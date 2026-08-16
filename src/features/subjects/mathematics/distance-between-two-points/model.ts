/**
 * Distance Between Two Points — data model.
 *
 * Reuses the shared coordinate math (grid bounds, pixel<->world
 * conversion) from Coordinate Plane Explorer's `coordinate-model.ts`.
 * This file adds only what's specific to this activity: Δx/Δy/distance
 * calculation, the Calculate-mode question bank, and the two special
 * case demo pairs (same y, same x).
 */

export interface DistPoint {
  x: number;
  y: number;
}

export const DEFAULT_A: DistPoint = { x: 2, y: 2 };
export const DEFAULT_B: DistPoint = { x: 6, y: 5 };

export function deltaX(a: DistPoint, b: DistPoint): number {
  return b.x - a.x;
}

export function deltaY(a: DistPoint, b: DistPoint): number {
  return b.y - a.y;
}

/** Straight-line distance. Rounded to 2dp for display; exact for perfect squares like 3-4-5. */
export function distance(a: DistPoint, b: DistPoint): number {
  const dx = deltaX(a, b);
  const dy = deltaY(a, b);
  return Math.sqrt(dx * dx + dy * dy);
}

export function formatDistance(d: number): string {
  return Number.isInteger(d) ? String(d) : d.toFixed(2);
}

// --- Calculate mode: multiple-choice questions ---------------------------

export interface CalculateQuestion {
  a: DistPoint;
  b: DistPoint;
  options: number[];
  correct: number;
}

export const CALCULATE_QUESTIONS: CalculateQuestion[] = [
  { a: { x: 1, y: 1 }, b: { x: 4, y: 5 }, options: [4, 5, 7], correct: 5 },
  { a: { x: 0, y: 0 }, b: { x: 3, y: 4 }, options: [3, 4, 5], correct: 5 },
  { a: { x: 1, y: 2 }, b: { x: 1, y: 6 }, options: [3, 4, 5], correct: 4 },
];

// --- Special cases: same y (horizontal) / same x (vertical) --------------

export const HORIZONTAL_CASE: { a: DistPoint; b: DistPoint } = { a: { x: 2, y: 3 }, b: { x: 7, y: 3 } };
export const VERTICAL_CASE: { a: DistPoint; b: DistPoint } = { a: { x: 4, y: 2 }, b: { x: 4, y: 7 } };
