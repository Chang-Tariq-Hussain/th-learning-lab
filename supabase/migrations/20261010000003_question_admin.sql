-- =============================================================================
-- TH Learning Lab — Phase 3, migration 3: Question Bank administration
--
-- From now on questions are written ONLY through the audited functions below
-- (SECURITY DEFINER, role-checked). Direct INSERT/UPDATE/DELETE on
-- public.questions and public.question_exams is revoked from every signed-in
-- user, including super admins, so no client — or leaked key — can bypass:
--   * the audit trail (every change writes its audit row in the same transaction),
--   * optimistic concurrency (a stale edit is refused, never silently overwritten),
--   * provenance rules (a generated question can never become a verified past paper;
--     editing the substance of a checked question resets its check),
--   * bulk-action limits (<= 100 per call, a reason is required for risky changes).
-- Questions are never hard-deleted: "delete" means archive.
-- =============================================================================

drop policy if exists questions_assessment_write on public.questions;
drop policy if exists question_exams_assessment_write on public.question_exams;
revoke insert, update, delete, truncate on public.questions from authenticated, anon;
revoke insert, update, delete, truncate on public.question_exams from authenticated, anon;

-- ------------------------------------------------------------ helpers -------
create or replace function public.question_fingerprint(q public.questions) returns text
language sql immutable as $$
  select 'e:' || md5(jsonb_build_array(
    q.stem, q.passage, q.options, q.correct_index, q.fixed_order, q.explanation, q.hints, q.concept, q.topic,
    q.difficulty, q.misconception_tag, q.language, q.needs_review, q.source_type, q.source_detail, q.source_exam,
    q.source_year, q.source_reference, q.source_note, q.answer_check, q.verified_note)::text)
$$;

create or replace function public._require_question_editor() returns void
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.has_admin_role('super_admin', 'question_manager') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
end $$;

create or replace function public._audit_insert(
  p_action text, p_entity text, p_entity_id text, p_before jsonb, p_after jsonb, p_meta jsonb
) returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  insert into public.audit_log (actor_id, actor_email, actor_role, action, entity, entity_id, before, after, meta)
  values (auth.uid(), (select email from auth.users where id = auth.uid()), public.current_admin_role()::text,
          p_action, p_entity, p_entity_id, p_before, p_after, p_meta);
end $$;

-- Fields an editor may change. Provenance has its own, stricter function.
create or replace function public._question_content_keys() returns text[]
language sql immutable as $$
  select array['stem','passage','options','correct_index','fixed_order','explanation','hints','concept','topic',
               'difficulty','misconception_tag','language','needs_review']
$$;
create or replace function public._question_provenance_keys() returns text[]
language sql immutable as $$
  select array['source_type','source_detail','source_exam','source_year','source_reference','source_note','answer_check','verified_note']
$$;

-- Only the keys that actually differ, as {key: value}.
create or replace function public._question_diff(a public.questions, b public.questions, keys text[]) returns jsonb[]
language plpgsql immutable as $$
declare k text; before jsonb := '{}'; after jsonb := '{}'; ja jsonb := to_jsonb(a); jb jsonb := to_jsonb(b);
begin
  foreach k in array keys loop
    if ja -> k is distinct from jb -> k then
      before := before || jsonb_build_object(k, ja -> k);
      after  := after  || jsonb_build_object(k, jb -> k);
    end if;
  end loop;
  return array[before, after];
end $$;

-- ------------------------------------------------------------- save ---------
create or replace function public.question_save(p_id uuid, p_expected_hash text, p_fields jsonb) returns jsonb
language plpgsql security definer set search_path = public, auth as $$
declare
  v_old public.questions;
  v_new public.questions;
  v_bad text;
  v_substantive boolean;
  v_reset boolean := false;
  v_diff jsonb[];
begin
  perform public._require_question_editor();
  select * into v_old from public.questions where id = p_id for update;
  if not found then raise exception 'question not found' using errcode = 'P0002'; end if;
  if v_old.content_hash is distinct from p_expected_hash then
    raise exception 'this question was changed by someone else — reload it and try again' using errcode = '40001';
  end if;
  select k into v_bad from jsonb_object_keys(p_fields) k where k <> all (public._question_content_keys()) limit 1;
  if v_bad is not null then
    raise exception 'field "%" cannot be edited here', v_bad using errcode = '22023';
  end if;

  update public.questions set
    stem              = case when p_fields ? 'stem' then p_fields ->> 'stem' else stem end,
    passage           = case when p_fields ? 'passage' then nullif(p_fields ->> 'passage', '') else passage end,
    options           = case when p_fields ? 'options' then p_fields -> 'options' else options end,
    correct_index     = case when p_fields ? 'correct_index' then (p_fields ->> 'correct_index')::integer else correct_index end,
    fixed_order       = case when p_fields ? 'fixed_order' then (p_fields ->> 'fixed_order')::boolean else fixed_order end,
    explanation       = case when p_fields ? 'explanation' then p_fields ->> 'explanation' else explanation end,
    hints             = case when p_fields ? 'hints' then (case when jsonb_typeof(p_fields -> 'hints') = 'null' then null else p_fields -> 'hints' end) else hints end,
    concept           = case when p_fields ? 'concept' then nullif(p_fields ->> 'concept', '') else concept end,
    topic             = case when p_fields ? 'topic' then nullif(p_fields ->> 'topic', '') else topic end,
    difficulty        = case when p_fields ? 'difficulty' then nullif(p_fields ->> 'difficulty', '') else difficulty end,
    misconception_tag = case when p_fields ? 'misconception_tag' then nullif(p_fields ->> 'misconception_tag', '') else misconception_tag end,
    language          = case when p_fields ? 'language' then nullif(p_fields ->> 'language', '') else language end,
    needs_review      = case when p_fields ? 'needs_review' then (p_fields ->> 'needs_review')::boolean else needs_review end
  where id = p_id
  returning * into v_new;

  v_diff := public._question_diff(v_old, v_new, public._question_content_keys());
  if v_diff[1] = '{}'::jsonb then
    return jsonb_build_object('id', v_new.id, 'content_hash', v_old.content_hash, 'changed', false);
  end if;

  -- Changing what was checked invalidates the check: the answer must be re-verified.
  v_substantive := (v_diff[1] ?| array['stem', 'passage', 'options', 'correct_index']);
  if v_substantive and v_new.answer_check = 'independently_checked' then
    update public.questions set answer_check = 'unchecked' where id = p_id returning * into v_new;
    v_reset := true;
  end if;
  update public.questions set content_hash = public.question_fingerprint(v_new) where id = p_id returning * into v_new;

  perform public._audit_insert('question.updated', 'question', p_id::text, v_diff[1], v_diff[2],
    jsonb_build_object('legacy_id', v_new.legacy_id, 'source_system', v_new.source_system, 'answer_check_reset', v_reset));
  return jsonb_build_object('id', v_new.id, 'content_hash', v_new.content_hash, 'changed', true, 'answer_check_reset', v_reset);
end $$;

-- ------------------------------------------------------- provenance ---------
create or replace function public.question_set_provenance(p_id uuid, p_expected_hash text, p_fields jsonb, p_reason text) returns jsonb
language plpgsql security definer set search_path = public, auth as $$
declare
  v_old public.questions;
  v_new public.questions;
  v_bad text;
  v_diff jsonb[];
begin
  perform public._require_question_editor();
  if p_reason is null or length(btrim(p_reason)) < 10 then
    raise exception 'give a reason of at least 10 characters for a provenance change' using errcode = '22023';
  end if;
  select * into v_old from public.questions where id = p_id for update;
  if not found then raise exception 'question not found' using errcode = 'P0002'; end if;
  if v_old.content_hash is distinct from p_expected_hash then
    raise exception 'this question was changed by someone else — reload it and try again' using errcode = '40001';
  end if;
  select k into v_bad from jsonb_object_keys(p_fields) k where k <> all (public._question_provenance_keys()) limit 1;
  if v_bad is not null then raise exception 'field "%" is not a provenance field', v_bad using errcode = '22023'; end if;

  update public.questions set
    source_type      = case when p_fields ? 'source_type' then (p_fields ->> 'source_type')::public.question_source else source_type end,
    source_detail    = case when p_fields ? 'source_detail' then nullif(p_fields ->> 'source_detail', '') else source_detail end,
    source_exam      = case when p_fields ? 'source_exam' then nullif(p_fields ->> 'source_exam', '') else source_exam end,
    source_year      = case when p_fields ? 'source_year' then nullif(p_fields ->> 'source_year', '')::integer else source_year end,
    source_reference = case when p_fields ? 'source_reference' then nullif(p_fields ->> 'source_reference', '') else source_reference end,
    source_note      = case when p_fields ? 'source_note' then nullif(p_fields ->> 'source_note', '') else source_note end,
    answer_check     = case when p_fields ? 'answer_check' then (p_fields ->> 'answer_check')::public.answer_check else answer_check end,
    verified_note    = case when p_fields ? 'verified_note' then nullif(p_fields ->> 'verified_note', '') else verified_note end
  where id = p_id
  returning * into v_new;

  -- A generated question can never be relabelled a verified past paper.
  if v_old.source_type = 'generated' and v_new.source_type = 'verified_past_paper' then
    raise exception 'a generated question cannot be relabelled as a verified past paper — if this exact question appears in a real paper, create it as a new past-paper question with its source reference and archive this one'
      using errcode = '23514';
  end if;
  if v_new.source_type = 'verified_past_paper'
     and (v_new.source_year is null or coalesce(btrim(v_new.source_reference), btrim(v_new.source_note), '') = '') then
    raise exception 'a verified past paper needs a source year and a source reference or note' using errcode = '23514';
  end if;

  v_diff := public._question_diff(v_old, v_new, public._question_provenance_keys());
  if v_diff[1] = '{}'::jsonb then
    return jsonb_build_object('id', v_new.id, 'content_hash', v_old.content_hash, 'changed', false);
  end if;
  update public.questions set content_hash = public.question_fingerprint(v_new) where id = p_id returning * into v_new;
  perform public._audit_insert('question.provenance_changed', 'question', p_id::text, v_diff[1], v_diff[2],
    jsonb_build_object('reason', btrim(p_reason), 'legacy_id', v_new.legacy_id, 'source_system', v_new.source_system));
  return jsonb_build_object('id', v_new.id, 'content_hash', v_new.content_hash, 'changed', true);
end $$;

-- --------------------------------------------------------- status (bulk) ----
create or replace function public.question_set_status(
  p_ids uuid[], p_status public.publish_status, p_reason text default null, p_dry_run boolean default false
) returns jsonb
language plpgsql security definer set search_path = public, auth as $$
declare
  v_id uuid; q public.questions;
  v_changed uuid[] := '{}'; v_skipped jsonb := '[]';
  v_needs_reason boolean;
begin
  perform public._require_question_editor();
  if p_ids is null or cardinality(p_ids) = 0 then raise exception 'select at least one question' using errcode = '22023'; end if;
  if cardinality(p_ids) > 100 then raise exception 'at most 100 questions per bulk action' using errcode = '22023'; end if;
  v_needs_reason := p_status = 'archived' or p_status = 'draft';
  if v_needs_reason and (p_reason is null or length(btrim(p_reason)) < 5) then
    raise exception 'give a reason (at least 5 characters) when archiving or unpublishing' using errcode = '22023';
  end if;

  foreach v_id in array (select array_agg(distinct x) from unnest(p_ids) x) loop
    select * into q from public.questions where id = v_id for update;
    if not found then v_skipped := v_skipped || jsonb_build_object('id', v_id, 'why', 'not found'); continue; end if;
    if q.status = p_status then v_skipped := v_skipped || jsonb_build_object('id', v_id, 'why', 'already ' || p_status::text); continue; end if;
    if p_status = 'published' then
      if btrim(q.stem) = '' or btrim(q.explanation) = '' then
        v_skipped := v_skipped || jsonb_build_object('id', v_id, 'why', 'needs a stem and an explanation'); continue;
      end if;
      if q.needs_review then
        v_skipped := v_skipped || jsonb_build_object('id', v_id, 'why', 'flagged needs-review: clear the flag after checking it'); continue;
      end if;
    end if;
    v_changed := v_changed || v_id;
    if not p_dry_run then
      update public.questions set status = p_status where id = v_id;
      perform public._audit_insert('question.status_changed', 'question', v_id::text,
        jsonb_build_object('status', q.status), jsonb_build_object('status', p_status),
        jsonb_build_object('reason', nullif(btrim(coalesce(p_reason, '')), ''), 'bulk_size', cardinality(p_ids), 'legacy_id', q.legacy_id));
    end if;
  end loop;
  return jsonb_build_object('dry_run', p_dry_run, 'changed', cardinality(v_changed), 'changed_ids', to_jsonb(v_changed), 'skipped', v_skipped);
end $$;

-- ------------------------------------------------------------- create -------
create or replace function public._question_create_row(p_row jsonb, p_via text) returns uuid
language plpgsql security definer set search_path = public, auth as $$
declare
  v_system text := p_row ->> 'source_system';
  v_subject uuid;
  v_src public.question_source;
  v_id uuid;
  v_new public.questions;
  e jsonb;
  v_exam uuid;
  v_bad text;
begin
  select k into v_bad from jsonb_object_keys(p_row) k
   where k <> all (public._question_content_keys() || public._question_provenance_keys() || array['source_system', 'subject_slug', 'exam_subject', 'exams'])
   limit 1;
  if v_bad is not null then raise exception 'unknown field "%"', v_bad using errcode = '22023'; end if;
  if v_system is null or v_system not in ('quiz', 'mpt', 'teacher') then
    raise exception 'source_system must be quiz, mpt or teacher' using errcode = '22023';
  end if;
  v_src := coalesce(nullif(p_row ->> 'source_type', ''), 'platform_authored')::public.question_source;
  if v_src = 'verified_past_paper'
     and ((p_row ->> 'source_year') is null or coalesce(nullif(btrim(p_row ->> 'source_reference'), ''), nullif(btrim(p_row ->> 'source_note'), '')) is null) then
    raise exception 'a verified past paper needs a source year and a source reference or note' using errcode = '23514';
  end if;
  if coalesce(p_row ->> 'answer_check', 'unchecked') not in ('unchecked', 'self_checked', 'recomputed') then
    raise exception 'new questions start unchecked, self_checked or recomputed — independent checks are recorded afterwards, with a reason' using errcode = '23514';
  end if;

  if v_system = 'quiz' then
    select id into v_subject from public.subjects where slug = p_row ->> 'subject_slug';
    if v_subject is null then raise exception 'unknown subject_slug "%"', coalesce(p_row ->> 'subject_slug', '') using errcode = '22023'; end if;
  elsif coalesce(btrim(p_row ->> 'exam_subject'), '') = '' then
    raise exception 'exam_subject is required for exam questions' using errcode = '22023';
  end if;

  insert into public.questions (
    source_system, legacy_id, subject_id, exam_subject, topic, concept, difficulty, stem, passage, options, correct_index,
    fixed_order, explanation, hints, misconception_tag, language, source_type, source_detail, source_exam, source_year,
    source_reference, source_note, answer_check, verified_note, needs_review, extra, status, content_hash)
  values (
    v_system, 'adm-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12), v_subject, nullif(p_row ->> 'exam_subject', ''),
    nullif(p_row ->> 'topic', ''), nullif(p_row ->> 'concept', ''), nullif(p_row ->> 'difficulty', ''),
    coalesce(p_row ->> 'stem', ''), nullif(p_row ->> 'passage', ''), coalesce(p_row -> 'options', '[]'::jsonb),
    coalesce((p_row ->> 'correct_index')::integer, 0), coalesce((p_row ->> 'fixed_order')::boolean, false),
    coalesce(p_row ->> 'explanation', ''), case when jsonb_typeof(p_row -> 'hints') = 'array' then p_row -> 'hints' else null end,
    nullif(p_row ->> 'misconception_tag', ''), nullif(p_row ->> 'language', ''), v_src, nullif(p_row ->> 'source_detail', ''),
    nullif(p_row ->> 'source_exam', ''), nullif(p_row ->> 'source_year', '')::integer, nullif(p_row ->> 'source_reference', ''),
    nullif(p_row ->> 'source_note', ''), coalesce(p_row ->> 'answer_check', 'unchecked')::public.answer_check,
    nullif(p_row ->> 'verified_note', ''), coalesce((p_row ->> 'needs_review')::boolean, false), '{}'::jsonb, 'draft', 'pending')
  returning * into v_new;
  update public.questions set content_hash = public.question_fingerprint(v_new) where id = v_new.id returning id into v_id;

  for e in select * from jsonb_array_elements(coalesce(p_row -> 'exams', '[]'::jsonb)) loop
    select id into v_exam from public.exam_types where slug = e ->> 'exam_slug';
    if v_exam is null then raise exception 'unknown exam_slug "%"', coalesce(e ->> 'exam_slug', '') using errcode = '22023'; end if;
    insert into public.question_exams (question_id, exam_type_id, topic, subtopic, difficulty, section_code)
    values (v_id, v_exam, nullif(e ->> 'topic', ''), nullif(e ->> 'subtopic', ''), nullif(e ->> 'difficulty', ''), nullif(e ->> 'section_code', ''));
  end loop;

  perform public._audit_insert('question.created', 'question', v_id::text, null,
    jsonb_build_object('source_system', v_system, 'source_type', v_src, 'status', 'draft'),
    jsonb_build_object('via', p_via, 'legacy_id', (select legacy_id from public.questions where id = v_id)));
  return v_id;
end $$;

create or replace function public.question_create(p_fields jsonb) returns uuid
language plpgsql security definer set search_path = public, auth as $$
begin
  perform public._require_question_editor();
  return public._question_create_row(p_fields, 'form');
end $$;

-- All-or-nothing import. Dry-run validates every row and reports; a real run commits only if EVERY row is valid.
create or replace function public.question_import(p_rows jsonb, p_dry_run boolean default true) returns jsonb
language plpgsql security definer set search_path = public, auth as $$
declare
  r jsonb; i integer := 0; v_errors integer := 0; v_created integer := 0; v_results jsonb := '[]'; v_id uuid;
begin
  perform public._require_question_editor();
  if jsonb_typeof(p_rows) <> 'array' then raise exception 'expected a JSON array of questions' using errcode = '22023'; end if;
  if jsonb_array_length(p_rows) = 0 then raise exception 'the file contains no questions' using errcode = '22023'; end if;
  if jsonb_array_length(p_rows) > 500 then raise exception 'at most 500 questions per import' using errcode = '22023'; end if;

  begin
    for r in select * from jsonb_array_elements(p_rows) loop
      i := i + 1;
      begin
        v_id := public._question_create_row(r, 'import');
        v_created := v_created + 1;
        v_results := v_results || jsonb_build_object('row', i, 'ok', true, 'id', v_id);
      exception when others then
        v_errors := v_errors + 1;
        v_results := v_results || jsonb_build_object('row', i, 'ok', false, 'error', sqlerrm);
      end;
    end loop;
    if p_dry_run or v_errors > 0 then
      raise exception 'rollback' using errcode = 'P0099';
    end if;
  exception when sqlstate 'P0099' then
    null; -- undo every row created above; the collected results survive
  end;

  if not p_dry_run and v_errors = 0 then
    perform public._audit_insert('question.imported', 'question_bank', null, null,
      jsonb_build_object('created', v_created), jsonb_build_object('rows', v_created));
  else
    v_created := 0;
  end if;
  return jsonb_build_object('dry_run', p_dry_run, 'committed', (not p_dry_run and v_errors = 0), 'created', v_created, 'errors', v_errors, 'results', v_results);
end $$;

-- ----------------------------------------------------------- history --------
-- Per-question change history. Question managers can't read the whole audit log,
-- but may see the history of the questions they work on.
create or replace function public.question_history(p_id uuid) returns table (
  at timestamptz, actor_email text, actor_role text, action text, before jsonb, after jsonb, meta jsonb
) language plpgsql stable security definer set search_path = public as $$
begin
  if public.current_admin_role() is null then raise exception 'forbidden' using errcode = '42501'; end if;
  return query
    select a.at, a.actor_email, a.actor_role, a.action, a.before, a.after, a.meta
    from public.audit_log a where a.entity = 'question' and a.entity_id = p_id::text
    order by a.at desc, a.id desc limit 50;
end $$;

-- ------------------------------------------------------------- grants -------
do $$
declare f text;
begin
  foreach f in array array[
    'question_save(uuid, text, jsonb)', 'question_set_provenance(uuid, text, jsonb, text)',
    'question_set_status(uuid[], public.publish_status, text, boolean)', 'question_create(jsonb)',
    'question_import(jsonb, boolean)', 'question_history(uuid)'
  ] loop
    execute format('revoke execute on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
  foreach f in array array[
    'question_fingerprint(public.questions)', '_require_question_editor()', '_audit_insert(text, text, text, jsonb, jsonb, jsonb)',
    '_question_content_keys()', '_question_provenance_keys()', '_question_diff(public.questions, public.questions, text[])',
    '_question_create_row(jsonb, text)'
  ] loop
    execute format('revoke execute on function public.%s from public, anon, authenticated', f);
  end loop;
end $$;
