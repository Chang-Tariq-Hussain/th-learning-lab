/**
 * Public API of the simulation framework.
 *
 * This module is intentionally domain-agnostic: nothing under
 * `features/simulation` knows about physics, chemistry, biology, or
 * mathematics. A concrete simulation imports from here, supplies its own
 * `ParameterSchema` + tick/render functions, and composes these pieces —
 * see the README in this folder for a worked example.
 *
 * Import from this file (`@/features/simulation`) rather than reaching
 * into subfolders directly, so the internal file layout can change
 * without breaking simulation code.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type {
  ParameterUnit,
  ParameterDefinition,
  SelectOption,
  SelectParameterDefinition,
  ParameterSchema,
  ParameterValues,
  PlaybackStatus,
  SpeedMultiplier,
  FrameInfo,
  SimulationUpdateFn,
  Point2D,
  Viewport,
  CanvasSize,
  ChartPoint,
  ChartSeries,
  FormulaVariable,
} from "./types";
export { SPEED_MULTIPLIERS } from "./types";

// ---------------------------------------------------------------------------
// State management (context + hooks)
// ---------------------------------------------------------------------------
export { SimulationProvider, useSimulation } from "./context/simulation-context";
export type {
  SimulationContextValue,
  SimulationProviderProps,
} from "./context/simulation-context";

export { useCanvasViewport } from "./context/canvas-viewport-context";
export { useSimulationSurface } from "./context/surface-context";

export { SimulationDensityProvider, useSimulationDensity } from "./context/density-context";
export type { SimulationDensity } from "./context/density-context";

export { useAnimation } from "./hooks/use-animation";
export type { UseAnimationOptions, UseAnimationResult } from "./hooks/use-animation";

export { useCanvas } from "./hooks/use-canvas";
export type { UseCanvasResult } from "./hooks/use-canvas";

export { usePanZoom } from "./hooks/use-pan-zoom";
export type { UsePanZoomOptions, UsePanZoomResult } from "./hooks/use-pan-zoom";

export { usePlayback } from "./hooks/use-playback";
export type { UsePlaybackOptions, UsePlaybackResult } from "./hooks/use-playback";

export { useSimulationParameters } from "./hooks/use-simulation-parameters";
export type { UseSimulationParametersResult } from "./hooks/use-simulation-parameters";

// ---------------------------------------------------------------------------
// Engine & utilities
// ---------------------------------------------------------------------------
export { AnimationEngine } from "./engine/animation-engine";
export type { AnimationEngineOptions } from "./engine/animation-engine";

export { SimulationEventEmitter } from "./utils/event-emitter";
export {
  worldToScreen,
  screenToWorld,
  worldLengthToScreen,
  configureCanvasForDPR,
  drawGrid,
  drawAxes,
} from "./utils/canvas-utils";

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------
export * from "./components/canvas";
export * from "./components/controls";
export * from "./components/panels";
export * from "./components/charts";
export * from "./components/formula";
