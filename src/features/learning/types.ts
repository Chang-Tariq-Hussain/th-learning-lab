/**
 * Core types for the Learning Experience architecture.
 *
 * This module is intentionally domain-agnostic, mirroring the same
 * convention as `@/features/simulation` and `@/features/quiz-engine`:
 * nothing here mentions Physics, Chemistry, Biology, or Mathematics.
 * A concrete topic supplies its own `TopicContent` (see
 * `data/physics-simple-motion.ts` for the first, demonstration
 * example) and everything else — sequencing, progress tracking,
 * rendering — is shared.
 *
 * The intended learning sequence for a topic is:
 *
 *   LEARN -> PREDICT -> EXPLORE -> EXPLAIN -> PRACTICE -> CHALLENGE -> MASTERY
 *
 * Every step after LEARN and EXPLORE is optional on `TopicContent` —
 * a topic can adopt the architecture incrementally (e.g. Learn +
 * Explore only, today), and `computeApplicableSteps` in `mastery.ts`
 * derives the *actual* sequence for that topic from whichever
 * sections it defines.
 */

import type { ReactNode } from "react";
import type { LearnMoreConcept } from "@/components/dashboard/simulation-learn-more";
import type { SubjectSlug } from "@/features/subjects/types";

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

export type LearningStep =
  | "learn"
  | "predict"
  | "explore"
  | "explain"
  | "practice"
  | "challenge"
  | "mastery";

/** Canonical order of every step the architecture knows about. A single
 *  topic's actual sequence is a subset of this — see `computeApplicableSteps`. */
export const LEARNING_STEPS: LearningStep[] = [
  "learn",
  "predict",
  "explore",
  "explain",
  "practice",
  "challenge",
  "mastery",
];

export const STEP_LABELS: Record<LearningStep, string> = {
  learn: "Learn",
  predict: "Predict",
  explore: "Explore",
  explain: "Explain",
  practice: "Practice",
  challenge: "Challenge",
  mastery: "Mastery",
};

// ---------------------------------------------------------------------------
// Section content models (authored, static, per topic)
// ---------------------------------------------------------------------------

/** LEARN — reuses `LearnMoreConcept` from the existing `SimulationLearnMore`
 *  component so authored content isn't duplicated in shape. */
export interface LearnSectionContent {
  /** 2-4 short bullets: what the student should be able to do afterwards. */
  objectives: string[];
  concepts: LearnMoreConcept[];
  /** One short paragraph connecting the concept to the real world. */
  whyItMatters: string;
  /** Crisp, glossary-style definitions — shorter and more literal than
   *  `concepts`, which favor a fuller explanation (and may carry a
   *  formula). Optional so existing/simpler topics don't need one. */
  keyTerms?: { term: string; definition: string }[];
  /** Small diagrams or annotated visuals supporting the lesson. The
   *  section component only knows how to lay these out (caption below
   *  visual, in a row of cards) — the actual visual is authored per
   *  topic as plain SVG/JSX, so this stays generic rather than
   *  growing a bespoke diagram-authoring format. */
  visualAids?: { id: string; caption: string; visual: ReactNode }[];
  /** Common wrong mental models students bring to this topic, each
   *  paired with the correction — rendered as a distinct callout so
   *  it doesn't blend into the regular concept explanations. */
  misconceptions?: { id: string; misconception: string; correction: string }[];
}

/**
 * PREDICT — a "commit to a guess, then run the experiment to check
 * it" interaction, always shown before the actual simulation result
 * is visible. This is the generic, subject-agnostic data model every
 * topic's Predict section is built from — see
 * `features/learning/components/prediction.tsx` for the component
 * that renders one of these through the full seven-step flow
 * (present scenario, ask for a prediction, record it, allow the
 * experiment, reveal/compare the result, explain why, record
 * performance).
 */
export interface PredictionOption {
  id: string;
  label: string;
}

export interface PredictionScenario {
  id: string;
  /** The narrative setup — what's about to happen, before the
   *  question is asked. */
  scenario: string;
  /** The specific thing the student must predict about that setup. */
  question: string;
  /** The choices the student can predict between. */
  options: PredictionOption[];
  /** Which option matches what actually happens when the experiment
   *  described by `scenario` is run. */
  actualResultOptionId: string;
  /** Shown after the result is revealed, regardless of whether the
   *  prediction was correct. */
  explanation: string;
  /** A single optional nudge, revealed on request before the student
   *  commits to a prediction — deliberately just one hint (not a
   *  progressive list like Challenge uses) since a prediction is
   *  meant to be answered from reasoning already covered in Learn,
   *  not walked through step by step. */
  hint?: string;
}

export interface PredictSectionContent {
  intro?: string;
  scenarios: PredictionScenario[];
}

/** EXPLORE — the guided experiment. The interactive simulation itself
 *  is supplied by the caller (`TopicLearningExperience`'s `simulation`
 *  prop) rather than modeled here; this only covers the guidance
 *  around it. */
export interface ExploreSectionContent {
  /** Short ordered steps for using the simulation. */
  howToUse: string[];
  /** Optional short challenges or observation prompts. */
  tryThis?: string[];
}

/** EXPLAIN — the "why does this happen?" question/answer pairs that sit
 *  between hands-on exploration and formal practice. */
export interface ExplainQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface ExplainSectionContent {
  questions: ExplainQuestion[];
}

/** PRACTICE — deliberately holds no question data of its own. It's a
 *  foreign key into the existing `quiz-engine` registry, so practice
 *  questions are never authored twice. */
export interface PracticeSectionContent {
  /** A `QuizMeta.id` from `@/features/quiz-engine/registry`. */
  quizId: string;
}

/**
 * CHALLENGE — a harder, realistic problem than ordinary Practice: the
 * student applies what the topic taught, often by interacting with
 * the simulation, rather than recognizing a fact. One `Challenge`
 * component (`components/challenge.tsx`) renders any
 * `ChallengeScenario` end to end regardless of subject — what varies
 * per topic is only the data below. The four kinds of challenge the
 * product spec calls out all fit the same shape:
 *
 *  - Physics: "Design a configuration that achieves a target range."
 *    → `answer.mode: "numeric"`, `tools` list the sliders available.
 *  - Chemistry: "Determine which conditions produce the desired
 *    reaction behavior." → `answer.mode: "choice"`.
 *  - Biology: "Identify what happens when a cellular process is
 *    disrupted." → `answer.mode: "choice"`.
 *  - Mathematics: "Find the function parameters that satisfy the
 *    required conditions." → `answer.mode: "numeric"`.
 */
export interface ChallengeConstraint {
  id: string;
  /** A rule or limit the student's solution has to respect, e.g.
   *  "Speed must stay within the simulation's 1–10 m/s range." */
  label: string;
}

export interface ChallengeTool {
  id: string;
  /** A variable or control the student has available to solve the
   *  problem, e.g. "Distance slider (10–100 m)". Purely descriptive —
   *  this doesn't wire up the control itself, it just tells the
   *  student what's available on the embedded simulation. */
  label: string;
}

export interface ChallengeOption {
  id: string;
  label: string;
}

/**
 * How a scenario's answer is checked. `choice` is a locked-in
 * multiple-choice pick (for "which of these is true" problems);
 * `numeric` accepts any value within `target ± tolerance` (for
 * "find a configuration that achieves X" design problems).
 */
export type ChallengeAnswer =
  | { mode: "choice"; options: ChallengeOption[]; correctOptionId: string }
  | { mode: "numeric"; unit?: string; target: number; tolerance: number };

export interface ChallengeScenario {
  id: string;
  title: string;
  /** The narrative setup — the realistic situation the student is
   *  dropped into. */
  scenario: string;
  /** The specific goal the student has to achieve or determine. */
  objective: string;
  /** Rules or limits the solution has to respect. Optional — not
   *  every challenge needs constraints beyond the objective itself. */
  constraints?: ChallengeConstraint[];
  /** What the student has available to work with — sliders, controls,
   *  known values. Optional for challenges that are answered from
   *  reasoning alone. */
  tools?: ChallengeTool[];
  /** Progressive hints, revealed one at a time on request. */
  hints?: string[];
  answer: ChallengeAnswer;
  /** The worked solution, shown once solved (or once attempts run
   *  out, if `maxAttempts` is set). */
  explanation: string;
  /** Optional cap on attempts; once reached without solving, the
   *  explanation is revealed automatically instead of leaving the
   *  student stuck. Omit for unlimited attempts. */
  maxAttempts?: number;
  /** Whether this scenario embeds the topic's live simulation for the
   *  student to experiment with while solving — "where appropriate,
   *  interact with the simulation." Defaults to `true`. */
  requiresExperiment?: boolean;
}

export interface ChallengeSectionContent {
  intro?: string;
  scenarios: ChallengeScenario[];
}

/** Optional lateral link to another topic — the seed of "cross-subject
 *  connections" and "recommended next topics"; not rendered by any
 *  component yet in this phase, just modeled so content can start
 *  carrying it. */
export interface RelatedTopicLink {
  subjectSlug: SubjectSlug;
  topicSlug: string;
  label: string;
  href: string;
  reason: string;
}

/**
 * REAL-WORLD MISSION — folded into CHALLENGE. A `ChallengeScenario`
 * with `answer.mode: "numeric"` and a narrative `scenario`/`objective`
 * *is* a mission: "use the simulation to find a configuration that
 * hits a target" was previously modeled as a separate section with
 * its own type and component; it's now just one flavor of Challenge,
 * so a topic doesn't need to duplicate the same "realistic scenario +
 * hints + retries" machinery under two different names.
 */

/**
 * The full authored learning experience for one topic. One object per
 * topic, registered in `registry.ts`. `learn` and `explore` are
 * required (every topic at minimum teaches something and has a
 * simulation to explore); every other section is optional so the
 * architecture can be adopted one topic, and one section, at a time.
 */
export interface TopicContent {
  subjectSlug: SubjectSlug;
  /** Stable id for this topic's learning experience — used as the
   *  progress-tracking key. By convention this is the simulation's
   *  `Visualization.slug` from `features/subjects/data/subjects.ts`. */
  topicSlug: string;
  title: string;
  subjectLabel: string;
  topicLabel: string;
  /** Same subject color tokens used across the app: "physics" |
   *  "chemistry" | "biology" | "math". */
  colorToken: string;
  /** Route to the simulation page this content belongs to. */
  simulationHref: string;

  learn: LearnSectionContent;
  predict?: PredictSectionContent;
  explore: ExploreSectionContent;
  explain?: ExplainSectionContent;
  practice?: PracticeSectionContent;
  challenge?: ChallengeSectionContent;
  relatedTopics?: RelatedTopicLink[];
}

// ---------------------------------------------------------------------------
// Progress model (per-student, persisted locally — see
// `@/lib/learning-progress` and `@/hooks/use-learning-progress`)
// ---------------------------------------------------------------------------

export type MasteryLevel = "not-started" | "learning" | "practicing" | "mastered";

/** One topic's progress record. Plain, serializable data — safe to
 *  JSON.stringify into localStorage today and send to a server later
 *  without any shape change. */
export interface TopicProgress {
  subjectSlug: string;
  topicSlug: string;
  /** Which steps this student has completed for this topic. */
  stepsCompleted: LearningStep[];
  predictionCorrect: number;
  predictionTotal: number;
  /** Best Practice (quiz) score achieved, 0-1. `null` until attempted. */
  bestQuizScore: number | null;
  challengeAttempts: number;
  /** Ids of `ChallengeScenario`s solved so far — sticky across
   *  sessions, so a topic revisited later still shows earlier
   *  challenges as solved instead of resetting. The section's overall
   *  "solved" state and score are derived from this against the
   *  content's scenario list (see `mastery.ts`), not stored
   *  separately, since only the content knows the total count. */
  challengeSolvedIds: string[];
  updatedAt: string;
}

/** Everything persisted client-side. One localStorage key holds one of
 *  these — see `LEARNING_PROGRESS_STORAGE_KEY` in
 *  `@/lib/learning-progress`. `version` exists purely so a future
 *  shape change can migrate old data instead of discarding it. */
export interface LearningProgressState {
  version: 1;
  /** Keyed by `progressKey(subjectSlug, topicSlug)`. */
  topics: Record<string, TopicProgress>;
}

export function progressKey(subjectSlug: string, topicSlug: string): string {
  return `${subjectSlug}:${topicSlug}`;
}
