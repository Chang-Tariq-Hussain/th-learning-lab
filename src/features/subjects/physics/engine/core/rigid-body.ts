import { Vector2 } from "../math/vector2";
import { Particle, type ParticleOptions } from "./particle";
import { computeMomentOfInertia, type Shape } from "./shape";

export interface RigidBodyOptions extends ParticleOptions {
  shape: Shape;
  rotation?: number;
  angularVelocity?: number;
  /** Coulomb friction coefficient (0–1+) used during collision resolution. */
  friction?: number;
}

/**
 * Extends `Particle` with a shape, orientation, and angular dynamics —
 * everything needed for objects that spin or rest stably on a surface
 * (a box on a ramp, a ball rolling to a stop). The rotational quantities
 * mirror the linear ones exactly:
 *
 * | Linear                | Angular                            |
 * |-----------------------|-------------------------------------|
 * | position              | rotation (radians)                  |
 * | velocity              | angularVelocity (rad/s)              |
 * | mass, invMass         | momentOfInertia, invMomentOfInertia  |
 * | force → acceleration  | torque → angular acceleration        |
 * | F = m a               | τ = I α                              |
 */
export class RigidBody extends Particle {
  shape: Shape;
  rotation: number;
  angularVelocity: number;
  friction: number;

  momentOfInertia: number;
  invMomentOfInertia: number;

  private torqueAccum = 0;

  constructor(options: RigidBodyOptions) {
    super(options);
    this.shape = options.shape;
    this.rotation = options.rotation ?? 0;
    this.angularVelocity = options.angularVelocity ?? 0;
    this.friction = options.friction ?? 0.3;

    if (this.isStatic) {
      this.momentOfInertia = Infinity;
      this.invMomentOfInertia = 0;
    } else {
      this.momentOfInertia = computeMomentOfInertia(this.shape, this.mass);
      this.invMomentOfInertia =
        this.momentOfInertia === 0 ? 0 : 1 / this.momentOfInertia;
    }
  }

  /** Accumulate torque (N·m) directly — positive is counter-clockwise. */
  applyTorque(torque: number): void {
    if (this.isStatic) return;
    this.torqueAccum += torque;
  }

  /**
   * Apply a force at a point offset from the center of mass. Splits into
   * the usual linear force plus torque = r × F, where r is the offset
   * from center to the application point — exactly how pushing a door
   * far from its hinge turns it more easily than pushing near the hinge.
   */
  applyForceAtPoint(
    force: { x: number; y: number },
    worldPoint: { x: number; y: number },
  ): void {
    this.applyForce(force);
    const r = Vector2.sub(worldPoint, this.position);
    this.applyTorque(Vector2.cross(r, force));
  }

  /**
   * Apply an impulse at a contact point — the core operation for
   * collision response against a rotating body. Changes both linear
   * velocity (Δv = J / m) and angular velocity (Δω = (r × J) / I).
   */
  applyImpulseAtPoint(
    impulse: { x: number; y: number },
    worldPoint: { x: number; y: number },
  ): void {
    if (this.isStatic) return;
    this.applyImpulse(impulse);
    const r = Vector2.sub(worldPoint, this.position);
    this.angularVelocity += Vector2.cross(r, impulse) * this.invMomentOfInertia;
  }

  consumeTorque(): number {
    const t = this.torqueAccum;
    this.torqueAccum = 0;
    return t;
  }

  /** Velocity of a specific point on the body, including its contribution from spin (v + ω × r). */
  velocityAtPoint(worldPoint: { x: number; y: number }): Vector2 {
    const r = Vector2.sub(worldPoint, this.position);
    return this.velocity.add(Vector2.crossScalar(this.angularVelocity, r));
  }

  // --- Educational readouts ------------------------------------------------

  /** L = I ω */
  get angularMomentum(): number {
    return this.isStatic ? 0 : this.momentOfInertia * this.angularVelocity;
  }

  /** Rotational KE = ½ I ω² */
  get rotationalKineticEnergy(): number {
    return this.isStatic
      ? 0
      : 0.5 *
          this.momentOfInertia *
          this.angularVelocity *
          this.angularVelocity;
  }

  get totalKineticEnergy(): number {
    return this.kineticEnergy + this.rotationalKineticEnergy;
  }
}
