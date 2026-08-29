"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Eye, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

/**
 * Same 0.85 / 0.70 accuracy thresholds the persistent mastery system
 * uses for its "mastered" / "developing" cut-offs
 * (`@/features/practice-mode/mastery.ts`), reused here for a
 * single-attempt performance message. Deliberately doesn't reuse the
 * words "Mastered" or "Developing" themselves, though — those are the
 * cross-attempt mastery badge's vocabulary, tracked over many
 * attempts, and reusing the exact label here for a single quiz score
 * would blur the two into looking like the same signal.
 */
function performanceMessage(percentage: number): { headline: string; body: string } {
  if (percentage >= 85) {
    return { headline: "Excellent", body: "Strong understanding of this topic." };
  }
  if (percentage >= 70) {
    return { headline: "Good attempt", body: "Review what you missed below, then try again." };
  }
  return { headline: "Keep practicing", body: "Revisit the explanations below and try again — that's how this sticks." };
}

type ReviewFilter = "incorrect" | "all";

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
  const revealed = answers.filter((answer) => answer.wasRevealed).length;
  const incorrect = Math.max(totalQuestions - score - revealed, 0);
  const percentage = totalQuestions === 0 ? 0 : Math.round((score / totalQuestions) * 100);
  const needsReview = answers.filter((answer) => !answer.isCorrect);
  const message = performanceMessage(percentage);

  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>(needsReview.length > 0 ? "incorrect" : "all");
  const [reviewOpen, setReviewOpen] = useState(false);

  const reviewList = reviewFilter === "incorrect" ? needsReview : answers;

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

        <div className="mx-auto mt-4 max-w-sm">
          <p className="font-display text-base font-medium text-ink dark:text-bone">{message.headline}</p>
          <p className="mt-0.5 text-sm text-ink-soft dark:text-bone-soft">{message.body}</p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Correct: {score}
          </span>
          <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
            <XCircle className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Incorrect: {incorrect}
          </span>
          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <Eye className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Revealed: {revealed}
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

      {answers.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-medium text-ink dark:text-bone">Review Questions</h2>
            {!reviewOpen ? (
              <Button variant="secondary" size="sm" onClick={() => setReviewOpen(true)}>
                {needsReview.length > 0 ? `Review ${needsReview.length} question${needsReview.length === 1 ? "" : "s"}` : "Review all questions"}
              </Button>
            ) : (
              <div className="flex gap-1 rounded-full border border-line bg-white/60 p-1 dark:border-line-dark dark:bg-white/[0.03]">
                {needsReview.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setReviewFilter("incorrect")}
                    aria-pressed={reviewFilter === "incorrect"}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                      reviewFilter === "incorrect"
                        ? "bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
                        : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone",
                    )}
                  >
                    Needs Review ({needsReview.length})
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setReviewFilter("all")}
                  aria-pressed={reviewFilter === "all"}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    reviewFilter === "all"
                      ? "bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
                      : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone",
                  )}
                >
                  All Questions ({answers.length})
                </button>
              </div>
            )}
          </div>

          {reviewOpen && (
            <div className="flex flex-col gap-4">
              {reviewList.map((answer, index) => {
                const status: "correct" | "incorrect" | "revealed" = answer.wasRevealed
                  ? "revealed"
                  : answer.isCorrect
                    ? "correct"
                    : "incorrect";

                return (
                  <div
                    key={`${answer.question.id}-${index}`}
                    className="rounded-2xl border border-line bg-white/60 p-5 dark:border-line-dark dark:bg-white/[0.03]"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <p className="font-medium text-ink dark:text-bone">{answer.question.question}</p>
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                          status === "correct"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
                            : status === "incorrect"
                              ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
                        )}
                      >
                        {status === "correct" ? (
                          <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
                        ) : status === "incorrect" ? (
                          <XCircle className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
                        ) : (
                          <Eye className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
                        )}
                        {status === "correct" ? "Correct" : status === "incorrect" ? "Incorrect" : "Revealed"}
                      </span>
                    </div>
                    <dl className="mt-3 space-y-1.5 text-sm">
                      {status !== "correct" ? (
                        <div className="flex gap-2">
                          <dt className="shrink-0 font-medium text-ink-soft dark:text-bone-soft">Your answer:</dt>
                          <dd className="text-ink-soft dark:text-bone-soft">
                            {answer.selectedAnswer ?? "No answer given"}
                          </dd>
                        </div>
                      ) : null}
                      <div className="flex gap-2">
                        <dt className="shrink-0 font-medium text-emerald-700 dark:text-emerald-400">Correct answer:</dt>
                        <dd className="text-ink-soft dark:text-bone-soft">{answer.question.correctAnswer}</dd>
                      </div>
                    </dl>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
                      {answer.question.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
