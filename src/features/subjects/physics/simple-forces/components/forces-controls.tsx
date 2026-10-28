"use client";

import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ForcesControlsProps {
  running: boolean;
  finished: boolean;
  onStart: () => void;
  onReset: () => void;
}

/** Exactly the two controls the spec calls for — Start and Reset. No Pause: the slide is short enough not to need one. */
export function ForcesControls({
  running,
  finished,
  onStart,
  onReset,
}: ForcesControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="primary"
        size="md"
        onClick={onStart}
        disabled={running || finished}
      >
        <Play className="h-4 w-4" strokeWidth={1.75} />
        Start
      </Button>
      <Button variant="ghost" size="md" onClick={onReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset
      </Button>
    </div>
  );
}
