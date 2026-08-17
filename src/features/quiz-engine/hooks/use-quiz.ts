"use client";

import { useMemo, useState } from "react";
import type { QuizAnswerRecord, QuizCompletionResult, QuizQuestion } from "../types";
import { clampQuestionIndex } from "../utils/validate-quiz";

export type QuizPhase = "active" | "complete";

export interface UseQuizOptions {
  quizId: string;
  questions: QuizQuestion[];
  onComplete?: (result: QuizCompletionResult) => void;
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
 */
export function useQuiz({ quizId, questions, onComplete }: UseQuizOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswerRecord[]>([]);
  const [phase, setPhase] = useState<QuizPhase>("active");

  const safeIndex = clampQuestionIndex(currentIndex, questions.length);
  const currentQuestion: QuizQuestion | undefined = questions[safeIndex];

  const score = useMemo(() => answers.filter((answer) => answer.isCorrect).length, [answers]);

  function selectAnswer(value: string) {
    if (isSubmitted) return;
    setSelectedAnswer(value);
  }

  function submitAnswer() {
    if (isSubmitted || !currentQuestion || selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setAnswers((prev) => [...prev, { question: currentQuestion, selectedAnswer, isCorrect }]);
    setIsSubmitted(true);
  }

  function goToNextQuestion() {
    if (!isSubmitted) return;

    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      finishQuiz();
      return;
    }

    setCurrentIndex(nextIndex);
    setSelectedAnswer(null);
    setIsSubmitted(false);
  }

  function finishQuiz() {
    setPhase("complete");

    const finalAnswers = answers;
    const totalQuestions = questions.length;
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
    setAnswers([]);
    setPhase("active");
  }

  return {
    phase,
    currentIndex: safeIndex,
    currentQuestion,
    totalQuestions: questions.length,
    selectedAnswer,
    isSubmitted,
    answers,
    score,
    isLastQuestion: currentIndex >= questions.length - 1,
    selectAnswer,
    submitAnswer,
    goToNextQuestion,
    retry,
  };
}
