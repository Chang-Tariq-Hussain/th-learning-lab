"use client";

import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GanttSegment } from "../model";

const PROCESS_COLORS = [
  "bg-sky-500/80 dark:bg-sky-400/70",
  "bg-amber-500/80 dark:bg-amber-400/70",
  "bg-emerald-500/80 dark:bg-emerald-400/70",
  "bg-violet-500/80 dark:bg-violet-400/70",
  "bg-rose-500/80 dark:bg-rose-400/70",
  "bg-cyan-500/80 dark:bg-cyan-400/70",
];

export function colorForProcess(processId: string, order: string[]): string {
  const index = order.indexOf(processId);
  return PROCESS_COLORS[index >= 0 ? index % PROCESS_COLORS.length : 0]!;
}

export interface GanttChartProps {
  segments: GanttSegment[];
  processOrder: string[];
  totalTime: number;
  /** Current playback time, in the same time units as the schedule. `null` before starting. */
  currentTime: number | null;
  isPlaying: boolean;
  isFinished: boolean;
  onPlayPause: () => void;
  onStep: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  className?: string;
}

const SPEED_OPTIONS = [0.5, 1, 2, 4];

/**
 * Renders the schedule as a horizontal timeline of blocks (the
 * classic "| P1 | P2 | P3 |" Gantt chart), with playback controls
 * that step a shared `currentTime` forward. The block under
 * `currentTime` is highlighted so stepping through visibly connects
 * to "which segment am I looking at right now."
 */
export function GanttChart({
  segments,
  processOrder,
  totalTime,
  currentTime,
  isPlaying,
  isFinished,
  onPlayPause,
  onStep,
  onReset,
  speed,
  onSpeedChange,
  className,
}: GanttChartProps) {
  const span = Math.max(1, totalTime);
  const activeIndex =
    currentTime === null
      ? -1
      : segments.findIndex((s) => currentTime >= s.start && currentTime < s.end);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div role="img" aria-label="CPU scheduling Gantt chart" className="overflow-x-auto">
        <div className="flex h-14 min-w-[420px] overflow-hidden rounded-md border border-line dark:border-line-dark">
          {segments.map((seg, i) => {
            const width = ((seg.end - seg.start) / span) * 100;
            const isActive = i === activeIndex;
            const isPast = currentTime !== null && currentTime >= seg.end;
            return (
              <div
                key={`${seg.processId ?? "idle"}-${seg.start}`}
                style={{ width: `${width}%` }}
                className={cn(
                  "flex items-center justify-center border-r border-paper text-xs font-mono font-medium text-white transition-opacity last:border-r-0 dark:border-chalkboard",
                  seg.processId ? colorForProcess(seg.processId, processOrder) : "bg-ink/10 text-ink-soft dark:bg-bone/10 dark:text-bone-soft",
                  isActive && "ring-2 ring-inset ring-ink dark:ring-bone",
                  currentTime !== null && !isPast && !isActive && "opacity-30",
                )}
                title={`${seg.processId ?? "Idle"}: ${seg.start}–${seg.end}`}
              >
                {seg.processId ?? "idle"}
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex min-w-[420px] justify-between font-mono text-[10px] text-ink-soft dark:text-bone-soft">
          <span>0</span>
          <span>{span}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onPlayPause}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-subject-it px-4 text-sm font-medium text-paper hover:opacity-90"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {currentTime === null ? "Play" : isFinished && !isPlaying ? "Replay" : isPlaying ? "Pause" : "Resume"}
        </button>
        <button
          onClick={onStep}
          disabled={isFinished}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-3 text-sm font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
        >
          <StepForward className="h-4 w-4" />
          Step
        </button>
        <button
          onClick={onReset}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-3 text-sm font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        <div className="ml-auto flex items-center gap-1 rounded-full border border-line p-1 dark:border-line-dark">
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={cn(
                "h-8 rounded-full px-2.5 text-xs font-medium",
                speed === s
                  ? "bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                  : "text-ink-soft hover:bg-ink/[0.06] dark:text-bone-soft dark:hover:bg-bone/[0.08]",
              )}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
      <p aria-live="polite" className="font-mono text-xs text-ink-soft dark:text-bone-soft">
        {currentTime === null
          ? "Not started — press Play or Step."
          : `Time: ${currentTime} / ${span}${isFinished ? " · Finished" : ""}`}
      </p>
    </div>
  );
}
