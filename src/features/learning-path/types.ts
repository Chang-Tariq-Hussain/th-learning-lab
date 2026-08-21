/**
 * Generic Learning Path data structures.
 *
 * A learning path turns a set of individual topics into an ordered
 * progression — "Motion -> Forces -> Newton's Laws -> Energy" instead
 * of a flat grid of unrelated activities. Nothing in this module
 * mentions Physics, Chemistry, Biology, or Mathematics: a concrete
 * path is just data (see `data/physics-foundations.ts` for the first,
 * demonstration example), and every subject gets the same engine,
 * hook, and UI component for free by registering one.
 *
 * A path topic is identified the same way progress is tracked
 * everywhere else in the app — `(subjectSlug, topicSlug)` — so a path
 * can reference `@/features/learning`'s `TopicContent` registry and
 * `@/lib/learning-progress`'s progress store without introducing a
 * third id scheme. `topicSlug` is conventionally a visualization's
 * `slug` from `@/features/subjects/data/subjects.ts`, exactly as it
 * is for `TopicContent.topicSlug`.
 */

import type { SubjectSlug } from "@/features/subjects/types";

/** Identifies one topic, wherever it's referenced — as a path node,
 *  as a prerequisite, or as a lookup key against progress/content. */
export interface LearningPathTopicKey {
  subjectSlug: SubjectSlug;
  topicSlug: string;
}

/** Stable string key for using a `LearningPathTopicKey` as a Map/Set
 *  key or React list key — mirrors `progressKey` in
 *  `@/features/learning/types`. */
export function pathTopicKeyId(key: LearningPathTopicKey): string {
  return `${key.subjectSlug}:${key.topicSlug}`;
}

/**
 * One node in a learning path — the "reusable" unit the brief asks
 * for. Deliberately carries its own display metadata (`title`,
 * `description`, `href`) rather than requiring a fully-authored
 * `TopicContent` to exist: a path can be laid out before every topic
 * on it has a rich Learn/Predict/Explore/... experience built for it.
 * Where a `TopicContent` *is* registered for this key, the engine uses
 * it for a more precise completion signal (see `engine.ts`).
 */
export interface LearningPathTopicRef extends LearningPathTopicKey {
  /** Display name for this step, e.g. "Newton's Laws". */
  title: string;
  /** One short sentence describing what this step covers. */
  description: string;
  /** Route to the topic/simulation page this step links to. */
  href: string;
  /**
   * Other topics that must be completed before this one unlocks.
   * Omit entirely to fall back to the path's default linear chain —
   * "depends on the topic immediately before it in `topics`" — which
   * covers the common straight-line case ("Motion -> Velocity ->
   * Acceleration -> ...") without repeating the obvious dependency on
   * every node. Pass an explicit empty array to mark a topic (usually
   * the first) as having no prerequisites at all. Pass one or more
   * keys to model a topic that depends on more than one earlier step,
   * or that doesn't simply follow its neighbor (see the challenge
   * topic in `data/physics-foundations.ts` for an example of both).
   */
  prerequisites?: LearningPathTopicKey[];
  /**
   * Optional enrichment/extension topic. A challenge topic never
   * blocks a later *core* topic from unlocking, and isn't counted
   * toward the path's core completion percentage or "path complete"
   * state — it's bonus material once the core sequence is finished,
   * matching the brief's "optional challenge topics."
   */
  isChallenge?: boolean;
}

/** A full ordered progression through a set of topics for one subject. */
export interface LearningPath {
  /** Stable id for this path, e.g. "physics-foundations". */
  id: string;
  subjectSlug: SubjectSlug;
  title: string;
  description: string;
  /** Same subject color tokens used across the app: "physics" |
   *  "chemistry" | "biology" | "math". */
  colorToken: string;
  /** Ordered — this array's order *is* the path's sequence, and is
   *  also what the default-prerequisite fallback chains against. */
  topics: LearningPathTopicRef[];
}
