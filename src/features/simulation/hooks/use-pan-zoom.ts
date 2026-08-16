"use client";

import { useCallback, useRef, useState } from "react";
import type { Point2D, Viewport } from "../types";

export interface UsePanZoomOptions {
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
  initialOffset?: Point2D;
  /** Disable pan/zoom interaction entirely (e.g. for a static preview). */
  enabled?: boolean;
}

export interface UsePanZoomResult {
  viewport: Viewport;
  isPanning: boolean;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetViewport: () => void;
  /** Spread onto the canvas/container element. */
  handlers: {
    onPointerDown: (event: React.PointerEvent) => void;
    onPointerMove: (event: React.PointerEvent) => void;
    onPointerUp: (event: React.PointerEvent) => void;
    onPointerLeave: (event: React.PointerEvent) => void;
    onWheel: (event: React.WheelEvent) => void;
  };
}

/**
 * Mouse + touch pan/zoom for `SimulationCanvas`. Pointer Events cover both
 * mouse and touch input in one code path, so no separate touch handling
 * is needed.
 */
export function usePanZoom({
  minZoom = 0.25,
  maxZoom = 4,
  initialZoom = 1,
  initialOffset = { x: 0, y: 0 },
  enabled = true,
}: UsePanZoomOptions = {}): UsePanZoomResult {
  const [viewport, setViewport] = useState<Viewport>({
    zoom: initialZoom,
    offset: initialOffset,
  });
  const [isPanning, setIsPanning] = useState(false);
  const lastPointer = useRef<Point2D | null>(null);

  const clampZoom = useCallback(
    (zoom: number) => Math.min(maxZoom, Math.max(minZoom, zoom)),
    [minZoom, maxZoom]
  );

  const setZoom = useCallback(
    (zoom: number) => {
      setViewport((prev) => ({ ...prev, zoom: clampZoom(zoom) }));
    },
    [clampZoom]
  );

  const zoomIn = useCallback(
    () => setViewport((prev) => ({ ...prev, zoom: clampZoom(prev.zoom * 1.25) })),
    [clampZoom]
  );

  const zoomOut = useCallback(
    () => setViewport((prev) => ({ ...prev, zoom: clampZoom(prev.zoom / 1.25) })),
    [clampZoom]
  );

  const resetViewport = useCallback(() => {
    setViewport({ zoom: initialZoom, offset: initialOffset });
  }, [initialZoom, initialOffset]);

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (!enabled) return;
      (event.target as Element).setPointerCapture?.(event.pointerId);
      lastPointer.current = { x: event.clientX, y: event.clientY };
      setIsPanning(true);
    },
    [enabled]
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!enabled || !lastPointer.current) return;
      const dx = event.clientX - lastPointer.current.x;
      const dy = event.clientY - lastPointer.current.y;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      setViewport((prev) => ({
        ...prev,
        offset: { x: prev.offset.x + dx, y: prev.offset.y + dy },
      }));
    },
    [enabled]
  );

  const endPan = useCallback(() => {
    lastPointer.current = null;
    setIsPanning(false);
  }, []);

  const onWheel = useCallback(
    (event: React.WheelEvent) => {
      if (!enabled) return;
      event.preventDefault();
      const direction = event.deltaY > 0 ? -1 : 1;
      setViewport((prev) => ({
        ...prev,
        zoom: clampZoom(prev.zoom * (1 + direction * 0.08)),
      }));
    },
    [enabled, clampZoom]
  );

  return {
    viewport,
    isPanning,
    setZoom,
    zoomIn,
    zoomOut,
    resetViewport,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endPan,
      onPointerLeave: endPan,
      onWheel,
    },
  };
}
