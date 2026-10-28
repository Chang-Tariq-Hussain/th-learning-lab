"use client";

import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface StageControlsProps {
  running: boolean;
  finished: boolean;
  /** True when stageIndex is 0 (Interphase) — nothing to step back to. */
  atStart: boolean;
  onPreviousStage: () => void;
  onStart: () => void;
  onPause: () => void;
  onNextStage: () => void;
  onReset: () => void;
}

/**
 * The spec's [◀ Previous] [▶ Play] [Next ▶] [↻ Restart] row. Previous
 * and Next Stage share the same "always pause first" rule Start/Next
 * already followed — stepping manually in either direction takes you
 * out of autoplay. All four targets are the `lg` Button size (48px
 * tall), comfortably above the ~44px touch-target minimum.
 */
export function StageControls({
  running,
  finished,
  atStart,
  onPreviousStage,
  onStart,
  onPause,
  onNextStage,
  onReset,
}: StageControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="secondary"
        size="md"
        onClick={onPreviousStage}
        disabled={running || atStart}
        aria-label="Previous stage"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      {running ? (
        <Button variant="secondary" size="md" onClick={onPause}>
          <Pause className="h-4 w-4" strokeWidth={1.75} />
          Pause
        </Button>
      ) : (
        <Button variant="primary" size="md" onClick={onStart} disabled={finished}>
          <Play className="h-4 w-4" strokeWidth={1.75} />
          Play
        </Button>
      )}

      <Button
        variant="secondary"
        size="md"
        onClick={onNextStage}
        disabled={running || finished}
        aria-label="Next stage"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
      </Button>

      <Button variant="ghost" size="md" onClick={onReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Restart
      </Button>
    </div>
  );
}
