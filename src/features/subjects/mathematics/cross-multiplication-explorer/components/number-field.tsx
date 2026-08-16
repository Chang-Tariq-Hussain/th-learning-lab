"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FIELD_MAX, FIELD_MIN } from "../colors";

export interface NumberFieldProps {
  value: number;
  onChange: (value: number) => void;
  color: string;
  label: string;
}

/** A single numerator/denominator stepper: type a value or nudge it with ±1. */
export function NumberField({ value, onChange, color, label }: NumberFieldProps) {
  const clamp = (next: number) => Math.min(FIELD_MAX, Math.max(FIELD_MIN, Math.round(next)));

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= FIELD_MIN}
        aria-label={`Decrease ${label}`}
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink-soft transition-colors dark:border-bone/20 dark:text-bone-soft",
          "hover:bg-ink/[0.04] disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-bone/[0.06]",
        )}
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={2} />
      </button>

      <input
        type="number"
        inputMode="numeric"
        min={FIELD_MIN}
        max={FIELD_MAX}
        value={value}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          if (Number.isNaN(parsed)) return;
          onChange(clamp(parsed));
        }}
        aria-label={label}
        style={{ color }}
        className="h-10 w-14 rounded-xl border border-ink/15 bg-transparent text-center font-display text-2xl font-medium tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-bone/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= FIELD_MAX}
        aria-label={`Increase ${label}`}
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink-soft transition-colors dark:border-bone/20 dark:text-bone-soft",
          "hover:bg-ink/[0.04] disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-bone/[0.06]",
        )}
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}
