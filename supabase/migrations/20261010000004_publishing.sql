-- =============================================================================
-- TH Learning Lab — Phase 4, migration 4: what learners may see, and how it is published
--
-- Learners are served from a "content overlay" built from the PUBLISHED view of this
-- database (status = 'published'). This migration closes the gaps that would otherwise let a
-- database edit break learners or never reach them:
--   * quiz questions can be placed in (and removed from) banks, through audited functions;
--   * exam questions must have exactly 4 options and a valid exam/section — the runtime types require it;
--   * a question that a stored mock depends on can't be taken out of use;
--   * a quiz bank can't be emptied by archiving its last published question;
--   * the last content publish is visible to every admin.
-- =============================================================================

alter table public.questions
  add constraint questions_exam_four_options check (source_system = 'quiz' or jsonb_array_length(options) = 4);

-- Bank membership is written only through the audited functions below.
drop policy if exists question_bank_items_assessment_write on public.question_bank_items;
revoke insert, update, delete, truncate on public.question_bank_items from authenticated, anon;

-- ---------------------------------------------------------- create (replaces migration 3's) ---
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
  v_exam_slug text;
  v_bad text;
  v_bank uuid;
  v_exams jsonb := coalesce(p_row -> 'exams', '[]'::jsonb);
begin
  select k into v_bad from jsonb_object_keys(p_row) k
   where k <> all (public._question_content_keys() || public._question_provenance_keys() || array['source_system', 'subject_slug', 'exam_subject', 'exams', 'bank_slug'])
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
    if coalesce(p_row ->> 'bank_slug', '') <> '' then
      select id into v_bank from public.question_banks where slug = p_row ->> 'bank_slug' and subject_id = v_subject;
      if v_bank is null then raise exception 'bank "%" does not exist for subject "%"', p_row ->> 'bank_slug', p_row ->> 'subject_slug' using errcode = '22023'; end if;
    end if;
  else
    if coalesce(btrim(p_row ->> 'exam_subject'), '') = '' then
      raise exception 'exam_subject is required for exam questions' using errcode = '22023';
    end if;
    if jsonb_typeof(v_exams) <> 'array' or jsonb_array_length(v_exams) = 0 then
      raise exception 'an exam question must belong to at least one exam' using errcode = '22023';
    end if;
    for e in select * from jsonb_array_elements(v_exams) loop
      v_exam_slug := e ->> 'exam_slug';
      if v_system = 'mpt' then
        if v_exam_slug is distinct from 'css-mpt' then raise exception 'CSS MPT questions belong to the css-mpt exam' using errcode = '22023'; end if;
        if coalesce(e ->> 'section_code', '') not in ('IS', 'UR', 'EN', 'GA', 'GK') then
          raise exception 'a CSS MPT question needs a section code: IS, UR, EN, GA or GK' using errcode = '22023';
        end if;
      elsif v_exam_slug is null or v_exam_slug not in ('pst', 'jest', 'jst') then
        raise exception 'teacher-test questions belong to pst, jest or jst' using errcode = '22023';
      end if;
    end loop;
    if (p_row -> 'options') is null or jsonb_typeof(p_row -> 'options') <> 'array' or jsonb_array_length(p_row -> 'options') <> 4 then
      raise exception 'exam questions need exactly 4 options' using errcode = '22023';
    end if;
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

  for e in select * from jsonb_array_elements(v_exams) loop
    select id into v_exam from public.exam_types where slug = e ->> 'exam_slug';
    if v_exam is null then raise exception 'unknown exam_slug "%"', coalesce(e ->> 'exam_slug', '') using errcode = '22023'; end if;
    insert into public.question_exams (question_id, exam_type_id, topic, subtopic, difficulty, section_code)
    values (v_id, v_exam, nullif(e ->> 'topic', ''), nullif(e ->> 'subtopic', ''), nullif(e ->> 'difficulty', ''), nullif(e ->> 'section_code', ''));
  end loop;
  if v_bank is not null then
    insert into public.question_bank_items (bank_id, question_id, position)
    values (v_bank, v_id, coalesce((select max(position) + 1 from public.question_bank_items where bank_id = v_bank), 0));
  end if;

  perform public._audit_insert('question.created', 'question', v_id::text, null,
    jsonb_build_object('source_system', v_system, 'source_type', v_src, 'status', 'draft'),
    jsonb_build_object('via', p_via, 'legacy_id', (select legacy_id from public.questions where id = v_id), 'bank', p_row ->> 'bank_slug'));
  return v_id;
end $$;

-- ------------------------------------------------ status (replaces migration 3's) ---
create or replace function public.question_set_status(
  p_ids uuid[], p_status public.publish_status, p_reason text default null, p_dry_run boolean default false
) returns jsonb
language plpgsql security definer set search_path = public, auth as $$
declare
  v_id uuid; q public.questions;
  v_changed uuid[] := '{}'; v_skipped jsonb := '[]';
  v_in text; v_bank record;
begin
  perform public._require_question_editor();
  if p_ids is null or cardinality(p_ids) = 0 then raise exception 'select at least one question' using errcode = '22023'; end if;
  if cardinality(p_ids) > 100 then raise exception 'at most 100 questions per bulk action' using errcode = '22023'; end if;
  if (p_status = 'archived' or p_status = 'draft') and (p_reason is null or length(btrim(p_reason)) < 5) then
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
    elsif q.status = 'published' then
      -- Taking a live question out of use: learners must not be left with a broken mock or an empty bank.
      select string_agg(e.slug, ', ') into v_in
        from public.exam_questions eq join public.exams e on e.id = eq.exam_id where eq.question_id = v_id and e.status = 'published';
      if v_in is not null then
        v_skipped := v_skipped || jsonb_build_object('id', v_id, 'why', 'used in the live mock ' || v_in || ' — replace it in the mock first'); continue;
      end if;
      select b.slug into v_bank from public.question_bank_items bi join public.question_banks b on b.id = bi.bank_id
        where bi.question_id = v_id and b.status = 'published'
          and (select count(*) from public.question_bank_items bi2 join public.questions q2 on q2.id = bi2.question_id
                where bi2.bank_id = b.id and q2.status = 'published' and q2.id <> v_id) = 0
        limit 1;
      if found then
        v_skipped := v_skipped || jsonb_build_object('id', v_id, 'why', 'it is the last published question in the bank ' || v_bank.slug); continue;
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

-- ------------------------------------------------------------ bank membership ---
create or replace function public.question_bank_add(p_question uuid, p_bank text) returns jsonb
language plpgsql security definer set search_path = public, auth as $$
declare q public.questions; b public.question_banks; v_pos integer;
begin
  perform public._require_question_editor();
  select * into q from public.questions where id = p_question for update;
  if not found then raise exception 'question not found' using errcode = 'P0002'; end if;
  if q.source_system <> 'quiz' then raise exception 'only quiz questions belong to quiz banks' using errcode = '22023'; end if;
  select * into b from public.question_banks where slug = p_bank;
  if not found then raise exception 'unknown bank "%"', p_bank using errcode = 'P0002'; end if;
  if b.subject_id is distinct from q.subject_id then raise exception 'this bank belongs to a different subject' using errcode = '22023'; end if;
  if exists (select 1 from public.question_bank_items where bank_id = b.id and question_id = q.id) then
    return jsonb_build_object('changed', false);
  end if;
  select coalesce(max(position) + 1, 0) into v_pos from public.question_bank_items where bank_id = b.id;
  insert into public.question_bank_items (bank_id, question_id, position) values (b.id, q.id, v_pos);
  perform public._audit_insert('question.bank_added', 'question', q.id::text, null, jsonb_build_object('bank', b.slug, 'position', v_pos), jsonb_build_object('legacy_id', q.legacy_id));
  return jsonb_build_object('changed', true, 'position', v_pos);
end $$;

create or replace function public.question_bank_remove(p_question uuid, p_bank text, p_reason text) returns jsonb
language plpgsql security definer set search_path = public, auth as $$
declare q public.questions; b public.question_banks; v_left integer;
begin
  perform public._require_question_editor();
  if p_reason is null or length(btrim(p_reason)) < 5 then raise exception 'give a reason (at least 5 characters)' using errcode = '22023'; end if;
  select * into q from public.questions where id = p_question for update;
  if not found then raise exception 'question not found' using errcode = 'P0002'; end if;
  select * into b from public.question_banks where slug = p_bank;
  if not found then raise exception 'unknown bank "%"', p_bank using errcode = 'P0002'; end if;
  if not exists (select 1 from public.question_bank_items where bank_id = b.id and question_id = q.id) then
    return jsonb_build_object('changed', false);
  end if;
  select count(*) into v_left from public.question_bank_items bi join public.questions q2 on q2.id = bi.question_id
    where bi.bank_id = b.id and q2.status = 'published' and q2.id <> q.id;
  if q.status = 'published' and v_left = 0 then
    raise exception 'it is the last published question in bank %', b.slug using errcode = '23514';
  end if;
  delete from public.question_bank_items where bank_id = b.id and question_id = q.id;
  perform public._audit_insert('question.bank_removed', 'question', q.id::text, jsonb_build_object('bank', b.slug), null,
    jsonb_build_object('reason', btrim(p_reason), 'legacy_id', q.legacy_id));
  return jsonb_build_object('changed', true);
end $$;

-- --------------------------------------------------------------- publishing ---
-- Latest content publish (written by the operator script), visible to every admin.
create or replace function public.latest_publish() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare r public.audit_log;
begin
  if public.current_admin_role() is null then raise exception 'forbidden' using errcode = '42501'; end if;
  select * into r from public.audit_log where action = 'content.published' order by id desc limit 1;
  if not found then return null; end if;
  return jsonb_build_object('at', r.at, 'actor', r.actor_email, 'meta', r.meta);
end $$;

do $$
declare f text;
begin
  foreach f in array array['question_bank_add(uuid, text)', 'question_bank_remove(uuid, text, text)', 'latest_publish()'] loop
    execute format('revoke execute on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
end $$;
