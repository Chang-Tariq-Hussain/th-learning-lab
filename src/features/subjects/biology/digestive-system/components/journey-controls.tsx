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
  currentStage: StageId;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function JourneyControls({
  running,
  started,
  complete,
  currentStage,
  onStart,
  onPause,
  onReset,
}: JourneyControlsProps) {
  const stage = STAGES.find((s) => s.id === currentStage)!;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        Follow Food
      </p>

      <ol className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
        {STAGES.map((s, i) => (
          <li key={s.id} className="flex items-center gap-1.5">
            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                started &&
                  (s.id === currentStage ||
                    i < STAGES.findIndex((x) => x.id === currentStage))
                  ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
                  : "border-ink/10 text-ink-soft/70 dark:border-bone/15 dark:text-bone-soft/60",
              )}
            >
              {s.label}
            </span>
            {i < STAGES.length - 1 ? (
              <span className="text-ink-soft/40 dark:text-bone-soft/40">→</span>
            ) : null}
          </li>
        ))}
      </ol>

      <p className="mt-3 min-h-[2.5rem] text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        {started
          ? stage.caption
          : "Press Start Journey to follow a bite of food through the digestive system."}
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        {running ? (
          <Button variant="secondary" size="md" onClick={onPause}>
            <Pause className="h-4 w-4" strokeWidth={1.75} />
            Pause
          </Button>
        ) : (
          <Button variant="primary" size="md" onClick={onStart}>
            <Play className="h-4 w-4" strokeWidth={1.75} />
            {complete
              ? "Restart Journey"
              : started
                ? "Resume"
                : "Start Journey"}
          </Button>
        )}
        <Button variant="ghost" size="md" onClick={onReset}>
          <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
          Reset
        </Button>
      </div>
    </div>
  );
}
