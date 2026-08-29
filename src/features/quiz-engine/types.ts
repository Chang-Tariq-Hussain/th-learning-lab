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

  /** Optional fine-grained concept this question tests within its
   *  topic (e.g. "Speed", "Formula Rearrangement", "Distance") —
   *  distinct from `topic`, which identifies the whole question bank.
   *  Powers the Practice Engine's per-concept mastery breakdown and
   *  weak-concept detection (see `features/practice-mode/mastery.ts`).
   *  Optional so existing untagged quizzes keep working unchanged;
   *  untagged questions are grouped under "General" wherever mastery
   *  is computed. */
  concept?: string;

  /** Optional label identifying which common misconception this
   *  question specifically targets or corrects (e.g.
   *  "average-of-speeds"). Purely descriptive metadata today — not
   *  yet read anywhere — but kept alongside `concept` so question
   *  data can carry it without a future shape change. */
  misconceptionTag?: string;

  /** Optional progressive hints, revealed one at a time on request
   *  before the student submits an answer — most general first. */
  hints?: string[];
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
  /** True when the student used "Show Answer" on this question before
   *  submitting it. A revealed question is never counted correct
   *  (`isCorrect` is always false in that case), even if the student's
   *  final selection happens to match — it's tracked as its own
   *  outcome ("answered independently" vs "answered after reveal"),
   *  not folded into the incorrect count. Defaults to `false`/absent
   *  for older code paths that don't set it. */
  wasRevealed?: boolean;
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
