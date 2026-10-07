import type { AnswerMap } from "./engine-types";

export interface StoredSession {
  mockId: string; // id of the test this session belongs to ("mock1" or "mock1-IS")
  startedAt: number; // epoch ms
  endsAt: number; // epoch ms, fixed at start so the clock never resets
  answers: AnswerMap;
  marked: Record<string, true>;
  current: number;
  submittedAt: number | null;
  autoSubmitted: boolean;
}

export interface AttemptRecord {
  startedAt: number;
  finishedAt: number;
  score: number;
  total: number;
  passMarks: number;
  passed: boolean;
  timeUsedSeconds: number;
  autoSubmitted: boolean;
}

const SESSION_PREFIX = "th-mpt-session-v2:";
const HISTORY_PREFIX = "th-mpt-history-v1:";
/** Key used before tests were generalised; only ever held a Mock 1 attempt. */
const LEGACY_KEY = "th-mpt-mock-session-v1";
const MAX_HISTORY = 25;

const sessionKey = (testId: string) => SESSION_PREFIX + testId;
const historyKey = (testId: string) => HISTORY_PREFIX + testId;

function isSession(x: unknown): x is StoredSession {
  if (!x || typeof x !== "object") return false;
  const s = x as Partial<StoredSession>;
  return (
    typeof s.mockId === "string" &&
    typeof s.startedAt === "number" &&
    typeof s.endsAt === "number" &&
    !!s.answers && typeof s.answers === "object" &&
    !!s.marked && typeof s.marked === "object" &&
    typeof s.current === "number" &&
    (s.submittedAt === null || typeof s.submittedAt === "number")
  );
}

/** Move an in-progress (or finished) Mock 1 attempt from the old single key to the new per-test key, once. */
function migrateLegacy(testId: string): void {
  if (testId !== "mock1") return;
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return;
    const parsed: unknown = JSON.parse(raw);
    if (isSession(parsed) && parsed.mockId === "mock1" && window.localStorage.getItem(sessionKey("mock1")) === null) {
      window.localStorage.setItem(sessionKey("mock1"), JSON.stringify({ ...parsed, autoSubmitted: parsed.autoSubmitted === true }));
    }
    window.localStorage.removeItem(LEGACY_KEY);
  } catch {
    /* storage unavailable or corrupt: nothing to migrate */
  }
}

export function loadSession(testId: string): StoredSession | null {
  try {
    migrateLegacy(testId);
    const raw = window.localStorage.getItem(sessionKey(testId));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isSession(parsed) && parsed.mockId === testId ? parsed : null;
  } catch {
    return null;
  }
}

export function saveSession(s: StoredSession): void {
  try {
    window.localStorage.setItem(sessionKey(s.mockId), JSON.stringify(s));
  } catch {
    /* storage unavailable: the exam still works in memory */
  }
}

export function clearSession(testId: string): void {
  try {
    window.localStorage.removeItem(sessionKey(testId));
  } catch {
    /* ignore */
  }
}

// ---- attempt history (score, date, time used), newest first
export function loadHistory(testId: string): AttemptRecord[] {
  try {
    const raw = window.localStorage.getItem(historyKey(testId));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r): r is AttemptRecord =>
        !!r && typeof r === "object" && typeof (r as AttemptRecord).score === "number" && typeof (r as AttemptRecord).startedAt === "number"
    );
  } catch {
    return [];
  }
}

/** Adds an attempt unless one with the same startedAt is already stored (so re-opening a finished test never double counts). */
export function recordAttempt(testId: string, rec: AttemptRecord): void {
  try {
    const list = loadHistory(testId);
    if (list.some((r) => r.startedAt === rec.startedAt)) return;
    const next = [rec, ...list].sort((a, b) => b.finishedAt - a.finishedAt).slice(0, MAX_HISTORY);
    window.localStorage.setItem(historyKey(testId), JSON.stringify(next));
  } catch {
    /* ignore: history is a convenience */
  }
}

export function bestAttempt(list: AttemptRecord[]): AttemptRecord | null {
  let best: AttemptRecord | null = null;
  for (const r of list) if (!best || r.score > best.score) best = r;
  return best;
}
