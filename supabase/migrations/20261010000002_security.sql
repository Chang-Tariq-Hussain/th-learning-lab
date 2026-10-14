-- =============================================================================
-- TH Learning Lab — Phase 2, migration 2: access control, audit log, media bucket
--
-- Model: the admin web app talks to Postgres AS THE SIGNED-IN USER (Supabase
-- anon key + the user's session). Row-level security below is the real
-- authorisation boundary; hiding buttons in the UI is never relied on. The
-- service-role key is only for operator scripts (import, bootstrap) and is never
-- shipped to the web app.
--
-- Roles (one per admin, see public.admin_roles):
--   super_admin       everything, incl. admin users and the audit log
--   content_manager   read all; edit subjects/simulations/GLE/paths/connections/media
--   question_manager  read all; edit question banks, questions, exams
--   analyst           read-only
-- Anyone without a row in admin_roles — including every signed-up learner — has
-- NO access to any table in this file.
-- =============================================================================

-- ------------------------------------------------------------ audit log -----
create or replace function public.audit_log_immutable() returns trigger
language plpgsql as $$
begin
  raise exception 'audit_log is append-only' using errcode = '42501';
end $$;

create trigger audit_log_no_update before update or delete on public.audit_log
  for each row execute function public.audit_log_immutable();
create trigger audit_log_no_truncate before truncate on public.audit_log
  for each statement execute function public.audit_log_immutable();

-- ----------------------------------------------------------- role helpers ---
create or replace function public.current_admin_role() returns public.admin_role
language sql stable security definer set search_path = public as $$
  select role from public.admin_roles where user_id = auth.uid()
$$;

create or replace function public.has_admin_role(variadic allowed public.admin_role[]) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.current_admin_role() = any (allowed), false)
$$;

-- ------------------------------------------------------------- RPC: audit ---
-- Any admin may append an audit entry for an action they performed. The actor
-- is always the caller; it cannot be spoofed from the client.
create or replace function public.write_audit(
  p_action text, p_entity text, p_entity_id text default null,
  p_before jsonb default null, p_after jsonb default null, p_meta jsonb default null
) returns bigint
language plpgsql security definer set search_path = public, auth as $$
declare
  v_role public.admin_role := public.current_admin_role();
  v_id bigint;
begin
  if v_role is null then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  insert into public.audit_log (actor_id, actor_email, actor_role, action, entity, entity_id, before, after, meta)
  values (auth.uid(), (select email from auth.users where id = auth.uid()), v_role::text,
          p_action, p_entity, p_entity_id, p_before, p_after, p_meta)
  returning id into v_id;
  return v_id;
end $$;

-- ------------------------------------------------------ RPC: admin users ----
create or replace function public.admin_set_role_by_email(p_email text, p_role public.admin_role) returns void
language plpgsql security definer set search_path = public, auth as $$
declare
  v_actor  uuid := auth.uid();
  v_target uuid;
  v_old    public.admin_role;
  v_supers integer;
begin
  if public.current_admin_role() is distinct from 'super_admin' then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  select id into v_target from auth.users where lower(email) = lower(btrim(p_email));
  if v_target is null then
    raise exception 'no account with that email' using errcode = 'P0002';
  end if;
  select role into v_old from public.admin_roles where user_id = v_target;

  -- Serialise concurrent changes so two super admins can't demote each other at once.
  perform 1 from public.admin_roles where role = 'super_admin' for update;
  if v_old = 'super_admin' and p_role <> 'super_admin' then
    select count(*) into v_supers from public.admin_roles where role = 'super_admin';
    if v_supers <= 1 then
      raise exception 'cannot demote the last super admin' using errcode = '23514';
    end if;
  end if;

  insert into public.admin_roles (user_id, email, role, granted_by)
  values (v_target, lower(btrim(p_email)), p_role, v_actor)
  on conflict (user_id) do update
    set role = excluded.role, email = excluded.email, granted_by = excluded.granted_by, granted_at = now();

  insert into public.audit_log (actor_id, actor_email, actor_role, action, entity, entity_id, before, after, meta)
  values (v_actor, (select email from auth.users where id = v_actor), 'super_admin',
          case when v_old is null then 'admin.role_granted' else 'admin.role_changed' end,
          'admin_role', v_target::text,
          case when v_old is null then null else jsonb_build_object('role', v_old) end,
          jsonb_build_object('role', p_role),
          jsonb_build_object('email', lower(btrim(p_email))));
end $$;

create or replace function public.admin_revoke_role(p_user uuid) returns void
language plpgsql security definer set search_path = public, auth as $$
declare
  v_actor  uuid := auth.uid();
  v_old    public.admin_roles;
  v_supers integer;
begin
  if public.current_admin_role() is distinct from 'super_admin' then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  perform 1 from public.admin_roles where role = 'super_admin' for update;
  select * into v_old from public.admin_roles where user_id = p_user;
  if not found then
    raise exception 'that user has no admin role' using errcode = 'P0002';
  end if;
  if v_old.role = 'super_admin' then
    select count(*) into v_supers from public.admin_roles where role = 'super_admin';
    if v_supers <= 1 then
      raise exception 'cannot remove the last super admin' using errcode = '23514';
    end if;
  end if;
  delete from public.admin_roles where user_id = p_user;
  insert into public.audit_log (actor_id, actor_email, actor_role, action, entity, entity_id, before, after, meta)
  values (v_actor, (select email from auth.users where id = v_actor), 'super_admin',
          'admin.role_revoked', 'admin_role', p_user::text,
          jsonb_build_object('role', v_old.role), null, jsonb_build_object('email', v_old.email));
end $$;

-- --------------------------------------------------------- RLS + privileges -
do $$
declare
  t text;
  all_content text[] := array[
    'subjects', 'topics', 'simulations', 'gle_topics', 'learning_paths', 'learning_path_nodes',
    'learning_path_prereqs', 'connections', 'media',
    'question_banks', 'questions', 'question_bank_items', 'question_exams', 'exam_types',
    'exam_sections', 'exams', 'exam_questions'];
  content_group text[] := array[
    'subjects', 'topics', 'simulations', 'gle_topics', 'learning_paths', 'learning_path_nodes',
    'learning_path_prereqs', 'connections', 'media'];
  assessment_group text[] := array[
    'question_banks', 'questions', 'question_bank_items', 'question_exams', 'exam_types',
    'exam_sections', 'exams', 'exam_questions'];
begin
  -- Start from nothing, then grant narrowly.
  revoke all on all tables in schema public from anon, authenticated;
  revoke all on all functions in schema public from public, anon;

  foreach t in array all_content loop
    execute format('alter table public.%I enable row level security', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format(
      'create policy %I on public.%I for select to authenticated using (public.current_admin_role() is not null)',
      t || '_admin_read', t);
  end loop;

  foreach t in array content_group loop
    execute format(
      'create policy %I on public.%I for all to authenticated '
      'using (public.has_admin_role(''super_admin'', ''content_manager'')) '
      'with check (public.has_admin_role(''super_admin'', ''content_manager''))',
      t || '_content_write', t);
  end loop;

  foreach t in array assessment_group loop
    execute format(
      'create policy %I on public.%I for all to authenticated '
      'using (public.has_admin_role(''super_admin'', ''question_manager'')) '
      'with check (public.has_admin_role(''super_admin'', ''question_manager''))',
      t || '_assessment_write', t);
  end loop;
end $$;

alter table public.admin_roles enable row level security;
grant select on public.admin_roles to authenticated;
create policy admin_roles_read on public.admin_roles for select to authenticated
  using (user_id = auth.uid() or public.has_admin_role('super_admin'));
-- No insert/update/delete policies: roles change only through the audited RPCs above.

alter table public.audit_log enable row level security;
grant select on public.audit_log to authenticated;
create policy audit_log_read on public.audit_log for select to authenticated
  using (public.has_admin_role('super_admin'));
-- No write policies: entries are appended only by the SECURITY DEFINER functions.

grant execute on function public.current_admin_role() to authenticated;
grant execute on function public.has_admin_role(public.admin_role[]) to authenticated;
grant execute on function public.write_audit(text, text, text, jsonb, jsonb, jsonb) to authenticated;
grant execute on function public.admin_set_role_by_email(text, public.admin_role) to authenticated;
grant execute on function public.admin_revoke_role(uuid) to authenticated;

-- ------------------------------------------------------------ media bucket --
-- Private bucket for admin-authored images. Only content managers and super
-- admins may touch objects; admin pages use short-lived signed URLs. Guarded so
-- the migration also runs on plain Postgres (no Supabase storage schema).
do $$
begin
  if exists (select 1 from information_schema.schemata where schema_name = 'storage') then
    insert into storage.buckets (id, name, public) values ('content-media', 'content-media', false)
    on conflict (id) do nothing;

    execute $p$ create policy content_media_read on storage.objects for select to authenticated
      using (bucket_id = 'content-media' and public.current_admin_role() is not null) $p$;
    execute $p$ create policy content_media_write on storage.objects for all to authenticated
      using (bucket_id = 'content-media' and public.has_admin_role('super_admin', 'content_manager'))
      with check (bucket_id = 'content-media' and public.has_admin_role('super_admin', 'content_manager')) $p$;
  end if;
end $$;
