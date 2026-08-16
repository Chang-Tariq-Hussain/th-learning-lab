"use client";

import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { useSimulation } from "../../context/simulation-context";
import { cn } from "@/lib/utils";

const iconButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink transition-colors hover:border-ink/30 hover:bg-ink/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-bone/15 dark:text-bone dark:hover:border-bone/30 dark:hover:bg-bone/[0.06]";

export function PlayPauseButton({ className }: { className?: string }) {
  const { status, toggle } = useSimulation();
  const isPlaying = status === "playing";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
      title={isPlaying ? "Pause (Space)" : "Play (Space)"}
      className={cn(
        iconButtonClass,
        "border-pine-600 bg-pine-600 text-paper hover:bg-pine-700 dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard dark:hover:bg-pine-100",
        className
      )}
    >
      {isPlaying ? (
        <Pause className="h-4 w-4" strokeWidth={1.75} fill="currentColor" />
      ) : (
        <Play className="ml-0.5 h-4 w-4" strokeWidth={1.75} fill="currentColor" />
      )}
    </button>
  );
}

export function ResetButton({ className }: { className?: string }) {
  const { resetAll } = useSimulation();
  return (
    <button
      type="button"
      onClick={resetAll}
      aria-label="Reset simulation"
      title="Reset (R)"
      className={cn(iconButtonClass, className)}
    >
      <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}

export function StepForwardButton({ className }: { className?: string }) {
  const { step, status } = useSimulation();
  return (
    <button
      type="button"
      onClick={step}
      disabled={status === "playing"}
      aria-label="Step forward one frame"
      title="Step forward (→)"
      className={cn(iconButtonClass, "disabled:cursor-not-allowed disabled:opacity-40", className)}
    >
      <StepForward className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}

/** The three transport controls grouped together — the common case. */
export function PlaybackControls({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)} role="group" aria-label="Playback">
      <PlayPauseButton />
      <StepForwardButton />
      <ResetButton />
    </div>
  );
}
