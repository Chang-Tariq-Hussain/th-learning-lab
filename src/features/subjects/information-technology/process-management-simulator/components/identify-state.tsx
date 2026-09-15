"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { IDENTIFY_STATE_SCENARIOS, LIFECYCLE_STATES, STATE_LABELS, type ProcessLifecycleState } from "../model";

function randomIndex(exclude?: number) {
  let n = Math.floor(Math.random() * IDENTIFY_STATE_SCENARIOS.length);
  if (exclude !== undefined && IDENTIFY_STATE_SCENARIOS.length > 1) {
    while (n === exclude) n = Math.floor(Math.random() * IDENTIFY_STATE_SCENARIOS.length);
  }
  return n;
}

export function IdentifyState() {
  const [index, setIndex] = useState(() => randomIndex());
  const [selected, setSelected] = useState<ProcessLifecycleState | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const scenario = IDENTIFY_STATE_SCENARIOS[index]!;
  const checked = selected !== null;
  const isCorrect = selected === scenario.correctState;

  const choose = (state: ProcessLifecycleState) => {
    if (checked) return;
    setSelected(state);
    setScore((s) => ({ correct: s.correct + (state === scenario.correctState ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setIndex(randomIndex(index));
    setSelected(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Read the situation, then pick which lifecycle state it describes. Score: {score.correct}/{score.total}
      </p>

      <div className="rounded-card bg-ink/[0.03] p-4 dark:bg-bone/[0.05]">
        <p className="text-sm leading-relaxed text-ink dark:text-bone">{scenario.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {LIFECYCLE_STATES.map((s) => {
          const isChoice = selected === s;
          const showCorrect = checked && s === scenario.correctState;
          const showWrong = checked && isChoice && s !== scenario.correctState;
          return (
            <button
              key={s}
              onClick={() => choose(s)}
              disabled={checked}
              className={cn(
                "rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors disabled:cursor-default",
                showCorrect && "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
                showWrong && "border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-400",
                !showCorrect && !showWrong && "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40",
              )}
            >
              {STATE_LABELS[s]}
            </button>
          );
        })}
      </div>

      {checked && (
        <div
          className={cn(
            "rounded-card border p-3 text-sm",
            isCorrect ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300" : "border-rose-500/40 bg-rose-500/10 text-rose-800 dark:text-rose-300",
          )}
        >
          {isCorrect ? "Correct." : `Not quite — the correct answer is ${STATE_LABELS[scenario.correctState]}.`}
        </div>
      )}

      <button
        onClick={next}
        className="inline-flex h-10 w-fit items-center gap-2 rounded-full bg-subject-it px-4 text-sm font-medium text-paper hover:opacity-90"
      >
        Next Scenario
      </button>
    </div>
  );
}
