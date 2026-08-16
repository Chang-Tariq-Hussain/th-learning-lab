/**
 * Slope of a Line — data model.
 *
 * Reuses the shared coordinate math (grid bounds, pixel<->world
 * conversion) from Coordinate Plane Explorer's `coordinate-model.ts`,
 * same pattern as Distance Between Two Points and Midpoint of a Line
 * Segment. This file adds only what's specific to this activity:
 * rise/run/slope calculation, the four slope-type presets (positive,
 * negative, zero, undefined), and the Calculate-mode question bank.
 */

export interface SlopePoint {
  x: number;
  y: number;
}

export const DEFAULT_A: SlopePoint = { x: 2, y: 2 };
export const DEFAULT_B: SlopePoint = { x: 6, y: 6 };

export function run(a: SlopePoint, b: SlopePoint): number {
  return b.x - a.x;
}

export function rise(a: SlopePoint, b: SlopePoint): number {
  return b.y - a.y;
}

/** Returns null when run is 0 — an undefined (vertical) slope, not a divide-by-zero error. */
export function slope(a: SlopePoint, b: SlopePoint): number | null {
  const r = run(a, b);
  if (r === 0) return null;
  return rise(a, b) / r;
}

export function formatSlope(m: number | null): string {
  if (m === null) return "undefined";
  return Number.isInteger(m) ? String(m) : m.toFixed(2);
}

export type SlopeType = "positive" | "negative" | "zero" | "undefined";

export function slopeType(a: SlopePoint, b: SlopePoint): SlopeType {
  const m = slope(a, b);
  if (m === null) return "undefined";
  if (m > 0) return "positive";
  if (m < 0) return "negative";
  return "zero";
}

export const SLOPE_TYPE_INFO: Record<SlopeType, { label: string; arrow: string; message: string }> = {
  positive: { label: "Positive slope", arrow: "↗", message: "As x increases, y also increases." },
  negative: { label: "Negative slope", arrow: "↘", message: "As x increases, y decreases." },
  zero: { label: "Zero slope", arrow: "→", message: "A horizontal line has zero slope." },
  undefined: { label: "Undefined slope", arrow: "↑", message: "Run is 0, so the slope is undefined." },
};

// --- Slope-type selector presets ------------------------------------------

export const SLOPE_PRESETS: Record<SlopeType, { a: SlopePoint; b: SlopePoint }> = {
  positive: { a: { x: 1, y: 1 }, b: { x: 5, y: 5 } },
  negative: { a: { x: 1, y: 5 }, b: { x: 5, y: 1 } },
  zero: { a: { x: 2, y: 4 }, b: { x: 8, y: 4 } },
  undefined: { a: { x: 4, y: 2 }, b: { x: 4, y: 8 } },
};

// --- Calculate mode: multiple-choice questions ---------------------------

export interface CalculateQuestion {
  a: SlopePoint;
  b: SlopePoint;
  options: number[];
  correct: number;
}

export const CALCULATE_QUESTIONS: CalculateQuestion[] = [
  { a: { x: 1, y: 2 }, b: { x: 4, y: 8 }, options: [1, 2, 3], correct: 2 },
  { a: { x: 2, y: 5 }, b: { x: 6, y: 1 }, options: [-1, 1, 4], correct: -1 },
  { a: { x: 0, y: 0 }, b: { x: 3, y: 6 }, options: [1, 2, 3], correct: 2 },
];
