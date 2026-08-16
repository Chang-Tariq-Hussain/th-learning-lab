"use client";

import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EnergyControlsProps {
  running: boolean;
  finished: boolean;
  onRelease: () => void;
  onReset: () => void;
}

/** Exactly the two controls the spec calls for — Release and Reset. */
export function EnergyControls({
  running,
  finished,
  onRelease,
  onReset,
}: EnergyControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        variant="primary"
        size="lg"
        onClick={onRelease}
        disabled={running || finished}
      >
        <Play className="h-4 w-4" strokeWidth={1.75} />
        Release
      </Button>
      <Button variant="ghost" size="lg" onClick={onReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset
      </Button>
    </div>
  );
}
