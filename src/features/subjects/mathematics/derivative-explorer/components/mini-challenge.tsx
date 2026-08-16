"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CHALLENGE_QUESTIONS } from "../derivative-model";

/** Same fixed-question, one-at-a-time, immediate-feedback pattern as Calculus Foundations' mini challenge. */
export function MiniChallenge() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const question = CHALLENGE_QUESTIONS[index]!;
  const isLast = index === CHALLENGE_QUESTIONS.length - 1;
  const isCorrect = selected === question.correctIndex;

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === question.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setSelected(null);
    setIndex((i) => Math.min(CHALLENGE_QUESTIONS.length - 1, i + 1));
  };

  const handleRestart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
  };

  const finished = isLast && selected !== null;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
        <span>
          Question {index + 1} of {CHALLENGE_QUESTIONS.length}
        </span>
        <span>Score: {score}</span>
      </div>

      <p className="font-display text-lg font-medium text-ink dark:text-bone">{question.prompt}</p>

      <div className="flex flex-col gap-2">
        {question.options.map((option, i) => {
          const isChosen = selected === i;
          const revealCorrect = selected !== null && i === question.correctIndex;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={cn(
                "flex items-center justify-between rounded-card border px-4 py-2.5 text-left text-sm transition-colors",
                revealCorrect
                  ? "border-pine-500 bg-pine-50 text-pine-700 dark:border-pine-300 dark:bg-pine-900/30 dark:text-pine-300"
                  : isChosen
                    ? "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-900/20 dark:text-amber-300"
                    : "border-line text-ink hover:border-ink/30 dark:border-line-dark dark:text-bone dark:hover:border-bone/30",
                selected !== null && "cursor-default"
              )}
            >
              <span>{option}</span>
              {revealCorrect ? <Check className="h-4 w-4" strokeWidth={2.5} /> : null}
              {isChosen && !revealCorrect ? <X className="h-4 w-4" strokeWidth={2.5} /> : null}
            </button>
          );
        })}
      </div>

      {selected !== null ? (
        <p
          className={cn(
            "rounded-card border px-4 py-3 text-sm leading-relaxed",
            isCorrect
              ? "border-pine-500/40 bg-pine-50 text-pine-700 dark:border-pine-300/30 dark:bg-pine-900/20 dark:text-pine-300"
              : "border-amber-500/40 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-900/15 dark:text-amber-300"
          )}
        >
          {isCorrect ? "Correct! " : "Not quite. "}
          {question.explanation}
        </p>
      ) : null}

      <div className="flex gap-3">
        {finished ? (
          <Button variant="primary" size="md" onClick={handleRestart}>
            Restart Challenge
          </Button>
        ) : (
          <Button variant="primary" size="md" onClick={handleNext} disabled={selected === null}>
            Next Question
          </Button>
        )}
      </div>

      {finished ? (
        <p className="text-center font-mono text-sm text-ink-soft dark:text-bone-soft">
          You scored {score} out of {CHALLENGE_QUESTIONS.length}.
        </p>
      ) : null}
    </div>
  );
}
