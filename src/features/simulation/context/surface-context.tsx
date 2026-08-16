"use client";

import { createContext, useContext } from "react";

export interface SimulationSurfaceContextValue {
  /** The DOM node that fullscreen mode and screenshot export both target. */
  containerRef: React.RefObject<HTMLDivElement>;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

const SimulationSurfaceContext =
  createContext<SimulationSurfaceContextValue | null>(null);

export const SimulationSurfaceProvider = SimulationSurfaceContext.Provider;

/**
 * Access the simulation's root DOM node and fullscreen state. Used by
 * `FullscreenButton` and `ExportScreenshotButton`, which both need a
 * reference to the whole simulation surface rather than just the canvas.
 */
export function useSimulationSurface(): SimulationSurfaceContextValue {
  const ctx = useContext(SimulationSurfaceContext);
  if (!ctx) {
    throw new Error(
      "useSimulationSurface() must be used inside a <SimulationContainer>."
    );
  }
  return ctx;
}
