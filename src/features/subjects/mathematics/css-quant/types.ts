export type ModuleId = "ratio" | "geometry" | "trigonometry" | "mixed";
export type Difficulty = 1 | 2 | 3;

export const DIFFICULTY_LABEL: Record<Difficulty, string> = { 1: "Standard", 2: "Competitive", 3: "Hard" };

/** Small diagrams drawn alongside a question (pure data, rendered by `figure.tsx`). */
export type Figure =
  | { kind: "right-triangle"; base?: string; height?: string; hyp?: string; angle?: string }
  | { kind: "triangle"; a: string; b: string; c: string }
  | { kind: "circle"; radius?: string; angle?: string; label?: string }
  | { kind: "rectangle"; w: string; h: string; diagonal?: string }
  | { kind: "elevation"; height: string; distance: string; angle: string }
  | { kind: "similar"; small: string; large: string };

export interface TopicDef {
  id: string;
  module: Exclude<ModuleId, "mixed">;
  label: string;
}

/** A fully built multiple-choice question. `options` are already shuffled; `correct` indexes into them. */
export interface Question {
  id: number;
  module: Exclude<ModuleId, "mixed">;
  topic: string;
  topicLabel: string;
  difficulty: Difficulty;
  prompt: string;
  figure?: Figure;
  options: string[];
  correct: number;
  /** Worked method, one line per step. */
  steps: string[];
  /** The fast route to use under exam time pressure. */
  trick: string;
  /** What the tempting wrong option comes from. */
  trap?: string;
}

/** What a generator returns before options are built and shuffled. */
export interface RawQuestion {
  prompt: string;
  figure?: Figure;
  /** The correct answer as display text. */
  answer: string;
  /** Plausible wrong answers, most tempting first. Duplicates of the answer are dropped. */
  wrong: string[];
  steps: string[];
  trick: string;
  trap?: string;
}

export type Rng = () => number;

export interface Generator {
  topic: TopicDef;
  make: (rng: Rng, difficulty: Difficulty) => RawQuestion;
}
