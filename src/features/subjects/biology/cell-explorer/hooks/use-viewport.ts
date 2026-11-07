"use client";

import { useCallback, useMemo, useState } from "react";

/** The scene's own coordinate space. Everything in `scene/` is drawn in these units. */
export const VIEW_W = 640;
export const VIEW_H = 480;

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 1.4;
/** How far past the content edge a drag may go, in scene units. */
const OVERSCROLL = 36;

interface ViewState {
  k: number;
  tx: number;
  ty: number;
}

const FIT: ViewState = { k: 1, tx: 0, ty: 0 };

function clampView(v: ViewState): ViewState {
  const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.k));
  if (k === 1) return FIT;
  const minX = VIEW_W * (1 - k) - OVERSCROLL;
  const minY = VIEW_H * (1 - k) - OVERSCROLL;
  return {
    k,
    tx: Math.min(OVERSCROLL, Math.max(minX, v.tx)),
    ty: Math.min(OVERSCROLL, Math.max(minY, v.ty)),
  };
}

export interface UseViewportResult {
  scale: number;
  /** CSS transform for the content group (user units are px inside an SVG). */
  transform: string;
  isZoomed: boolean;
  canZoomIn: boolean;
  canZoomOut: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  /** Zoom by `factor` keeping the scene point (cx, cy) fixed on screen. */
  zoomAt: (factor: number, cx: number, cy: number) => void;
  /** Pan by a delta in scene units. */
  panBy: (dx: number, dy: number) => void;
  /** Bring a scene point to the middle of the view without changing zoom. */
  centerOn: (x: number, y: number) => void;
  reset: () => void;
}

/**
 * Zoom + pan for the cell stage. Zoom is continuous between fit (1x) and 4x; the view is always clamped so the
 * cell cannot be dragged out of sight. All maths is in scene units; the caller converts pointer pixels.
 */
export function useViewport(): UseViewportResult {
  const [view, setView] = useState<ViewState>(FIT);

  const zoomAt = useCallback((factor: number, cx: number, cy: number) => {
    setView((v) => {
      const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.k * factor));
      if (k === v.k) return v;
      const ratio = k / v.k;
      return clampView({ k, tx: cx - (cx - v.tx) * ratio, ty: cy - (cy - v.ty) * ratio });
    });
  }, []);

  const zoomIn = useCallback(() => zoomAt(ZOOM_STEP, VIEW_W / 2, VIEW_H / 2), [zoomAt]);
  const zoomOut = useCallback(() => zoomAt(1 / ZOOM_STEP, VIEW_W / 2, VIEW_H / 2), [zoomAt]);
  const panBy = useCallback((dx: number, dy: number) => setView((v) => (v.k === 1 ? v : clampView({ ...v, tx: v.tx + dx, ty: v.ty + dy }))), []);
  const centerOn = useCallback(
    (x: number, y: number) => setView((v) => (v.k === 1 ? v : clampView({ ...v, tx: VIEW_W / 2 - v.k * x, ty: VIEW_H / 2 - v.k * y }))),
    [],
  );
  const reset = useCallback(() => setView(FIT), []);

  return useMemo(
    () => ({
      scale: view.k,
      transform: `translate(${view.tx.toFixed(2)}px, ${view.ty.toFixed(2)}px) scale(${view.k.toFixed(3)})`,
      isZoomed: view.k > 1.001,
      canZoomIn: view.k < MAX_ZOOM - 0.001,
      canZoomOut: view.k > MIN_ZOOM + 0.001,
      zoomIn,
      zoomOut,
      zoomAt,
      panBy,
      centerOn,
      reset,
    }),
    [view, zoomIn, zoomOut, zoomAt, panBy, centerOn, reset],
  );
}
