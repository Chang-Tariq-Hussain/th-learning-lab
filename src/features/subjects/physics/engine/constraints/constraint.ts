import type { Particle } from "../core/particle";
import { Vector2 } from "../math/vector2";

/**
 * A `Constraint` restricts how bodies can move relative to each other or
 * to a fixed point — a rigid pendulum rod, a rope, a hinge. Unlike a
 * `Spring` (a *force* that pulls toward a target length but can be
 * stretched), a constraint is solved by directly correcting position and
 * velocity each step so the restriction holds essentially exactly. This
 * is the standard "positional correction" approach used by simple
 * educational engines — much easier to reason about than full sequential
 * impulse solving, at the cost of not composing perfectly when many
 * constraints fight each other (fine for the single-rod/rope cases this
 * engine targets).
 */
export interface Constraint {
  /** Called once per `World.step()`, after integration — corrects positions/velocities to satisfy the constraint. */
  solve(dt: number): void;
}

/**
 * Keeps `bodyA` and `bodyB` (or `bodyA` and a fixed `anchor`) at a fixed
 * distance apart — a rigid rod. This is exactly what a pendulum needs:
 * a bob at a fixed distance from a pivot, free to swing.
 */
export class DistanceConstraint implements Constraint {
  bodyB: Particle | null;
  anchor: Vector2 | null;

  constructor(
    public bodyA: Particle,
    target: Particle | { x: number; y: number },
    public distance: number,
  ) {
    if (isParticleLike(target)) {
      this.bodyB = target;
      this.anchor = null;
    } else {
      this.bodyB = null;
      this.anchor = Vector2.from(target);
    }
  }

  private get otherPosition(): Vector2 {
    return this.bodyB ? this.bodyB.position : this.anchor!;
  }

  solve(): void {
    const a = this.bodyA;
    const b = this.bodyB;
    const other = this.otherPosition;

    const delta = Vector2.sub(other, a.position);
    const currentDistance = delta.magnitude();
    if (currentDistance === 0) return;
    const direction = delta.scale(1 / currentDistance);
    const error = currentDistance - this.distance;

    // Split the correction between the two bodies in proportion to how
    // "free" each one is to move (its inverse mass) — a static or very
    // heavy body barely moves, a light one absorbs most of the
    // correction, matching intuition (you can't tug the Earth toward you).
    const totalInvMass = a.invMass + (b?.invMass ?? 0);
    if (totalInvMass === 0) return;

    if (!a.isStatic) {
      const moveA = (error * a.invMass) / totalInvMass;
      a.position.addScaledInPlace(direction, moveA);
      // Removing the velocity component along the constraint direction
      // stops the rod from stretching further on the next step — the
      // simplest stable way to keep a rigid link rigid.
      const vAlong = Vector2.dot(a.velocity, direction);
      a.velocity.subInPlace(direction.scale(vAlong));
    }
    if (b && !b.isStatic) {
      const moveB = (error * b.invMass) / totalInvMass;
      b.position.addScaledInPlace(direction, -moveB);
      const vAlong = Vector2.dot(b.velocity, direction);
      b.velocity.subInPlace(direction.scale(-vAlong));
    }
  }
}

/** Pins a body to a fixed world point — a zero-length distance constraint, useful as a pivot. */
export class PinConstraint implements Constraint {
  constructor(
    public body: Particle,
    public anchor: { x: number; y: number },
  ) {}

  solve(): void {
    if (this.body.isStatic) return;
    this.body.position.copyFrom(this.anchor);
    this.body.velocity.set(0, 0);
  }
}

function isParticleLike(
  value: Particle | { x: number; y: number },
): value is Particle {
  return typeof (value as Particle).applyForce === "function";
}
