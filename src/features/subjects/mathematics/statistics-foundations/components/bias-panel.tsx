"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BIAS_SCENARIOS, type BiasScenario } from "../statistics-model";

function BiasBar({ scenario, active }: { scenario: BiasScenario; active: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-card border p-4 transition-colors",
        active
          ? "border-subject-math bg-subject-math-soft dark:bg-subject-math/10"
          : "border-line dark:border-line-dark",
      )}
    >
      <p className="text-sm font-medium text-ink dark:text-bone">{scenario.label}</p>
      <div className="flex items-center gap-3">
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-ink/10 dark:bg-bone/10">
          <div
            className="h-full rounded-full bg-subject-math transition-all duration-500"
            style={{ width: `${scenario.yesPercent}%` }}
          />
        </div>
        <span className="w-12 shrink-0 text-right font-mono text-sm text-ink dark:text-bone">
          {scenario.yesPercent}%
        </span>
      </div>
      <p className="text-xs text-ink-soft dark:text-bone-soft">
        said &ldquo;yes&rdquo; to &ldquo;{scenario.question}&rdquo;
      </p>
    </div>
  );
}

/**
 * Level 9 — Sampling Bias. Compares "ask only students in the library"
 * against "ask students randomly throughout the school" to show how
 * *who* you sample changes the result, without introducing any real
 * statistics beyond a plain percentage bar.
 */
export function BiasPanel() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-5">
      <p className="max-w-md text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Two ways to ask the same question: <em>&ldquo;Do you like reading?&rdquo;</em>
      </p>

      <div className="grid w-full grid-cols-1 gap-3">
        <BiasBar scenario={BIAS_SCENARIOS[0]!} active={revealed} />
        {revealed ? <BiasBar scenario={BIAS_SCENARIOS[1]!} active /> : null}
      </div>

      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="rounded-full border border-subject-math bg-subject-math-soft px-4 py-1.5 text-sm font-medium text-subject-math transition-colors hover:bg-subject-math/20 dark:bg-subject-math/15"
        >
          Now ask randomly throughout the school
        </button>
      ) : (
        <div className="flex flex-col gap-2 text-center text-sm text-ink-soft dark:text-bone-soft">
          <p>{BIAS_SCENARIOS[0]!.description}</p>
          <p>{BIAS_SCENARIOS[1]!.description}</p>
          <p className="mt-1 font-medium text-ink dark:text-bone">Who you choose can affect your conclusions.</p>
        </div>
      )}
    </div>
  );
}
