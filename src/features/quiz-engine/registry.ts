import type { QuizMeta } from "./types";
import { physicsMotionQuiz } from "./data/physics-motion-quiz";

/**
 * Every registered quiz. Add a new quiz by creating a `QuizMeta` in
 * `data/` (see `physics-motion-quiz.ts` for the pattern) and listing
 * it here — nothing else needs to change. This mirrors
 * `features/subjects/data/subjects.ts`: a single array, read by
 * getter functions, instead of scattered lookups.
 */
export const quizzes: QuizMeta[] = [physicsMotionQuiz];

export function getQuizById(id: string): QuizMeta | undefined {
  return quizzes.find((quiz) => quiz.id === id);
}

export function getQuizzesBySubject(subjectSlug: string): QuizMeta[] {
  return quizzes.filter((quiz) => quiz.subjectSlug === subjectSlug);
}
