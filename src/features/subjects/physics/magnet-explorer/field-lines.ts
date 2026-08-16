/**
 * Pure geometry for the decorative field-line arcs drawn around each
 * magnet. Defined once in the magnet's own local coordinate space — the
 * same space its poles live in before translate/rotate (see
 * `getPoles` in `magnet-model.ts`) — so a `<FieldLines>` component can
 * reuse the exact transform already applied to the magnet body and
 * never has to recompute anything as the magnet moves or rotates.
 *
 * Not a real dipole-field calculation: these are hand-tuned Bezier arcs
 * chosen so the picture reads clearly (denser + brighter near the poles,
 * fading with distance) rather than being scientifically exact.
 */

import { MAGNET_LENGTH, MAGNET_WIDTH, type Point } from "./magnet-model";

const HALF_LENGTH = MAGNET_LENGTH / 2;
const HALF_WIDTH = MAGNET_WIDTH / 2;

/** Arcs per side (top/bottom) of the magnet — kept low so the picture stays readable. */
const LOOP_COUNT = 4;

export interface FieldLine {
  /** SVG path data, running from the North pole to the South pole. */
  path: string;
  /** Stroke opacity — higher (denser-looking) for loops that hug the magnet. */
  opacity: number;
  strokeWidth: number;
  /** Small N -> S direction marker, placed and oriented at the arc's midpoint. */
  arrow: { x: number; y: number; angleDeg: number };
}

function cubicPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const mt = 1 - t;
  return {
    x: mt ** 3 * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t ** 3 * p3.x,
    y: mt ** 3 * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t ** 3 * p3.y,
  };
}

function cubicTangent(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const mt = 1 - t;
  return {
    x: 3 * mt * mt * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x),
    y: 3 * mt * mt * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y),
  };
}

/** Builds one side's worth of arcs (`sign` = +1 below the magnet, -1 above, in SVG's y-down space). */
function buildSide(sign: 1 | -1): FieldLine[] {
  const lines: FieldLine[] = [];

  for (let i = 0; i < LOOP_COUNT; i++) {
    const t = i / (LOOP_COUNT - 1); // 0 = innermost (near the body), 1 = outermost
    const bulge = HALF_WIDTH + 18 + t * 82;
    const reach = 10 + t * 36;
    // Outer loops start a touch behind the very tip, so the bundle fans
    // out near each pole instead of every line converging on one pixel.
    const startX = HALF_LENGTH - t * 6;
    const endX = -HALF_LENGTH + t * 6;

    const start: Point = { x: startX, y: 0 };
    const end: Point = { x: endX, y: 0 };
    const c1: Point = { x: HALF_LENGTH * 0.32 + reach, y: sign * bulge };
    const c2: Point = { x: -HALF_LENGTH * 0.32 - reach, y: sign * bulge };

    const path = `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} C ${c1.x.toFixed(1)} ${c1.y.toFixed(
      1
    )} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;

    const mid = cubicPoint(start, c1, c2, end, 0.5);
    const tangent = cubicTangent(start, c1, c2, end, 0.5);
    // Tangent points S -> N (t increasing runs start->end, i.e. N->S);
    // flip it so the arrow marker points the way the field actually runs, N -> S.
    const angleDeg = (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI;

    lines.push({
      path,
      opacity: 0.5 - t * 0.36,
      strokeWidth: 2.1 - t * 1,
      arrow: { x: mid.x, y: mid.y, angleDeg },
    });
  }

  return lines;
}

/**
 * Precomputed once at module load — every magnet, at any position or
 * rotation, reuses this same local-space set inside its own transform.
 */
export const FIELD_LINES: FieldLine[] = [...buildSide(1), ...buildSide(-1)];
