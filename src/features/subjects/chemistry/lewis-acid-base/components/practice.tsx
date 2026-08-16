"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRACTICE_QUESTIONS, type PracticeQuestion } from "../model";

function PracticeCard({ item }: { item: PracticeQuestion }) {
  const [answer, setAnswer] = useState<string | null>(null);
  const isCorrect = answer === item.correctAnswer;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">Quick Check</p>
      <p className="mt-2 font-display text-base font-medium text-ink dark:text-bone">{item.question}</p>
      <p className="mt-1 font-mono text-sm text-ink-soft dark:text-bone-soft">{item.prompt}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {item.options.map((option) => {
          const isSelected = answer === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setAnswer(option)}
              aria-pressed={isSelected}
              className={cn(
                "rounded-full border px-4 py-1.5 font-mono text-sm font-medium transition-colors",
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
            className="mt-3 flex items-start gap-2 text-sm"
          >
            {isCorrect ? (
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#5A9E6F]" strokeWidth={2} />
            ) : (
              <X className="mt-0.5 h-4 w-4 shrink-0 text-[#E0663D]" strokeWidth={2} />
            )}
            <p className="leading-relaxed text-ink-soft dark:text-bone-soft">
              {isCorrect ? (
                <>
                  <strong className="text-ink dark:text-bone">Correct! </strong>
                  {item.correctExplanation}
                </>
              ) : (
                item.incorrectExplanation
              )}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** 2 small "Which is the Lewis acid/base?" activities — deliberately tiny, immediate feedback, no scoring. */
export function Practice() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {PRACTICE_QUESTIONS.map((item) => (
        <PracticeCard key={item.prompt + item.question} item={item} />
      ))}
    </div>
  );
}
