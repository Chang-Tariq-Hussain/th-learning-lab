import type { QuizDifficulty } from "@/features/quiz-engine/types";

/** Label used for any question that doesn't carry an explicit
 *  `concept` tag, so mastery calculations always have somewhere to
 *  group untagged questions instead of silently dropping them. */
export const UNTAGGED_CONCEPT = "General";

/**
 * One finished question attempt, kept locally. This is the unit the
 * Practice Engine persists and later aggregates into concept mastery
 * — deliberately flat and serializable (no React state, no class
 * instances) so the exact same shape could be POSTed to a backend
 * later without changing anything that produces or reads it.
 */
export interface QuestionAttemptRecord {
  questionId: string;
  subjectSlug: string;
  /** The question's own `topic` slug (e.g. "simple-motion") — this is
   *  what Practice Mode's "All Topics" option spans, and what a
   *  topic's mastery is scoped to. */
  topicSlug: string;
  /** Falls back to `UNTAGGED_CONCEPT` for questions without an
   *  explicit `concept` tag. */
  concept: string;
  difficulty: QuizDifficulty;
  isCorrect: boolean;
  attemptedAt: string;
}

/** Everything persisted client-side for the Practice Engine. One
 *  localStorage key holds one of these — see
 *  `PRACTICE_PERFORMANCE_STORAGE_KEY` in `performance-store.ts`.
 *  `version` exists so a future shape change can migrate old data
 *  instead of discarding it, the same convention `learning-progress.ts`
 *  uses. */
export interface PracticePerformanceState {
  version: 1;
  /** Every recorded attempt, oldest first. Capped per topic (see
   *  `MAX_ATTEMPTS_PER_TOPIC` in `performance-store.ts`) so history
   *  doesn't grow without bound over a long usage history. */
  attempts: QuestionAttemptRecord[];
}

export interface ConceptMastery {
  concept: string;
  attempts: number;
  correct: number;
  /** 0-1. */
  accuracy: number;
}

export type TopicMasteryLevel = "not-started" | "needs-practice" | "developing" | "mastered";

export interface TopicMasterySummary {
  subjectSlug: string;
  topicSlug: string;
  level: TopicMasteryLevel;
  totalAttempts: number;
  /** 0-1 across every attempt in this topic, regardless of concept. */
  overallAccuracy: number;
  /** One entry per concept seen in this topic, sorted weakest first
   *  (lowest accuracy; concepts with too few attempts to be a
   *  reliable signal are excluded — see `mastery.ts`). */
  concepts: ConceptMastery[];
  /** The single weakest concept with enough attempts to be a
   *  reliable signal, or `null` if there isn't one yet. */
  weakestConcept: ConceptMastery | null;
  /** A short, ready-to-display sentence, e.g. "Practice Acceleration
   *  next." — `null` when there's nothing to recommend yet (no
   *  attempts, or every concept is already solid). */
  recommendation: string | null;
}
