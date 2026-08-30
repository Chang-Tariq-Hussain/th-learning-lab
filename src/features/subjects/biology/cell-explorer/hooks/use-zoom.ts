"use client";

import { useMemo, useState } from "react";

export interface ZoomPoint {
  x: number;
  y: number;
}

export interface UseZoomResult {
  scale: number;
  transform: string;
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

const ZOOM_STEPS = [1, 1.5, 2] as const;
const VIEWPORT_CENTER: ZoomPoint = { x: 200, y: 200 };

/**
 * TASK 8 SCOPE — three fixed zoom steps (fit / 1.5x / 2x), matching
 * the plan's "2 steps: fit -> 1.5x -> 2x" spec, rather than continuous
 * pinch/scroll zoom. Deliberately isolated from selection state (it
 * only *reads* `focusPoint`, which the caller derives from whatever's
 * currently selected) so this hook has no idea what an "organelle" is
 * and doesn't need to change if the selection model ever does.
 *
 * Zooming in re-centers on `focusPoint` (in the SVG's own 400x400
 * viewBox coordinates) rather than the cell's geometric center, so
 * zooming actually brings whatever a student just clicked into view.
 * The math: applying `translate(tx, ty) scale(s)` to a group maps a
 * point p to `s * p + t`. Solving `s * focusPoint + t = viewportCenter`
 * for t centers focusPoint on screen at the new scale. At scale 1
 * (fit) the translation is forced to zero regardless of focusPoint,
 * so switching back to "fit" always shows the whole cell, never a
 * lingering offset from the last zoom.
 *
 * Consumers apply the returned `transform` string to a `<g>` wrapping
 * the whole cell inside the *existing* viewBox — content simply clips
 * at the SVG's own edges when zoomed in, which reads as a magnifier
 * rather than needing a separate pan/scroll affordance.
 */
export function useZoom(focusPoint: ZoomPoint | null): UseZoomResult {
  const [stepIndex, setStepIndex] = useState(0);
  const scale = ZOOM_STEPS[stepIndex]!;

  const transform = useMemo(() => {
    if (scale === 1) return "translate(0 0) scale(1)";
    const center = focusPoint ?? VIEWPORT_CENTER;
    const tx = VIEWPORT_CENTER.x - scale * center.x;
    const ty = VIEWPORT_CENTER.y - scale * center.y;
    return `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale})`;
  }, [scale, focusPoint]);

  return {
    scale,
    transform,
    zoomIn: () => setStepIndex((i) => Math.min(i + 1, ZOOM_STEPS.length - 1)),
    zoomOut: () => setStepIndex((i) => Math.max(i - 1, 0)),
    reset: () => setStepIndex(0),
    canZoomIn: stepIndex < ZOOM_STEPS.length - 1,
    canZoomOut: stepIndex > 0,
  };
}
