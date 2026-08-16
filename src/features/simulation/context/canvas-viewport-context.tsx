"use client";

import { createContext, useContext } from "react";
import { usePanZoom, type UsePanZoomOptions, type UsePanZoomResult } from "../hooks/use-pan-zoom";

const CanvasViewportContext = createContext<UsePanZoomResult | null>(null);

export interface CanvasViewportProviderProps extends UsePanZoomOptions {
  children: React.ReactNode;
}

/**
 * Owns the pan/zoom viewport for a simulation's canvas, so that
 * `SimulationCanvas` (which draws using the viewport) and `ZoomControls`
 * (which sits in the toolbar, outside the canvas) share one source of
 * truth instead of drifting out of sync.
 *
 * `SimulationContainer` wraps its children in this provider automatically,
 * covering the common case of one canvas per simulation. For a simulation
 * with multiple independent canvases, nest an additional
 * `CanvasViewportProvider` around each one.
 */
export function CanvasViewportProvider({ children, ...options }: CanvasViewportProviderProps) {
  const panZoom = usePanZoom(options);
  return (
    <CanvasViewportContext.Provider value={panZoom}>{children}</CanvasViewportContext.Provider>
  );
}

export function useCanvasViewport(): UsePanZoomResult {
  const ctx = useContext(CanvasViewportContext);
  if (!ctx) {
    throw new Error(
      "useCanvasViewport() must be used inside a <SimulationContainer> (or a manual <CanvasViewportProvider>)."
    );
  }
  return ctx;
}
