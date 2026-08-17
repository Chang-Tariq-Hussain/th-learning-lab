/**
 * Core types for the reusable Quiz Engine. This file is intentionally
 * generic — it knows nothing about Physics, Chemistry, Biology, or
 * Maths specifically, only about "a question with a correct answer".
 * Every subject registers its own quiz data (see `data/`) against
 * these same shapes.
 */

import { ReactNode } from "react";

/** Difficulty is tracked from day one even though no quiz surfaces a
 *  selector for it yet — see the feature README for why. */
export type QuizDifficulty = "easy" | "medium" | "hard";

/**
 * Discriminant for question shape. Only "multiple-choice" exists
 * today; the union is written this way (rather than a single flat
 * interface) so a future type — e.g. "numeric-input" or
 * "fill-in-the-blank" — can be added as one more member without
 * touching existing questions or existing renderers.
 */
export type QuestionType = "multiple-choice";

interface QuizQuestionBase {
  id: string;
  type: QuestionType;
  /** Plain text or LaTeX (rendered via the shared FormulaCard/InlineMath
   *  helpers where a caller opts in — see QuizQuestionCard). */
  question: string;
  explanation: string;
  difficulty: QuizDifficulty;
  /** Subject slug, e.g. "physics" — matches `Subject["slug"]` in the
   *  simulation registry, but this module doesn't import that type to
   *  keep the engine independent of the subjects feature. */
  subject: string;
  topic: string;
}

export interface MultipleChoiceQuestion extends QuizQuestionBase {
  type: "multiple-choice";
  /** At least two options. Rendered in the order given unless the
   *  caller opts into `shuffleOptions` on `<Quiz />`. */
  options: string[];
  /** Must equal one entry of `options` exactly. Storing the answer as
   *  the option's *value* (not its index) is what lets options be
   *  shuffled safely later — nothing needs to remap an index. */
  correctAnswer: string;
}

/** Union point for future question types. Every renderer in this
 *  feature switches on `question.type`, so adding a member here is
 *  the only place that needs to change to support a new type. */
export type QuizQuestion = MultipleChoiceQuestion;

/** One student response, correct or not — kept even for skipped/timed
 *  out questions in future versions via `selectedAnswer: null`. */
export interface QuizAnswerRecord {
  question: QuizQuestion;
  selectedAnswer: string | null;
  isCorrect: boolean;
}

/**
 * Shape of a finished attempt. Nothing persists this today (no
 * accounts/database yet), but every quiz produces this same
 * structure so a later progress-tracking feature can start saving it
 * without changing the engine.
 */
export interface QuizCompletionResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  /** 0–100, rounded to the nearest whole number. */
  percentage: number;
  /** ISO 8601 timestamp. */
  completedAt: string;
  answers: QuizAnswerRecord[];
}

/**
 * Metadata plus questions for one registered quiz. `colorToken`
 * matches the token keys in `subject-colors.ts` so quiz UI can reuse
 * the same subject tinting as the rest of the dashboard.
 */
export interface QuizMeta extends QuizQuestionBase {
  description: ReactNode;
  id: string;
  title: string;
  /** Subject slug, e.g. "physics" — used for registry lookups. Kept
   *  separate from `colorToken` because they don't always match (the
   *  Mathematics subject's slug is "mathematics" but its color token
   *  is "math"). */
  subjectSlug: string;
  subjectLabel: string;
  topicLabel: string;
  colorToken: string;
  /** Where "Back to Topic" should go from the results screen. */
  backHref: string;
  questions: QuizQuestion[];
}
