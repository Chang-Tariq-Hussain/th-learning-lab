/**
 * Applies the overlay to the code registries. Runs in the LEARNER app, so it is defensive by design:
 * every overlay item is validated, and anything invalid is ignored — the code version stays. A bad or
 * stale overlay can therefore never break a quiz, an exam or a bank; at worst it changes nothing.
 * Pure and dependency-free (no Node APIs).
 */
import type { QuizMeta, QuizQuestion } from "@/features/quiz-engine/types";
import { validateQuizQuestions } from "@/features/quiz-engine/utils/validate-quiz";
import type { MptQuestion } from "@/features/mpt-mock/data/mpt-mock-data";
import type { ExamType, TeacherQuestion } from "@/features/teacher-tests/types";
import type { ContentOverlay, ListOverlay, QuizBankOverlay, SkippedItem } from "./types";

type Skipped = SkippedItem[];

// ---------------------------------------------------------------- validity ---
export function quizQuestionProblem(q: QuizQuestion): string | null {
  const issue = validateQuizQuestions([q])[0];
  if (issue) return issue.message;
  if (!q.id || !q.explanation?.trim()) return "missing id or explanation";
  if (new Set(q.options.map((o) => o.trim().toLowerCase())).size !== q.options.length) return "repeated option";
  return null;
}

export function mptQuestionProblem(q: MptQuestion): string | null {
  if (!q.id || !q.question?.trim() || !q.explanation?.trim()) return "missing id, question or explanation";
  if (!["IS", "UR", "EN", "GA", "GK"].includes(q.subjectCode)) return "invalid section code";
  const letters = ["A", "B", "C", "D"] as const;
  if (!q.options || letters.some((l) => typeof q.options[l] !== "string" || !q.options[l].trim())) return "needs four non-empty options A–D";
  if (!letters.includes(q.correctAnswer)) return "correct answer must be A, B, C or D";
  return null;
}

export function teacherQuestionProblem(q: TeacherQuestion): string | null {
  if (!q.id || !q.question?.trim() || !q.explanation?.trim()) return "missing id, question or explanation";
  if (!Array.isArray(q.options) || q.options.length !== 4 || q.options.some((o) => typeof o !== "string" || !o.trim())) return "needs exactly four non-empty options";
  if (!Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer > 3) return "correct answer index must be 0–3";
  if (!Array.isArray(q.examTypes) || !q.examTypes.includes(q.examType)) return "examType must be one of its examTypes";
  return null;
}

// -------------------------------------------------------------------- quiz ---
export function applyQuizOverlay(banks: QuizMeta[], overlay: ContentOverlay["quiz"], skipped?: Skipped): QuizMeta[] {
  const note = (scope: string, id: string, why: string): void => { skipped?.push({ scope, id, why }); };
  return banks.map((bank) => {
    const o: QuizBankOverlay | undefined = overlay[bank.id];
    if (!o) return bank;
    const scope = `quiz:${bank.id}`;
    const removed = new Set(o.remove ?? []);
    const known = new Set(bank.questions.map((q) => q.id));
    for (const id of Object.keys(o.replace ?? {})) if (!known.has(id)) note(scope, id, "replacement for a question not in this bank");

    let questions: QuizQuestion[] = bank.questions
      .filter((q) => !removed.has(q.id))
      .map((q) => {
        const r = o.replace?.[q.id];
        if (!r) return q;
        const problem = quizQuestionProblem(r);
        if (problem) { note(scope, q.id, `replacement ignored: ${problem}`); return q; }
        return r;
      });
    const ids = new Set(questions.map((q) => q.id));
    for (const a of o.add ?? []) {
      const problem = quizQuestionProblem(a);
      if (problem) { note(scope, a.id, `addition ignored: ${problem}`); continue; }
      if (ids.has(a.id)) { note(scope, a.id, "addition ignored: id already in the bank"); continue; }
      ids.add(a.id);
      questions.push(a);
    }
    if (o.order) {
      const rank = new Map(o.order.map((id, i) => [id, i] as const));
      questions = [...questions].sort((a, b) => (rank.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.id) ?? Number.MAX_SAFE_INTEGER));
    }
    if (questions.length === 0) { note(scope, bank.id, "overlay would leave the bank empty — code questions kept"); return bank; }
    return { ...bank, questions };
  });
}

// --------------------------------------------------------------------- MPT ---
export function applyMptOverlay(bank: MptQuestion[], overlay: ContentOverlay["mpt"], skipped?: Skipped): MptQuestion[] {
  const replace = overlay.replace;
  if (!replace || Object.keys(replace).length === 0) return bank;
  const known = new Set(bank.map((q) => q.id));
  for (const id of Object.keys(replace)) if (!known.has(id)) skipped?.push({ scope: "mpt", id, why: "replacement for a question not in the bank" });
  return bank.map((q) => {
    const r = replace[q.id];
    if (!r) return q;
    const problem = mptQuestionProblem(r);
    if (problem) { skipped?.push({ scope: "mpt", id: q.id, why: `replacement ignored: ${problem}` }); return q; }
    return r;
  });
}

// ----------------------------------------------------------------- teacher ---
export function applyTeacherOverlay(exam: ExamType, bank: TeacherQuestion[], overlay: ContentOverlay["teacher"], skipped?: Skipped): TeacherQuestion[] {
  const o: ListOverlay<TeacherQuestion> | undefined = overlay[exam];
  if (!o) return bank;
  const scope = `teacher:${exam}`;
  const removed = new Set(o.remove ?? []);
  const known = new Set(bank.map((q) => q.id));
  for (const id of Object.keys(o.replace ?? {})) if (!known.has(id)) skipped?.push({ scope, id, why: "replacement for a question not in this bank" });
  const out: TeacherQuestion[] = bank
    .filter((q) => !removed.has(q.id))
    .map((q) => {
      const r = o.replace?.[q.id];
      if (!r) return q;
      const problem = teacherQuestionProblem(r);
      if (problem) { skipped?.push({ scope, id: q.id, why: `replacement ignored: ${problem}` }); return q; }
      return r;
    });
  const ids = new Set(out.map((q) => q.id));
  for (const a of o.add ?? []) {
    const problem = teacherQuestionProblem(a);
    if (problem) { skipped?.push({ scope, id: a.id, why: `addition ignored: ${problem}` }); continue; }
    if (ids.has(a.id) || a.examType !== exam) { skipped?.push({ scope, id: a.id, why: "addition ignored: duplicate id or wrong exam" }); continue; }
    ids.add(a.id);
    out.push(a);
  }
  if (out.length === 0) { skipped?.push({ scope, id: exam, why: "overlay would leave the bank empty — code questions kept" }); return bank; }
  return out;
}

/** True when nothing in the overlay would change learner-visible content. */
export function overlayIsEmpty(o: ContentOverlay): boolean {
  return Object.keys(o.quiz).length === 0 && Object.keys(o.mpt.replace ?? {}).length === 0 && Object.values(o.teacher).every((x) => !x || (!Object.keys(x.replace ?? {}).length && !(x.remove ?? []).length && !(x.add ?? []).length));
}
