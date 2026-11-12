"use client";

import { Maximize2, Spline, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ViewControlsProps {
  zoom: number;
  showSpindle: boolean;
  onSpindle: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

/** Spindle-fiber toggle and zoom / reset buttons (dragging pans the zoomed picture; Ctrl + wheel and + / - keys also zoom). */
export function ViewControls({ zoom, showSpindle, onSpindle, onZoomIn, onZoomOut, onReset }: ViewControlsProps) {
  return (
    <>
      <Button size="sm" variant={showSpindle ? "secondary" : "ghost"} onClick={onSpindle} aria-pressed={showSpindle} data-testid="spindle-toggle" title="Spindle fibers (S)">
        <Spline className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        Spindle
      </Button>
      <div role="group" aria-label="Zoom" className="flex items-center gap-1">
        <Button size="sm" variant="ghost" onClick={onZoomOut} disabled={zoom <= 1.001} aria-label="Zoom out" title="Zoom out (-)" data-testid="zoom-out">
          <ZoomOut className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </Button>
        <span className="min-w-10 text-center text-xs tabular-nums text-ink-soft dark:text-bone-soft" data-testid="zoom-level" aria-live="polite">
          {zoom.toFixed(1)}×
        </span>
        <Button size="sm" variant="ghost" onClick={onZoomIn} disabled={zoom >= 2.999} aria-label="Zoom in" title="Zoom in (+)" data-testid="zoom-in">
          <ZoomIn className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </Button>
        <Button size="sm" variant="ghost" onClick={onReset} disabled={zoom <= 1.001} aria-label="Reset zoom and position" title="Reset view (0)" data-testid="zoom-reset">
          <Maximize2 className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          <span className="hidden sm:inline">Reset view</span>
        </Button>
      </div>
    </>
  );
}
