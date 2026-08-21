/**
 * Pure functions that derive mastery/completion signals from a
 * `TopicProgress` record and/or its `TopicContent`. Nothing here
 * touches storage or React — see `@/lib/learning-progress` for
 * persistence and `@/hooks/use-learning-progress` for the React seam.
 * Kept pure and framework-free so the same logic can run server-side
 * later without change.
 */

import type { LearningStep, MasteryLevel, TopicContent, TopicProgress } from "./types";

/** A fresh, empty progress record for a topic that's never been visited. */
export function createEmptyTopicProgress(subjectSlug: string, topicSlug: string): TopicProgress {
  return {
    subjectSlug,
    topicSlug,
    stepsCompleted: [],
    predictionCorrect: 0,
    predictionTotal: 0,
    bestQuizScore: null,
    challengeAttempts: 0,
    challengeSolvedIds: [],
    updatedAt: new Date(0).toISOString(),
  };
}

/**
 * The actual step sequence for one topic, derived from which optional
 * sections its `TopicContent` defines. `learn`, `explore`, and
 * `mastery` are always present; `predict`, `explain`, `practice`, and
 * `challenge` only appear if the topic supplies that content. This is
 * what `TopicJourney` renders and what `isTopicComplete` checks
 * against — so a topic that (today) only has Learn + Explore shows a
 * two-step journey, not a seven-step one with five permanently-empty
 * steps.
 */
export function computeApplicableSteps(content: TopicContent): LearningStep[] {
  const steps: LearningStep[] = ["learn"];
  if (content.predict && content.predict.scenarios.length > 0) steps.push("predict");
  steps.push("explore");
  if (content.explain && content.explain.questions.length > 0) steps.push("explain");
  if (content.practice) steps.push("practice");
  if (content.challenge && content.challenge.scenarios.length > 0) steps.push("challenge");
  steps.push("mastery");
  return steps;
}

/** True once every applicable step (per `computeApplicableSteps`) has
 *  been marked complete for this student. */
export function isTopicComplete(content: TopicContent, progress: TopicProgress): boolean {
  return computeApplicableSteps(content).every((step) => progress.stepsCompleted.includes(step));
}

/**
 * A coarse, tunable mastery signal for dashboards/badges. Kept as one
 * small function so the "what counts as mastered" rule lives in
 * exactly one place:
 *
 * - not-started: nothing completed yet.
 * - learning: at least one step done, but Practice hasn't been attempted.
 * - practicing: Practice attempted (or completed) but the mastery bar isn't met.
 * - mastered: at least one Challenge scenario was solved AND the best
 *   Practice score is >= 80%.
 *
 * A topic with no Practice/Challenge sections can still reach
 * "learning" but never "mastered" — that's intentional for this
 * phase, since mastery should mean "demonstrated understanding," not
 * "visited the page." Topics without those sections are marked
 * complete instead (`isTopicComplete`), which is a separate signal.
 */
export function computeMasteryLevel(progress: TopicProgress): MasteryLevel {
  if (progress.stepsCompleted.length === 0) return "not-started";

  const practiced = progress.bestQuizScore !== null || progress.stepsCompleted.includes("practice");
  const masteredBar = progress.challengeSolvedIds.length > 0 && (progress.bestQuizScore ?? 0) >= 0.8;

  if (masteredBar) return "mastered";
  if (practiced) return "practicing";
  return "learning";
}

// ---------------------------------------------------------------------------
// Per-section breakdown — powers the Mastery section's "what am I good
// at / what needs more practice" readout.
// ---------------------------------------------------------------------------

export type StepStatus = "strong" | "developing" | "needs-practice" | "not-started";

export interface StepBreakdownEntry {
  step: LearningStep;
  label: string;
  status: StepStatus;
  detail: string;
}

/**
 * One row per applicable step (skipping "mastery" itself, since that's
 * the summary, not a row within it), each with a plain-language
 * status and a one-line reason. Thresholds are the same ones
 * `computeMasteryLevel` uses (>= 0.8 strong, >= 0.5 "developing" for
 * Practice; >= 0.7 / >= 0.4 for Predict, which is lower-stakes and
 * ungraded) so the numbers a student sees here always agree with the
 * mastery badge above them.
 */
export function computeTopicBreakdown(content: TopicContent, progress: TopicProgress): StepBreakdownEntry[] {
  const entries: StepBreakdownEntry[] = [];

  entries.push({
    step: "learn",
    label: "Learn",
    status: progress.stepsCompleted.includes("learn") ? "strong" : "not-started",
    detail: progress.stepsCompleted.includes("learn") ? "Objectives and key concepts reviewed." : "Not reviewed yet.",
  });

  if (content.predict && content.predict.scenarios.length > 0) {
    if (progress.predictionTotal === 0) {
      entries.push({ step: "predict", label: "Predict", status: "not-started", detail: "No predictions made yet." });
    } else {
      const accuracy = progress.predictionCorrect / progress.predictionTotal;
      entries.push({
        step: "predict",
        label: "Predict",
        status: accuracy >= 0.7 ? "strong" : accuracy >= 0.4 ? "developing" : "needs-practice",
        detail: `${progress.predictionCorrect}/${progress.predictionTotal} predictions correct (${Math.round(accuracy * 100)}%).`,
      });
    }
  }

  entries.push({
    step: "explore",
    label: "Explore",
    status: progress.stepsCompleted.includes("explore") ? "strong" : "not-started",
    detail: progress.stepsCompleted.includes("explore") ? "Experiment completed." : "Not run yet.",
  });

  if (content.explain && content.explain.questions.length > 0) {
    entries.push({
      step: "explain",
      label: "Explain",
      status: progress.stepsCompleted.includes("explain") ? "strong" : "not-started",
      detail: progress.stepsCompleted.includes("explain")
        ? 'Reviewed the "why" behind the experiment.'
        : "Not reviewed yet.",
    });
  }

  if (content.practice) {
    if (progress.bestQuizScore === null) {
      entries.push({ step: "practice", label: "Practice", status: "not-started", detail: "Quiz not attempted yet." });
    } else {
      const score = progress.bestQuizScore;
      entries.push({
        step: "practice",
        label: "Practice",
        status: score >= 0.8 ? "strong" : score >= 0.5 ? "developing" : "needs-practice",
        detail: `Best quiz score: ${Math.round(score * 100)}%.`,
      });
    }
  }

  if (content.challenge && content.challenge.scenarios.length > 0) {
    const total = content.challenge.scenarios.length;
    const solved = progress.challengeSolvedIds.length;
    if (progress.challengeAttempts === 0) {
      entries.push({ step: "challenge", label: "Challenge", status: "not-started", detail: "Not attempted yet." });
    } else {
      const allSolved = solved === total;
      entries.push({
        step: "challenge",
        label: "Challenge",
        status: allSolved ? "strong" : solved > 0 ? "developing" : "needs-practice",
        detail: `${solved}/${total} scenarios solved (${Math.round((solved / total) * 100)}%), ${progress.challengeAttempts} attempt${progress.challengeAttempts === 1 ? "" : "s"} total.`,
      });
    }
  }

  return entries;
}
