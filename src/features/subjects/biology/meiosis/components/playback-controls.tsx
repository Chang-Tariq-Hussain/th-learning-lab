"use client";

import { ChevronLeft, ChevronRight, Footprints, Pause, Play, RotateCcw, Shuffle, SkipBack, SkipForward, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SPEEDS, type Speed } from "../hooks/use-beat-timeline";

export interface PlaybackControlsProps {
  playing: boolean;
  atStart: boolean;
  atEnd: boolean;
  stepMode: boolean;
  speed: Speed;
  showLabels: boolean;
  disabled?: boolean;
  onPlayPause: () => void;
  onStep: (d: 1 | -1) => void;
  onStage: (d: 1 | -1) => void;
  onRestart: () => void;
  onStepMode: () => void;
  onSpeed: (s: Speed) => void;
  onLabels: () => void;
  onNewCell: () => void;
}

const iconBtn = "px-3 sm:px-3.5";

/** Transport controls. Icons always have a text label for assistive tech; text shows from `sm`. */
export function PlaybackControls(p: PlaybackControlsProps) {
  const off = p.disabled;
  return (
    <div className="flex w-full flex-col items-center gap-2" role="group" aria-label="Simulation controls">
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <Button variant="ghost" size="md" className={iconBtn} onClick={() => p.onStage(-1)} disabled={off || p.atStart} aria-label="Previous stage" title="Previous stage (Shift+Left)" data-testid="prev-stage">
          <SkipBack className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </Button>
        <Button variant="secondary" size="md" className={iconBtn} onClick={() => p.onStep(-1)} disabled={off || p.atStart} aria-label="Step back" title="Step back (Left)" data-testid="step-back">
          <ChevronLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </Button>
        <Button variant="primary" size="md" onClick={p.onPlayPause} disabled={off || (p.atEnd && !p.playing)} data-testid="play-pause" aria-label={p.playing ? "Pause" : p.stepMode ? "Play one step" : "Play"} title="Play / pause (Space)">
          {p.playing ? <Pause className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> : <Play className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
          <span>{p.playing ? "Pause" : p.stepMode ? "Play step" : p.atStart ? "Start" : "Play"}</span>
        </Button>
        <Button variant="secondary" size="md" className={iconBtn} onClick={() => p.onStep(1)} disabled={off || p.atEnd} aria-label="Step forward" title="Step forward (Right)" data-testid="step-forward">
          <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="md" className={iconBtn} onClick={() => p.onStage(1)} disabled={off || p.atEnd} aria-label="Next stage" title="Next stage (Shift+Right)" data-testid="next-stage">
          <SkipForward className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="md" className={iconBtn} onClick={p.onRestart} disabled={off} aria-label="Restart" title="Restart (R)" data-testid="restart">
          <RotateCcw className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          <span className="hidden sm:inline">Restart</span>
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <div role="radiogroup" aria-label="Animation speed" className="flex items-center rounded-full border border-line p-0.5 dark:border-line-dark">
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={p.speed === s}
              onClick={() => p.onSpeed(s)}
              data-speed={s}
              className={cn(
                "min-h-9 min-w-10 rounded-full px-2 text-xs font-medium tabular-nums focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone",
                p.speed === s ? "bg-subject-biology text-white dark:text-chalkboard" : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone",
              )}
            >
              {s}×
            </button>
          ))}
        </div>
        <Button size="sm" variant={p.stepMode ? "secondary" : "ghost"} onClick={p.onStepMode} aria-pressed={p.stepMode} data-testid="step-mode" disabled={off} title="Step-by-step mode: Play advances one step at a time">
          <Footprints className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          Step-by-step
        </Button>
        <Button size="sm" variant={p.showLabels ? "secondary" : "ghost"} onClick={p.onLabels} aria-pressed={p.showLabels} data-testid="labels-toggle" title="Labels (L)">
          <Tag className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          Labels
        </Button>
        <Button size="sm" variant="ghost" onClick={p.onNewCell} disabled={off} data-testid="new-cell" title="Run a different random meiosis">
          <Shuffle className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          New cell
        </Button>
      </div>
    </div>
  );
}
