import type { QuizQuestion } from "../types";

/**
 * Fisher–Yates shuffle. Always returns a new array — callers never
 * need to worry about mutating whatever they passed in (e.g. a quiz's
 * registered `questions` array, which other code may still hold a
 * reference to).
 */
export function shuffleArray<T>(items: readonly T[]): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i]!;
    result[i] = result[j]!;
    result[j] = temp;
  }
  return result;
}

/** Shuffles a quiz's question order. Pure — does not touch each
 *  question's own options. */
export function shuffleQuestions(questions: readonly QuizQuestion[]): QuizQuestion[] {
  return shuffleArray(questions);
}

/**
 * Shuffles a single question's options.
 *
 * This is safe by construction: `correctAnswer` is stored as the
 * option's *value* (see `types.ts`), not its index, so re-ordering
 * `options` can never desync it from the correct answer — there is no
 * index to remap.
 */
export function shuffleQuestionOptions(question: QuizQuestion): QuizQuestion {
  return { ...question, options: shuffleArray(question.options) };
}
