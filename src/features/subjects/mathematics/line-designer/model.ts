/**
 * Line Designer — data model.
 *
 * A dedicated simulation for "Equation of a Straight Line"
 * (Mathematics Batch 3, Topic 18). The Learning Path previously
 * pointed this topic at the existing Equation Playground simulation,
 * but that simulation is actually an unrelated "find the missing
 * number in a + b = c" arithmetic game (see
 * `@/features/subjects/mathematics/equation-playground/equations.ts`)
 * — it has nothing to do with slope-intercept lines. Rather than
 * force-fit the wrong simulation onto this topic, this is a small,
 * new, purpose-built one, reusing the shared coordinate-plane pixel
 * math from Coordinate Plane Explorer (`../coordinate-plane-explorer/coordinate-model`)
 * so its grid and axes render identically to every other Coordinate
 * Geometry simulation in this batch.
 */

import { GRID_MAX, GRID_MIN } from "../coordinate-plane-explorer/coordinate-model";

export interface LinePoint {
  x: number;
  y: number;
}

export const M_MIN = -5;
export const M_MAX = 5;
export const B_MIN = -8;
export const B_MAX = 8;

export const DEFAULT_M = 1;
export const DEFAULT_B = 2;

/** Evaluates y = mx + b at a given x. */
export function evaluateLine(m: number, b: number, x: number): number {
  return m * x + b;
}

/**
 * Finds the two points where the line y = mx + b crosses the edges of
 * the square grid, so the line can be drawn edge-to-edge without
 * distortion. Checks all four grid edges and keeps whichever two
 * intersection points actually fall within the grid's bounds.
 */
export function lineEndpoints(m: number, b: number): [LinePoint, LinePoint] {
  const candidates: LinePoint[] = [];
  const within = (v: number) => v >= GRID_MIN - 1e-9 && v <= GRID_MAX + 1e-9;

  // Left edge (x = GRID_MIN) and right edge (x = GRID_MAX).
  const yAtLeft = evaluateLine(m, b, GRID_MIN);
  if (within(yAtLeft)) candidates.push({ x: GRID_MIN, y: yAtLeft });
  const yAtRight = evaluateLine(m, b, GRID_MAX);
  if (within(yAtRight)) candidates.push({ x: GRID_MAX, y: yAtRight });

  // Bottom edge (y = GRID_MIN) and top edge (y = GRID_MAX) — only
  // meaningful for non-horizontal lines.
  if (m !== 0) {
    const xAtBottom = (GRID_MIN - b) / m;
    if (within(xAtBottom)) candidates.push({ x: xAtBottom, y: GRID_MIN });
    const xAtTop = (GRID_MAX - b) / m;
    if (within(xAtTop)) candidates.push({ x: xAtTop, y: GRID_MAX });
  }

  // Deduplicate near-identical points (can happen exactly at a corner).
  const unique: LinePoint[] = [];
  for (const point of candidates) {
    if (!unique.some((u) => Math.abs(u.x - point.x) < 1e-6 && Math.abs(u.y - point.y) < 1e-6)) {
      unique.push(point);
    }
  }

  if (unique.length >= 2) return [unique[0]!, unique[1]!];
  // Degenerate fallback (shouldn't happen for m in [-5,5], b in [-8,8]
  // on a [-10,10] grid, but keeps the type honest).
  return [
    { x: GRID_MIN, y: evaluateLine(m, b, GRID_MIN) },
    { x: GRID_MAX, y: evaluateLine(m, b, GRID_MAX) },
  ];
}

export function formatCoefficient(m: number): string {
  if (m === 1) return "";
  if (m === -1) return "-";
  return `${m}`;
}

/** Renders "y = mx + b" (or "y = mx", "y = b", "y = -x + b", etc.) in its simplest visible form. */
export function formatEquation(m: number, b: number): string {
  const mPart = m === 0 ? "" : `${formatCoefficient(m)}x`;
  if (m === 0) return `y = ${b}`;
  if (b === 0) return `y = ${mPart}`;
  const sign = b > 0 ? "+" : "\u2212";
  return `y = ${mPart} ${sign} ${Math.abs(b)}`;
}

// --- Match mode (Calculate-style challenge) ---------------------------------

export interface MatchQuestion {
  id: string;
  targetM: number;
  targetB: number;
  /** A hint describing the target, e.g. "slope 2, y-intercept -3". */
  prompt: string;
}

export const MATCH_QUESTIONS: MatchQuestion[] = [
  { id: "line-match-1", targetM: 2, targetB: 0, prompt: "Slope 2, passing through the origin" },
  { id: "line-match-2", targetM: -1, targetB: 4, prompt: "Slope -1, y-intercept 4" },
  { id: "line-match-3", targetM: 0, targetB: -3, prompt: "A flat, horizontal line at y = -3" },
  { id: "line-match-4", targetM: 3, targetB: -6, prompt: "Slope 3, y-intercept -6" },
  { id: "line-match-5", targetM: -2, targetB: -1, prompt: "Slope -2, y-intercept -1" },
];
