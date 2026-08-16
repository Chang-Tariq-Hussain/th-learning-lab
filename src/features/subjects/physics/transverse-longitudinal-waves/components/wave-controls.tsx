"use client";

import { Crosshair, Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StepperControl } from "../../basic-wave-motion/components/stepper-control";
import { SPEED_MAX, SPEED_MIN, SPEED_STEP } from "../wave-model";

interface WaveControlsProps {
  running: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (v: number) => void;
  showParticlePaths: boolean;
  onToggleParticlePaths: () => void;
  watching: boolean;
  onToggleWatch: () => void;
}

export function WaveControls({
  running,
  onPlayPause,
  onReset,
  speed,
  onSpeedChange,
  showParticlePaths,
  onToggleParticlePaths,
  watching,
  onToggleWatch,
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
          onClick={onToggleParticlePaths}
          aria-pressed={showParticlePaths}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
            showParticlePaths
              ? "border-pine-500 bg-pine-600 text-paper dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard"
              : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
          )}
        >
          <Sparkles className="h-4 w-4" strokeWidth={1.75} />
          Show particle paths
        </button>
        <button
          type="button"
          onClick={onToggleWatch}
          aria-pressed={watching}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
            watching
              ? "border-amber-500 bg-amber-500 text-paper dark:text-chalkboard"
              : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
          )}
        >
          <Crosshair className="h-4 w-4" strokeWidth={1.75} />
          Watch one particle
        </button>
      </div>

      <StepperControl
        label="Speed"
        value={speed}
        unit="×"
        min={SPEED_MIN}
        max={SPEED_MAX}
        step={SPEED_STEP}
        onChange={onSpeedChange}
      />
    </div>
  );
}
