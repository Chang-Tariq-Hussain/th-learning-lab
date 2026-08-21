/**
 * Public API for the Learning Path architecture. Other code should
 * import from here rather than reaching into `features/learning-path/*`
 * internals directly — mirrors `@/features/learning`'s `index.ts`.
 */

export type { LearningPath, LearningPathTopicRef, LearningPathTopicKey } from "./types";
export { pathTopicKeyId } from "./types";

export type {
  LearningPathState,
  LearningPathTopicState,
  LearningPathRecommendation,
  LearningPathRecommendationKind,
  LearningPathLookups,
  PathTopicStatus,
} from "./engine";
export { computeLearningPathState } from "./engine";

export { learningPathList, getLearningPathById, getLearningPathsForSubject } from "./registry";

export { LearningPathTrack } from "./components/learning-path-track";
