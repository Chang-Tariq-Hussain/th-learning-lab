"use client";

import { ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface StageControlsProps {
  running: boolean;
  finished: boolean;
  onStart: () => void;
  onPause: () => void;
  onNextStage: () => void;
  onReset: () => void;
}

/** Exactly the four controls the spec calls for — Start, Pause, Next Stage, Reset. No sliders, no extra options. */
export function StageControls({ running, finished, onStart, onPause, onNextStage, onReset }: StageControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {running ? (
        <Button variant="secondary" size="lg" onClick={onPause}>
          <Pause className="h-4 w-4" strokeWidth={1.75} />
          Pause
        </Button>
      ) : (
        <Button variant="primary" size="lg" onClick={onStart} disabled={finished}>
          <Play className="h-4 w-4" strokeWidth={1.75} />
          Start
        </Button>
      )}
      <Button variant="secondary" size="lg" onClick={onNextStage} disabled={running || finished}>
        <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
        Next Stage
      </Button>
      <Button variant="ghost" size="lg" onClick={onReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset
      </Button>
    </div>
  );
}
