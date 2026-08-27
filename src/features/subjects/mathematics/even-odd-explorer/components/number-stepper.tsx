"use client";

import { Minus, Plus } from "lucide-react";
import { OPERAND_MAX, OPERAND_MIN } from "../model";

export function NumberStepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 dark:text-bone-soft/70">
        {label}
      </span>
      <div className="flex items-center gap-3 rounded-full border border-line bg-white/70 px-2 py-1.5 dark:border-line-dark dark:bg-white/[0.04]">
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          disabled={value <= OPERAND_MIN}
          aria-label={`Decrease ${label}`}
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/[0.06] hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 dark:text-bone-soft dark:hover:bg-bone/[0.08] dark:hover:text-bone"
        >
          <Minus className="h-4 w-4" strokeWidth={2} />
        </button>
        <span className="w-10 text-center font-display text-2xl font-medium text-ink dark:text-bone">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          disabled={value >= OPERAND_MAX}
          aria-label={`Increase ${label}`}
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/[0.06] hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 dark:text-bone-soft dark:hover:bg-bone/[0.08] dark:hover:text-bone"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
