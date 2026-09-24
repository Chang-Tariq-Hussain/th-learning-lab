"use client";

import { Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlaySpeed, StepPlayer } from "@/features/subjects/information-technology/osi-model-explorer/hooks/use-step-player";
import { Panel } from "@/features/subjects/information-technology/osi-model-explorer/components/ui";

const SPEEDS: PlaySpeed[] = [0.5, 1, 1.5, 2];

const secondaryBtn =
  "inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40";

/**
 * Play / Pause / Step / Back / Reset / Speed controls plus a progress
 * bar, driven by the OSI Model Explorer's `useStepPlayer` hook — the
 * one animation engine both simulations share. Wraps on small screens.
 */
export function PlayerControls({ player, total }: { player: StepPlayer; total: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={player.playPause}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-subject-it px-5 text-sm font-medium text-paper hover:opacity-90"
        >
          {player.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {player.playLabel}
        </button>
        <button onClick={player.stepBack} disabled={player.stepIndex < 0} className={secondaryBtn}>
          <StepBack className="h-4 w-4" />
          Back
        </button>
        <button onClick={player.stepForward} disabled={player.isFinished} className={secondaryBtn}>
          <StepForward className="h-4 w-4" />
          Step
        </button>
        <button onClick={player.reset} className={secondaryBtn}>
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        <div className="flex items-center gap-1 rounded-full border border-line p-1 dark:border-line-dark sm:ml-auto" role="group" aria-label="Playback speed">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => player.setSpeed(s)}
              aria-pressed={player.speed === s}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                player.speed === s ? "bg-subject-it text-paper" : "text-ink-soft hover:bg-ink/5 dark:text-bone-soft dark:hover:bg-bone/10",
              )}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      <Panel title="Step">
        <p className="text-sm text-ink-soft dark:text-bone-soft">
          Step {Math.max(0, player.stepIndex + 1)} of {total}
          {player.stepIndex === -1 && " — not started"}
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-bone/10">
          <div className="h-full rounded-full bg-subject-it transition-all" style={{ width: `${((player.stepIndex + 1) / total) * 100}%` }} />
        </div>
      </Panel>
    </div>
  );
}
