"use client";

import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { CHALLENGE_QUESTIONS } from "../nervous-model";

interface MiniChallengeProps {
  step: number;
  feedback: boolean | null;
  onAnswer: (correct: boolean) => void;
  onRestart: () => void;
}

export function MiniChallenge({
  step,
  feedback,
  onAnswer,
  onRestart,
}: MiniChallengeProps) {
  const done = step >= CHALLENGE_QUESTIONS.length;
  const question = done ? null : CHALLENGE_QUESTIONS[step];

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <p className="font-display text-base font-medium text-ink dark:text-bone">
          Mini Challenge
        </p>
        {done ? (
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1 text-xs font-medium text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
            Try again
          </button>
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
            {step + 1} / {CHALLENGE_QUESTIONS.length}
          </span>
        )}
      </div>

      {done ? (
        <p className="mt-2 text-sm font-medium text-pine-600 dark:text-pine-300">
          ✓ Nice work — you&apos;ve got the nervous system down.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">
            {question!.prompt}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {question!.options.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => onAnswer(option.correct)}
                className="rounded-full border border-ink/15 px-3.5 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}

      {feedback !== null ? (
        <p
          className={cn(
            "mt-3 text-sm font-medium",
            feedback
              ? "text-pine-600 dark:text-pine-300"
              : "text-red-600 dark:text-red-400",
          )}
        >
          {feedback ? "✓ Correct!" : "Not quite — try the next one."}
        </p>
      ) : null}
    </div>
  );
}
