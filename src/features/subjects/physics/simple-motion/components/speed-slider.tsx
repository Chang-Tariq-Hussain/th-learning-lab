"use client";

import { SPEED_MAX, SPEED_MIN, SPEED_STEP } from "../motion-model";

export interface SpeedSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

/**
 * A single native range input, styled the same way as the Math
 * subject's ValueSlider — large accent-colored thumb, big number
 * readout above it. The only control this lesson needs besides the
 * three buttons.
 */
export function SpeedSlider({ value, onChange, disabled = false }: SpeedSliderProps) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <label htmlFor="speed-slider" className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
        Speed
      </label>
      <span className="font-display text-3xl font-semibold text-subject-physics tabular-nums">
        {value} <span className="text-lg font-normal text-ink-soft dark:text-bone-soft">m/s</span>
      </span>
      <input
        id="speed-slider"
        type="range"
        min={SPEED_MIN}
        max={SPEED_MAX}
        step={SPEED_STEP}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label="Choose a speed in meters per second"
        className="h-3 w-full cursor-pointer touch-none appearance-none rounded-full bg-subject-physics-soft accent-subject-physics disabled:cursor-not-allowed disabled:opacity-60 dark:bg-subject-physics/20 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-subject-physics [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-subject-physics [&::-moz-range-thumb]:shadow-md"
      />
      <div className="flex w-full justify-between px-1 font-mono text-[11px] text-ink-soft dark:text-bone-soft">
        <span>{SPEED_MIN} m/s</span>
        <span>{SPEED_MAX} m/s</span>
      </div>
    </div>
  );
}
