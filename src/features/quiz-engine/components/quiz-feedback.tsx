"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface QuizFeedbackProps {
  isCorrect: boolean;
  explanation: string;
  isLastQuestion: boolean;
  onNext: () => void;
}

/** Correct/incorrect banner with the explanation and a Next Question
 *  (or Finish, on the last question) button. Deliberately does not
 *  auto-advance — the student decides when they're ready to move on. */
export function QuizFeedback({ isCorrect, explanation, isLastQuestion, onNext }: QuizFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      role="status"
      className={cn(
        "rounded-[1.75rem] border p-5 shadow-card sm:p-6",
        isCorrect
          ? "border-emerald-500/30 bg-emerald-50 dark:border-emerald-400/25 dark:bg-emerald-500/10"
          : "border-red-400/30 bg-red-50 dark:border-red-400/25 dark:bg-red-500/10",
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        {isCorrect ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
        ) : (
          <XCircle className="h-5 w-5 shrink-0 text-red-500 dark:text-red-400" strokeWidth={2} />
        )}
        <p className="font-display text-lg font-medium text-ink dark:text-bone">
          {isCorrect ? "Correct!" : "Not quite."}
        </p>
      </div>

      <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{explanation}</p>

      <Button size="sm" className="mt-4" onClick={onNext}>
        {isLastQuestion ? "See Results" : "Next Question"}
      </Button>
    </motion.div>
  );
}
