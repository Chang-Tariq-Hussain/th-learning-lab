"use client";

import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuizAnswerRecord } from "../types";

export interface QuizResultsSecondaryAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface QuizResultsProps {
  answers: QuizAnswerRecord[];
  totalQuestions: number;
  backHref: string;
  backLabel: string;
  onRetry: () => void;
  /** Heading above the score, e.g. "Practice Complete!". Defaults to "Quiz Complete" -- every existing topic quiz keeps its current copy. */
  resultsTitle?: string;
  /** Label on the primary retry button. Defaults to "Try Again". Practice Mode overrides this to "Practice Again" since its `onRetry` generates a brand new randomized set instead of replaying the same one. */
  retryLabel?: string;
  /** An optional third action rendered between "retry" and "back" -- e.g. Practice Mode's "Change Topic", which returns to the configuration screen instead of navigating or retrying. */
  secondaryAction?: QuizResultsSecondaryAction;
}

export function QuizResults({
  answers,
  totalQuestions,
  backHref,
  backLabel,
  onRetry,
  resultsTitle = "Quiz Complete",
  retryLabel = "Try Again",
  secondaryAction,
}: QuizResultsProps) {
  const score = answers.filter((answer) => answer.isCorrect).length;
  const incorrect = totalQuestions - score;
  const percentage = totalQuestions === 0 ? 0 : Math.round((score / totalQuestions) * 100);
  const missedAnswers = answers.filter((answer) => !answer.isCorrect);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      <div className="rounded-[1.75rem] border border-line bg-white/70 p-6 text-center shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
          {resultsTitle}
        </p>
        <p className="mt-3 font-display text-4xl font-semibold tabular-nums text-ink dark:text-bone sm:text-5xl">
          {score} / {totalQuestions}
        </p>
        <p className="mt-1 font-mono text-lg tabular-nums text-ink-soft dark:text-bone-soft">{percentage}%</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Correct: {score}
          </span>
          <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
            <XCircle className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Incorrect: {incorrect}
          </span>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="secondary" size="md" onClick={onRetry}>
            <RotateCcw className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            {retryLabel}
          </Button>
          {secondaryAction ? (
            <Button variant="secondary" size="md" href={secondaryAction.href} onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          ) : null}
          <Button variant="ghost" size="md" href={backHref}>
            {backLabel}
          </Button>
        </div>
      </div>

      {missedAnswers.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 font-display text-lg font-medium text-ink dark:text-bone">Review missed questions</h2>
          <div className="flex flex-col gap-4">
            {missedAnswers.map((answer) => (
              <div
                key={answer.question.id}
                className="rounded-2xl border border-line bg-white/60 p-5 dark:border-line-dark dark:bg-white/[0.03]"
              >
                <p className="font-medium text-ink dark:text-bone">{answer.question.question}</p>
                <dl className="mt-3 space-y-1.5 text-sm">
                  <div className="flex gap-2">
                    <dt className="shrink-0 font-medium text-red-600 dark:text-red-400">Your answer:</dt>
                    <dd className="text-ink-soft dark:text-bone-soft">{answer.selectedAnswer ?? "No answer given"}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="shrink-0 font-medium text-emerald-700 dark:text-emerald-400">Correct answer:</dt>
                    <dd className="text-ink-soft dark:text-bone-soft">{answer.question.correctAnswer}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
                  {answer.question.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
