"use client";

import { ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface StepControlsProps {
  running: boolean;
  finished: boolean;
  onStart: () => void;
  onPause: () => void;
  onNextStep: () => void;
  onReset: () => void;
}

export function StepControls({ running, finished, onStart, onPause, onNextStep, onReset }: StepControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {running ? (
        <Button variant="secondary" size="md" onClick={onPause}>
          <Pause className="h-4 w-4" strokeWidth={1.75} />
          Pause
        </Button>
      ) : (
        <Button variant="primary" size="md" onClick={onStart} disabled={finished}>
          <Play className="h-4 w-4" strokeWidth={1.75} />
          Start
        </Button>
      )}
      <Button variant="secondary" size="md" onClick={onNextStep} disabled={running || finished}>
        <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
        Next Step
      </Button>
      <Button variant="ghost" size="md" onClick={onReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset
      </Button>
    </div>
  );
}
