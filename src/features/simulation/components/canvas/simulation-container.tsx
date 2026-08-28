"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SimulationProvider } from "../../context/simulation-context";
import { SimulationSurfaceProvider } from "../../context/surface-context";
import { CanvasViewportProvider } from "../../context/canvas-viewport-context";
import { usePlayback } from "../../hooks/use-playback";
import { cn } from "@/lib/utils";
import type { ParameterSchema, SimulationUpdateFn, SpeedMultiplier } from "../../types";
import type { UsePanZoomOptions } from "../../hooks/use-pan-zoom";

export interface SimulationContainerProps {
  /** Declarative parameter list — see `ParameterSchema`. */
  schema: ParameterSchema;
  /** Called every animation frame with timing info + live parameter values. */
  onTick?: SimulationUpdateFn;
  initialSpeed?: SpeedMultiplier;
  /** Options for the shared canvas pan/zoom viewport (min/max zoom, etc.). */
  panZoom?: UsePanZoomOptions;
  className?: string;
  children: React.ReactNode;
  /** Accessible name for the whole simulation region, e.g. "Projectile motion simulation". */
  label: string;
}

/**
 * The root wrapper every simulation renders once. It:
 *  - Sets up `SimulationProvider` (playback + parameter state)
 *  - Sets up `CanvasViewportProvider` (shared pan/zoom for canvas + ZoomControls)
 *  - Owns the fullscreen-capable DOM node, via `SimulationSurfaceProvider`
 *  - Wires the standard keyboard shortcuts (Space/R/Arrows/F)
 *
 * A concrete simulation only supplies `schema` + `onTick` and composes
 * the rest of the framework's components as children — it never touches
 * playback state, animation loops, or fullscreen APIs directly.
 */
export function SimulationContainer({
  schema,
  onTick,
  initialSpeed = 1,
  panZoom,
  className,
  children,
  label,
}: SimulationContainerProps) {
  return (
    <SimulationProvider schema={schema} onTick={onTick} initialSpeed={initialSpeed}>
      <CanvasViewportProvider {...panZoom}>
        <SimulationSurface className={className} label={label}>
          {children}
        </SimulationSurface>
      </CanvasViewportProvider>
    </SimulationProvider>
  );
}

function SimulationSurface({
  className,
  children,
  label,
}: {
  className?: string;
  children: React.ReactNode;
  label: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    const node = containerRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      node.requestFullscreen?.();
    }
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    const onChange = () => setIsFullscreen(document.fullscreenElement === node);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const { keyboardProps } = usePlayback({ onToggleFullscreen: toggleFullscreen });

  return (
    <SimulationSurfaceProvider value={{ containerRef, isFullscreen, toggleFullscreen }}>
      <div
        ref={containerRef}
        tabIndex={0}
        role="application"
        aria-label={`${label}. Keyboard shortcuts: space to play or pause, R to reset, arrow keys to step, F for fullscreen.`}
        {...keyboardProps}
        className={cn(
          "flex flex-col gap-4 rounded-card border border-line bg-paper p-4 outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-line-dark dark:bg-chalkboard sm:p-6",
          isFullscreen && "h-screen w-screen overflow-y-auto",
          className
        )}
      >
        {children}
      </div>
    </SimulationSurfaceProvider>
  );
}
