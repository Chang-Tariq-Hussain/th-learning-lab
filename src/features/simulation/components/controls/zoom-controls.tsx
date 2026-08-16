"use client";

import { Minus, Plus, Scan } from "lucide-react";
import { useCanvasViewport } from "../../context/canvas-viewport-context";
import { cn } from "@/lib/utils";

const buttonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-ink/[0.04] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:text-bone-soft dark:hover:bg-bone/[0.06] dark:hover:text-bone";

export function ZoomControls({ className }: { className?: string }) {
  const { zoomIn, zoomOut, resetViewport, viewport } = useCanvasViewport();

  return (
    <div
      role="group"
      aria-label="Zoom"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-ink/10 px-1 dark:border-bone/15",
        className
      )}
    >
      <button type="button" onClick={zoomOut} aria-label="Zoom out" className={buttonClass}>
        <Minus className="h-3.5 w-3.5" strokeWidth={1.75} />
      </button>
      <span className="min-w-[3.5ch] text-center font-mono text-xs text-ink-soft dark:text-bone-soft">
        {Math.round(viewport.zoom * 100)}%
      </span>
      <button type="button" onClick={zoomIn} aria-label="Zoom in" className={buttonClass}>
        <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        onClick={resetViewport}
        aria-label="Reset zoom and pan"
        title="Reset view"
        className={buttonClass}
      >
        <Scan className="h-3.5 w-3.5" strokeWidth={1.75} />
      </button>
    </div>
  );
}
