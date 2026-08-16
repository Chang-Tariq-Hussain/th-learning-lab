/**
 * Coordinate Plane Explorer — data model.
 *
 * A square SVG viewBox maps world coordinates in [-10, 10] on both
 * axes to pixel space, with the origin at the exact center. Every
 * other piece — the grid, the draggable point, quadrant clicks, the
 * cursor readout — goes through `pixelToWorld` / `worldToPixelX/Y`
 * so there is exactly one source of truth for the mapping.
 */

export const GRID_MIN = -10;
export const GRID_MAX = 10;
export const VIEW_SIZE = 600;
export const SCALE = VIEW_SIZE / (GRID_MAX - GRID_MIN);
export const ORIGIN_PX = VIEW_SIZE / 2;

export function worldToPixelX(x: number): number {
  return ORIGIN_PX + x * SCALE;
}

export function worldToPixelY(y: number): number {
  return ORIGIN_PX - y * SCALE;
}

function clampWorld(v: number): number {
  return Math.min(GRID_MAX, Math.max(GRID_MIN, v));
}

/** Converts an SVG-space pixel position to the nearest integer grid coordinate. */
export function pixelToWorld(px: number, py: number): { x: number; y: number } {
  const xRaw = (px - ORIGIN_PX) / SCALE;
  const yRaw = (ORIGIN_PX - py) / SCALE;
  return { x: clampWorld(Math.round(xRaw)), y: clampWorld(Math.round(yRaw)) };
}

export type Quadrant = "I" | "II" | "III" | "IV";

export function quadrantOf(x: number, y: number): Quadrant | null {
  if (x > 0 && y > 0) return "I";
  if (x < 0 && y > 0) return "II";
  if (x < 0 && y < 0) return "III";
  if (x > 0 && y < 0) return "IV";
  return null;
}

export const QUADRANT_INFO: Record<Quadrant, { title: string; signs: string }> = {
  I: { title: "Quadrant I", signs: "x > 0, y > 0" },
  II: { title: "Quadrant II", signs: "x < 0, y > 0" },
  III: { title: "Quadrant III", signs: "x < 0, y < 0" },
  IV: { title: "Quadrant IV", signs: "x > 0, y < 0" },
};

/** A short, always-current caption describing where the point currently sits. */
export function positionMessage(x: number, y: number): string {
  if (x === 0 && y === 0) return "You are at the origin.";
  if (x === 0) return y > 0 ? "You are on the positive y-axis." : "You are on the negative y-axis.";
  if (y === 0) return x > 0 ? "You are on the positive x-axis." : "You are on the negative x-axis.";
  const xSide = x > 0 ? "the positive x side" : "the negative x side";
  const ySide = y > 0 ? "above the x-axis" : "below the x-axis";
  return `You are on ${xSide}, ${ySide}.`;
}

// --- Mini challenge (place the point) ---------------------------------------

export const PLACEMENT_CHALLENGES: { x: number; y: number }[] = [
  { x: 4, y: 3 },
  { x: -2, y: 5 },
  { x: -4, y: -3 },
  { x: 6, y: -2 },
];

// --- Quadrant challenge -------------------------------------------------------

export interface QuadrantQuestion {
  point: { x: number; y: number };
  correct: Quadrant;
  explanation: string;
}

export const QUADRANT_QUESTION: QuadrantQuestion = {
  point: { x: -3, y: 5 },
  correct: "II",
  explanation: "x is negative and y is positive, so the point is in Quadrant II.",
};

// --- Learning panel -----------------------------------------------------------

export const LEARNING_PANEL_SECTIONS: { title: string; body: string }[] = [
  { title: "Origin", body: "The point where the x-axis and y-axis meet." },
  { title: "X-axis", body: "The horizontal axis." },
  { title: "Y-axis", body: "The vertical axis." },
  { title: "Coordinates", body: "A pair of numbers written as (x, y) that tells us the position of a point." },
  { title: "Quadrants", body: "The coordinate plane is divided into four regions." },
];
