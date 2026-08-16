import { Vector2 } from "../math/vector2";
import type { Contact, BoundaryContact } from "./detection";

/**
 * Impulse-based resolution between two bodies (see `Contact`), including
 * rotation: the impulse is applied at the actual contact point, so a
 * glancing hit imparts spin the same way a real collision would.
 *
 * The three physics steps, in order:
 * 1. **Restitution** — how much of the closing speed "bounces back",
 *    from `e = min(a.restitution, b.restitution)`. `e = 1` is a
 *    perfectly elastic collision (all kinetic energy along the normal
 *    is conserved); `e = 0` is perfectly inelastic (bodies stop
 *    approaching but don't bounce).
 * 2. **Friction** — a Coulomb-model tangential impulse, clamped to
 *    `μ × normalImpulse` so friction can never exceed what the normal
 *    force could physically produce.
 * 3. **Positional correction** — pushes overlapping bodies apart
 *    directly. Impulse resolution alone only fixes *velocity*; without
 *    this step, bodies resting under gravity slowly sink into each
 *    other as tiny numerical errors accumulate each frame.
 */
export function resolveCollision(contact: Contact): void {
  const { bodyA, bodyB, normal, penetration, point } = contact;
  if (bodyA.isStatic && bodyB.isStatic) return;

  const rA = Vector2.sub(point, bodyA.position);
  const rB = Vector2.sub(point, bodyB.position);

  const relativeVelocity = Vector2.sub(
    bodyB.velocityAtPoint(point),
    bodyA.velocityAtPoint(point),
  );
  const velocityAlongNormal = Vector2.dot(relativeVelocity, normal);
  if (velocityAlongNormal > 0) return; // already separating — nothing to resolve

  const rACrossN = Vector2.cross(rA, normal);
  const rBCrossN = Vector2.cross(rB, normal);
  const invMassSum =
    bodyA.invMass +
    bodyB.invMass +
    rACrossN * rACrossN * bodyA.invMomentOfInertia +
    rBCrossN * rBCrossN * bodyB.invMomentOfInertia;
  if (invMassSum === 0) return;

  const restitution = Math.min(bodyA.restitution, bodyB.restitution);
  const j = (-(1 + restitution) * velocityAlongNormal) / invMassSum;
  const normalImpulse = normal.scale(j);

  bodyA.applyImpulseAtPoint(normalImpulse.scale(-1), point);
  bodyB.applyImpulseAtPoint(normalImpulse, point);

  // --- Friction (Coulomb model) ---
  const relativeVelocity2 = Vector2.sub(
    bodyB.velocityAtPoint(point),
    bodyA.velocityAtPoint(point),
  );
  const tangentRaw = Vector2.sub(
    relativeVelocity2,
    normal.scale(Vector2.dot(relativeVelocity2, normal)),
  );
  const tangentMag = tangentRaw.magnitude();
  if (tangentMag > 1e-6) {
    const tangent = tangentRaw.scale(1 / tangentMag);
    const rACrossT = Vector2.cross(rA, tangent);
    const rBCrossT = Vector2.cross(rB, tangent);
    const tangentInvMassSum =
      bodyA.invMass +
      bodyB.invMass +
      rACrossT * rACrossT * bodyA.invMomentOfInertia +
      rBCrossT * rBCrossT * bodyB.invMomentOfInertia;

    let jt =
      tangentInvMassSum === 0
        ? 0
        : -Vector2.dot(relativeVelocity2, tangent) / tangentInvMassSum;
    const mu = Math.sqrt(bodyA.friction * bodyB.friction);
    const maxFriction = Math.abs(j) * mu;
    jt = Math.max(-maxFriction, Math.min(maxFriction, jt));

    const frictionImpulse = tangent.scale(jt);
    bodyA.applyImpulseAtPoint(frictionImpulse.scale(-1), point);
    bodyB.applyImpulseAtPoint(frictionImpulse, point);
  }

  // --- Positional correction ---
  const percent = 0.8; // don't fully correct in one step — smoother than a hard snap
  const slop = 0.01; // allow a tiny, imperceptible overlap so bodies don't jitter at rest
  const correctionMag =
    (Math.max(penetration - slop, 0) / (bodyA.invMass + bodyB.invMass)) *
    percent;
  const correction = normal.scale(correctionMag);
  if (!bodyA.isStatic)
    bodyA.position.subInPlace(correction.scale(bodyA.invMass));
  if (!bodyB.isStatic)
    bodyB.position.addInPlace(correction.scale(bodyB.invMass));
}

/** Same three steps as `resolveCollision`, specialized for a body hitting a fixed world boundary (ground/wall). */
export function resolveBoundaryCollision(contact: BoundaryContact): void {
  const { body, normal, penetration } = contact;
  if (body.isStatic) return;

  const velocityAlongNormal = Vector2.dot(body.velocity, normal);
  if (velocityAlongNormal < 0) {
    body.velocity.subInPlace(
      normal.scale((1 + body.restitution) * velocityAlongNormal),
    );

    const tangent = normal.perpendicular();
    const tangentialVelocity = Vector2.dot(body.velocity, tangent);
    body.velocity.subInPlace(tangent.scale(tangentialVelocity * body.friction));

    // A touch of rolling friction so spinning bodies gradually settle rather than spinning forever.
    body.angularVelocity *= 1 - body.friction * 0.05;
  }

  body.position.addScaledInPlace(normal, penetration);
}
