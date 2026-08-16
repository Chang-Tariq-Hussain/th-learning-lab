"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PredictionQuestion } from "../model";

interface PredictionPromptProps {
  question: PredictionQuestion;
}

/** "Predict before running" — a small multiple-choice moment ahead of each factor's slider. */
export function PredictionPrompt({ question }: PredictionPromptProps) {
  const [answerIndex, setAnswerIndex] = useState<number | null>(null);
  const isCorrect = answerIndex === question.correctIndex;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-subject-chemistry" strokeWidth={1.75} />
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">Predict first</p>
      </div>
      <p className="mt-2 font-display text-base font-medium text-ink dark:text-bone">{question.prompt}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {question.options.map((option, i) => {
          const isSelected = answerIndex === i;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setAnswerIndex(i)}
              aria-pressed={isSelected}
              className={cn(
                "rounded-full border px-4 py-1.5 font-mono text-sm font-medium transition-colors",
                "border-line dark:border-line-dark",
                isSelected
                  ? "border-transparent bg-white dark:bg-white/[0.06]"
                  : "bg-white/40 hover:border-ink/25 dark:bg-white/[0.02] dark:hover:border-bone/25"
              )}
              style={isSelected ? { boxShadow: `0 0 0 2px ${i === question.correctIndex ? "#5A9E6F" : "#E0663D"}` } : undefined}
            >
              {option}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {answerIndex !== null ? (
          <motion.div
            key={answerIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 flex items-start gap-2 text-sm"
          >
            {isCorrect ? (
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#5A9E6F]" strokeWidth={2} />
            ) : (
              <X className="mt-0.5 h-4 w-4 shrink-0 text-[#E0663D]" strokeWidth={2} />
            )}
            <p className="leading-relaxed text-ink-soft dark:text-bone-soft">
              {isCorrect ? <strong className="text-ink dark:text-bone">Correct! </strong> : null}
              {question.explanation}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
