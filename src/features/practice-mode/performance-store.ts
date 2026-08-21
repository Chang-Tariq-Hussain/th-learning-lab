/**
 * Local, non-authenticated Practice Engine performance — persisted in
 * localStorage, no accounts, no server. Mirrors
 * `@/lib/learning-progress.ts`'s shape on purpose: pure read/write
 * functions plus a storage key, so this integrates with the same
 * client-side state architecture the rest of the platform already
 * uses instead of introducing a new one.
 *
 * Server-sync seam: every write goes through `withAttemptsRecorded`
 * below, never through `window.localStorage` directly from a
 * component. Moving to server-backed performance tracking later means
 * changing `readPerformanceState`/`writePerformanceState` to call an
 * API instead of localStorage — nothing that calls them needs to
 * change.
 */

import type { PracticePerformanceState, QuestionAttemptRecord } from "./mastery-types";

export const PRACTICE_PERFORMANCE_STORAGE_KEY = "learning-platform-practice-performance";
const CURRENT_VERSION = 1 as const;

/** How many attempts to keep per subject+topic. Old attempts are
 *  dropped oldest-first once a topic exceeds this, so a student who's
 *  practiced the same topic for months doesn't grow an unbounded
 *  localStorage payload — recent performance is what the adaptive
 *  selector and mastery summary actually care about. */
const MAX_ATTEMPTS_PER_TOPIC = 300;

function emptyState(): PracticePerformanceState {
  return { version: CURRENT_VERSION, attempts: [] };
}

export function readPerformanceState(): PracticePerformanceState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(PRACTICE_PERFORMANCE_STORAGE_KEY);
    if (typeof raw !== "string") return emptyState();

    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      (parsed as PracticePerformanceState).version !== CURRENT_VERSION ||
      !Array.isArray((parsed as PracticePerformanceState).attempts)
    ) {
      return emptyState();
    }
    return parsed as PracticePerformanceState;
  } catch {
    return emptyState();
  }
}

export function writePerformanceState(state: PracticePerformanceState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PRACTICE_PERFORMANCE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore — worst case performance history just doesn't persist this session.
  }
}

export function clearPerformanceState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PRACTICE_PERFORMANCE_STORAGE_KEY);
  } catch {
    // Ignore.
  }
}

/**
 * Appends a batch of attempts (one finished practice/quiz round) and
 * trims each subject+topic's history back down to
 * `MAX_ATTEMPTS_PER_TOPIC`, keeping the most recent. Pure — returns a
 * new state rather than mutating, so it can be used directly as a
 * `setState` updater.
 */
export function withAttemptsRecorded(
  state: PracticePerformanceState,
  newAttempts: QuestionAttemptRecord[],
): PracticePerformanceState {
  if (newAttempts.length === 0) return state;

  const combined = [...state.attempts, ...newAttempts];

  // Trim per subject+topic group rather than globally, so a heavily
  // practiced topic can't crowd out history for a topic the student
  // barely touches.
  const countByTopic = new Map<string, number>();
  for (let i = combined.length - 1; i >= 0; i--) {
    const attempt = combined[i]!;
    const key = `${attempt.subjectSlug}:${attempt.topicSlug}`;
    const count = countByTopic.get(key) ?? 0;
    if (count >= MAX_ATTEMPTS_PER_TOPIC) {
      combined.splice(i, 1);
      continue;
    }
    countByTopic.set(key, count + 1);
  }

  return { ...state, attempts: combined };
}
