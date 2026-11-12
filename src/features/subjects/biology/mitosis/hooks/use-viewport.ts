"use client";

import { useCallback, useState } from "react";
import { VIEW_H, VIEW_W } from "../engine/beats";

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;

export interface Viewport {
  z: number;
  /** Pan of the view centre, in scene units. */
  px: number;
  py: number;
}

const clampPan = (z: number, px: number, py: number): Viewport => {
  const mx = (VIEW_W - VIEW_W / z) / 2;
  const my = (VIEW_H - VIEW_H / z) / 2;
  return { z, px: Math.min(mx, Math.max(-mx, px)), py: Math.min(my, Math.max(-my, py)) };
};

/** Zoom / pan state of the stage. The picture is an SVG, so this only changes its viewBox. */
export function useViewport() {
  const [view, setView] = useState<Viewport>({ z: 1, px: 0, py: 0 });
  const zoomBy = useCallback((f: number) => setView((v) => clampPan(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.z * f)), v.px, v.py)), []);
  const zoomIn = useCallback(() => zoomBy(1.25), [zoomBy]);
  const zoomOut = useCallback(() => zoomBy(1 / 1.25), [zoomBy]);
  const reset = useCallback(() => setView({ z: 1, px: 0, py: 0 }), []);
  const panBy = useCallback((dx: number, dy: number) => setView((v) => clampPan(v.z, v.px + dx, v.py + dy)), []);
  return { view, zoomIn, zoomOut, reset, panBy, zoomed: view.z > 1.001 };
}
