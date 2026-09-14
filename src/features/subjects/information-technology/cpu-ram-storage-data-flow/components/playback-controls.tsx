"use client";

import { Play, Pause, RotateCcw, StepForward } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlaySpeed, StepPlayer } from "../hooks/use-step-player";

const SPEEDS: PlaySpeed[] = [0.5, 1, 1.5, 2];

export function PlaybackControls({ player }: { player: StepPlayer }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={player.playPause}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-subject-it px-5 text-sm font-medium text-paper hover:opacity-90"
      >
        {player.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {player.playLabel}
      </button>
      <button
        onClick={player.stepForward}
        disabled={player.isFinished}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
      >
        <StepForward className="h-4 w-4" />
        Step
      </button>
      <button
        onClick={player.reset}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </button>
      <div className="ml-auto flex items-center gap-1 rounded-full border border-line p-1 dark:border-line-dark" role="group" aria-label="Playback speed">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => player.setSpeed(s)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              player.speed === s
                ? "bg-subject-it text-paper"
                : "text-ink-soft hover:bg-ink/5 dark:text-bone-soft dark:hover:bg-bone/10"
            )}
          >
            {s}×
          </button>
        ))}
      </div>
    </div>
  );
}
