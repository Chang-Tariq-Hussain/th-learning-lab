"use client";

import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { CHALLENGE_PROMPT, type ChallengeStep } from "../wave-model";

interface MiniChallengeProps {
  step: ChallengeStep;
  feedback: { correct: boolean; message: string } | null;
  onRestart: () => void;
}

export function MiniChallenge({ step, feedback, onRestart }: MiniChallengeProps) {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <p className="font-display text-base font-medium text-ink dark:text-bone">Mini Challenge</p>
        {step === "done" ? (
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1 text-xs font-medium text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
            Try again
          </button>
        ) : null}
      </div>

      {step === "done" ? (
        <p className="mt-2 text-sm font-medium text-pine-600 dark:text-pine-300">
          ✓ Nice work — you found both the crest and the trough.
        </p>
      ) : (
        <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">{CHALLENGE_PROMPT[step]}</p>
      )}

      {feedback ? (
        <p
          className={cn(
            "mt-3 text-sm font-medium",
            feedback.correct ? "text-pine-600 dark:text-pine-300" : "text-red-600 dark:text-red-400"
          )}
        >
          {feedback.correct ? "✓ Correct! " : ""}
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
}
