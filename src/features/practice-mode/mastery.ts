/**
 * Pure functions that turn a list of `QuestionAttemptRecord`s into
 * mastery signals: per-concept accuracy, an overall topic mastery
 * level, and a plain-language "practice this next" recommendation.
 * Nothing here touches storage or React — see `performance-store.ts`
 * for persistence and `@/hooks/use-practice-performance` for the
 * React seam. Framework-free on purpose, so the same logic could run
 * server-side later without change.
 */

import type { ConceptMastery, QuestionAttemptRecord, TopicMasteryLevel, TopicMasterySummary } from "./mastery-types";

/** A concept needs at least this many attempts before its accuracy is
 *  treated as a reliable signal — one lucky guess or one careless
 *  slip shouldn't be enough to brand (or clear) a concept. Concepts
 *  below this threshold are excluded from `weakestConcept` and the
 *  recommendation, though they still appear in `concepts` for display. */
const MIN_ATTEMPTS_FOR_SIGNAL = 3;

/** Below this accuracy, a concept counts as "weak" for
 *  recommendation purposes. */
export const WEAK_ACCURACY_THRESHOLD = 0.7;

/** Minimum total topic attempts before "mastered" can be claimed —
 *  a single perfect 5-question round shouldn't immediately read as
 *  mastery. */
const MIN_ATTEMPTS_FOR_MASTERED = 10;

function accuracyOf(stat: { attempts: number; correct: number }): number {
  return stat.attempts === 0 ? 0 : stat.correct / stat.attempts;
}

/** Per-concept accuracy for one subject+topic, sorted weakest first.
 *  Concepts with zero attempts never appear (there's nothing to
 *  report yet); concepts below `MIN_ATTEMPTS_FOR_SIGNAL` still appear
 *  here (for display — "Speed: 1 attempt so far") but are excluded by
 *  `computeTopicMasterySummary` when picking a single weakest concept. */
export function computeConceptMastery(
  attempts: readonly QuestionAttemptRecord[],
  subjectSlug: string,
  topicSlug: string,
): ConceptMastery[] {
  const scoped = attempts.filter((attempt) => attempt.subjectSlug === subjectSlug && attempt.topicSlug === topicSlug);

  const byConcept = new Map<string, { attempts: number; correct: number }>();
  for (const attempt of scoped) {
    const stat = byConcept.get(attempt.concept) ?? { attempts: 0, correct: 0 };
    stat.attempts += 1;
    if (attempt.isCorrect) stat.correct += 1;
    byConcept.set(attempt.concept, stat);
  }

  return Array.from(byConcept.entries())
    .map(([concept, stat]) => ({ concept, attempts: stat.attempts, correct: stat.correct, accuracy: accuracyOf(stat) }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

function levelFor(overallAccuracy: number, totalAttempts: number): TopicMasteryLevel {
  if (totalAttempts === 0) return "not-started";
  if (overallAccuracy >= 0.85 && totalAttempts >= MIN_ATTEMPTS_FOR_MASTERED) return "mastered";
  if (overallAccuracy >= WEAK_ACCURACY_THRESHOLD) return "developing";
  return "needs-practice";
}

/**
 * The full mastery picture for one subject+topic: overall accuracy,
 * a coarse level for badges/summaries, the per-concept breakdown, and
 * — the point of the exercise — which single concept to recommend
 * practicing next, in the same "Practice X next" phrasing style the
 * product spec asks for.
 */
export function computeTopicMasterySummary(
  attempts: readonly QuestionAttemptRecord[],
  subjectSlug: string,
  topicSlug: string,
): TopicMasterySummary {
  const concepts = computeConceptMastery(attempts, subjectSlug, topicSlug);
  const totalAttempts = concepts.reduce((sum, entry) => sum + entry.attempts, 0);
  const totalCorrect = concepts.reduce((sum, entry) => sum + entry.correct, 0);
  const overallAccuracy = totalAttempts === 0 ? 0 : totalCorrect / totalAttempts;

  const reliableConcepts = concepts.filter((entry) => entry.attempts >= MIN_ATTEMPTS_FOR_SIGNAL);
  const weakestConcept =
    reliableConcepts.length > 0 && reliableConcepts[0]!.accuracy < WEAK_ACCURACY_THRESHOLD ? reliableConcepts[0]! : null;

  return {
    subjectSlug,
    topicSlug,
    level: levelFor(overallAccuracy, totalAttempts),
    totalAttempts,
    overallAccuracy,
    concepts,
    weakestConcept,
    recommendation: weakestConcept ? `Practice ${weakestConcept.concept} next.` : null,
  };
}
