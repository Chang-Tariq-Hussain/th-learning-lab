/**
 * Database rows → the exact objects the learner app uses. This is the inverse of
 * lib/db-seed/bundle.ts. A round-trip check over every imported question (scripts/db/verify.ts) proves the
 * two are inverses: importing the code and mapping it back must give identical questions, so a pristine
 * database always yields an EMPTY overlay.
 */
import type { QuizQuestion } from "@/features/quiz-engine/types";
import type { MptQuestion } from "@/features/mpt-mock/data/mpt-mock-data";
import type { ExamType, TeacherQuestion } from "@/features/teacher-tests/types";

export interface DbQuestion {
  id: string; source_system: "quiz" | "mpt" | "teacher"; legacy_id: string; subject_slug: string | null; exam_subject: string | null;
  topic: string | null; concept: string | null; difficulty: string | null; stem: string; passage: string | null; options: string[]; correct_index: number;
  fixed_order: boolean; explanation: string; hints: string[] | null; misconception_tag: string | null; language: string | null;
  source_type: "verified_past_paper" | "existing_bank" | "generated" | "platform_authored"; source_detail: string | null; source_year: number | null;
  source_reference: string | null; source_note: string | null; answer_check: string; verified_note: string | null; needs_review: boolean;
  extra: Record<string, unknown>;
}
export interface DbExamLink { exam_slug: string; topic: string | null; subtopic: string | null; difficulty: string | null; section_code: string | null }

export function toQuizQuestion(q: DbQuestion): QuizQuestion {
  const out: Record<string, unknown> = {
    id: q.legacy_id, type: "multiple-choice", question: q.stem, explanation: q.explanation, difficulty: q.difficulty,
    subject: q.subject_slug, topic: q.topic, options: [...q.options], correctAnswer: q.options[q.correct_index],
  };
  if (q.concept) out["concept"] = q.concept;
  if (q.misconception_tag) out["misconceptionTag"] = q.misconception_tag;
  if (q.hints && q.hints.length) out["hints"] = [...q.hints];
  return out as unknown as QuizQuestion;
}

const MPT_DIFFICULTY: Record<string, MptQuestion["difficulty"]> = { easy: "Easy", medium: "Moderate", hard: "Difficult" };
const MPT_SOURCE: Record<DbQuestion["source_type"], MptQuestion["sourceType"]> = {
  verified_past_paper: "Verified Past Paper", existing_bank: "Existing Question Bank", generated: "Generated Practice", platform_authored: "Generated Practice",
};
const LETTERS = ["A", "B", "C", "D"] as const;

export function toMptQuestion(q: DbQuestion, link: DbExamLink): MptQuestion {
  const x = q.extra as { alsoIn?: number[]; optionsReordered?: boolean; usedInMocks?: string[]; mockNumber?: Record<string, number>; yieldNote?: string | null };
  const out: Record<string, unknown> = {
    id: q.legacy_id, subject: q.exam_subject, subjectCode: link.section_code, topic: link.topic ?? "", difficulty: MPT_DIFFICULTY[link.difficulty ?? ""] ?? "Moderate",
    question: q.stem, passage: q.passage, options: Object.fromEntries(LETTERS.map((l, i) => [l, q.options[i]])), correctAnswer: LETTERS[q.correct_index],
    explanation: q.explanation, sourceType: (q.source_detail as MptQuestion["sourceType"] | null) ?? MPT_SOURCE[q.source_type], sourceYear: q.source_year,
    alsoIn: x.alsoIn ?? [], sourceNote: q.source_note ?? "", verified: q.answer_check === "independently_checked", verifiedNote: q.verified_note ?? "",
    optionsReordered: x.optionsReordered ?? false, usedInMocks: x.usedInMocks ?? [], mockNumber: x.mockNumber ?? {},
  };
  if ("yieldNote" in q.extra && x.yieldNote !== null && x.yieldNote !== undefined) out["yieldNote"] = x.yieldNote;
  return out as unknown as MptQuestion;
}

const TEACHER_DIFFICULTY: Record<string, TeacherQuestion["difficulty"]> = { easy: "easy", medium: "moderate", hard: "difficult" };
const TEACHER_SOURCE: Record<DbQuestion["source_type"], TeacherQuestion["sourceType"]> = {
  verified_past_paper: "verified_past_paper", existing_bank: "existing_question", generated: "generated_syllabus", platform_authored: "generated_syllabus",
};
const EXAM_ORDER: ExamType[] = ["pst", "jest", "jst"];

/** `link` is this exam's own filing of the question; `memberships` lists every exam it belongs to. */
export function toTeacherQuestion(q: DbQuestion, exam: ExamType, link: DbExamLink, memberships: string[]): TeacherQuestion {
  const x = q.extra as { syllabusClass?: string | null };
  return {
    id: q.legacy_id, examType: exam, examTypes: EXAM_ORDER.filter((e) => memberships.includes(e)),
    question: q.stem, passage: q.passage, options: q.options as TeacherQuestion["options"], correctAnswer: q.correct_index, explanation: q.explanation,
    subject: q.exam_subject as TeacherQuestion["subject"], topic: link.topic ?? "", subtopic: link.subtopic,
    difficulty: TEACHER_DIFFICULTY[link.difficulty ?? ""] ?? "moderate", sourceType: (q.source_detail as TeacherQuestion["sourceType"] | null) ?? TEACHER_SOURCE[q.source_type],
    sourceYear: q.source_year, sourceReference: q.source_reference, verified: q.answer_check === "independently_checked", verificationNote: q.verified_note ?? "",
    syllabusClass: x.syllabusClass ?? null, language: (q.language as TeacherQuestion["language"] | null) ?? "en", fixedOrder: q.fixed_order, needsReview: q.needs_review,
  };
}
