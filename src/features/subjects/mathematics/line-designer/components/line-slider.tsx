"use client";

/**
 * Same large-thumb native range-input pattern used by every other
 * slider in this codebase (see e.g. Equation Playground's
 * `ValueSlider`, Derivative Explorer's `LabeledSlider`) — kept local
 * to this subject rather than imported cross-feature, matching how
 * those other simulations each keep their own copy.
 */
export interface LineSliderProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

export function LineSlider({ id, label, value, onChange, min, max }: LineSliderProps) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-2">
      <label htmlFor={id} className="font-mono text-sm text-ink-soft dark:text-bone-soft">
        {label} = <span className="text-lg font-semibold text-subject-math tabular-nums">{value}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={label}
        className="h-3 w-full cursor-pointer touch-none appearance-none rounded-full bg-subject-math-soft accent-subject-math dark:bg-subject-math/20 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-subject-math [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-subject-math [&::-moz-range-thumb]:shadow-md"
      />
      <div className="flex w-full justify-between px-1 font-mono text-[11px] text-ink-soft dark:text-bone-soft">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
