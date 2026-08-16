"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperControlProps {
  label: string;
  value: number;
  unit?: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

/** Simple decrement / value / increment control — matches the spec's `[ − ] [ value ] [ + ]` layout rather than a slider. */
export function StepperControl({ label, value, unit, min, max, step, onChange }: StepperControlProps) {
  const decrement = () => onChange(Math.max(min, Math.round((value - step) * 10) / 10));
  const increment = () => onChange(Math.min(max, Math.round((value + step) * 10) / 10));

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">{label}</span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          aria-label={`Decrease ${label.toLowerCase()}`}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors dark:border-bone/20 dark:text-bone",
            "hover:border-ink/35 hover:bg-ink/[0.04] dark:hover:border-bone/35 dark:hover:bg-bone/[0.06]",
            "disabled:pointer-events-none disabled:opacity-40"
          )}
        >
          <Minus className="h-4 w-4" strokeWidth={2} />
        </button>

        <span className="min-w-[4.5rem] text-center font-display text-lg font-semibold tabular-nums text-ink dark:text-bone">
          {value}
          {unit ? <span className="ml-0.5 text-xs font-normal text-ink-soft dark:text-bone-soft">{unit}</span> : null}
        </span>

        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          aria-label={`Increase ${label.toLowerCase()}`}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors dark:border-bone/20 dark:text-bone",
            "hover:border-ink/35 hover:bg-ink/[0.04] dark:hover:border-bone/35 dark:hover:bg-bone/[0.06]",
            "disabled:pointer-events-none disabled:opacity-40"
          )}
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
