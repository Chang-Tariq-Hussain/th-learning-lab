"use client";

import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  min: number;
  max: number;
}

export function ZoomControls({ zoom, onZoomIn, onZoomOut, onReset, min, max }: ZoomControlsProps) {
  return (
    <div
      role="group"
      aria-label="Zoom controls"
      className="flex items-center gap-1 rounded-full border border-line bg-white/70 p-1 shadow-sm dark:border-line-dark dark:bg-chalkboard/70"
    >
      <button
        type="button"
        onClick={onZoomOut}
        disabled={zoom <= min}
        aria-label="Zoom out"
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 dark:text-bone-soft dark:hover:bg-bone/10 dark:hover:text-bone"
      >
        <ZoomOut className="h-4 w-4" strokeWidth={1.75} />
      </button>
      <span className="min-w-[3.5rem] text-center font-mono text-xs text-ink-soft dark:text-bone-soft">
        {Math.round(zoom * 100)}%
      </span>
      <button
        type="button"
        onClick={onZoomIn}
        disabled={zoom >= max}
        aria-label="Zoom in"
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 dark:text-bone-soft dark:hover:bg-bone/10 dark:hover:text-bone"
      >
        <ZoomIn className="h-4 w-4" strokeWidth={1.75} />
      </button>
      <span className="mx-0.5 h-4 w-px bg-line dark:bg-line-dark" aria-hidden="true" />
      <button
        type="button"
        onClick={onReset}
        aria-label="Reset zoom to 100%"
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink dark:text-bone-soft dark:hover:bg-bone/10 dark:hover:text-bone"
      >
        <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
      </button>
    </div>
  );
}
