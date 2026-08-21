/**
 * Builds one practice round from a question pool and the student's
 * recent performance — this is what makes Practice Mode "adaptive"
 * rather than a random draw. Pure and framework-free: given the same
 * pool and attempts, it returns a deterministic *ranking* (a small
 * amount of random jitter is used only to break exact ties, not to
 * decide the round), so this logic is trivially testable and could
 * run server-side unchanged later.
 *
 * Four rules, applied in this order of concern:
 *  1. Prioritize weak concepts — a concept the student is below
 *     `WEAK_ACCURACY_THRESHOLD` on (with enough attempts to be a
 *     signal) gets a score boost proportional to how weak it is.
 *  2. Mix in previously failed questions — a question whose most
 *     recent attempt was wrong gets an extra boost, so missed
 *     questions resurface instead of vanishing into the pool.
 *  3. Avoid exact repeats — a question the student already answered
 *     *correctly* recently gets a penalty, so the same handful of
 *     already-mastered questions don't dominate every round. A
 *     recent miss is never penalized this way — that would cancel
 *     out rule 2 above for exactly the case it exists to handle.
 *  4. Gradually increase difficulty — once the round's question *set*
 *     is chosen by the above, the final presentation order is sorted
 *     easy-to-hard, so a round warms up rather than opening on its
 *     hardest question.
 */

import type { QuizDifficulty, QuizQuestion } from "@/features/quiz-engine/types";
import { UNTAGGED_CONCEPT, type QuestionAttemptRecord } from "./mastery-types";
import { WEAK_ACCURACY_THRESHOLD } from "./mastery";

/** A concept needs at least this many recorded attempts before its
 *  accuracy is trusted enough to drive selection — matches the
 *  threshold `mastery.ts` uses for the same reason. */
const MIN_ATTEMPTS_FOR_CONCEPT_SIGNAL = 3;

/** How many of the most recent attempts (across the whole subject,
 *  not just this round) count as "recently seen" for the repeat
 *  penalty. */
const RECENT_HISTORY_WINDOW = 15;

const PREVIOUSLY_FAILED_BOOST = 0.6;
const RECENTLY_SEEN_PENALTY = 0.4;
const UNKNOWN_CONCEPT_PRIORITY = 0.35;
const TIE_BREAK_JITTER = 0.05;

const DIFFICULTY_RANK: Record<QuizDifficulty, number> = { easy: 0, medium: 1, hard: 2 };

export interface AdaptiveSelectionOptions {
  /** Candidate questions, already filtered to the subject/topic/
   *  difficulty the student asked for — this function only decides
   *  *which* of those to use and in what order, not which pool to
   *  draw from. */
  pool: readonly QuizQuestion[];
  /** The student's attempt history relevant to this pool (typically
   *  pre-filtered to the same subject, and topic unless the round
   *  spans "All Topics"). */
  attempts: readonly QuestionAttemptRecord[];
  requestedCount: number;
}

interface ConceptStat {
  attempts: number;
  correct: number;
}

/** How much of a priority boost a concept should get, based on its
 *  recent accuracy. Unattempted/under-attempted concepts get a
 *  moderate boost too — first exposure to new material is worth
 *  surfacing, just not as urgently as a confirmed weak spot. */
function conceptBoost(concept: string, statsByConcept: Map<string, ConceptStat>): number {
  const stat = statsByConcept.get(concept);
  if (!stat || stat.attempts < MIN_ATTEMPTS_FOR_CONCEPT_SIGNAL) return UNKNOWN_CONCEPT_PRIORITY;

  const accuracy = stat.correct / stat.attempts;
  if (accuracy >= WEAK_ACCURACY_THRESHOLD) return 0;
  return WEAK_ACCURACY_THRESHOLD - accuracy;
}

/**
 * Ranks and selects `requestedCount` questions from `pool`, then
 * orders the selection by increasing difficulty. Returns fewer than
 * `requestedCount` only when the pool itself is smaller — it never
 * repeats a question within a single round.
 */
export function selectAdaptiveQuestions({ pool, attempts, requestedCount }: AdaptiveSelectionOptions): QuizQuestion[] {
  if (pool.length === 0 || requestedCount <= 0) return [];

  const statsByConcept = new Map<string, ConceptStat>();
  const lastResultByQuestionId = new Map<string, boolean>();

  // `attempts` is oldest-first (see `performance-store.ts`), so a
  // later loop iteration always overwrites an earlier one — this
  // naturally leaves each question's *most recent* result in the map.
  for (const attempt of attempts) {
    const stat = statsByConcept.get(attempt.concept) ?? { attempts: 0, correct: 0 };
    stat.attempts += 1;
    if (attempt.isCorrect) stat.correct += 1;
    statsByConcept.set(attempt.concept, stat);

    lastResultByQuestionId.set(attempt.questionId, attempt.isCorrect);
  }

  const recentlySeenIds = new Set(attempts.slice(-RECENT_HISTORY_WINDOW).map((attempt) => attempt.questionId));

  const ranked = pool
    .map((question) => {
      const concept = question.concept ?? UNTAGGED_CONCEPT;
      let score = conceptBoost(concept, statsByConcept);

      if (lastResultByQuestionId.get(question.id) === false) score += PREVIOUSLY_FAILED_BOOST;
      // The repeat penalty exists to stop already-mastered questions
      // from dominating every round — it must not fire for a
      // question the student just got *wrong*, or it would cancel
      // out the boost above and defeat the "mix in failed questions"
      // rule for the most common case (a miss from the last round).
      if (recentlySeenIds.has(question.id) && lastResultByQuestionId.get(question.id) !== false) {
        score -= RECENTLY_SEEN_PENALTY;
      }
      score += Math.random() * TIE_BREAK_JITTER;

      return { question, score };
    })
    .sort((a, b) => b.score - a.score);

  const selected = ranked.slice(0, Math.min(requestedCount, ranked.length));

  // The ranking above decided *which* questions made the cut; this
  // pass only decides presentation order, stable within a difficulty
  // band so the weak-concept prioritization isn't undone.
  return selected
    .map((entry, index) => ({ ...entry, index }))
    .sort((a, b) => {
      const byDifficulty = DIFFICULTY_RANK[a.question.difficulty] - DIFFICULTY_RANK[b.question.difficulty];
      return byDifficulty !== 0 ? byDifficulty : a.index - b.index;
    })
    .map((entry) => entry.question);
}
