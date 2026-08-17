import type { QuizQuestion } from "../types";

export interface QuizValidationIssue {
  questionId?: string;
  message: string;
}

/**
 * Checks a question set for the problems that would otherwise crash
 * the quiz mid-render or silently produce a wrong score: an empty
 * list, a missing prompt, too few options, or a `correctAnswer` that
 * doesn't match any option. Returns an empty array when the quiz is
 * safe to render.
 *
 * `<Quiz />` calls this once before rendering the first question and
 * shows `QuizUnavailable` instead of the quiz UI if anything comes
 * back — see `quiz.tsx`.
 */
export function validateQuizQuestions(questions: readonly QuizQuestion[]): QuizValidationIssue[] {
  const issues: QuizValidationIssue[] = [];

  if (questions.length === 0) {
    issues.push({ message: "This quiz doesn't have any questions yet." });
    return issues;
  }

  questions.forEach((question, index) => {
    const position = `Question ${index + 1}`;

    if (!question.question || !question.question.trim()) {
      issues.push({ questionId: question.id, message: `${position} is missing its prompt.` });
    }

    if (!question.options || question.options.length < 2) {
      issues.push({ questionId: question.id, message: `${position} needs at least two options.` });
    } else if (!question.options.includes(question.correctAnswer)) {
      issues.push({
        questionId: question.id,
        message: `${position}'s correct answer doesn't match any of its options.`,
      });
    }
  });

  return issues;
}

/** Clamps a question index into range, so an out-of-range index (a
 *  stale `currentIndex` after a quiz is swapped out from under the
 *  component, for example) can never read past the array. */
export function clampQuestionIndex(index: number, totalQuestions: number): number {
  if (totalQuestions === 0) return 0;
  if (index < 0) return 0;
  if (index > totalQuestions - 1) return totalQuestions - 1;
  return index;
}
