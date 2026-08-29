"use client";

import { CheckCircle2, Eye, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type QuizFeedbackOutcome = "correct" | "incorrect" | "revealed";

export interface QuizFeedbackProps {
  outcome: QuizFeedbackOutcome;
  explanation: string;
  isLastQuestion: boolean;
  onNext: () => void;
}

const OUTCOME_STYLES: Record<QuizFeedbackOutcome, string> = {
  correct: "border-emerald-500/30 bg-emerald-50 dark:border-emerald-400/25 dark:bg-emerald-500/10",
  incorrect: "border-red-400/30 bg-red-50 dark:border-red-400/25 dark:bg-red-500/10",
  revealed: "border-amber-400/30 bg-amber-50 dark:border-amber-400/25 dark:bg-amber-500/10",
};

const OUTCOME_ICON: Record<QuizFeedbackOutcome, typeof CheckCircle2> = {
  correct: CheckCircle2,
  incorrect: XCircle,
  revealed: Eye,
};

const OUTCOME_ICON_COLOR: Record<QuizFeedbackOutcome, string> = {
  correct: "text-emerald-600 dark:text-emerald-400",
  incorrect: "text-red-500 dark:text-red-400",
  revealed: "text-amber-600 dark:text-amber-400",
};

const OUTCOME_LABEL: Record<QuizFeedbackOutcome, string> = {
  correct: "Correct!",
  incorrect: "Not quite.",
  revealed: "Answer revealed",
};

/** Correct/incorrect/revealed banner with the explanation and a Next
 *  Question (or Finish, on the last question) button. Deliberately
 *  does not auto-advance — the student decides when they're ready to
 *  move on. The "revealed" outcome fires when the student used "Show
 *  Answer" instead of submitting their own choice — see
 *  `QuizAnswerRecord.wasRevealed`. */
export function QuizFeedback({ outcome, explanation, isLastQuestion, onNext }: QuizFeedbackProps) {
  const Icon = OUTCOME_ICON[outcome];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      role="status"
      className={cn("rounded-[1.75rem] border p-5 shadow-card sm:p-6", OUTCOME_STYLES[outcome])}
    >
      <div className="mb-2 flex items-center gap-2">
        <Icon className={cn("h-5 w-5 shrink-0", OUTCOME_ICON_COLOR[outcome])} strokeWidth={2} aria-hidden="true" />
        <p className="font-display text-lg font-medium text-ink dark:text-bone">{OUTCOME_LABEL[outcome]}</p>
      </div>

      {outcome === "revealed" ? (
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
          Not counted as a correct answer — reviewing is how you learn it for next time.
        </p>
      ) : null}

      <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{explanation}</p>

      <Button size="sm" className="mt-4" onClick={onNext}>
        {isLastQuestion ? "See Results" : "Next Question"}
      </Button>
    </motion.div>
  );
}
