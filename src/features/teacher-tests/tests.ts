/**
 * Turns teacher-bank questions and planned papers into the shapes the shared exam runner understands.
 * No bank is imported here, so light pages can use it without shipping questions.
 */
import type { MptTest } from "@/features/mpt-mock/test-defs";
import type { Letter, RunnerQuestion } from "@/features/mpt-mock/engine-types";
import { hashString, mulberry32, seededShuffle } from "./random";
import type { PlannedMock } from "./generator";
import { TEACHER_BASE } from "./config";
import type { ExamConfig, ExamType, TeacherDifficulty, TeacherQuestion, TeacherSourceType, TeacherSubject } from "./types";

export type PracticeMode = "subject" | "topic" | "difficulty" | "past-paper" | "mixed";
export const PRACTICE_MODES: PracticeMode[] = ["subject", "topic", "difficulty", "past-paper", "mixed"];

export interface PracticeSpec {
  mode: PracticeMode;
  subject?: TeacherSubject;
  topic?: string;
  difficulty?: TeacherDifficulty;
  count: number;
}

export interface TeacherTest extends MptTest {
  exam: ExamType;
  mode: "mock" | "practice";
  mockIndex?: number;
  practice?: PracticeSpec;
}

export const SUBJECT_CODES: Record<TeacherSubject, string> = {
  English: "ENG",
  Mathematics: "MAT",
  Science: "SCI",
  Computer: "CMP",
  Islamiat: "ISL",
  "Social Studies": "SOC",
  Sindhi: "SND",
  Urdu: "URD",
  Pedagogy: "PED",
};

export const SOURCE_LABELS: Record<TeacherSourceType, string> = {
  verified_past_paper: "Verified Past Paper",
  existing_question: "Existing Question",
  generated_similar: "Similar Practice Question",
  generated_syllabus: "Generated Syllabus Question",
};

export const DIFFICULTY_LABELS: Record<TeacherDifficulty, string> = { easy: "Easy", moderate: "Moderate", difficult: "Difficult" };

const LETTERS: Letter[] = ["A", "B", "C", "D"];

export function mockHref(exam: ExamType, index: number): string {
  return `${TEACHER_BASE}/${exam}/mock/${index}`;
}

export function buildMockTest(cfg: ExamConfig, planned: PlannedMock): TeacherTest {
  const total = planned.questionIds.length;
  return {
    id: planned.id,
    kind: "full",
    mockId: planned.id,
    mockTitle: `${cfg.label} Mock ${planned.index}`,
    title: `${cfg.label} Mock ${planned.index}`,
    totalQuestions: total,
    timeMinutes: cfg.mock.durationMinutes,
    passMarks: cfg.mock.passMarks ?? 0,
    negativeMarking: cfg.mock.negativeMarking,
    sections: planned.sections.filter((s) => s.ids.length > 0).map((s) => ({ subject: s.title, code: s.code, count: s.ids.length })),
    questionIds: planned.questionIds,
    exam: cfg.id,
    mode: "mock",
    mockIndex: planned.index,
  };
}

export function practiceTitle(cfg: ExamConfig, spec: PracticeSpec): string {
  switch (spec.mode) {
    case "subject":
      return `${cfg.label} practice - ${spec.subject ?? "Subject"}`;
    case "topic":
      return `${cfg.label} practice - ${spec.subject ?? ""}: ${spec.topic ?? "Topic"}`;
    case "difficulty":
      return `${cfg.label} practice - ${spec.difficulty ?? "Difficulty"}`;
    case "past-paper":
      return `${cfg.label} practice - Past papers`;
    default:
      return `${cfg.label} practice - Mixed`;
  }
}

/** `questions` must already be ordered with each subject's questions together. */
export function buildPracticeTest(cfg: ExamConfig, id: string, spec: PracticeSpec, questions: TeacherQuestion[]): TeacherTest {
  const sections: { subject: string; code: string; count: number }[] = [];
  for (const q of questions) {
    const last = sections[sections.length - 1];
    if (last && last.subject === q.subject) last.count += 1;
    else sections.push({ subject: q.subject, code: SUBJECT_CODES[q.subject], count: 1 });
  }
  return {
    id,
    kind: "full",
    mockId: id,
    mockTitle: practiceTitle(cfg, spec),
    title: practiceTitle(cfg, spec),
    totalQuestions: questions.length,
    timeMinutes: Math.max(1, Math.ceil(questions.length * cfg.practice.minutesPerQuestion)),
    passMarks: 0,
    negativeMarking: false,
    sections,
    questionIds: questions.map((q) => q.id),
    exam: cfg.id,
    mode: "practice",
    practice: spec,
  };
}

const UNSAFE_OPTION = /\b(all|none|both|neither|any)\s+of\b|\babove\b|\bboth\b|\b[abcd]\s*(and|&)\s*[abcd]\b/i;

/** Options may be reordered unless the question marks them fixed or one option refers to the others. */
export function canShuffleOptions(q: TeacherQuestion): boolean {
  if (q.fixedOrder) return false;
  return !q.options.some((o) => UNSAFE_OPTION.test(o));
}

/** Deterministic option order for one question in one test, with the correct answer tracked through the shuffle. */
export function arrangeOptions(q: TeacherQuestion, testId: string, shuffle: boolean): { options: Record<Letter, string>; correct: Letter; order: number[] } {
  const idx = [0, 1, 2, 3];
  const order = shuffle && canShuffleOptions(q) ? seededShuffle(idx, mulberry32(hashString(`${testId}|${q.id}|opt`))) : idx;
  const options = {} as Record<Letter, string>;
  let correct: Letter = "A";
  order.forEach((orig, pos) => {
    const letter = LETTERS[pos] as Letter;
    options[letter] = q.options[orig] as string;
    if (orig === q.correctAnswer) correct = letter;
  });
  return { options, correct, order };
}

export function toRunnerQuestions(test: TeacherTest, cfg: ExamConfig, bank: TeacherQuestion[]): RunnerQuestion[] {
  const byId = new Map(bank.map((q) => [q.id, q] as const));
  const out: RunnerQuestion[] = [];
  let sectionIndex = 0;
  let usedInSection = 0;
  test.questionIds.forEach((id) => {
    const q = byId.get(id);
    if (!q) return;
    while (sectionIndex < test.sections.length - 1 && usedInSection >= (test.sections[sectionIndex]?.count ?? 0)) {
      sectionIndex += 1;
      usedInSection = 0;
    }
    usedInSection += 1;
    const sec = test.sections[sectionIndex];
    const { options, correct } = arrangeOptions(q, test.id, cfg.mock.randomizeOptions);
    out.push({
      id: q.id,
      subject: sec?.subject ?? q.subject,
      subjectCode: sec?.code ?? SUBJECT_CODES[q.subject],
      topic: q.topic,
      difficulty: DIFFICULTY_LABELS[q.difficulty],
      question: q.question,
      passage: q.passage,
      options,
      correctAnswer: correct,
      explanation: q.explanation,
      sourceType: SOURCE_LABELS[q.sourceType],
      sourceYear: q.sourceYear,
      verified: q.verified,
      rtl: q.language !== "en",
    });
  });
  return out;
}
