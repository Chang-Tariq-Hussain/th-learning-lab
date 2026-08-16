"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PhotosynthesisControlsProps {
  running: boolean;
  finished: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

/** Exactly the three controls the spec calls for — Start, Pause, Reset. */
export function PhotosynthesisControls({ running, finished, onStart, onPause, onReset }: PhotosynthesisControlsProps) {
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
      <Button variant="ghost" size="lg" onClick={onReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset
      </Button>
    </div>
  );
}
