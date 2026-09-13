"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { BOOT_STAGES, type BootStageId } from "../model";

export interface StageTimelineProps {
  /** Highest stage order reached so far (-1 = not started). */
  reachedOrder: number;
  activeStageId: BootStageId | null;
  onSelectStage: (id: BootStageId) => void;
}

/** Horizontal (wrapping) progress timeline: completed stages show a
 *  checkmark and stay visible, the active stage is highlighted, and
 *  every stage — reached or not — is clickable so a student can freely
 *  inspect what any stage does, independent of playback position. */
export function StageTimeline({ reachedOrder, activeStageId, onSelectStage }: StageTimelineProps) {
  return (
    <ol className="flex flex-wrap gap-2" aria-label="Boot sequence timeline">
      {BOOT_STAGES.map((stage) => {
        const isCompleted = stage.order < reachedOrder;
        const isActive = stage.id === activeStageId;
        return (
          <li key={stage.id}>
            <button
              onClick={() => onSelectStage(stage.id)}
              aria-current={isActive ? "step" : undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "border-subject-it bg-subject-it text-paper"
                  : isCompleted
                    ? "border-subject-it/50 bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                    : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
              )}
            >
              {isCompleted && !isActive && <Check className="h-3 w-3" />}
              <span className="font-mono">{stage.order + 1}.</span>
              {stage.shortLabel}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
