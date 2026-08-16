"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepperControl } from "../../basic-wave-motion/components/stepper-control";
import {
  FREQUENCY_MAX,
  FREQUENCY_MIN,
  FREQUENCY_STEP,
  WAVELENGTH_MAX,
  WAVELENGTH_MIN,
  WAVELENGTH_STEP,
} from "../wave-model";

interface SpeedControlsProps {
  running: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  frequency: number;
  onFrequencyChange: (v: number) => void;
  wavelength: number;
  onWavelengthChange: (v: number) => void;
}

export function SpeedControls({
  running,
  onPlayPause,
  onReset,
  frequency,
  onFrequencyChange,
  wavelength,
  onWavelengthChange,
}: SpeedControlsProps) {
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
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
        <StepperControl
          label="Frequency"
          value={frequency}
          unit="Hz"
          min={FREQUENCY_MIN}
          max={FREQUENCY_MAX}
          step={FREQUENCY_STEP}
          onChange={onFrequencyChange}
        />
        <StepperControl
          label="Wavelength"
          value={wavelength}
          unit="m"
          min={WAVELENGTH_MIN}
          max={WAVELENGTH_MAX}
          step={WAVELENGTH_STEP}
          onChange={onWavelengthChange}
        />
      </div>
    </div>
  );
}
