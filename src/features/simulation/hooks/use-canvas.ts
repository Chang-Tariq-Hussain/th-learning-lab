"use client";

import { useEffect, useRef, useState } from "react";
import type { CanvasSize } from "../types";
import { configureCanvasForDPR } from "../utils/canvas-utils";

export interface UseCanvasResult {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  size: CanvasSize;
  /** Re-reads canvas size and returns a fresh 2D context configured for the current DPR. */
  getContext: () => CanvasRenderingContext2D | null;
}

/**
 * Manages a canvas element that fills its parent container and stays
 * crisp at any device pixel ratio, resizing automatically via
 * ResizeObserver. Drawing logic itself lives in the simulation's own
 * render function, invoked from `useAnimation`'s `onTick`.
 */
export function useCanvas(): UseCanvasResult {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<CanvasSize>({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const getContext = (): CanvasRenderingContext2D | null => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0 || size.height === 0) return null;
    return configureCanvasForDPR(canvas, size);
  };

  return { canvasRef, containerRef, size, getContext };
}
