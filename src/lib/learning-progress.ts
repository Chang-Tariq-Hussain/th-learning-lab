/**
 * Local, non-authenticated learning progress — persisted in
 * localStorage, no accounts, no server. This mirrors `user-profile.ts`
 * on purpose: same small "pure read/write functions + a storage key"
 * shape, so this feature integrates with the project's existing
 * client-side state architecture instead of introducing a new one
 * (no Zustand here either).
 *
 * Every function in this file is pure with respect to its inputs —
 * `with*` functions take a state and return a *new* state rather than
 * mutating in place — so `@/hooks/use-learning-progress` can use them
 * directly as `setState` updaters, and so this logic is trivially
 * testable without a DOM.
 *
 * Server-sync seam: every write in the app goes through the `with*`
 * functions below, never through `window.localStorage` directly.
 * Moving to server-backed progress later means changing
 * `readProgressState`/`writeProgressState` to call an API instead of
 * localStorage — the `with*` functions, and everything that calls
 * them (the progress hook, and every component built on it), do not
 * need to change.
 */

import { createEmptyTopicProgress } from "@/features/learning/mastery";
import {
  progressKey,
  type LearningProgressState,
  type LearningStep,
  type TopicProgress,
} from "@/features/learning/types";

export const LEARNING_PROGRESS_STORAGE_KEY = "learning-platform-progress";
const CURRENT_VERSION = 1 as const;

function emptyState(): LearningProgressState {
  return { version: CURRENT_VERSION, topics: {} };
}

/** Reads and validates the stored progress state. Returns an empty,
 *  valid state for missing, corrupt, or wrong-version data — never
 *  throws. */
export function readProgressState(): LearningProgressState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(LEARNING_PROGRESS_STORAGE_KEY);
    if (typeof raw !== "string") return emptyState();

    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      (parsed as LearningProgressState).version !== CURRENT_VERSION ||
      typeof (parsed as LearningProgressState).topics !== "object"
    ) {
      return emptyState();
    }
    return parsed as LearningProgressState;
  } catch {
    // Storage can throw in private-browsing modes or when disabled;
    // corrupt JSON is also possible if a future version's shape changes.
    return emptyState();
  }
}

export function writeProgressState(state: LearningProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LEARNING_PROGRESS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore — worst case progress just doesn't persist this session.
  }
}

export function clearProgressState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LEARNING_PROGRESS_STORAGE_KEY);
  } catch {
    // Ignore.
  }
}

/** Reads one topic's progress out of a state object, falling back to
 *  an empty record rather than `undefined` so callers never need a
 *  null check. */
export function getTopicProgress(
  state: LearningProgressState,
  subjectSlug: string,
  topicSlug: string,
): TopicProgress {
  return state.topics[progressKey(subjectSlug, topicSlug)] ?? createEmptyTopicProgress(subjectSlug, topicSlug);
}

function updateTopic(
  state: LearningProgressState,
  subjectSlug: string,
  topicSlug: string,
  update: (progress: TopicProgress) => TopicProgress,
): LearningProgressState {
  const key = progressKey(subjectSlug, topicSlug);
  const current = getTopicProgress(state, subjectSlug, topicSlug);
  const next = update(current);

  // No-op guard: if `update` returns the same object (see
  // `withStepCompleted` below), skip creating a new state entirely so
  // callers using this as a `setState` updater get a reference-equal
  // bail-out from React instead of an unnecessary re-render.
  if (next === current) return state;

  return {
    ...state,
    topics: { ...state.topics, [key]: { ...next, updatedAt: new Date().toISOString() } },
  };
}

/** Marks a step complete. Idempotent — completing an already-complete
 *  step returns the same state object (see the no-op guard above). */
export function withStepCompleted(
  state: LearningProgressState,
  subjectSlug: string,
  topicSlug: string,
  step: LearningStep,
): LearningProgressState {
  return updateTopic(state, subjectSlug, topicSlug, (progress) => {
    if (progress.stepsCompleted.includes(step)) return progress;
    return { ...progress, stepsCompleted: [...progress.stepsCompleted, step] };
  });
}

/** Records one Predict-phase answer (correct or not). */
export function withPredictionAnswer(
  state: LearningProgressState,
  subjectSlug: string,
  topicSlug: string,
  correct: boolean,
): LearningProgressState {
  return updateTopic(state, subjectSlug, topicSlug, (progress) => ({
    ...progress,
    predictionTotal: progress.predictionTotal + 1,
    predictionCorrect: progress.predictionCorrect + (correct ? 1 : 0),
  }));
}

/** Records a Practice (quiz) attempt's score, keeping the best. */
export function withQuizResult(
  state: LearningProgressState,
  subjectSlug: string,
  topicSlug: string,
  scoreFraction: number,
): LearningProgressState {
  return updateTopic(state, subjectSlug, topicSlug, (progress) => ({
    ...progress,
    bestQuizScore: Math.max(progress.bestQuizScore ?? 0, scoreFraction),
  }));
}

/** Records one attempt at one Challenge scenario. `challengeAttempts`
 *  increments every call (every submit, across every scenario);
 *  `scenarioId` is added to `challengeSolvedIds` the first time it's
 *  solved and never removed, so an earlier pass on a scenario is
 *  never erased by a later failed retry on a *different* scenario. */
export function withChallengeAttempt(
  state: LearningProgressState,
  subjectSlug: string,
  topicSlug: string,
  scenarioId: string,
  solved: boolean,
): LearningProgressState {
  return updateTopic(state, subjectSlug, topicSlug, (progress) => ({
    ...progress,
    challengeAttempts: progress.challengeAttempts + 1,
    challengeSolvedIds:
      solved && !progress.challengeSolvedIds.includes(scenarioId)
        ? [...progress.challengeSolvedIds, scenarioId]
        : progress.challengeSolvedIds,
  }));
}
