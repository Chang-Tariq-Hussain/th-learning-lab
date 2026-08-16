"use client";

import { cn } from "@/lib/utils";
import { QUADRANT_QUESTION, type Quadrant } from "../coordinate-model";

interface QuadrantChallengeProps {
  answered: Quadrant | null;
  onAnswer: (quadrant: Quadrant) => void;
  onRestart: () => void;
}

const OPTIONS: Quadrant[] = ["I", "II", "III", "IV"];

export function QuadrantChallenge({ answered, onAnswer, onRestart }: QuadrantChallengeProps) {
  const correct = answered === QUADRANT_QUESTION.correct;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-display text-base font-medium text-ink dark:text-bone">
        Which quadrant contains ({QUADRANT_QUESTION.point.x}, {QUADRANT_QUESTION.point.y})?
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onAnswer(option)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              answered === option
                ? correct
                  ? "border-pine-500 bg-pine-600 text-paper dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard"
                  : "border-red-400 text-red-600 dark:text-red-400"
                : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {answered ? (
        correct ? (
          <p className="mt-3 text-sm font-medium text-pine-600 dark:text-pine-300">
            ✓ Correct! {QUADRANT_QUESTION.explanation}
          </p>
        ) : (
          <div className="mt-3">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">Not quite.</p>
            <button
              type="button"
              onClick={onRestart}
              className="mt-1 text-xs font-medium text-ink-soft underline hover:text-ink dark:text-bone-soft dark:hover:text-bone"
            >
              Try again
            </button>
          </div>
        )
      ) : null}
    </div>
  );
}
