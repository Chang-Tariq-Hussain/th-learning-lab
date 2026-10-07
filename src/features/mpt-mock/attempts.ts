import type { MptMockDefinition } from "./data/mpt-mock-data";
import type { MockResult } from "./engine";
import { bestAttempt, loadHistory, loadSession, recordAttempt, saveSession } from "./storage";
import type { AttemptRecord, StoredSession } from "./storage";

export type TestState = "not-started" | "in-progress" | "completed";

export interface TestStatus {
  state: TestState;
  last: AttemptRecord | null;
  best: AttemptRecord | null;
  attempts: number;
  /** true while the stored session is finished or expired but not yet graded into history */
  needsFinalize: boolean;
}

export function attemptFromResult(result: MockResult, session: StoredSession): AttemptRecord {
  const finishedAt = session.submittedAt ?? Date.now();
  return {
    startedAt: session.startedAt,
    finishedAt,
    score: result.score,
    total: result.total,
    passMarks: result.passMarks,
    passed: result.passed,
    timeUsedSeconds: Math.max(0, Math.round((finishedAt - session.startedAt) / 1000)),
    autoSubmitted: session.autoSubmitted,
  };
}

/** Cheap read used by the landing page. Does not import the question bank. */
export function readTestStatus(testId: string, now: number = Date.now()): TestStatus {
  const session = loadSession(testId);
  const history = loadHistory(testId);
  const last = history[0] ?? null;
  const best = bestAttempt(history);
  const base = { last, best, attempts: history.length };
  if (session) {
    if (session.submittedAt === null && now < session.endsAt) return { ...base, state: "in-progress", needsFinalize: false };
    const recorded = history.some((r) => r.startedAt === session.startedAt);
    if (!recorded) return { ...base, state: last ? "completed" : "in-progress", needsFinalize: true };
  }
  return { ...base, state: history.length > 0 ? "completed" : "not-started", needsFinalize: false };
}

/**
 * Grades a finished-or-expired stored session into the attempt history (e.g. the time ran out while the person was elsewhere).
 * The engine (and so the question bank) is loaded on demand, only when this is actually needed.
 */
export async function finalizeStoredSession(test: MptMockDefinition): Promise<void> {
  const session = loadSession(test.id);
  if (!session) return;
  const now = Date.now();
  if (session.submittedAt === null) {
    if (now < session.endsAt) return;
    const done: StoredSession = { ...session, submittedAt: session.endsAt, autoSubmitted: true };
    saveSession(done);
    await finalizeStoredSession(test);
    return;
  }
  const { getMockQuestions, gradeMock } = await import("./engine");
  const result = gradeMock(test, getMockQuestions(test), session.answers);
  recordAttempt(test.id, attemptFromResult(result, session));
}
