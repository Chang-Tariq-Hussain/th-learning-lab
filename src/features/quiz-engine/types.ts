/** Difficulty levels supported by the quiz engine. */
export type QuizDifficulty = "easy" | "medium" | "hard";

/** Supported question types. */
export type QuestionType = "multiple-choice";

/**
 * Base fields shared by every question.
 */
interface QuizQuestionBase {
  id: string;
  type: QuestionType;

  /** Plain text or LaTeX. */
  question: string;

  /** Explanation shown after answering. */
  explanation: string;

  /** Difficulty of this individual question. */
  difficulty: QuizDifficulty;

  /** Subject slug, e.g. "physics", "biology", "mathematics". */
  subject: string;

  /** Topic slug, e.g. "cell-structure". */
  topic: string;
}

/**
 * Multiple-choice question.
 */
export interface MultipleChoiceQuestion extends QuizQuestionBase {
  type: "multiple-choice";

  /** At least two answer options. */
  options: string[];

  /** Must exactly match one of the options. */
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

  percentage: number;

  completedAt: string;

  answers: QuizAnswerRecord[];
}

/**
 * Metadata and configuration for an entire quiz.
 */
export interface QuizMeta {
  id: string;
  title: string;
  description: string;
  subjectSlug: string;
  subjectLabel: string;
  topicLabel: string;
  colorToken: string;
  /** Where "Back to Topic" should go from the results screen. */
  backHref: string;
  difficulty: QuizDifficulty;
  estimatedTime: number;
  questions: QuizQuestion[];
}
