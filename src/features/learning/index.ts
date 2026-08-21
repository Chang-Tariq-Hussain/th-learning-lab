/**
 * Public API for the Learning Experience architecture. Other code
 * should import from here (or from `@/hooks/use-learning-progress`
 * for the progress hook) rather than reaching into
 * `features/learning/*` internals directly.
 */

export type {
  LearningStep,
  MasteryLevel,
  TopicContent,
  LearnSectionContent,
  PredictSectionContent,
  PredictionOption,
  PredictionScenario,
  ExploreSectionContent,
  ExplainSectionContent,
  ExplainQuestion,
  PracticeSectionContent,
  ChallengeSectionContent,
  ChallengeScenario,
  ChallengeConstraint,
  ChallengeTool,
  ChallengeOption,
  ChallengeAnswer,
  RelatedTopicLink,
  TopicProgress,
  LearningProgressState,
} from "./types";

export { LEARNING_STEPS, STEP_LABELS, progressKey } from "./types";

export {
  computeMasteryLevel,
  computeApplicableSteps,
  computeTopicBreakdown,
  isTopicComplete,
  createEmptyTopicProgress,
} from "./mastery";
export type { StepStatus, StepBreakdownEntry } from "./mastery";

export { getTopicContent, topicContentList } from "./registry";

export { TopicLearningExperience } from "./components/topic-learning-experience";
export { TopicJourney } from "./components/topic-journey";
export { MasteryBadge } from "./components/mastery-badge";
export { MasterySection } from "./components/mastery-section";
export { LearnSection } from "./components/learn-section";
export { PredictSection } from "./components/predict-section";
export { Prediction } from "./components/prediction";
export type { PredictionResult } from "./components/prediction";
export { ExploreSection } from "./components/explore-section";
export { ExplainSection } from "./components/explain-section";
export { ChallengeSection } from "./components/challenge-section";
export { Challenge } from "./components/challenge";
export type { ChallengeAttemptResult } from "./components/challenge";
