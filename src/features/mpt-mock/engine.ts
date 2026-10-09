import { MPT_MOCK_1, MPT_MOCK_2, MPT_QUESTION_BANK } from "./data/mpt-mock-data";
import type { MptMockDefinition, MptQuestion } from "./data/mpt-mock-data";
import { asFullTest, buildSectionTest, isSectionCode } from "./test-defs";
import type { MptTest } from "./test-defs";

export type { Letter, AnswerMap, RunnerQuestion } from "./engine-types";
import type { AnswerMap, RunnerQuestion } from "./engine-types";

/** Registry of full mocks. Add a new mock here once its question ids exist in the data file. */
export const MPT_MOCKS: MptMockDefinition[] = [MPT_MOCK_1, MPT_MOCK_2];

export function getMockById(id: string): MptMockDefinition | null {
  return MPT_MOCKS.find((m) => m.id === id) ?? null;
}

/** Resolves "mock2" (full test) or "mock2-IS" (section test) to a test definition, or null if unknown. */
export function getTestById(testId: string): MptTest | null {
  const full = getMockById(testId);
  if (full) return asFullTest(full);
  const m = /^(mock\d+)-([A-Z]{2})$/.exec(testId);
  if (!m || !m[1] || !m[2] || !isSectionCode(m[2])) return null;
  const mock = getMockById(m[1]);
  return mock ? buildSectionTest(mock, m[2]) : null;
}

let bankIndex: Map<string, MptQuestion> | null = null;
function bankById(): Map<string, MptQuestion> {
  if (!bankIndex) bankIndex = new Map(MPT_QUESTION_BANK.map((q) => [q.id, q] as const));
  return bankIndex;
}

export function getMockQuestions(mock: MptMockDefinition): MptQuestion[] {
  const byId = bankById();
  const out: MptQuestion[] = [];
  for (const id of mock.questionIds) {
    const q = byId.get(id);
    if (q) out.push(q);
  }
  return out;
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

export interface BucketResult {
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
}

export interface SectionResult extends BucketResult {
  subject: string;
  code: string;
  accuracy: number; // correct / attempted, 0-100
}

export interface WeakArea {
  subject: string;
  topic: string;
  correct: number;
  total: number;
  percent: number; // correct / total, unanswered count as missed
}

export interface MockResult extends BucketResult {
  score: number;
  percentage: number;
  passMarks: number;
  passed: boolean;
  sections: SectionResult[];
  weakAreas: WeakArea[];
  status: Record<string, "correct" | "incorrect" | "unanswered">;
}

export function gradeMock(
  mock: MptMockDefinition,
  questions: RunnerQuestion[],
  answers: AnswerMap
): MockResult {
  const status: MockResult["status"] = {};
  const bySubject = new Map<string, BucketResult>();
  const byTopic = new Map<string, WeakArea>();
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  for (const q of questions) {
    const given = answers[q.id];
    const state = given === undefined ? "unanswered" : given === q.correctAnswer ? "correct" : "incorrect";
    status[q.id] = state;
    if (state === "correct") correct += 1;
    else if (state === "incorrect") incorrect += 1;
    else unanswered += 1;

    const s = bySubject.get(q.subject) ?? { total: 0, correct: 0, incorrect: 0, unanswered: 0 };
    s.total += 1;
    s[state] += 1;
    bySubject.set(q.subject, s);

    const key = `${q.subject}||${q.topic}`;
    const t = byTopic.get(key) ?? { subject: q.subject, topic: q.topic, correct: 0, total: 0, percent: 0 };
    t.total += 1;
    if (state === "correct") t.correct += 1;
    byTopic.set(key, t);
  }

  const sections: SectionResult[] = mock.sections.map((sec) => {
    const b = bySubject.get(sec.subject) ?? { total: sec.count, correct: 0, incorrect: 0, unanswered: sec.count };
    const attempted = b.correct + b.incorrect;
    return {
      subject: sec.subject,
      code: sec.code,
      ...b,
      accuracy: attempted === 0 ? 0 : Math.round((b.correct / attempted) * 100),
    };
  });

  // Weak areas: topics with at least 2 questions scoring under 60% (unanswered counts as missed),
  // lowest first, at most 3 per subject.
  const weakAreas: WeakArea[] = [];
  for (const sec of mock.sections) {
    const rows = [...byTopic.values()]
      .filter((t) => t.subject === sec.subject && t.total >= 2)
      .map((t) => ({ ...t, percent: Math.round((t.correct / t.total) * 100) }))
      .filter((t) => t.percent < 60)
      .sort((a, b) => a.percent - b.percent || b.total - a.total)
      .slice(0, 3);
    weakAreas.push(...rows);
  }

  const score = correct; // 1 mark each, no negative marking
  return {
    total: questions.length,
    correct,
    incorrect,
    unanswered,
    score,
    percentage: questions.length === 0 ? 0 : Math.round((score / questions.length) * 1000) / 10,
    passMarks: mock.passMarks,
    passed: score >= mock.passMarks,
    sections,
    weakAreas,
    status,
  };
}

export function sourceLabel(q: RunnerQuestion): string {
  return q.sourceYear ? `${q.sourceType} · ${q.sourceYear}` : q.sourceType;
}

export const isUrdu = (q: RunnerQuestion): boolean => q.rtl ?? q.subjectCode === "UR";
