import type { LearningPath, LearningPathTopicRef } from "./types";
import { physicsFoundationsPath } from "./data/physics-foundations";
import { mathematicsFoundationsPath } from "./data/mathematics-foundations";

/**
 * Every registered learning path. Add a new path by creating a
 * `LearningPath` in `data/` (see `data/physics-foundations.ts` for
 * the pattern) and listing it here — one array, read by getters,
 * same convention as `@/features/learning/registry.ts` and
 * `@/features/quiz-engine/registry.ts`.
 */
export const learningPathList: LearningPath[] = [physicsFoundationsPath, mathematicsFoundationsPath];

export function getLearningPathById(id: string): LearningPath | undefined {
  return learningPathList.find((path) => path.id === id);
}

/** A subject can have zero, one, or several learning paths — a
 *  subject page can render all of them, or none, with no special
 *  casing needed for subjects that don't have one yet. */
export function getLearningPathsForSubject(subjectSlug: string): LearningPath[] {
  return learningPathList.filter((path) => path.subjectSlug === subjectSlug);
}

/**
 * Finds whichever registered path (and topic ref within it) has a
 * topic whose `href` exactly matches the given pathname. This is the
 * lookup the "Next Topic" navigation (`@/features/learning-path/
 * components/next-topic-nav.tsx`) is built on: matching by route
 * rather than by `(subjectSlug, topicSlug)` sidesteps the handful of
 * topics whose route slug differs from their progress-tracking
 * content slug (see `data/mathematics-foundations.ts`'s file
 * comment) — a page never needs to know its own content slug to find
 * its place in a path.
 */
export function findPathTopicByHref(
  href: string,
): { path: LearningPath; ref: LearningPathTopicRef; index: number } | undefined {
  for (const path of learningPathList) {
    const index = path.topics.findIndex((t) => t.href === href);
    const ref = index !== -1 ? path.topics[index] : undefined;
    if (ref) return { path, ref, index };
  }
  return undefined;
}
