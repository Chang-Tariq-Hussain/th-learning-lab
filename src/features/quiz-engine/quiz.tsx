"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuiz } from "./hooks/use-quiz";
import { validateQuizQuestions } from "./utils/validate-quiz";
import { QuizProgress } from "./components/quiz-progress";
import { QuizQuestionCard } from "./components/quiz-question-card";
import { QuizFeedback } from "./components/quiz-feedback";
import { QuizResults } from "./components/quiz-results";
import type { QuizResultsSecondaryAction } from "./components/quiz-results";
import { QuizUnavailable } from "./components/quiz-unavailable";
import type { QuizCompletionResult, QuizQuestion } from "./types";

export interface QuizProps {
  quizId: string;
  questions: QuizQuestion[];
  subjectLabel: string;
  topicLabel: string;
  colorToken: string;
  /** Where "Back to Topic" on the results screen (and the unavailable
   *  fallback) should go. */
  backHref: string;
  backLabel?: string;
  /** Called once with the finished attempt's score/answers. Nothing
   *  persists it today — this is the hook a future progress-tracking
   *  feature will use. */
  onComplete?: (result: QuizCompletionResult) => void;
  /** Results-screen heading override — see `QuizResults`. Defaults to "Quiz Complete". */
  resultsTitle?: string;
  /** Results-screen retry button label override — see `QuizResults`. Defaults to "Try Again". */
  retryLabel?: string;
  /** When provided, called instead of the engine's built-in retry (which just replays the same `questions` array from question one). Practice Mode passes a callback that picks a brand new randomized set instead. */
  onRetryOverride?: () => void;
  /** Optional third results-screen action — see `QuizResults`. */
  secondaryAction?: QuizResultsSecondaryAction;
  /** Whether to randomize question order for this attempt — see
   *  `useQuiz`'s docblock. Defaults to `true`; Practice Mode passes
   *  `false` since it hands in an already deliberately-ordered set. */
  shuffleQuestionOrder?: boolean;
}

/**
 * The reusable Quiz component — receives question data as props and
 * renders the full take-a-quiz flow: question → check answer →
 * feedback → next question → results. Contains no subject-specific
 * content itself, so any subject can drop it in with its own
 * `QuizMeta` (see `data/physics-motion-quiz.ts` for the pattern).
 */
export function Quiz({
  quizId,
  questions,
  subjectLabel,
  topicLabel,
  colorToken,
  backHref,
  backLabel = "Back to Topic",
  onComplete,
  resultsTitle,
  retryLabel,
  onRetryOverride,
  secondaryAction,
  shuffleQuestionOrder = true,
}: QuizProps) {
  const issues = useMemo(() => validateQuizQuestions(questions), [questions]);

  const {
    phase,
    currentIndex,
    currentQuestion,
    totalQuestions,
    selectedAnswer,
    isSubmitted,
    isRevealed,
    answers,
    isLastQuestion,
    selectAnswer,
    submitAnswer,
    revealAnswer,
    goToNextQuestion,
    retry,
  } = useQuiz({ quizId, questions, onComplete, shuffleQuestionOrder });

  if (issues.length > 0 || !currentQuestion) {
    return <QuizUnavailable backHref={backHref} backLabel={backLabel} />;
  }

  if (phase === "complete") {
    return (
      <QuizResults
        answers={answers}
        totalQuestions={totalQuestions}
        backHref={backHref}
        backLabel={backLabel}
        onRetry={onRetryOverride ?? retry}
        resultsTitle={resultsTitle}
        retryLabel={retryLabel}
        secondaryAction={secondaryAction}
      />
    );
  }

  const lastAnswer = answers[answers.length - 1];
  const showFeedbackForCurrent = isSubmitted && lastAnswer?.question.id === currentQuestion.id;

  return (
    <div className="flex w-full flex-col gap-6">
      <QuizProgress currentIndex={currentIndex} totalQuestions={totalQuestions} colorToken={colorToken} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <QuizQuestionCard
            question={currentQuestion}
            subjectLabel={subjectLabel}
            topicLabel={topicLabel}
            colorToken={colorToken}
            selectedAnswer={selectedAnswer}
            isSubmitted={isSubmitted}
            isRevealed={isRevealed}
            onSelectAnswer={selectAnswer}
            onCheckAnswer={submitAnswer}
            onShowAnswer={revealAnswer}
          />
        </motion.div>
      </AnimatePresence>

      {showFeedbackForCurrent && lastAnswer && (
        <QuizFeedback
          outcome={lastAnswer.wasRevealed ? "revealed" : lastAnswer.isCorrect ? "correct" : "incorrect"}
          explanation={lastAnswer.question.explanation}
          isLastQuestion={isLastQuestion}
          onNext={goToNextQuestion}
        />
      )}
    </div>
  );
}
