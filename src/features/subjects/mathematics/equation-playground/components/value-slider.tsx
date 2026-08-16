"use client";

export interface ValueSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

/**
 * A single big native `<input type="range">`, not a custom drag widget
 * — this already gets keyboard support (arrow keys, Home/End), touch
 * dragging, and screen-reader semantics for free, and native range
 * inputs are easy to style large without reinventing pointer handling.
 */
export function ValueSlider({ value, onChange, min = 0, max = 20 }: ValueSliderProps) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <span className="font-display text-3xl font-semibold text-subject-math tabular-nums">{value}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label="Choose a number for the missing value"
        className="h-3 w-full cursor-pointer touch-none appearance-none rounded-full bg-subject-math-soft accent-subject-math dark:bg-subject-math/20 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-subject-math [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-subject-math [&::-moz-range-thumb]:shadow-md"
      />
      <div className="flex w-full justify-between px-1 font-mono text-[11px] text-ink-soft dark:text-bone-soft">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
