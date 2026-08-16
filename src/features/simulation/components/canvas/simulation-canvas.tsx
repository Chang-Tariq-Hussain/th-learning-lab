"use client";

import { useEffect, useRef } from "react";
import { useSimulation } from "../../context/simulation-context";
import { useCanvasViewport } from "../../context/canvas-viewport-context";
import { useCanvas } from "../../hooks/use-canvas";
import { drawAxes, drawGrid } from "../../utils/canvas-utils";
import { cn } from "@/lib/utils";
import type { CanvasSize, FrameInfo, ParameterValues, Viewport } from "../../types";

export interface SimulationCanvasRenderInfo {
  frame: FrameInfo;
  size: CanvasSize;
  viewport: Viewport;
  values: ParameterValues;
}

export interface SimulationCanvasProps {
  /**
   * Imperative draw callback, invoked on every animation frame (and once
   * more whenever parameters/viewport change while paused, so the canvas
   * never looks stale). The framework has already cleared the canvas and
   * drawn the optional grid/axes before this runs; draw simulation-specific
   * content in canvas pixel coordinates, or use `worldToScreen` from
   * `canvas-utils` to place things in world space.
   */
  render: (ctx: CanvasRenderingContext2D, info: SimulationCanvasRenderInfo) => void;
  showGrid?: boolean;
  showAxes?: boolean;
  gridSpacing?: number;
  className?: string;
  /** Accessible label for the canvas region, e.g. "Projectile trajectory view". */
  ariaLabel?: string;
}

/**
 * The reusable drawing surface. Handles device-pixel-ratio scaling,
 * responsive resizing, pan/zoom (mouse + touch via Pointer Events, shared
 * with `ZoomControls` via `CanvasViewportProvider`), and an optional
 * grid/axes background — a concrete simulation supplies only a `render`
 * callback and never touches the canvas element, context lifecycle, or
 * resize/DPR handling directly.
 */
export function SimulationCanvas({
  render,
  showGrid = true,
  showAxes = false,
  gridSpacing = 40,
  className,
  ariaLabel = "Simulation view",
}: SimulationCanvasProps) {
  const { canvasRef, containerRef, size, getContext } = useCanvas();
  const { viewport, handlers, isPanning } = useCanvasViewport();
  const { subscribeFrame, values, status, time, frameCount } = useSimulation();

  const renderRef = useRef(render);
  renderRef.current = render;
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const draw = (frame: FrameInfo) => {
    const ctx = getContext();
    if (!ctx) return;
    ctx.clearRect(0, 0, size.width, size.height);

    if (showGrid) drawGrid(ctx, size, viewportRef.current, { spacing: gridSpacing });
    if (showAxes) drawAxes(ctx, size, viewportRef.current);

    renderRef.current(ctx, {
      frame,
      size,
      viewport: viewportRef.current,
      values: valuesRef.current,
    });
  };
  const drawRef = useRef(draw);
  drawRef.current = draw;

  // Hook into the shared animation loop rather than starting a second one.
  useEffect(() => {
    return subscribeFrame((frame) => drawRef.current(frame));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribeFrame]);

  // Redraw once on parameter/viewport/size/resize changes even while
  // paused, so adjusting a slider is reflected immediately.
  useEffect(() => {
    if (status === "playing") return;
    drawRef.current({ time, deltaTime: 0, frameCount });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, viewport, size.width, size.height, status]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel}
      className={cn(
        "relative min-h-[280px] w-full overflow-hidden rounded-lg border border-line bg-white/40 dark:border-line-dark dark:bg-white/[0.02]",
        isPanning ? "cursor-grabbing" : "cursor-grab",
        className
      )}
    >
      <canvas ref={canvasRef} className="block h-full w-full touch-none" {...handlers} />
    </div>
  );
}
