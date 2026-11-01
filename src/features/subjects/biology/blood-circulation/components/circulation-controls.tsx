"use client";

import { Pause, Play, Route, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CirculationControlsProps {
  running: boolean;
  onPlayPause: () => void;
  onReset: () => void;
}

/** Start/Pause and Reset: these live in the sticky stage block so they stay reachable with the animation. */
export function CirculationControls({ running, onPlayPause, onReset }: CirculationControlsProps) {
  return (
    <>
      <Button variant={running ? "secondary" : "primary"} size="md" className="min-w-28" onClick={onPlayPause}>
        {running ? (
          <>
            <Pause className="h-4 w-4" strokeWidth={1.75} />
            Pause
          </>
        ) : (
          <>
            <Play className="h-4 w-4" strokeWidth={1.75} />
            Start
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

interface TraceToggleProps {
  tracing: boolean;
  onToggleTrace: () => void;
}

/** The guided "Trace Blood" mode switch; sits at the top of the controls, beside the sticky stage. */
export function TraceToggle({ tracing, onToggleTrace }: TraceToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggleTrace}
      aria-pressed={tracing}
      className={cn(
        "flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
        tracing
          ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
          : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
      )}
    >
      <Route className="h-4 w-4" strokeWidth={1.75} />
      Trace Blood
    </button>
  );
}
