"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAX_COEFFICIENT } from "../equation-model";

interface CoefficientStepperProps {
  value: number;
  onChange: (next: number) => void;
  label: string;
}

/**
 * A "-  N  +" control for one term's coefficient — deliberately a
 * stepper rather than a free-text field, so a student can never type
 * a fraction, a zero, or a change to the formula itself. Only the
 * coefficient (the big number in front) is ever adjustable here; the
 * formula's subscripts are fixed text, never part of this control.
 */
export function CoefficientStepper({ value, onChange, label }: CoefficientStepperProps) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-line dark:border-line-dark">
      <button
        type="button"
        aria-label={`Decrease coefficient for ${label}`}
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors dark:text-bone-soft",
          "hover:bg-ink/[0.05] hover:text-ink disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-bone/[0.08] dark:hover:text-bone",
        )}
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
      <span className="w-6 text-center font-mono text-base font-semibold text-ink dark:text-bone" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Increase coefficient for ${label}`}
        onClick={() => onChange(Math.min(MAX_COEFFICIENT, value + 1))}
        disabled={value >= MAX_COEFFICIENT}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors dark:text-bone-soft",
          "hover:bg-ink/[0.05] hover:text-ink disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-bone/[0.08] dark:hover:text-bone",
        )}
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}
