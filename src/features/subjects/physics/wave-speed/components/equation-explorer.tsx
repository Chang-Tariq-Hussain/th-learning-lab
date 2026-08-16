"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { EQUATION_EXAMPLES, type SolveFor } from "../wave-model";

export function EquationExplorer() {
  const [solveFor, setSolveFor] = useState<SolveFor>("speed");
  const example = EQUATION_EXAMPLES.find((e) => e.solveFor === solveFor)!;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
        Rearranging the Equation
      </p>

      <div role="tablist" aria-label="Solve for" className="mt-3 flex flex-wrap justify-center gap-1.5">
        {EQUATION_EXAMPLES.map((e) => (
          <button
            key={e.solveFor}
            type="button"
            role="tab"
            aria-selected={solveFor === e.solveFor}
            onClick={() => setSolveFor(e.solveFor)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              solveFor === e.solveFor
                ? "border-pine-500 bg-pine-600 text-paper dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard"
                : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
            )}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="font-display text-2xl font-semibold text-ink dark:text-bone">{example.formula}</p>
        <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">Given: {example.given}</p>
        <p className="mt-1 font-mono text-sm font-medium text-amber-600 dark:text-amber-400">{example.result}</p>
      </div>
    </div>
  );
}
