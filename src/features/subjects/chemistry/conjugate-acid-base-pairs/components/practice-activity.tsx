"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRACTICE_QUESTIONS, type PracticeQuestion } from "../model";

/** Two tiny multiple-choice questions, each with its own independent state — no scoring, no sequencing, just immediate feedback per the spec. */
export function PracticeActivity() {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">Practice</p>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PRACTICE_QUESTIONS.map((question) => (
          <QuestionCard key={question.slug} question={question} />
        ))}
      </div>
    </div>
  );
}

function QuestionCard({ question }: { question: PracticeQuestion }) {
  const [answer, setAnswer] = useState<string | null>(null);
  const isCorrect = answer === question.correctAnswer;

  return (
    <div className="rounded-card border border-line p-3 dark:border-line-dark">
      <p className="font-mono text-sm font-medium text-ink dark:text-bone">{question.prompt}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {question.options.map((option) => {
          const isSelected = answer === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setAnswer(option)}
              aria-pressed={isSelected}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-xs font-medium transition-colors",
                "border-line dark:border-line-dark",
                isSelected
                  ? "border-transparent bg-white dark:bg-white/[0.06]"
                  : "bg-white/40 hover:border-ink/25 dark:bg-white/[0.02] dark:hover:border-bone/25",
              )}
              style={isSelected ? { boxShadow: `0 0 0 2px ${isCorrect ? "#5A9E6F" : "#E0663D"}` } : undefined}
            >
              {option}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {answer ? (
          <motion.div
            key={answer}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 flex items-start gap-1.5 text-xs"
          >
            {isCorrect ? (
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5A9E6F]" strokeWidth={2} />
            ) : (
              <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E0663D]" strokeWidth={2} />
            )}
            <p className="leading-relaxed text-ink-soft dark:text-bone-soft">
              {isCorrect ? question.correctExplanation : "Try again — think about which proton just left."}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
