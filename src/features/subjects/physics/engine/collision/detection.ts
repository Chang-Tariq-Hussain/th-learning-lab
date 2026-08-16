import { Vector2 } from "../math/vector2";
import type { RigidBody } from "../core/rigid-body";

/**
 * A detected overlap between two bodies, with everything the resolver
 * needs: `normal` points from `bodyA` toward `bodyB`, `penetration` is
 * how far they overlap along that normal, and `point` is the
 * approximate contact location (used for torque in rotational response
 * and for debug-overlay markers).
 */
export interface Contact {
  bodyA: RigidBody;
  bodyB: RigidBody;
  normal: Vector2;
  penetration: number;
  point: Vector2;
}

/**
 * Rectangles are treated as axis-aligned for collision purposes (their
 * current AABB), which keeps detection to simple, fast formulas — the
 * standard simplification for an educational 2D engine, where boxes
 * mostly sit flat on the ground or stack rather than tumble arbitrarily.
 * A rotated rect still *renders* rotated; only collision math ignores
 * the rotation.
 */
function rectHalfExtents(body: RigidBody): { hw: number; hh: number } {
  if (body.shape.kind !== "rect")
    throw new Error("rectHalfExtents called on a non-rect body");
  return { hw: body.shape.width / 2, hh: body.shape.height / 2 };
}

export function circleVsCircle(a: RigidBody, b: RigidBody): Contact | null {
  if (a.shape.kind !== "circle" || b.shape.kind !== "circle") return null;

  const delta = Vector2.sub(b.position, a.position);
  const dist = delta.magnitude();
  const radiusSum = a.shape.radius + b.shape.radius;
  if (dist >= radiusSum) return null;

  const normal = dist === 0 ? new Vector2(1, 0) : delta.scale(1 / dist);
  const penetration = radiusSum - dist;
  const point = a.position.add(normal.scale(a.shape.radius));

  return { bodyA: a, bodyB: b, normal, penetration, point };
}

export function rectVsRect(a: RigidBody, b: RigidBody): Contact | null {
  if (a.shape.kind !== "rect" || b.shape.kind !== "rect") return null;

  const ea = rectHalfExtents(a);
  const eb = rectHalfExtents(b);
  const delta = Vector2.sub(b.position, a.position);

  const overlapX = ea.hw + eb.hw - Math.abs(delta.x);
  const overlapY = ea.hh + eb.hh - Math.abs(delta.y);
  if (overlapX <= 0 || overlapY <= 0) return null;

  // Resolve along whichever axis has the smaller overlap — the
  // standard AABB minimum-translation-vector approach.
  let normal: Vector2;
  let penetration: number;
  if (overlapX < overlapY) {
    normal = new Vector2(delta.x < 0 ? -1 : 1, 0);
    penetration = overlapX;
  } else {
    normal = new Vector2(0, delta.y < 0 ? -1 : 1);
    penetration = overlapY;
  }

  const point = a.position.add(delta.scale(0.5));
  return { bodyA: a, bodyB: b, normal, penetration, point };
}

export function circleVsRect(
  circleBody: RigidBody,
  rectBody: RigidBody,
): Contact | null {
  if (circleBody.shape.kind !== "circle" || rectBody.shape.kind !== "rect")
    return null;

  const { hw, hh } = rectHalfExtents(rectBody);
  const relative = Vector2.sub(circleBody.position, rectBody.position);

  // Closest point on the rectangle to the circle's center, clamped to the rect's extents.
  const closest = new Vector2(
    Math.min(hw, Math.max(-hw, relative.x)),
    Math.min(hh, Math.max(-hh, relative.y)),
  );

  const delta = Vector2.sub(relative, closest);
  const distSq = delta.magnitudeSquared();
  const radius = circleBody.shape.radius;
  if (distSq >= radius * radius) return null;

  const dist = Math.sqrt(distSq);
  const normal = dist === 0 ? new Vector2(0, 1) : delta.scale(1 / dist);
  const penetration = radius - dist;
  const point = rectBody.position.add(closest);

  // Normal always points from the rect (bodyA) toward the circle (bodyB) by convention below.
  return { bodyA: rectBody, bodyB: circleBody, normal, penetration, point };
}

/** Dispatches to the right narrow-phase test based on each body's shape kind. */
export function detectCollision(a: RigidBody, b: RigidBody): Contact | null {
  if (a.shape.kind === "circle" && b.shape.kind === "circle")
    return circleVsCircle(a, b);
  if (a.shape.kind === "rect" && b.shape.kind === "rect")
    return rectVsRect(a, b);
  if (a.shape.kind === "circle" && b.shape.kind === "rect") {
    const contact = circleVsRect(b, a);
    // circleVsRect always returns {bodyA: rect, bodyB: circle}; flip so
    // the caller's (a, b) order and the contact's (bodyA, bodyB) order
    // — and therefore the normal's direction — stay consistent.
    if (!contact) return null;
    return {
      bodyA: a,
      bodyB: b,
      normal: contact.normal.scale(-1),
      penetration: contact.penetration,
      point: contact.point,
    };
  }
  if (a.shape.kind === "rect" && b.shape.kind === "circle")
    return circleVsRect(a, b);
  return null;
}

/** An axis-aligned world boundary — the ground, walls, or an arbitrary bounding box a simulation wants objects contained within. */
export interface Boundary {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface BoundaryContact {
  body: RigidBody;
  normal: Vector2;
  penetration: number;
}

/** Checks a single body against a rectangular boundary, returning one contact per violated edge (a body can hit a corner and touch two edges at once). */
export function detectBoundaryCollisions(
  body: RigidBody,
  boundary: Boundary,
): BoundaryContact[] {
  const contacts: BoundaryContact[] = [];
  const radius =
    body.shape.kind === "circle"
      ? body.shape.radius
      : Math.max(body.shape.width, body.shape.height) / 2;

  if (body.position.x - radius < boundary.minX) {
    contacts.push({
      body,
      normal: new Vector2(1, 0),
      penetration: boundary.minX - (body.position.x - radius),
    });
  }
  if (body.position.x + radius > boundary.maxX) {
    contacts.push({
      body,
      normal: new Vector2(-1, 0),
      penetration: body.position.x + radius - boundary.maxX,
    });
  }
  if (body.position.y - radius < boundary.minY) {
    contacts.push({
      body,
      normal: new Vector2(0, 1),
      penetration: boundary.minY - (body.position.y - radius),
    });
  }
  if (body.position.y + radius > boundary.maxY) {
    contacts.push({
      body,
      normal: new Vector2(0, -1),
      penetration: body.position.y + radius - boundary.maxY,
    });
  }
  return contacts;
}
