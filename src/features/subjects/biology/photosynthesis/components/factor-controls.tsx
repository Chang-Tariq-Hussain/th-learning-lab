"use client";

import { RotateCcw } from "lucide-react";
import { DEFAULT_FACTORS } from "../model";
import type { PhotosynthesisFactors } from "../types";

export interface FactorControlsProps {
  factors: PhotosynthesisFactors;
  /** The combined 0–1 rate `factorRate(factors)` already computed by
   *  the caller — shown as a plain percentage readout rather than
   *  recomputed here, so there's exactly one place that owns the
   *  formula. */
  rate: number;
  onChange: (factors: PhotosynthesisFactors) => void;
}

interface SliderSpec {
  key: keyof PhotosynthesisFactors;
  label: string;
  lowLabel: string;
  highLabel: string;
}

const SLIDERS: SliderSpec[] = [
  { key: "light", label: "Light Intensity", lowLabel: "Dark", highLabel: "Bright" },
  { key: "co2", label: "Carbon Dioxide", lowLabel: "None", highLabel: "Plentiful" },
  { key: "temperature", label: "Temperature", lowLabel: "Cold", highLabel: "Hot" },
];

/**
 * The one-variable-at-a-time experiment panel for "Factors Affecting
 * Photosynthesis." Three plain range inputs (kept local/unstyled-
 * context rather than pulling in the `features/simulation` parameter
 * system, since this simulation doesn't use that engine anywhere
 * else) plus a live rate readout, so a student can change one slider,
 * leave the others alone, and watch the plant scene above visibly
 * speed up or slow down.
 */
export function FactorControls({ factors, rate, onChange }: FactorControlsProps) {
  const ratePercent = Math.round(rate * 100);
  const isOptimal =
    factors.light === DEFAULT_FACTORS.light &&
    factors.co2 === DEFAULT_FACTORS.co2 &&
    factors.temperature === DEFAULT_FACTORS.temperature;

  return (
    <div className="flex flex-col gap-5 rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
            Environmental Factors
          </p>
          <h2 className="mt-1 font-display text-lg font-medium text-ink dark:text-bone">
            Rate of Photosynthesis: {ratePercent}%
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onChange(DEFAULT_FACTORS)}
          disabled={isOptimal}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:text-ink disabled:opacity-40 disabled:hover:text-ink-soft dark:border-line-dark dark:text-bone-soft dark:hover:text-bone"
        >
          <RotateCcw className="h-3 w-3" strokeWidth={2} />
          Reset to Optimal
        </button>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-white/70 shadow-card dark:bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-subject-biology transition-[width] duration-150 ease-linear"
          style={{ width: `${ratePercent}%` }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {SLIDERS.map((slider) => {
          const value = factors[slider.key];
          const inputId = `photosynthesis-factor-${slider.key}`;
          return (
            <div key={slider.key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor={inputId} className="text-sm font-medium text-ink dark:text-bone">
                  {slider.label}
                </label>
                <span className="font-mono text-xs text-ink-soft dark:text-bone-soft">{value}</span>
              </div>
              <input
                id={inputId}
                type="range"
                min={0}
                max={100}
                step={1}
                value={value}
                onChange={(event) =>
                  onChange({ ...factors, [slider.key]: Number(event.target.value) })
                }
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={value}
                aria-valuetext={`${slider.label}: ${value} of 100`}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-pine-600 dark:bg-line-dark dark:accent-pine-300"
              />
              <div className="flex justify-between text-[10px] uppercase tracking-wide text-ink-soft/70 dark:text-bone-soft/70">
                <span>{slider.lowLabel}</span>
                <span>{slider.highLabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        Change one slider at a time and press Start to see how it affects the rate. Light and CO₂
        both need to be available — whichever one is scarcer limits the rate. Temperature works
        differently: the rate is highest near the middle and drops off toward either extreme.
      </p>
    </div>
  );
}
