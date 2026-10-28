"use client";

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
  frequency: number;
  onFrequencyChange: (v: number) => void;
  wavelength: number;
  onWavelengthChange: (v: number) => void;
}

export function SpeedControls({
  frequency,
  onFrequencyChange,
  wavelength,
  onWavelengthChange,
}: SpeedControlsProps) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">

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
