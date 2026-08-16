/**
 * Field-at-a-point calculation for the compass needle — a separate,
 * reusable concern from `magnet-physics.ts` (which only ever answers
 * "what force does one magnet feel from another"). Any future
 * visualization that needs "which way does the field point *here*"
 * (a second compass, a field-strength meter, etc.) can import this
 * without pulling in magnet-to-magnet force logic.
 */

import { getPoles, type MagnetState, type Point } from "@/features/subjects/physics/magnet-explorer";

const FIELD_CONSTANT = 900_000;
const MIN_DISTANCE = 26;
/** Field strength treated as "full" for the visual indicator's opacity — tuned by feel, not units. */
const REFERENCE_STRENGTH = 3.2;

export interface FieldReading {
  angleDeg: number;
  /** 0–1, roughly "how strong is the field here" — used to fade the indicator with distance. */
  strength: number;
}

/** One pole's contribution to the field at `point`: pointing away from North, toward South. */
function poleContribution(point: Point, pole: Point, towardPole: boolean) {
  const dx = pole.x - point.x;
  const dy = pole.y - point.y;
  const rawDistance = Math.hypot(dx, dy);
  const distance = Math.max(rawDistance, MIN_DISTANCE);
  const magnitude = FIELD_CONSTANT / (distance * distance);
  const ux = dx / (rawDistance || 1);
  const uy = dy / (rawDistance || 1);
  const sign = towardPole ? 1 : -1;
  return { fx: ux * magnitude * sign, fy: uy * magnitude * sign };
}

/**
 * The local field direction at `point`, treating the magnet's poles as
 * a simple source (North — field points away) and sink (South — field
 * points toward): the same monopole-style approximation
 * `magnet-physics.ts` uses for pole-to-pole force, just evaluated at an
 * arbitrary point instead of at another magnet's poles. Not
 * scientifically exact, but it produces a field that always runs
 * smoothly from North to South, which is what a beginner needs to see.
 */
export function getFieldAt(magnet: MagnetState, point: Point): FieldReading {
  const poles = getPoles(magnet);
  const north = poleContribution(point, poles.north, false);
  const south = poleContribution(point, poles.south, true);

  const fx = north.fx + south.fx;
  const fy = north.fy + south.fy;
  const magnitude = Math.hypot(fx, fy);

  return {
    angleDeg: (Math.atan2(fy, fx) * 180) / Math.PI,
    strength: Math.min(magnitude / REFERENCE_STRENGTH, 1),
  };
}
