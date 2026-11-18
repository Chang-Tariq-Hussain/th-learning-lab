"use client";

import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SPEEDS, type Speed } from "../meiosis/hooks/use-beat-timeline";

export interface TransportProps {
  playing: boolean;
  atStart: boolean;
  atEnd: boolean;
  speed: Speed;
  onPlayPause: () => void;
  onStep: (d: 1 | -1) => void;
  onRestart: () => void;
  onSpeed: (s: Speed) => void;
  extra?: React.ReactNode;
}

/** Compact play / step / restart / speed bar shared by the three labs (same look as the Mitosis and Meiosis transport). */
export function Transport(p: TransportProps) {
  return (
    <div className="flex w-full flex-col items-center gap-2" role="group" aria-label="Animation controls">
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <Button variant="secondary" size="md" className="px-3" onClick={() => p.onStep(-1)} disabled={p.atStart} aria-label="Step back" title="Step back (Left)" data-testid="step-back">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button variant="primary" size="md" onClick={p.onPlayPause} disabled={p.atEnd && !p.playing} data-testid="play-pause" aria-label={p.playing ? "Pause" : "Play"} title="Play / pause (Space)">
          {p.playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          <span>{p.playing ? "Pause" : p.atStart ? "Start" : "Play"}</span>
        </Button>
        <Button variant="secondary" size="md" className="px-3" onClick={() => p.onStep(1)} disabled={p.atEnd} aria-label="Step forward" title="Step forward (Right)" data-testid="step-forward">
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="md" className="px-3" onClick={p.onRestart} aria-label="Restart" title="Restart (R)" data-testid="restart">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
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
              className={cn("min-h-9 min-w-10 rounded-full px-2 text-xs font-medium tabular-nums focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone", p.speed === s ? "bg-subject-biology text-white dark:text-chalkboard" : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone")}
            >
              {s}×
            </button>
          ))}
        </div>
        {p.extra}
      </div>
    </div>
  );
}

/** Numbered, clickable progress strip: one pill per beat, the current one highlighted, completed ones filled. */
export function StepStrip({ steps, beat, onGo, label }: { steps: string[]; beat: number; onGo: (i: number) => void; label: string }) {
  return (
    <ol className="flex flex-wrap gap-1" aria-label={label} data-testid="step-strip">
      {steps.map((s, i) => (
        <li key={`${i}-${s}`}>
          <button
            type="button"
            onClick={() => onGo(i)}
            aria-current={i === beat ? "step" : undefined}
            data-step={i}
            className={cn(
              "min-h-9 rounded-full border px-2.5 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone",
              i === beat ? "border-subject-biology bg-subject-biology text-white dark:text-chalkboard" : i < beat ? "border-subject-biology/60 bg-subject-biology-soft text-ink dark:bg-subject-biology/15 dark:text-bone" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {i + 1}. {s}
          </button>
        </li>
      ))}
    </ol>
  );
}

/** Keyboard shortcuts shared by the labs: Space play/pause, Left/Right step, R restart. */
export function transportKeys(e: React.KeyboardEvent, a: { playPause: () => void; step: (d: 1 | -1) => void; restart: () => void }) {
  const t = e.target as HTMLElement;
  if (t.closest("input,select,textarea,[role=tab],[role=radio]")) return;
  if (e.key === " " && !t.closest("button,a")) (e.preventDefault(), a.playPause());
  else if (e.key === "ArrowRight" && !e.shiftKey) (e.preventDefault(), a.step(1));
  else if (e.key === "ArrowLeft" && !e.shiftKey) (e.preventDefault(), a.step(-1));
  else if (e.key === "r" || e.key === "R") a.restart();
}
