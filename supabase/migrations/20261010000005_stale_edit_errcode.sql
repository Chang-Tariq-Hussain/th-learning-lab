-- Stale-edit conflicts used SQLSTATE 40001 (serialization_failure). PostgREST treats 40001 specially and, in testing
-- (v12.2.12 and v13.0.0), never answers the request: the admin saw "TypeError: fetch failed" instead of
-- "this question was changed by someone else". PostgREST's documented custom code PT409 returns a normal HTTP 409
-- with the same message, so use that. Bodies are otherwise identical to migration 3 (create or replace keeps grants).
CREATE OR REPLACE FUNCTION public.question_save(p_id uuid, p_expected_hash text, p_fields jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
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
    raise exception 'this question was changed by someone else — reload it and try again' using errcode = 'PT409';
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
end $function$

;

CREATE OR REPLACE FUNCTION public.question_set_provenance(p_id uuid, p_expected_hash text, p_fields jsonb, p_reason text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
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
    raise exception 'this question was changed by someone else — reload it and try again' using errcode = 'PT409';
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
end $function$

;

