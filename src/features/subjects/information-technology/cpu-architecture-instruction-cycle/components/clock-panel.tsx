"use client";

import { cn } from "@/lib/utils";
import { CYCLE_STAGES, STAGE_LABELS, type CycleStage } from "../model";

export interface ClockPanelProps {
  cycle: number;
  stage: CycleStage | undefined;
  className?: string;
}

export function ClockPanel({ cycle, stage, className }: ClockPanelProps) {
  return (
    <div className={cn("rounded-card border border-line bg-paper p-4 dark:border-line-dark dark:bg-chalkboard", className)}>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subject-it">CPU Clock</p>
        <span className="font-mono text-lg font-semibold text-ink dark:text-bone">Cycle {cycle}</span>
      </div>
      <div className="mt-3 flex gap-1.5">
        {CYCLE_STAGES.map((s) => (
          <div
            key={s}
            className={cn(
              "flex-1 rounded-lg border py-1.5 text-center font-mono text-[11px] font-medium",
              stage === s ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {STAGE_LABELS[s]}
          </div>
        ))}
      </div>
    </div>
  );
}
