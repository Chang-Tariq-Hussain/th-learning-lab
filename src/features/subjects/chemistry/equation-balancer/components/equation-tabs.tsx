"use client";

import { cn } from "@/lib/utils";
import { EQUATION_ORDER, EQUATIONS } from "../equation-model";

interface EquationTabsProps {
  equationId: string;
  onChange: (id: string) => void;
}

/** Equation selector, styled to match Reaction Builder's / Molecule Builder's tabs. */
export function EquationTabs({ equationId, onChange }: EquationTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Equation to balance"
      className="flex flex-wrap gap-1 rounded-full border border-line p-1 dark:border-line-dark"
    >
      {EQUATION_ORDER.map((id) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={equationId === id}
          onClick={() => onChange(id)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
            equationId === id
              ? "bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
              : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone",
          )}
        >
          {EQUATIONS[id]!.name}
        </button>
      ))}
    </div>
  );
}
