/**
 * The engine supports exactly two primitive shapes, which is enough for
 * every teaching scenario listed in the brief (balls, boxes, ground,
 * ramps, platforms) while keeping collision detection to a handful of
 * well-understood cases (circle-circle, circle-rect, rect-rect).
 */
export interface CircleShape {
  kind: "circle";
  radius: number;
}

export interface RectShape {
  kind: "rect";
  width: number;
  height: number;
}

export type Shape = CircleShape | RectShape;

export function circle(radius: number): CircleShape {
  return { kind: "circle", radius };
}

export function rect(width: number, height: number): RectShape {
  return { kind: "rect", width, height };
}

/**
 * Moment of inertia about the center of mass, for a uniform-density
 * body of the given shape and total mass. Used to convert torque into
 * angular acceleration (τ = I α) the same way mass converts force into
 * linear acceleration (F = m a).
 *
 * - Solid disk: I = ½ m r²
 * - Solid rectangle: I = m (w² + h²) / 12
 */
export function computeMomentOfInertia(shape: Shape, mass: number): number {
  if (shape.kind === "circle") {
    return 0.5 * mass * shape.radius * shape.radius;
  }
  return (
    (mass * (shape.width * shape.width + shape.height * shape.height)) / 12
  );
}

/** Axis-aligned bounding box, used for broad-phase checks and debug overlays. */
export interface AABB {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function shapeAABB(
  position: { x: number; y: number },
  shape: Shape,
  rotation = 0,
): AABB {
  if (shape.kind === "circle") {
    return {
      minX: position.x - shape.radius,
      minY: position.y - shape.radius,
      maxX: position.x + shape.radius,
      maxY: position.y + shape.radius,
    };
  }
  // For a rotated rectangle, bound the four corners — a conservative
  // (slightly larger) box, which is standard for broad-phase AABBs.
  const hw = shape.width / 2;
  const hh = shape.height / 2;
  const corners = [
    { x: -hw, y: -hh },
    { x: hw, y: -hh },
    { x: hw, y: hh },
    { x: -hw, y: hh },
  ];
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const c of corners) {
    const x = position.x + c.x * cos - c.y * sin;
    const y = position.y + c.x * sin + c.y * cos;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  return { minX, minY, maxX, maxY };
}
