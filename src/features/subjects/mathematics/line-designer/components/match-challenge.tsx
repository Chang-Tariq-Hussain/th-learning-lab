"use client";

import { MATCH_QUESTIONS } from "../model";

interface MatchChallengeProps {
  questionIndex: number;
  solved: boolean;
  onNext: () => void;
}

/**
 * Unlike the other topics' "Calculate" mode (pick from multiple-choice
 * numbers), matching a line needs two continuous values (m and b), so
 * this checks the *live* slider state (passed down as `solved` from
 * the parent, which compares against the target) rather than offering
 * discrete answer buttons.
 */
export function MatchChallenge({ questionIndex, solved, onNext }: MatchChallengeProps) {
  const question = MATCH_QUESTIONS[questionIndex];
  const done = questionIndex >= MATCH_QUESTIONS.length;

  if (done || !question) {
    return (
      <div className="rounded-card border border-line bg-white/60 p-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-display text-base font-medium text-pine-600 dark:text-pine-300">
          ✓ Nice work — you matched all {MATCH_QUESTIONS.length} target lines.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <p className="font-display text-base font-medium text-ink dark:text-bone">Match the target line</p>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
          {questionIndex + 1} / {MATCH_QUESTIONS.length}
        </span>
      </div>
      <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
        Adjust <span className="font-mono">m</span> and <span className="font-mono">b</span> below to create: <strong>{question.prompt}</strong>
      </p>
      <p className="mt-2 text-xs text-ink-soft/80 dark:text-bone-soft/80">The dashed amber line on the grid is your target — match it exactly.</p>

      {solved ? (
        <div className="mt-3">
          <p className="text-sm font-medium text-pine-600 dark:text-pine-300">✓ Matched!</p>
          <button
            type="button"
            onClick={onNext}
            className="mt-1 text-xs font-medium text-ink-soft underline hover:text-ink dark:text-bone-soft dark:hover:text-bone"
          >
            Next target
          </button>
        </div>
      ) : null}
    </div>
  );
}
