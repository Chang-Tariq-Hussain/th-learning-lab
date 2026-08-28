"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SimulationProvider } from "../../context/simulation-context";
import { SimulationSurfaceProvider } from "../../context/surface-context";
import { CanvasViewportProvider } from "../../context/canvas-viewport-context";
import { useSimulationDensity } from "../../context/density-context";
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
  const density = useSimulationDensity();

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
          "flex flex-col rounded-card border border-line bg-paper outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-line-dark dark:bg-chalkboard",
          // "compact" (set via `SimulationDensityProvider`, see
          // `ExperimentFrame`) is for a simulation nested inside
          // another already-padded card — Predict/Challenge, not
          // Explore's own large/dedicated area. Every step here stays
          // strictly ≤ the "default" step at the same breakpoint, so
          // a nested simulation never gets *more* padding than the
          // full presentation, only ever less. Padding still grows
          // back at `lg` even when compact, since a nested simulation
          // isn't short on room on a wide screen — only mobile/tablet
          // actually need the space back (fullscreen mode always gets
          // the roomy values regardless, since it's never "nested").
          density === "compact" && !isFullscreen
            ? "gap-3 p-2 sm:gap-4 sm:p-4 lg:p-6"
            : "gap-4 p-4 sm:p-6",
          isFullscreen && "h-screen w-screen overflow-y-auto",
          className
        )}
      >
        {children}
      </div>
    </SimulationSurfaceProvider>
  );
}
