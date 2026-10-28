"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface WaveActionsProps {
  running: boolean;
  onPlayPause: () => void;
  onReset: () => void;
}

/**
 * Play/Pause and Reset for every wave simulation. Lives in the layout's sticky `actions` slot so the wave stays
 * in view while the learner adjusts amplitude, wavelength or frequency below it. `aria-pressed` + the visible
 * status chip say whether it is running.
 */
export function WaveActions({ running, onPlayPause, onReset }: WaveActionsProps) {
  return (
    <>
      <Button variant={running ? "secondary" : "primary"} size="md" onClick={onPlayPause} className="min-w-28">
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
      <Button variant="ghost" size="md" onClick={onReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset
      </Button>
    </>
  );
}
