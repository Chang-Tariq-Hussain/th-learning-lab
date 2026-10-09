/** Extra result breakdowns for the teacher tests: difficulty, source type, and strong / weak topics. */
import type { RunnerQuestion } from "@/features/mpt-mock/engine-types";

export interface Row {
  label: string;
  correct: number;
  total: number;
  percent: number;
}

type Status = Record<string, "correct" | "incorrect" | "unanswered">;

function group(questions: RunnerQuestion[], status: Status, keyOf: (q: RunnerQuestion) => string): Row[] {
  const map = new Map<string, { correct: number; total: number }>();
  for (const q of questions) {
    const k = keyOf(q);
    const e = map.get(k) ?? { correct: 0, total: 0 };
    e.total += 1;
    if (status[q.id] === "correct") e.correct += 1;
    map.set(k, e);
  }
  return [...map.entries()].map(([label, e]) => ({ label, ...e, percent: e.total === 0 ? 0 : Math.round((e.correct / e.total) * 100) }));
}

export interface TeacherAnalysis {
  byDifficulty: Row[];
  bySource: Row[];
  /** past-paper questions against everything else */
  pastVsGenerated: Row[];
  strong: Row[];
  weak: Row[];
}

const DIFF_ORDER = ["Easy", "Moderate", "Difficult"];

export function analyse(questions: RunnerQuestion[], status: Status): TeacherAnalysis {
  const byDifficulty = group(questions, status, (q) => q.difficulty).sort((a, b) => DIFF_ORDER.indexOf(a.label) - DIFF_ORDER.indexOf(b.label));
  const bySource = group(questions, status, (q) => q.sourceType).sort((a, b) => b.total - a.total);
  const pastVsGenerated = group(questions, status, (q) => (q.sourceType === "Verified Past Paper" ? "Verified past paper" : "Practice and generated"));
  const topics = group(questions, status, (q) => `${q.subject}: ${q.topic}`).filter((r) => r.total >= 2);
  const strong = topics.filter((r) => r.percent >= 80).sort((a, b) => b.percent - a.percent || b.total - a.total).slice(0, 5);
  const weak = topics.filter((r) => r.percent < 60).sort((a, b) => a.percent - b.percent || b.total - a.total).slice(0, 5);
  return { byDifficulty, bySource, pastVsGenerated, strong, weak };
}
