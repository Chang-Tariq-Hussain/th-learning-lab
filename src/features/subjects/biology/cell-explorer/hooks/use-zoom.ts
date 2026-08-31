"use client";

import { useEffect, useMemo, useState } from "react";

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
  /** True once zoomed in past "fit" — the caller should only wire up
   *  drag-to-pan handlers while this is true; at scale 1 there's
   *  nothing to pan (the whole cell is already in view) and dragging
   *  would only interfere with normal organelle clicks/taps. */
  isPannable: boolean;
  /** Pans the view by a delta already expressed in the shared 400×400
   *  viewBox's own units (not screen pixels) — the caller (typically
   *  `CellIllustration`, which owns the pointer/touch drag handlers
   *  and knows the SVG's on-screen size) is responsible for converting
   *  a pointer-move delta into viewBox units before calling this. */
  panBy: (dx: number, dy: number) => void;
}

const ZOOM_STEPS = [1, 1.5, 2] as const;
const VIEWPORT_CENTER: ZoomPoint = { x: 200, y: 200 };
const VIEWPORT_SIZE = 400;
/** How far past the strict "keep the cell edge on screen" bound a drag
 *  is allowed to go, in viewBox units — matches the small overscroll
 *  feel most pinch-zoom/map apps allow rather than hard-stopping the
 *  drag exactly at the content edge. */
const PAN_OVERSCROLL_MARGIN = 40;

/** Clamps a translate component so the zoomed content can't be
 *  dragged so far that the cell disappears off-screen entirely. */
function clampTranslate(t: number, scale: number): number {
  const min = VIEWPORT_SIZE * (1 - scale) - PAN_OVERSCROLL_MARGIN;
  const max = PAN_OVERSCROLL_MARGIN;
  return Math.min(max, Math.max(min, t));
}

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
 * BUGFIX/ENHANCEMENT — zoomed content used to simply clip at the SVG's
 * own edges with no way to see whatever scrolled out of view; every
 * other app's "pinch/click to zoom" gesture lets you then drag around
 * the zoomed image, so this now also tracks a `pan` offset (on top of
 * the focus-point centering above) that `panBy` nudges and the
 * returned `transform` folds in, clamped so a drag can't lose the cell
 * off-screen. `pan` resets whenever the scale changes or a new
 * organelle is focused, so each zoom/selection starts freshly centered
 * — exactly like before — and the student can then drag from there.
 */
export function useZoom(focusPoint: ZoomPoint | null): UseZoomResult {
  const [stepIndex, setStepIndex] = useState(0);
  const [pan, setPan] = useState<ZoomPoint>({ x: 0, y: 0 });
  const scale = ZOOM_STEPS[stepIndex]!;

  // Reset any manual drag offset whenever the zoom level changes or a
  // newly selected organelle moves the auto-centered focus point —
  // otherwise a drag from the previous view would carry over into a
  // now-unrelated center point.
  useEffect(() => {
    setPan({ x: 0, y: 0 });
  }, [scale, focusPoint?.x, focusPoint?.y]);

  const transform = useMemo(() => {
    if (scale === 1) return "translate(0 0) scale(1)";
    const center = focusPoint ?? VIEWPORT_CENTER;
    const baseTx = VIEWPORT_CENTER.x - scale * center.x;
    const baseTy = VIEWPORT_CENTER.y - scale * center.y;
    const tx = clampTranslate(baseTx + pan.x, scale);
    const ty = clampTranslate(baseTy + pan.y, scale);
    return `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale})`;
  }, [scale, focusPoint, pan]);

  return {
    scale,
    transform,
    zoomIn: () => setStepIndex((i) => Math.min(i + 1, ZOOM_STEPS.length - 1)),
    zoomOut: () => setStepIndex((i) => Math.max(i - 1, 0)),
    reset: () => setStepIndex(0),
    canZoomIn: stepIndex < ZOOM_STEPS.length - 1,
    canZoomOut: stepIndex > 0,
    isPannable: scale > 1,
    panBy: (dx, dy) => {
      if (scale === 1) return;
      setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
    },
  };
}
