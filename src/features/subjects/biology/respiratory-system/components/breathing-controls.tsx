"use client";

import { Pause, Play, RotateCcw, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BreathingControlsProps {
  auto: boolean;
  running: boolean;
  onInhale: () => void;
  onExhale: () => void;
  onAuto: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function BreathingControls({ auto, running, onInhale, onExhale, onAuto, onPause, onReset }: BreathingControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="secondary" size="lg" onClick={onInhale}>
        <Play className="h-4 w-4" strokeWidth={1.75} />
        Inhale
      </Button>
      <Button variant="secondary" size="lg" onClick={onExhale}>
        <Play className="h-4 w-4 rotate-180" strokeWidth={1.75} />
        Exhale
      </Button>
      <button
        type="button"
        onClick={onAuto}
        aria-pressed={auto}
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
          auto
            ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
            : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
        )}
      >
        <Wind className="h-4 w-4" strokeWidth={1.75} />
        Auto Breathing
      </button>
      <Button variant="ghost" size="lg" onClick={onPause} disabled={!running}>
        <Pause className="h-4 w-4" strokeWidth={1.75} />
        Pause
      </Button>
      <Button variant="ghost" size="lg" onClick={onReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset
      </Button>
    </div>
  );
}
