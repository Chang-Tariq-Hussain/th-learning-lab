/**
 * Pure geometry for the Triangle Explorer simulation. No React, no
 * SVG coordinates — `TriangleCanvas` is the only place that converts
 * these plain math results into pixels.
 *
 * Vertex/side naming follows the standard convention: side `a` is the
 * side opposite vertex `A` (i.e. the segment B–C), side `b` is
 * opposite `B` (segment A–C), and side `c` is opposite `C` (segment
 * A–B). Angles are named the same way — `angleA` is the interior
 * angle measured at vertex `A`.
 */

export interface TrianglePoint {
  x: number;
  y: number;
}

export interface TriangleVertices {
  A: TrianglePoint;
  B: TrianglePoint;
  C: TrianglePoint;
}

export type VertexId = "A" | "B" | "C";

export interface TriangleSides {
  a: number;
  b: number;
  c: number;
}

export interface TriangleAngles {
  A: number;
  B: number;
  C: number;
}

export type SideClassification = "equilateral" | "isosceles" | "scalene";
export type AngleClassification = "acute" | "right" | "obtuse";

/** Degrees within this of a boundary (90° for right, or two sides
 *  within this of each other for isosceles/equilateral) still count
 *  as that boundary — freehand dragging can't land on exactly 90.000°,
 *  so classification needs a little tolerance to feel right rather
 *  than flickering between categories on a sub-pixel wobble. */
const ANGLE_EPSILON_DEG = 1.5;
const SIDE_EPSILON = 3;

export function distance(p1: TrianglePoint, p2: TrianglePoint): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export function sideLengths(v: TriangleVertices): TriangleSides {
  return {
    a: distance(v.B, v.C),
    b: distance(v.A, v.C),
    c: distance(v.A, v.B),
  };
}

/** Law of cosines, solved for the angle at each vertex. Inputs are
 *  clamped to [-1, 1] before `acos` — floating-point drift on
 *  near-degenerate triangles can push the raw ratio a hair outside
 *  that domain, which would otherwise produce `NaN`. */
function angleFromSides(opposite: number, adjacent1: number, adjacent2: number): number {
  if (adjacent1 <= 0 || adjacent2 <= 0) return 0;
  const cos = (adjacent1 ** 2 + adjacent2 ** 2 - opposite ** 2) / (2 * adjacent1 * adjacent2);
  const clamped = Math.max(-1, Math.min(1, cos));
  return (Math.acos(clamped) * 180) / Math.PI;
}

export function angles(v: TriangleVertices): TriangleAngles {
  const { a, b, c } = sideLengths(v);
  return {
    A: angleFromSides(a, b, c),
    B: angleFromSides(b, a, c),
    C: angleFromSides(c, a, b),
  };
}

export function perimeter(v: TriangleVertices): number {
  const { a, b, c } = sideLengths(v);
  return a + b + c;
}

/** Shoelace formula — works for any vertex ordering/orientation. */
export function area(v: TriangleVertices): number {
  const { A, B, C } = v;
  return Math.abs(A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y)) / 2;
}

/** A triangle collapses (zero-area / three collinear points) as its
 *  vertices are dragged toward each other or onto a line. Below this
 *  area, angle/side math is numerically unstable, so canvas dragging
 *  refuses moves that would cross this floor rather than letting the
 *  triangle flip inside-out or momentarily disappear. Expressed in
 *  the same pixel-ish units as `TriangleCanvas`'s coordinate space. */
export const MIN_TRIANGLE_AREA = 900;

export function classifyBySides(sides: TriangleSides): SideClassification {
  const { a, b, c } = sides;
  const ab = Math.abs(a - b) < SIDE_EPSILON;
  const bc = Math.abs(b - c) < SIDE_EPSILON;
  const ac = Math.abs(a - c) < SIDE_EPSILON;
  if (ab && bc && ac) return "equilateral";
  if (ab || bc || ac) return "isosceles";
  return "scalene";
}

export function classifyByAngles(ang: TriangleAngles): AngleClassification {
  const max = Math.max(ang.A, ang.B, ang.C);
  if (Math.abs(max - 90) < ANGLE_EPSILON_DEG) return "right";
  if (max > 90) return "obtuse";
  return "acute";
}

/** Which single vertex (if any) is the right angle — used to draw a
 *  square marker there instead of an arc, and to drive the
 *  Pythagorean panel's hypotenuse/leg labeling. `null` when the
 *  triangle isn't a right triangle. */
export function rightAngleVertex(ang: TriangleAngles): VertexId | null {
  if (Math.abs(ang.A - 90) < ANGLE_EPSILON_DEG) return "A";
  if (Math.abs(ang.B - 90) < ANGLE_EPSILON_DEG) return "B";
  if (Math.abs(ang.C - 90) < ANGLE_EPSILON_DEG) return "C";
  return null;
}

export function formatLength(n: number): string {
  return n.toFixed(1);
}

export function formatDegrees(n: number): string {
  return `${Math.round(n)}°`;
}

// ---------------------------------------------------------------------------
// Presets — each is a hand-placed, comfortably non-degenerate triangle
// inside a 400×400 canvas (see `TriangleCanvas`'s `SIZE`), used both as
// the simulation's starting shape and its quick-load preset buttons.
// ---------------------------------------------------------------------------

export const CANVAS_SIZE = 400;

export const TRIANGLE_PRESETS: Record<string, { label: string; vertices: TriangleVertices }> = {
  scalene: {
    label: "Scalene",
    vertices: { A: { x: 80, y: 320 }, B: { x: 340, y: 290 }, C: { x: 190, y: 70 } },
  },
  equilateral: {
    label: "Equilateral",
    vertices: { A: { x: 60, y: 300 }, B: { x: 340, y: 300 }, C: { x: 200, y: 57 } },
  },
  isosceles: {
    label: "Isosceles",
    vertices: { A: { x: 90, y: 310 }, B: { x: 310, y: 310 }, C: { x: 200, y: 80 } },
  },
  right: {
    label: "Right",
    vertices: { A: { x: 90, y: 320 }, B: { x: 90, y: 90 }, C: { x: 330, y: 320 } },
  },
  obtuse: {
    label: "Obtuse",
    vertices: { A: { x: 70, y: 300 }, B: { x: 350, y: 300 }, C: { x: 300, y: 130 } },
  },
};

/** Nudges every vertex of a preset by a small random amount while
 *  guaranteeing the result stays comfortably above `MIN_TRIANGLE_AREA`
 *  — used by the "Random" preset button so it can't hand back a
 *  sliver triangle. Falls back to the un-jittered preset if repeated
 *  jitter attempts keep landing below the floor (astronomically
 *  unlikely at this jitter range, but kept for correctness). */
export function randomizedTriangle(): TriangleVertices {
  const base = TRIANGLE_PRESETS.scalene!.vertices;
  const jitter = () => (Math.random() - 0.5) * 120;
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate: TriangleVertices = {
      A: clampToCanvas({ x: base.A.x + jitter(), y: base.A.y + jitter() }),
      B: clampToCanvas({ x: base.B.x + jitter(), y: base.B.y + jitter() }),
      C: clampToCanvas({ x: base.C.x + jitter(), y: base.C.y + jitter() }),
    };
    if (area(candidate) > MIN_TRIANGLE_AREA * 1.5) return candidate;
  }
  return base;
}

const CANVAS_PADDING = 24;

export function clampToCanvas(p: TrianglePoint): TrianglePoint {
  return {
    x: Math.max(CANVAS_PADDING, Math.min(CANVAS_SIZE - CANVAS_PADDING, p.x)),
    y: Math.max(CANVAS_PADDING, Math.min(CANVAS_SIZE - CANVAS_PADDING, p.y)),
  };
}
