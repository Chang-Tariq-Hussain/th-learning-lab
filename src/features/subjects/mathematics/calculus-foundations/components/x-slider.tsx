"use client";

import { formatValue } from "../calculus-model";

export interface XSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

/**
 * A slider paired with a synced number input for choosing x — same
 * "native range input, styled large" approach as Equation Playground's
 * `ValueSlider`, plus a number box per the brief's "slider AND number
 * input" requirement.
 */
export function XSlider({ value, onChange, min, max }: XSliderProps) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <label htmlFor="calc-x-slider" className="font-mono text-sm text-ink-soft dark:text-bone-soft">
          x =
        </label>
        <input
          id="calc-x-number"
          type="number"
          value={formatValue(value)}
          min={min}
          max={max}
          step={0.1}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (!Number.isNaN(next)) onChange(Math.min(max, Math.max(min, next)));
          }}
          className="w-20 rounded-md border border-ink/15 bg-transparent px-2 py-1 text-center font-mono text-sm text-ink outline-none focus-visible:border-pine-500 dark:border-bone/20 dark:text-bone"
        />
      </div>
      <input
        id="calc-x-slider"
        type="range"
        min={min}
        max={max}
        step={0.1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label="Choose x"
        className="h-3 w-full cursor-pointer touch-none appearance-none rounded-full bg-subject-math-soft accent-subject-math dark:bg-subject-math/20 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-subject-math [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-subject-math [&::-moz-range-thumb]:shadow-md"
      />
      <div className="flex w-full justify-between px-1 font-mono text-[11px] text-ink-soft dark:text-bone-soft">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}
