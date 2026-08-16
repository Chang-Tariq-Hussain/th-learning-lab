"use client";

export interface PlanSliderProps {
  id: string;
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  /** How many decimal places to show in the big number readout. Defaults to 0. */
  decimals?: number;
}

/**
 * One native range input with a big colored readout above it — reused
 * for Speed, Time, and Distance so all three feel like the same kind
 * of control, matching the ValueSlider pattern used in the Math
 * subject's visualizations.
 */
export function PlanSlider({
  id,
  label,
  unit,
  value,
  min,
  max,
  step = 1,
  onChange,
  disabled = false,
  decimals = 0,
}: PlanSliderProps) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <label
        htmlFor={id}
        className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics"
      >
        {label}
      </label>
      <span className="font-display text-3xl font-semibold text-subject-physics tabular-nums">
        {value.toFixed(decimals)}{" "}
        <span className="text-lg font-normal text-ink-soft dark:text-bone-soft">
          {unit}
        </span>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={`Choose ${label.toLowerCase()} in ${unit}`}
        className="h-3 w-full cursor-pointer touch-none appearance-none rounded-full bg-subject-physics-soft accent-subject-physics disabled:cursor-not-allowed disabled:opacity-60 dark:bg-subject-physics/20 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-subject-physics [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-subject-physics [&::-moz-range-thumb]:shadow-md"
      />
      <div className="flex w-full justify-between px-1 font-mono text-[11px] text-ink-soft dark:text-bone-soft">
        <span>
          {min.toFixed(decimals)} {unit}
        </span>
        <span>
          {max.toFixed(decimals)} {unit}
        </span>
      </div>
    </div>
  );
}
