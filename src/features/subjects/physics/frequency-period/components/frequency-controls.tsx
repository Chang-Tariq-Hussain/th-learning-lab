"use client";

import { Eye, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StepperControl } from "../../basic-wave-motion/components/stepper-control";
import { FREQUENCY_MAX, FREQUENCY_MIN, FREQUENCY_STEP } from "../wave-model";

interface FrequencyControlsProps {
  running: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  frequency: number;
  onFrequencyChange: (v: number) => void;
  watchingOneSecond: boolean;
  onWatchOneSecond: () => void;
}

export function FrequencyControls({
  running,
  onPlayPause,
  onReset,
  frequency,
  onFrequencyChange,
  watchingOneSecond,
  onWatchOneSecond,
}: FrequencyControlsProps) {
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
          onClick={onWatchOneSecond}
          aria-pressed={watchingOneSecond}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
            watchingOneSecond
              ? "border-pine-500 bg-pine-600 text-paper dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard"
              : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
          )}
        >
          <Eye className="h-4 w-4" strokeWidth={1.75} />
          Watch 1 second
        </button>
      </div>

      <StepperControl
        label="Frequency"
        value={frequency}
        unit="Hz"
        min={FREQUENCY_MIN}
        max={FREQUENCY_MAX}
        step={FREQUENCY_STEP}
        onChange={onFrequencyChange}
      />
    </div>
  );
}
