"use client";

import { useMemo, useState } from "react";
import type { QuizAnswerRecord, QuizCompletionResult, QuizQuestion } from "../types";
import { clampQuestionIndex } from "../utils/validate-quiz";
import { shuffleQuestionOptions, shuffleQuestions } from "../utils/shuffle";

export type QuizPhase = "active" | "complete";

export interface UseQuizOptions {
  quizId: string;
  questions: QuizQuestion[];
  onComplete?: (result: QuizCompletionResult) => void;
  /**
   * Whether to randomize question order for this attempt. Defaults to
   * `true` — the right default for a standalone topic quiz or the
   * Golden Learning Experience Practice section, where `questions` is
   * just a topic's full bank in whatever order it was authored in.
   *
   * Practice Mode passes `false`: its `questions` prop already comes
   * out of `selectPracticeQuestions`/`selectAdaptiveQuestions` in a
   * deliberate order (weak concepts first, previously-missed
   * questions mixed in, avoiding whatever was just seen) — reshuffling
   * that order here would silently undo the adaptive selection.
   *
   * Either way, each question's own *options* are always shuffled
   * (see `shuffleOptions` below) — that part is never optional, since
   * there's no case where showing options in their stored order is
   * correct.
   */
  shuffleQuestionOrder?: boolean;
}

/**
 * Owns all quiz-taking state. This is a plain `useState`-based hook,
 * not a Zustand store — the project doesn't use Zustand anywhere
 * (state lives in React state or, for a couple of simulations,
 * Context), and nothing about quiz-taking needs to be read outside
 * the `<Quiz />` tree, so a store would only add indirection.
 *
 * A future "resume where I left off" or cross-tab progress feature
 * would be a good reason to promote this to shared state — see the
 * feature README.
 *
 * ## Option shuffling
 *
 * Every question's `options` are shuffled once per attempt via
 * `preparedQuestions` below, using the *value-based* `correctAnswer`
 * (see `types.ts`) — there's no index to desync, so this is safe by
 * construction. This is the fix for correct answers disproportionately
 * landing on option A: question data across this project's ~20 quiz
 * banks is generally authored with the correct answer listed first
 * (simplest to write, easiest to review), and until now nothing
 * actually reordered `options` before rendering them for a standalone
 * topic quiz or a Golden Learning Experience Practice section — only
 * Practice Mode's own question-selection pipeline
 * (`selectPracticeQuestions`) happened to call `shuffleQuestionOptions`
 * already. Shuffling here, in the one hook every quiz surface in the
 * app is built on, fixes it everywhere at once and makes it
 * impossible for a future quiz to skip.
 *
 * The shuffle is memoized on `[questions, attempt]`, so:
 * - it's stable across re-renders while a question is being answered
 *   (selecting an option doesn't reshuffle it out from under the
 *   student — see the feature's README/architecture notes),
 * - it changes questions when the question navigates or `questions`
 *   itself changes (Practice Mode swaps in a whole new array each
 *   round), and
 * - it changes again on `retry()`, via the `attempt` counter, so a
 *   replayed standalone quiz doesn't show the exact same option
 *   layout twice in a row.
 */
export function useQuiz({ quizId, questions, onComplete, shuffleQuestionOrder = true }: UseQuizOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswerRecord[]>([]);
  const [phase, setPhase] = useState<QuizPhase>("active");
  const [attempt, setAttempt] = useState(0);

  const preparedQuestions = useMemo(() => {
    const ordered = shuffleQuestionOrder ? shuffleQuestions(questions) : questions;
    return ordered.map(shuffleQuestionOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `attempt` is intentionally included only to force a fresh shuffle on retry; it isn't read in the body.
  }, [questions, shuffleQuestionOrder, attempt]);

  const safeIndex = clampQuestionIndex(currentIndex, preparedQuestions.length);
  const currentQuestion: QuizQuestion | undefined = preparedQuestions[safeIndex];

  const score = useMemo(() => answers.filter((answer) => answer.isCorrect).length, [answers]);

  function selectAnswer(value: string) {
    if (isSubmitted) return;
    setSelectedAnswer(value);
  }

  /**
   * Explicitly requested by the student ("Show Answer"), never
   * triggered automatically. Reveals the correct option and the
   * explanation immediately, the same as submitting normally, but the
   * resulting `QuizAnswerRecord` is flagged `wasRevealed: true` and is
   * never counted correct — see `submitAnswer` below and
   * `QuizAnswerRecord.wasRevealed` in `types.ts`.
   */
  function revealAnswer() {
    if (isSubmitted || !currentQuestion) return;
    setIsRevealed(true);
    setAnswers((prev) => [
      ...prev,
      { question: currentQuestion, selectedAnswer, isCorrect: false, wasRevealed: true },
    ]);
    setIsSubmitted(true);
  }

  function submitAnswer() {
    if (isSubmitted || !currentQuestion || selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setAnswers((prev) => [...prev, { question: currentQuestion, selectedAnswer, isCorrect, wasRevealed: false }]);
    setIsSubmitted(true);
  }

  function goToNextQuestion() {
    if (!isSubmitted) return;

    const nextIndex = currentIndex + 1;
    if (nextIndex >= preparedQuestions.length) {
      finishQuiz();
      return;
    }

    setCurrentIndex(nextIndex);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setIsRevealed(false);
  }

  function finishQuiz() {
    setPhase("complete");

    const finalAnswers = answers;
    const totalQuestions = preparedQuestions.length;
    const finalScore = finalAnswers.filter((answer) => answer.isCorrect).length;

    onComplete?.({
      quizId,
      score: finalScore,
      totalQuestions,
      percentage: totalQuestions === 0 ? 0 : Math.round((finalScore / totalQuestions) * 100),
      completedAt: new Date().toISOString(),
      answers: finalAnswers,
    });
  }

  function retry() {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setIsRevealed(false);
    setAnswers([]);
    setPhase("active");
    // Forces `preparedQuestions` to reshuffle (both question order, if
    // enabled, and every question's options) rather than replaying the
    // exact same layout as the previous attempt.
    setAttempt((value) => value + 1);
  }

  return {
    phase,
    currentIndex: safeIndex,
    currentQuestion,
    totalQuestions: preparedQuestions.length,
    selectedAnswer,
    isSubmitted,
    isRevealed,
    answers,
    score,
    isLastQuestion: currentIndex >= preparedQuestions.length - 1,
    selectAnswer,
    submitAnswer,
    revealAnswer,
    goToNextQuestion,
    retry,
  };
}
