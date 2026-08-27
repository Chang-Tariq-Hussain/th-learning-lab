/**
 * Pure functions that turn a `LearningPath` (static, authored data)
 * into a per-student `LearningPathState` (which topics are locked,
 * which one is current, what to recommend next, how far along the
 * path is overall). Nothing here touches storage or React — see
 * `@/hooks/use-learning-path` for the React seam, and
 * `@/lib/learning-progress` for where the underlying `TopicProgress`
 * records actually live. Kept pure and framework-free so it's
 * trivially testable and could run server-side later without change,
 * matching the convention `@/features/learning/mastery.ts` sets.
 */

import { computeMasteryLevel, isTopicComplete } from "@/features/learning/mastery";
import type { MasteryLevel, TopicContent, TopicProgress } from "@/features/learning/types";
import { pathTopicKeyId, type LearningPath, type LearningPathTopicKey, type LearningPathTopicRef } from "./types";

/** A coarse 0-1 score per mastery level, used to turn the path's
 *  overall progress into one percentage. Mirrors the ordering
 *  `computeMasteryLevel` already documents (not-started < learning <
 *  practicing < mastered) rather than introducing a second scale. */
const MASTERY_SCORE: Record<MasteryLevel, number> = {
  "not-started": 0,
  learning: 1 / 3,
  practicing: 2 / 3,
  mastered: 1,
};

export type PathTopicStatus = "locked" | "unlocked" | "current" | "completed";

export interface LearningPathTopicState {
  ref: LearningPathTopicRef;
  progress: TopicProgress;
  status: PathTopicStatus;
  masteryLevel: MasteryLevel;
  /** 0-100, derived from `masteryLevel` via `MASTERY_SCORE`. */
  masteryPercent: number;
  /**
   * Whether the student has meaningfully *begun* this topic — the
   * signal that unlocks whatever comes next (see `PART 8` of the
   * unlocking brief: "the simplest reliable existing progress
   * signal"). Concretely: at least one Learning Step has been
   * recorded (`stepsCompleted.length > 0`), the same signal for every
   * topic regardless of whether it has a full Golden Learning
   * Experience or is a bare simulation page. Deliberately *not* the
   * same thing as `isDone` — see that field's doc comment for why
   * completion and unlocking are kept separate.
   */
  isStarted: boolean;
  /**
   * Whether this topic counts as fully *done* — real completion, not
   * merely started. Used for the "completed" status, the mastery
   * checkmark, and the path's completion metrics. Deliberately NOT
   * used to decide unlocking: a student does not need to finish
   * (let alone master) Topic 1 before Topic 2 becomes available,
   * only to have started it (see `isStarted`). See
   * `isPathTopicDone` for what "done" means when a topic doesn't
   * have a registered `TopicContent` yet.
   */
  isDone: boolean;
  /** Resolved prerequisite topics (explicit, or the default linear
   *  chain — see `LearningPathTopicRef.prerequisites`) that are not
   *  yet done. Non-empty exactly when `status === "locked"`. */
  unmetPrerequisites: LearningPathTopicRef[];
  /** Resolved prerequisites that *are* done, but weakly — attempted
   *  without reaching a solid mastery bar. Surfaced so the UI (and
   *  the path-level recommendation) can suggest reviewing them before
   *  pressing on, per the brief's "if a prerequisite topic is weak,
   *  recommend reviewing it." */
  weakPrerequisites: LearningPathTopicRef[];
}

export type LearningPathRecommendationKind =
  | "start-path"
  | "review-prerequisite"
  | "continue-current"
  | "challenge"
  | "path-complete";

export interface LearningPathRecommendation {
  /** The topic to link the student to. Omitted only for
   *  `kind: "path-complete"` when the path has no challenge topics
   *  left to suggest — there's nothing further to link to. */
  topic?: LearningPathTopicRef;
  kind: LearningPathRecommendationKind;
  /** Plain-language reason, ready to render as-is — e.g. "Before
   *  continuing to Newton's Laws, consider reviewing Acceleration." */
  reason: string;
}

export interface LearningPathState {
  path: LearningPath;
  /** Every topic's derived state, in the same order as `path.topics`. */
  topics: LearningPathTopicState[];
  /** The core (non-challenge) topic the student should be working on
   *  right now — the first unlocked, not-yet-done core topic. `null`
   *  once every core topic is done. */
  currentTopic: LearningPathTopicState | null;
  recommendation: LearningPathRecommendation | null;
  completedCoreCount: number;
  /** Core topics with `isStarted`, i.e. at least begun — the metric
   *  the brief's progress visualization wants ("5/27 topics
   *  started"), independent of the stricter `completedCoreCount`. */
  startedCoreCount: number;
  totalCoreCount: number;
  /** 0-100 average of every core topic's `masteryPercent`. */
  pathMasteryPercent: number;
  isPathComplete: boolean;
}

/** Whether a topic counts as "done" for the purposes of unlocking
 *  whatever comes after it. When a `TopicContent` is registered for
 *  this key, this is exactly `isTopicComplete` (every applicable
 *  Learn/Predict/Explore/.../Mastery step for *that* topic's actual
 *  content). When it isn't (a path can reference a topic before its
 *  full learning experience is authored), this falls back to "some
 *  progress has been recorded at all" so the path degrades gracefully
 *  instead of leaving that topic permanently unlockable. */
function isPathTopicDone(progress: TopicProgress, content: TopicContent | undefined): boolean {
  if (content) return isTopicComplete(content, progress);
  return progress.stepsCompleted.length > 0;
}

/** The unlocking signal (see `LearningPathTopicState.isStarted`):
 *  true once any Learning Step has been recorded, regardless of
 *  whether a full `TopicContent` is registered for this topic. This
 *  is intentionally the *only* thing prerequisite-resolution checks
 *  — completing/mastering the previous topic is never required to
 *  unlock the next one. */
function isPathTopicStarted(progress: TopicProgress): boolean {
  return progress.stepsCompleted.length > 0;
}

/** Whether a *completed* prerequisite was cleared weakly enough to be
 *  worth reviewing before building on it — attempted Practice with a
 *  low score, or never got past light engagement in the first place.
 *  Deliberately excludes "not-started": that's a *locked* prerequisite
 *  (a different situation, with a different message), not a weak one. */
function isPrerequisiteWeak(progress: TopicProgress): boolean {
  const level = computeMasteryLevel(progress);
  if (level === "learning") return true;
  if (level === "practicing") return (progress.bestQuizScore ?? 1) < 0.5;
  return false;
}

/** Resolves one topic's effective prerequisite refs: explicit list if
 *  given, otherwise the immediately preceding *core* topic in the
 *  path's order (a challenge topic is never implicitly depended on,
 *  and never implicitly depends on its neighbor either — it opts in
 *  via an explicit `prerequisites` list instead). */
function resolvePrerequisites(
  ref: LearningPathTopicRef,
  path: LearningPath,
  byId: Map<string, LearningPathTopicRef>,
): LearningPathTopicRef[] {
  if (ref.prerequisites) {
    return ref.prerequisites.map((key) => byId.get(pathTopicKeyId(key))).filter((t): t is LearningPathTopicRef => Boolean(t));
  }
  if (ref.isChallenge) return [];

  const coreTopics = path.topics.filter((t) => !t.isChallenge);
  const index = coreTopics.findIndex((t) => pathTopicKeyId(t) === pathTopicKeyId(ref));
  const previous = index > 0 ? coreTopics[index - 1] : undefined;
  return previous ? [previous] : [];
}

export interface LearningPathLookups {
  /** Reads (or synthesizes an empty) `TopicProgress` for one key —
   *  typically `useLearningProgress().getTopicProgress` or
   *  `getTopicProgress` from `@/lib/learning-progress`. */
  getProgress: (key: LearningPathTopicKey) => TopicProgress;
  /** Reads a topic's registered `TopicContent`, if any — typically
   *  `getTopicContent` from `@/features/learning/registry`. Returning
   *  `undefined` is expected and handled (see `isPathTopicDone`). */
  getContent: (key: LearningPathTopicKey) => TopicContent | undefined;
}

/**
 * Derives the full per-student state of one learning path. Pure: same
 * inputs always produce the same output, so this can be called on
 * every render (typically memoized by `@/hooks/use-learning-path`)
 * without needing its own caching.
 */
export function computeLearningPathState(path: LearningPath, lookups: LearningPathLookups): LearningPathState {
  const byId = new Map(path.topics.map((t) => [pathTopicKeyId(t), t]));

  // Pass 1: per-topic progress/mastery/started/done-ness, independent
  // of prerequisite locking (which needs every topic's started-ness
  // first — see `isStarted`'s doc comment for why *started*, not
  // *done*, is what gates the next topic).
  const partial = path.topics.map((ref) => {
    const progress = lookups.getProgress(ref);
    const content = lookups.getContent(ref);
    const masteryLevel = computeMasteryLevel(progress);
    return {
      ref,
      progress,
      masteryLevel,
      masteryPercent: Math.round(MASTERY_SCORE[masteryLevel] * 100),
      isStarted: isPathTopicStarted(progress),
      isDone: isPathTopicDone(progress, content),
    };
  });
  const startedById = new Map(partial.map((p) => [pathTopicKeyId(p.ref), p.isStarted]));
  const progressById = new Map(partial.map((p) => [pathTopicKeyId(p.ref), p.progress]));

  // Pass 2: resolve locking + weak-prerequisite review flags now that
  // every topic's started-ness is known. A prerequisite is "unmet"
  // (and so blocks unlocking) only while it hasn't been started at
  // all — not until it's finished, and never until it's mastered.
  const topics: LearningPathTopicState[] = partial.map((p) => {
    const prerequisites = resolvePrerequisites(p.ref, path, byId);
    const unmetPrerequisites = prerequisites.filter((prereq) => !startedById.get(pathTopicKeyId(prereq)));
    const weakPrerequisites = prerequisites.filter((prereq) => {
      if (unmetPrerequisites.includes(prereq)) return false;
      const prereqProgress = progressById.get(pathTopicKeyId(prereq));
      return prereqProgress ? isPrerequisiteWeak(prereqProgress) : false;
    });

    const status: PathTopicStatus = p.isDone ? "completed" : unmetPrerequisites.length > 0 ? "locked" : "unlocked";

    return {
      ref: p.ref,
      progress: p.progress,
      masteryLevel: p.masteryLevel,
      masteryPercent: p.masteryPercent,
      isStarted: p.isStarted,
      isDone: p.isDone,
      status,
      unmetPrerequisites,
      weakPrerequisites,
    };
  });

  const coreTopicStates = topics.filter((t) => !t.ref.isChallenge);
  const challengeTopicStates = topics.filter((t) => t.ref.isChallenge);

  // The current topic is the first unlocked-but-not-done core topic,
  // in path order — exactly the next thing to work on.
  const currentTopic = coreTopicStates.find((t) => t.status === "unlocked") ?? null;
  if (currentTopic) currentTopic.status = "current";

  const completedCoreCount = coreTopicStates.filter((t) => t.isDone).length;
  const startedCoreCount = coreTopicStates.filter((t) => t.isStarted).length;
  const totalCoreCount = coreTopicStates.length;
  const isPathComplete = totalCoreCount > 0 && completedCoreCount === totalCoreCount;
  const pathMasteryPercent =
    totalCoreCount === 0 ? 0 : Math.round(coreTopicStates.reduce((sum, t) => sum + t.masteryPercent, 0) / totalCoreCount);

  const recommendation = computeRecommendation(currentTopic, challengeTopicStates, isPathComplete);

  return {
    path,
    topics,
    currentTopic,
    recommendation,
    completedCoreCount,
    startedCoreCount,
    totalCoreCount,
    pathMasteryPercent,
    isPathComplete,
  };
}

function computeRecommendation(
  currentTopic: LearningPathTopicState | null,
  challengeTopicStates: LearningPathTopicState[],
  isPathComplete: boolean,
): LearningPathRecommendation | null {
  if (currentTopic) {
    // A weak prerequisite takes priority over pressing on — recommend
    // the weakest (first-listed) one to review first.
    const weak = currentTopic.weakPrerequisites[0];
    if (weak) {
      return {
        topic: weak,
        kind: "review-prerequisite",
        reason: `Before continuing to ${currentTopic.ref.title}, consider reviewing ${weak.title}.`,
      };
    }

    const justStarting = currentTopic.masteryLevel === "not-started" && currentTopic.unmetPrerequisites.length === 0;
    return {
      topic: currentTopic.ref,
      kind: justStarting ? "start-path" : "continue-current",
      reason: justStarting
        ? `Start with ${currentTopic.ref.title}.`
        : `Continue with ${currentTopic.ref.title} to keep your progress moving.`,
    };
  }

  if (isPathComplete) {
    const availableChallenge = challengeTopicStates.find((t) => t.status !== "locked" && !t.isDone);
    if (availableChallenge) {
      return {
        topic: availableChallenge.ref,
        kind: "challenge",
        reason: `You've completed the core path — ready for a challenge? Try ${availableChallenge.ref.title}.`,
      };
    }
    return {
      kind: "path-complete",
      reason: "You've completed every topic in this path. Nice work.",
    };
  }

  // No current topic and the path isn't complete — every remaining
  // core topic is locked behind something unfinished, which shouldn't
  // happen with a well-formed path, but degrade quietly rather than
  // recommend nothing at all.
  return null;
}
