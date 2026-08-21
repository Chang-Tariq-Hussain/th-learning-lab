import type { LearningPath } from "./types";
import { physicsFoundationsPath } from "./data/physics-foundations";

/**
 * Every registered learning path. Add a new path by creating a
 * `LearningPath` in `data/` (see `data/physics-foundations.ts` for
 * the pattern) and listing it here — one array, read by getters,
 * same convention as `@/features/learning/registry.ts` and
 * `@/features/quiz-engine/registry.ts`.
 *
 * Deliberately just one entry in this phase — the reusable foundation
 * plus a single worked example for Physics, not a full content
 * migration across every subject.
 */
export const learningPathList: LearningPath[] = [physicsFoundationsPath];

export function getLearningPathById(id: string): LearningPath | undefined {
  return learningPathList.find((path) => path.id === id);
}

/** A subject can have zero, one, or several learning paths — a
 *  subject page can render all of them, or none, with no special
 *  casing needed for subjects that don't have one yet. */
export function getLearningPathsForSubject(subjectSlug: string): LearningPath[] {
  return learningPathList.filter((path) => path.subjectSlug === subjectSlug);
}
