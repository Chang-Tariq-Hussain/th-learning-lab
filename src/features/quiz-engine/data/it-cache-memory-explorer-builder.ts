import type { QuizQuestion } from "../types";

interface CacheQuestionSpec {
  id: string;
  difficulty: "easy" | "medium" | "hard";
  concept: string;
  question: string;
  correct: string;
  /** Exactly three plausible wrong answers. */
  wrong: [string, string, string];
  /** Where the correct answer sits among the four options (0–3). */
  slot: 0 | 1 | 2 | 3;
  explanation: string;
  hints?: string[];
  misconceptionTag?: string;
}

/**
 * Shared by the Cache Memory Explorer's two banks. Placing the correct
 * answer by an explicit `slot` keeps stored answer positions balanced
 * by construction (checked by the bank verification), instead of
 * relying on the run-time shuffle alone.
 */
export function cacheQuestion(spec: CacheQuestionSpec): QuizQuestion {
  const options = [...spec.wrong];
  options.splice(spec.slot, 0, spec.correct);
  return {
    id: spec.id,
    type: "multiple-choice",
    question: spec.question,
    options,
    correctAnswer: spec.correct,
    explanation: spec.explanation,
    difficulty: spec.difficulty,
    subject: "information-technology",
    topic: "cache-memory-explorer",
    concept: spec.concept,
    ...(spec.misconceptionTag ? { misconceptionTag: spec.misconceptionTag } : {}),
    ...(spec.hints ? { hints: spec.hints } : {}),
  };
}
