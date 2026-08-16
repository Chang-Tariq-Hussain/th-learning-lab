/**
 * Midpoint of a Line Segment — data model.
 *
 * Reuses the shared coordinate math (grid bounds, pixel<->world
 * conversion) from Coordinate Plane Explorer's `coordinate-model.ts`,
 * same pattern as Distance Between Two Points. This file adds only
 * what's specific to this activity: the midpoint formula, the two
 * equal half-distances either side of M, the Calculate-mode question
 * bank, and the horizontal/vertical special-case demo pairs.
 */

export interface MidPoint {
  x: number;
  y: number;
}

export const DEFAULT_A: MidPoint = { x: 2, y: 2 };
export const DEFAULT_B: MidPoint = { x: 8, y: 6 };

/** M = ((x1+x2)/2, (y1+y2)/2). Kept as exact (possibly .5) values — not snapped. */
export function midpoint(a: MidPoint, b: MidPoint): MidPoint {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function distance(p: MidPoint, q: MidPoint): number {
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function formatNumber(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export function formatDistance(d: number): string {
  return Number.isInteger(d) ? String(d) : d.toFixed(2);
}

export function formatPoint(p: MidPoint): string {
  return `(${formatNumber(p.x)}, ${formatNumber(p.y)})`;
}

// --- Calculate mode: multiple-choice questions ---------------------------

export interface CalculateQuestion {
  a: MidPoint;
  b: MidPoint;
  options: MidPoint[];
  correct: MidPoint;
}

export const CALCULATE_QUESTIONS: CalculateQuestion[] = [
  {
    a: { x: 2, y: 2 },
    b: { x: 6, y: 6 },
    options: [
      { x: 4, y: 4 },
      { x: 8, y: 8 },
      { x: 2, y: 4 },
    ],
    correct: { x: 4, y: 4 },
  },
  {
    a: { x: -2, y: 4 },
    b: { x: 4, y: 4 },
    options: [
      { x: 1, y: 4 },
      { x: 1, y: 0 },
      { x: 3, y: 4 },
    ],
    correct: { x: 1, y: 4 },
  },
  {
    a: { x: 0, y: -3 },
    b: { x: 0, y: 5 },
    options: [
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 1 },
    ],
    correct: { x: 0, y: 1 },
  },
];

// --- Special cases: horizontal / vertical segments ------------------------

export const HORIZONTAL_CASE: { a: MidPoint; b: MidPoint } = { a: { x: 2, y: 4 }, b: { x: 8, y: 4 } };
export const VERTICAL_CASE: { a: MidPoint; b: MidPoint } = { a: { x: 3, y: 2 }, b: { x: 3, y: 8 } };
