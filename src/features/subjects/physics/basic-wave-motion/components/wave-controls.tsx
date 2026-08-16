"use client";

import { Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AMPLITUDE_MAX,
  AMPLITUDE_MIN,
  AMPLITUDE_STEP,
  WAVELENGTH_MAX,
  WAVELENGTH_MIN,
  WAVELENGTH_STEP,
} from "../wave-model";
import { StepperControl } from "./stepper-control";

interface WaveControlsProps {
  running: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  amplitude: number;
  onAmplitudeChange: (v: number) => void;
  wavelength: number;
  onWavelengthChange: (v: number) => void;
  showParticles: boolean;
  onToggleParticles: () => void;
}

export function WaveControls({
  running,
  onPlayPause,
  onReset,
  amplitude,
  onAmplitudeChange,
  wavelength,
  onWavelengthChange,
  showParticles,
  onToggleParticles,
}: WaveControlsProps) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant={running ? "secondary" : "primary"} size="lg" onClick={onPlayPause}>
          {running ? (
            <>
              <Pause className="h-4 w-4" strokeWidth={1.75} />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" strokeWidth={1.75} />
              Play
            </>
          )}
        </Button>
        <Button variant="ghost" size="lg" onClick={onReset}>
          <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
          Reset
        </Button>
        <button
          type="button"
          onClick={onToggleParticles}
          aria-pressed={showParticles}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
            showParticles
              ? "border-pine-500 bg-pine-600 text-paper dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard"
              : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
          )}
        >
          <Sparkles className="h-4 w-4" strokeWidth={1.75} />
          Show particles
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
        <StepperControl
          label="Amplitude"
          value={amplitude}
          min={AMPLITUDE_MIN}
          max={AMPLITUDE_MAX}
          step={AMPLITUDE_STEP}
          onChange={onAmplitudeChange}
        />
        <StepperControl
          label="Wavelength"
          value={wavelength}
          min={WAVELENGTH_MIN}
          max={WAVELENGTH_MAX}
          step={WAVELENGTH_STEP}
          onChange={onWavelengthChange}
        />
      </div>
    </div>
  );
}
