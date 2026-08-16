"use client";

import { cn } from "@/lib/utils";
import { CALCULATE_QUESTIONS, formatPoint, type MidPoint } from "../model";

interface CalculateChallengeProps {
  questionIndex: number;
  answered: MidPoint | null;
  onAnswer: (value: MidPoint) => void;
  onNext: () => void;
}

const samePoint = (p: MidPoint | null, q: MidPoint) => !!p && p.x === q.x && p.y === q.y;

export function CalculateChallenge({ questionIndex, answered, onAnswer, onNext }: CalculateChallengeProps) {
  const question = CALCULATE_QUESTIONS[questionIndex];
  const done = questionIndex >= CALCULATE_QUESTIONS.length;

  if (done || !question) {
    return (
      <div className="rounded-card border border-line bg-white/60 p-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-display text-base font-medium text-pine-600 dark:text-pine-300">
          ✓ Nice work — you completed all {CALCULATE_QUESTIONS.length} questions.
        </p>
      </div>
    );
  }

  const correct = samePoint(answered, question.correct);

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <p className="font-display text-base font-medium text-ink dark:text-bone">What is the midpoint?</p>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
          {questionIndex + 1} / {CALCULATE_QUESTIONS.length}
        </span>
      </div>
      <p className="mt-1 font-mono text-sm text-ink-soft dark:text-bone-soft">
        A = ({question.a.x}, {question.a.y}) &nbsp;·&nbsp; B = ({question.b.x}, {question.b.y})
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {question.options.map((option) => {
          const isSelected = samePoint(answered, option);
          return (
            <button
              key={formatPoint(option)}
              type="button"
              onClick={() => onAnswer(option)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                isSelected
                  ? correct
                    ? "border-pine-500 bg-pine-600 text-paper dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard"
                    : "border-red-400 text-red-600 dark:text-red-400"
                  : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
              )}
            >
              {formatPoint(option)}
            </button>
          );
        })}
      </div>

      {answered !== null ? (
        correct ? (
          <div className="mt-3">
            <p className="text-sm font-medium text-pine-600 dark:text-pine-300">✓ Correct!</p>
            <button
              type="button"
              onClick={onNext}
              className="mt-1 text-xs font-medium text-ink-soft underline hover:text-ink dark:text-bone-soft dark:hover:text-bone"
            >
              Next question
            </button>
          </div>
        ) : (
          <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">Not quite — try another option.</p>
        )
      ) : null}
    </div>
  );
}
