/** 1 = Beginner, 2 = Intermediate, 3 = Advanced. Ordered so "increase" / "decrease" is just ±1. */
export type Difficulty = 1 | 2 | 3;

export const MIN_DIFFICULTY: Difficulty = 1;
export const MAX_DIFFICULTY: Difficulty = 3;

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
};

export type QuestionKind =
  | "missing-value"
  | "simplify"
  | "equivalent-mc"
  | "equivalent-dragdrop"
  | "word-problem";

interface QuestionBase {
  /** Unique per generated question — also used as the identity for "don't repeat this exact one twice in a row". */
  id: number;
  kind: QuestionKind;
  difficulty: Difficulty;
  /** The question text shown above the interactive area. */
  prompt: string;
  /** Shown in the feedback banner after answering, correct or not. */
  explanation: string;
}

/** a : b = c : ? — solve the proportion for the missing fourth term. */
export interface MissingValueQuestion extends QuestionBase {
  kind: "missing-value";
  a: number;
  b: number;
  c: number;
  d: number;
  /** Which slot was blanked out — kept general so higher difficulties can blank any position. */
  missing: "a" | "b" | "c" | "d";
  answer: number;
}

/** Reduce a : b to lowest terms — two numeric blanks. */
export interface SimplifyQuestion extends QuestionBase {
  kind: "simplify";
  a: number;
  b: number;
  answerA: number;
  answerB: number;
}

/** Any single-select, four-option question — covers both "equivalent ratios" and word problems. */
export interface ChoiceQuestion extends QuestionBase {
  kind: "equivalent-mc" | "word-problem";
  choices: string[];
  correctIndex: number;
}

/** Drag two number tiles into the blanks to build a ratio equivalent to the target. */
export interface DragDropQuestion extends QuestionBase {
  kind: "equivalent-dragdrop";
  targetA: number;
  targetB: number;
  scale: number;
  tiles: number[];
  answerA: number;
  answerB: number;
}

export type Question =
  | MissingValueQuestion
  | SimplifyQuestion
  | ChoiceQuestion
  | DragDropQuestion;

export interface RoundResult {
  correct: boolean;
  /** How many attempts it took before answering correctly (or giving up) this round — 1 means first try. */
  attempts: number;
}
