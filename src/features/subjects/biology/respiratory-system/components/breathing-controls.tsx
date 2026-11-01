"use client";

import { Pause, Play, RotateCcw, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BreathingControlsProps {
  running: boolean;
  onInhale: () => void;
  onExhale: () => void;
  onPause: () => void;
  onReset: () => void;
}

/** Inhale / Exhale / Pause / Reset: rendered in the sticky stage block so they stay reachable with the lungs. */
export function BreathingControls({ running, onInhale, onExhale, onPause, onReset }: BreathingControlsProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-center">
      <Button variant="secondary" size="md" onClick={onInhale}>
        <Play className="h-4 w-4" strokeWidth={1.75} />
        Inhale
      </Button>
      <Button variant="secondary" size="md" onClick={onExhale}>
        <Play className="h-4 w-4 rotate-180" strokeWidth={1.75} />
        Exhale
      </Button>
      <Button variant="ghost" size="md" onClick={onPause} disabled={!running}>
        <Pause className="h-4 w-4" strokeWidth={1.75} />
        Pause
      </Button>
      <Button variant="ghost" size="md" onClick={onReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset
      </Button>
    </div>
  );
}

interface AutoBreathingToggleProps {
  auto: boolean;
  onAuto: () => void;
}

/** The continuous-breathing mode switch; sits at the top of the controls, beside / under the sticky stage. */
export function AutoBreathingToggle({ auto, onAuto }: AutoBreathingToggleProps) {
  return (
    <button
      type="button"
      onClick={onAuto}
      aria-pressed={auto}
      className={cn(
        "flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
        auto
          ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
          : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
      )}
    >
      <Wind className="h-4 w-4" strokeWidth={1.75} />
      Auto Breathing
    </button>
  );
}
