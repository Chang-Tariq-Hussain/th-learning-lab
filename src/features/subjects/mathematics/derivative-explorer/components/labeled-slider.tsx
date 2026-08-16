"use client";

import { formatValue } from "../../calculus-foundations/calculus-model";

export interface LabeledSliderProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}

/**
 * Same large-thumb range-input styling as Calculus Foundations'
 * `XSlider`, generalized with an id/label so more than one slider
 * (x-position, distance-between-points) can sit on screen together.
 */
export function LabeledSlider({ id, label, value, onChange, min, max, step = 0.05 }: LabeledSliderProps) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-2">
      <label htmlFor={id} className="font-mono text-sm text-ink-soft dark:text-bone-soft">
        {label}: <span className="font-semibold text-ink dark:text-bone">{formatValue(value)}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={label}
        className="h-3 w-full cursor-pointer touch-none appearance-none rounded-full bg-subject-math-soft accent-subject-math dark:bg-subject-math/20 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-subject-math [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-subject-math [&::-moz-range-thumb]:shadow-md"
      />
    </div>
  );
}
