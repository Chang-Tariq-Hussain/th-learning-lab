/**
 * Plain geometry + types for the compass. Deliberately small and
 * decoupled from `magnet-model.ts` — a compass has no poles to grab
 * and rotate like a bar magnet, just a position, so it doesn't need
 * most of what that file offers. It does reuse the magnet playground's
 * own dimensions (imported, not duplicated) so the two objects always
 * share one coordinate space.
 */

import { PLAYGROUND_HEIGHT, PLAYGROUND_WIDTH, type Point } from "@/features/subjects/physics/magnet-explorer";

export interface CompassState {
  id: "compass";
  x: number;
  y: number;
}

export const COMPASS_RADIUS = 46;
export const NEEDLE_LENGTH = COMPASS_RADIUS - 12;

export const COMPASS_START: CompassState = {
  id: "compass",
  x: PLAYGROUND_WIDTH * 0.68,
  y: PLAYGROUND_HEIGHT * 0.62,
};

/** Keeps the compass body fully inside the playground at any position. */
export function clampCompassToPlayground(x: number, y: number): Point {
  const margin = COMPASS_RADIUS + 6;
  return {
    x: Math.min(Math.max(x, margin), PLAYGROUND_WIDTH - margin),
    y: Math.min(Math.max(y, margin), PLAYGROUND_HEIGHT - margin),
  };
}
