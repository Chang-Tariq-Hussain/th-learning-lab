"use client";

import { cn } from "@/lib/utils";
import type { PlaySpeed, StepPlayer } from "../hooks/use-step-player";

const SPEEDS: PlaySpeed[] = [0.5, 1, 1.5, 2];

export interface PlaybackControlsProps {
  player: StepPlayer;
  totalSteps: number;
  className?: string;
}

export function PlaybackControls({ player, totalSteps, className }: PlaybackControlsProps) {
  const disabled = totalSteps === 0;
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="flex items-center gap-1.5">
        <button
          onClick={player.stepBackward}
          disabled={disabled || player.stepIndex <= -1}
          className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-ink/30 disabled:opacity-40 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30"
        >
          ◂ Back
        </button>
        <button
          onClick={player.playPause}
          disabled={disabled}
          className="rounded-full border border-subject-it bg-subject-it-soft px-4 py-1.5 text-xs font-semibold text-subject-it transition-colors disabled:opacity-40 dark:bg-subject-it/20"
        >
          {player.isPlaying ? "Pause" : player.playLabel}
        </button>
        <button
          onClick={player.stepForward}
          disabled={disabled || player.isFinished}
          className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-ink/30 disabled:opacity-40 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30"
        >
          Step ▸
        </button>
        <button
          onClick={player.reset}
          disabled={disabled}
          className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-ink/30 disabled:opacity-40 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30"
        >
          Reset
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Speed:</span>
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => player.setSpeed(s)}
            className={cn(
              "rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium",
              player.speed === s ? "border-ink dark:border-bone" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {s}×
          </button>
        ))}
      </div>

      <span className="font-mono text-[11px] text-ink-soft dark:text-bone-soft">
        {player.stepIndex >= 0 ? player.stepIndex + 1 : 0} / {totalSteps}
      </span>
    </div>
  );
}
