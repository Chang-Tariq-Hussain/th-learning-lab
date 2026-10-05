import type { Difficulty, Question } from "./types";

export type Mode = "practice" | "drill";
export type DiffSetting = Difficulty | "mixed";
export type Source = "all" | "past";
export type Phase = "setup" | "question" | "answered" | "finished";

export const DRILL_COUNTS = [10, 20, 30] as const;
export const TIMER_OPTIONS = [0, 45, 60, 90] as const;

export interface Result {
  q: Question;
  /** Chosen option index, or null when the clock ran out. */
  picked: number | null;
  correct: boolean;
  ms: number;
}

export interface SessionState {
  mode: Mode;
  diff: DiffSetting;
  topicId: string | null;
  /** "past" limits questions to the verified past-paper bank. */
  source: Source;
  drillCount: number;
  /** Seconds per question in a drill; 0 = untimed. */
  secPerQ: number;
  phase: Phase;
  question: Question | null;
  picked: number | null;
  startedAt: number;
  remainingMs: number;
  results: Result[];
}

export type SessionAction =
  | { type: "settings"; patch: Partial<Pick<SessionState, "diff" | "topicId" | "source" | "drillCount" | "secPerQ">> }
  | { type: "to-setup"; mode: Mode }
  | { type: "start"; mode: Mode; question: Question; now: number }
  | { type: "show"; question: Question; now: number }
  | { type: "pick"; index: number; now: number }
  | { type: "timeout"; now: number }
  | { type: "tick"; now: number }
  | { type: "finish" };

export function initialSession(): SessionState {
  return { mode: "practice", diff: 2, topicId: null, source: "all", drillCount: 10, secPerQ: 60, phase: "setup", question: null, picked: null, startedAt: 0, remainingMs: 0, results: [] };
}

export const isTimed = (s: Pick<SessionState, "mode" | "secPerQ">) => s.mode === "drill" && s.secPerQ > 0;

export function sessionReducer(s: SessionState, a: SessionAction): SessionState {
  switch (a.type) {
    case "settings":
      return { ...s, ...a.patch };
    case "to-setup":
      return { ...s, mode: a.mode, phase: "setup", question: null, picked: null, results: [] };
    case "start":
      return { ...s, mode: a.mode, phase: "question", question: a.question, picked: null, startedAt: a.now, remainingMs: s.secPerQ * 1000, results: [] };
    case "show":
      return { ...s, phase: "question", question: a.question, picked: null, startedAt: a.now, remainingMs: s.secPerQ * 1000 };
    case "pick": {
      if (s.phase !== "question" || !s.question || a.index < 0 || a.index >= s.question.options.length) return s;
      const correct = a.index === s.question.correct;
      return { ...s, phase: "answered", picked: a.index, results: [...s.results, { q: s.question, picked: a.index, correct, ms: Math.max(0, a.now - s.startedAt) }] };
    }
    case "timeout": {
      if (s.phase !== "question" || !s.question) return s;
      return { ...s, phase: "answered", picked: null, remainingMs: 0, results: [...s.results, { q: s.question, picked: null, correct: false, ms: Math.max(0, a.now - s.startedAt) }] };
    }
    case "tick": {
      if (s.phase !== "question" || !isTimed(s)) return s;
      const remaining = Math.max(0, s.secPerQ * 1000 - (a.now - s.startedAt));
      return remaining === s.remainingMs ? s : { ...s, remainingMs: remaining };
    }
    case "finish":
      return { ...s, phase: "finished" };
    default:
      return s;
  }
}

export interface TopicStat {
  topic: string;
  label: string;
  total: number;
  correct: number;
}

export function topicStats(results: Result[]): TopicStat[] {
  const map = new Map<string, TopicStat>();
  for (const r of results) {
    const cur = map.get(r.q.topic) ?? { topic: r.q.topic, label: r.q.topicLabel, total: 0, correct: 0 };
    cur.total++;
    if (r.correct) cur.correct++;
    map.set(r.q.topic, cur);
  }
  return [...map.values()].sort((a, b) => a.correct / a.total - b.correct / b.total || b.total - a.total);
}

export function currentStreak(results: Result[]): number {
  let n = 0;
  for (let i = results.length - 1; i >= 0 && results[i]!.correct; i--) n++;
  return n;
}

export function bestStreak(results: Result[]): number {
  let best = 0;
  let cur = 0;
  for (const r of results) {
    cur = r.correct ? cur + 1 : 0;
    best = Math.max(best, cur);
  }
  return best;
}

export const accuracyPct = (results: Result[]) => (results.length ? Math.round((results.filter((r) => r.correct).length / results.length) * 100) : 0);

export function avgSeconds(results: Result[]): number {
  return results.length ? results.reduce((t, r) => t + r.ms, 0) / results.length / 1000 : 0;
}
