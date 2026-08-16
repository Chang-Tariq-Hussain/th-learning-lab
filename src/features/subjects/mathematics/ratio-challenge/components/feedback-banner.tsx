"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FeedbackBannerProps {
  correct: boolean;
  explanation: string;
  onNext: () => void;
}

export function FeedbackBanner({ correct, explanation, onNext }: FeedbackBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      role="status"
      className={cn(
        "rounded-[1.75rem] border p-5 shadow-card sm:p-6",
        correct
          ? "border-subject-chemistry/30 bg-subject-chemistry-soft dark:border-subject-chemistry/25 dark:bg-subject-chemistry/10"
          : "border-subject-physics/25 bg-subject-physics-soft dark:border-subject-physics/25 dark:bg-subject-physics/10",
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        {correct ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-subject-chemistry" strokeWidth={2} />
        ) : (
          <XCircle className="h-5 w-5 shrink-0 text-subject-physics" strokeWidth={2} />
        )}
        <p className="font-display text-lg font-medium text-ink dark:text-bone">
          {correct ? "Correct!" : "Not quite"}
        </p>
      </div>

      <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{explanation}</p>

      <Button size="sm" className="mt-4" onClick={onNext}>
        Next question
      </Button>
    </motion.div>
  );
}
