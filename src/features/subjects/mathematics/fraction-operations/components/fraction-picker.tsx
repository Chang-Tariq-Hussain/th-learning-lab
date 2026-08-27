"use client";

import { Minus, Plus } from "lucide-react";
import { DENOMINATOR_OPTIONS, type Fraction } from "../model";

export function FractionPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Fraction;
  onChange: (next: Fraction) => void;
}) {
  const denIndex = DENOMINATOR_OPTIONS.indexOf(value.den);

  const setNumerator = (num: number) => {
    onChange({ ...value, num: Math.min(Math.max(num, 0), value.den) });
  };

  const setDenominator = (nextDen: number) => {
    // Keep the same visual proportion as closely as possible instead
    // of silently clamping the numerator to the new max — round to
    // the nearest whole numerator under the new denominator.
    const proportion = value.den === 0 ? 0 : value.num / value.den;
    const nextNum = Math.min(nextDen, Math.max(0, Math.round(proportion * nextDen)));
    onChange({ num: nextNum, den: nextDen });
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 dark:text-bone-soft/70">
        {label}
      </span>

      <div className="flex items-center gap-4">
        <Stepper
          label="numerator"
          value={value.num}
          onDecrease={() => setNumerator(value.num - 1)}
          onIncrease={() => setNumerator(value.num + 1)}
          canDecrease={value.num > 0}
          canIncrease={value.num < value.den}
        />

        <span className="font-display text-2xl text-ink-soft/50 dark:text-bone-soft/50">/</span>

        <Stepper
          label="denominator"
          value={value.den}
          onDecrease={() => setDenominator(DENOMINATOR_OPTIONS[Math.max(0, denIndex - 1)]!)}
          onIncrease={() => setDenominator(DENOMINATOR_OPTIONS[Math.min(DENOMINATOR_OPTIONS.length - 1, denIndex + 1)]!)}
          canDecrease={denIndex > 0}
          canIncrease={denIndex < DENOMINATOR_OPTIONS.length - 1}
        />
      </div>
    </div>
  );
}

function Stepper({
  label,
  value,
  onDecrease,
  onIncrease,
  canDecrease,
  canIncrease,
}: {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  canDecrease: boolean;
  canIncrease: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={onIncrease}
        disabled={!canIncrease}
        aria-label={`Increase ${label}`}
        className="flex h-6 w-6 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/[0.06] hover:text-ink disabled:cursor-not-allowed disabled:opacity-25 dark:text-bone-soft dark:hover:bg-bone/[0.08] dark:hover:text-bone"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
      <span className="w-9 text-center font-display text-2xl font-medium text-ink dark:text-bone">{value}</span>
      <button
        type="button"
        onClick={onDecrease}
        disabled={!canDecrease}
        aria-label={`Decrease ${label}`}
        className="flex h-6 w-6 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/[0.06] hover:text-ink disabled:cursor-not-allowed disabled:opacity-25 dark:text-bone-soft dark:hover:bg-bone/[0.08] dark:hover:text-bone"
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
