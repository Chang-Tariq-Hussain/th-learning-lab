"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STAGES } from "../digestive-model";
import type { StageId } from "../types";

interface JourneyControlsProps {
  running: boolean;
  started: boolean;
  complete: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

/** Start / Pause / Reset: rendered in the sticky stage block so they stay reachable with the animation. */
export function JourneyControls({ running, started, complete, onStart, onPause, onReset }: JourneyControlsProps) {
  return (
    <>
      {running ? (
        <Button variant="secondary" size="md" onClick={onPause} className="min-w-28">
          <Pause className="h-4 w-4" strokeWidth={1.75} />
          Pause
        </Button>
      ) : (
        <Button variant="primary" size="md" onClick={onStart} className="min-w-28">
          <Play className="h-4 w-4" strokeWidth={1.75} />
          {complete ? "Restart Journey" : started ? "Resume" : "Start Journey"}
        </Button>
      )}
      <Button variant="ghost" size="md" onClick={onReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset
      </Button>
    </>
  );
}

interface JourneyProgressProps {
  started: boolean;
  currentStage: StageId;
}

/** The "Follow Food" stage pills and caption; they sit with the controls, beside / under the sticky stage. */
export function JourneyProgress({ started, currentStage }: JourneyProgressProps) {
  const stage = STAGES.find((s) => s.id === currentStage)!;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-label uppercase tracking-[0.2em] text-subject-biology">Follow Food</p>

      <ol className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
        {STAGES.map((s, i) => (
          <li key={s.id} className="flex items-center gap-1.5">
            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                started && (s.id === currentStage || i < STAGES.findIndex((x) => x.id === currentStage))
                  ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
                  : "border-ink/10 text-ink-soft/70 dark:border-bone/15 dark:text-bone-soft/60",
              )}
            >
              {s.label}
            </span>
            {i < STAGES.length - 1 ? <span className="text-ink-soft/40 dark:text-bone-soft/40">→</span> : null}
          </li>
        ))}
      </ol>

      <p className="mt-3 min-h-[2.5rem] text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        {started ? stage.caption : "Press Start Journey to follow a bite of food through the digestive system."}
      </p>
    </div>
  );
}
