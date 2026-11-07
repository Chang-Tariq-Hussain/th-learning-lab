"use client";

import { cn } from "@/lib/utils";
import type { CellKind } from "../types";

export interface CellSwitchProps {
  value: CellKind;
  onChange: (kind: CellKind) => void;
}

const OPTIONS: { kind: CellKind; label: string }[] = [
  { kind: "animal", label: "Animal cell" },
  { kind: "plant", label: "Plant cell" },
];

/** Two-option switch between the cell types. A radio group: arrow keys move between the options. */
export function CellSwitch({ value, onChange }: CellSwitchProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Cell type"
      className="inline-flex gap-1 rounded-full border border-line bg-white/60 p-1 dark:border-line-dark dark:bg-white/[0.03]"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          const next: CellKind = value === "animal" ? "plant" : "animal";
          onChange(next);
          (e.currentTarget.querySelector(`[data-kind="${next}"]`) as HTMLElement | null)?.focus();
        }
      }}
    >
      {OPTIONS.map((option) => {
        const on = value === option.kind;
        return (
          <button
            key={option.kind}
            type="button"
            role="radio"
            aria-checked={on}
            data-kind={option.kind}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(option.kind)}
            className={cn(
              "min-h-11 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:focus-visible:outline-bone",
              on ? "bg-subject-biology text-white dark:text-chalkboard" : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
