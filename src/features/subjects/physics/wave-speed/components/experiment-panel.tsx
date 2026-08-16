"use client";

import { cn } from "@/lib/utils";
import {
  FREQUENCY_EXPERIMENT_VALUES,
  FREQUENCY_EXPERIMENT_WAVELENGTH,
  WAVELENGTH_EXPERIMENT_FREQUENCY,
  WAVELENGTH_EXPERIMENT_VALUES,
  waveSpeed,
} from "../wave-model";

interface ExperimentPanelProps {
  frequency: number;
  wavelength: number;
  onSetFrequency: (v: number) => void;
  onSetWavelength: (v: number) => void;
}

/**
 * "Change one variable at a time" — each button sets the *real* controls
 * above, so trying an experiment immediately updates the live wave,
 * readouts, and formula rather than showing a separate static demo.
 */
export function ExperimentPanel({ frequency, wavelength, onSetFrequency, onSetWavelength }: ExperimentPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-display text-sm font-medium text-ink dark:text-bone">Experiment: Change the Frequency</p>
        <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">
          Wavelength held at {FREQUENCY_EXPERIMENT_WAVELENGTH} m. Try each frequency:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {FREQUENCY_EXPERIMENT_VALUES.map((f) => {
            const active = frequency === f && wavelength === FREQUENCY_EXPERIMENT_WAVELENGTH;
            return (
              <button
                key={f}
                type="button"
                onClick={() => {
                  onSetWavelength(FREQUENCY_EXPERIMENT_WAVELENGTH);
                  onSetFrequency(f);
                }}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-pine-500 bg-pine-600 text-paper dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard"
                    : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
                )}
              >
                {f} × {FREQUENCY_EXPERIMENT_WAVELENGTH} = {waveSpeed(f, FREQUENCY_EXPERIMENT_WAVELENGTH)} m/s
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
          When wavelength stays constant, increasing frequency increases wave speed in this model.
        </p>
      </div>

      <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-display text-sm font-medium text-ink dark:text-bone">Experiment: Change the Wavelength</p>
        <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">
          Frequency held at {WAVELENGTH_EXPERIMENT_FREQUENCY} Hz. Try each wavelength:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {WAVELENGTH_EXPERIMENT_VALUES.map((l) => {
            const active = wavelength === l && frequency === WAVELENGTH_EXPERIMENT_FREQUENCY;
            return (
              <button
                key={l}
                type="button"
                onClick={() => {
                  onSetFrequency(WAVELENGTH_EXPERIMENT_FREQUENCY);
                  onSetWavelength(l);
                }}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-pine-500 bg-pine-600 text-paper dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard"
                    : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
                )}
              >
                {WAVELENGTH_EXPERIMENT_FREQUENCY} × {l} = {waveSpeed(WAVELENGTH_EXPERIMENT_FREQUENCY, l)} m/s
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
          When frequency stays constant, increasing wavelength increases wave speed in this model.
        </p>
      </div>
    </div>
  );
}
