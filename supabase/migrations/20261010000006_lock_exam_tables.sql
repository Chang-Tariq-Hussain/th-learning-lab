-- Exam composition and bank tables had a blanket "question_manager may write" policy that migrations 3-4 only removed
-- for questions, question_exams and question_bank_items. A question manager could therefore DELETE exam_questions
-- (silently breaking stored mocks) or a question_bank (cascading away its items) straight through the API, with no audit
-- row and no guard. The admin app never writes these tables (exam composition is a later phase), so make them
-- read-only for signed-in users; changes will arrive as audited RPCs. Operator scripts (db:import) are unaffected.
do $$
declare t text;
begin
  foreach t in array array['question_banks', 'exam_types', 'exam_sections', 'exams', 'exam_questions'] loop
    execute format('drop policy if exists %I on public.%I', t || '_assessment_write', t);
    execute format('revoke insert, update, delete, truncate on public.%I from authenticated, anon', t);
  end loop;
end $$;
