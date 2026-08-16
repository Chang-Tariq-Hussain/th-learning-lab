/**
 * Core types for the simulation framework.
 *
 * These types are intentionally domain-agnostic — nothing here mentions
 * physics, chemistry, biology, or mathematics specifically. A concrete
 * simulation (e.g. "Projectile Motion") plugs its own parameter list,
 * update function, and render function into these shapes.
 */

// ---------------------------------------------------------------------------
// Parameters
// ---------------------------------------------------------------------------

/** Units are stored as free text so any domain can express its own. */
export type ParameterUnit = string;

export interface ParameterDefinition {
  /** Unique key, used as the field name in the parameters record. */
  key: string;
  /** Human-readable label, e.g. "Gravity" */
  label: string;
  /** Short helper text shown in a tooltip. */
  description?: string;
  unit?: ParameterUnit;
  min: number;
  max: number;
  step?: number;
  defaultValue: number;
  /** Render as a slider, a number input, or both together (default). */
  control?: "slider" | "number" | "both";
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectParameterDefinition {
  key: string;
  label: string;
  description?: string;
  options: SelectOption[];
  defaultValue: string;
}

/** A simulation's full parameter schema: numeric sliders + select dropdowns. */
export interface ParameterSchema {
  numeric?: ParameterDefinition[];
  select?: SelectParameterDefinition[];
}

/** Live parameter values, keyed by ParameterDefinition["key"]. */
export type ParameterValues = Record<string, number | string>;

// ---------------------------------------------------------------------------
// Playback / engine
// ---------------------------------------------------------------------------

export type PlaybackStatus = "idle" | "playing" | "paused" | "finished";

export const SPEED_MULTIPLIERS = [0.25, 0.5, 1, 2, 5, 10] as const;
export type SpeedMultiplier = (typeof SPEED_MULTIPLIERS)[number];

export interface FrameInfo {
  /** Seconds elapsed in simulation time (affected by speed multiplier). */
  time: number;
  /** Seconds elapsed since the previous frame (already speed-scaled). */
  deltaTime: number;
  /** Number of frames rendered since the simulation was last reset. */
  frameCount: number;
}

/** Callback a simulation provides to advance its own state by one tick. */
export type SimulationUpdateFn = (frame: FrameInfo, params: ParameterValues) => void;

// ---------------------------------------------------------------------------
// Canvas / coordinate space
// ---------------------------------------------------------------------------

export interface Point2D {
  x: number;
  y: number;
}

export interface Viewport {
  /** Pan offset in world units. */
  offset: Point2D;
  /** Zoom factor; 1 = 100%. */
  zoom: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}

// ---------------------------------------------------------------------------
// Charts
// ---------------------------------------------------------------------------

export interface ChartPoint {
  x: number;
  y: number;
  /** Optional series label, for multi-series charts. */
  series?: string;
}

export interface ChartSeries {
  id: string;
  label: string;
  color: string;
  data: ChartPoint[];
}

// ---------------------------------------------------------------------------
// Formulas
// ---------------------------------------------------------------------------

export interface FormulaVariable {
  symbol: string;
  meaning: string;
  unit?: string;
}
