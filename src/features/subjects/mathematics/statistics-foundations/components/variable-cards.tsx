"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VARIABLE_EXAMPLES } from "../statistics-model";

/**
 * Level 2 — Variables. A grid of example variables; clicking one shows
 * the "VARIABLE -> what can change from one individual to another?"
 * framing underneath, per the brief.
 */
export function VariableCards() {
  const [activeId, setActiveId] = useState(VARIABLE_EXAMPLES[0]!.id);
  const active = VARIABLE_EXAMPLES.find((v) => v.id === activeId)!;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
      <p className="max-w-md text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        A variable is something that can be measured or recorded, and it can change from one individual to another.
      </p>

      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
        {VARIABLE_EXAMPLES.map((variable) => (
          <button
            key={variable.id}
            type="button"
            onClick={() => setActiveId(variable.id)}
            aria-pressed={activeId === variable.id}
            className={cn(
              "rounded-card border px-3 py-3 text-center text-sm font-medium transition-colors",
              activeId === variable.id
                ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                : "border-line text-ink hover:border-ink/30 dark:border-line-dark dark:text-bone dark:hover:border-bone/30",
            )}
          >
            {variable.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 rounded-card border border-line bg-white/50 px-6 py-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Variable: {active.label}</p>
        <p className="text-ink-soft/70 dark:text-bone-soft/70">↓</p>
        <p className="max-w-sm text-sm text-ink-soft dark:text-bone-soft">
          What can change from one individual to another?
        </p>
        <p className="mt-1 text-sm text-ink dark:text-bone">{active.hint}</p>
      </div>
    </div>
  );
}
