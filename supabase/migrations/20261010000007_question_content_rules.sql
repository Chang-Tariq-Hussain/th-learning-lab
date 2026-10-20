-- Database-level content rules. The admin form already refused blank text, blank options and repeated options, but a
-- direct RPC call (question_create / question_import / question_save) accepted them: a draft with identical options
-- or a blank question could be stored, and importing the same file twice created every question twice. Enforced here
-- so the rules hold for every caller. Only changed rows are checked, so existing data is never blocked
-- (current data has no violations). Duplicate detection applies to admin-created questions (legacy_id 'adm-%') only:
-- the code registries legitimately contain a few repeated questions and must keep importing identically.
create or replace function public._question_content_rules() returns trigger
language plpgsql as $$
declare v_n integer; v_d integer;
begin
  if tg_op = 'UPDATE' and new.stem is not distinct from old.stem and new.options is not distinct from old.options then
    return new;
  end if;
  if btrim(new.stem) = '' then
    raise exception 'the question text is required' using errcode = '23514';
  end if;
  if exists (select 1 from jsonb_array_elements(new.options) o where jsonb_typeof(o) <> 'string' or btrim(o #>> '{}') = '') then
    raise exception 'every answer option needs text' using errcode = '23514';
  end if;
  select count(*), count(distinct lower(btrim(o))) into v_n, v_d from jsonb_array_elements_text(new.options) o;
  if v_n <> v_d then
    raise exception 'two options are identical — each option must be different' using errcode = '23514';
  end if;
  if tg_op = 'INSERT' and new.legacy_id like 'adm-%' and exists (
    select 1 from public.questions q
    where q.source_system = new.source_system and lower(btrim(q.stem)) = lower(btrim(new.stem)) and q.options = new.options
      and q.subject_id is not distinct from new.subject_id and q.exam_subject is not distinct from new.exam_subject) then
    raise exception 'an identical question (same text and options) already exists' using errcode = '23505';
  end if;
  return new;
end $$;

drop trigger if exists questions_content_rules on public.questions;
create trigger questions_content_rules before insert or update of stem, options on public.questions
  for each row execute function public._question_content_rules();

-- A row that is not a JSON object used to surface as "cannot call jsonb_object_keys on a scalar".
CREATE OR REPLACE FUNCTION public._question_create_row(p_row jsonb, p_via text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
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
  if jsonb_typeof(p_row) is distinct from 'object' then raise exception 'each question must be a JSON object' using errcode = '22023'; end if;
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
end $function$

;
