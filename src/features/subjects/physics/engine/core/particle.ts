import { Vector2 } from "../math/vector2";

let nextParticleId = 1;

export interface ParticleOptions {
  position?: { x: number; y: number };
  velocity?: { x: number; y: number };
  /** kg. Use `Infinity` (or `isStatic: true`) for an immovable object. */
  mass?: number;
  isStatic?: boolean;
  /** 0–1 linear damping applied each step, e.g. 0.01 for light air drag. Independent of the explicit `Drag` force generator — this is a cheap always-on approximation. */
  damping?: number;
  /** 0 = perfectly inelastic (no bounce), 1 = perfectly elastic. Used by the collision resolver. */
  restitution?: number;
  /** Free-form label/metadata for educational display, e.g. `{ label: "Ball A" }`. */
  userData?: Record<string, unknown>;
}

/**
 * A point mass: position, velocity, and the forces acting on it, with no
 * size, shape, or rotation. This is exactly what the closed-form
 * projectile-motion equations model — a `Particle` under `Gravity` and
 * optionally `Drag` reproduces that simulation's numeric integration
 * (see `physics/projectile-motion/physics.ts`) as a special case of this
 * more general engine.
 *
 * `RigidBody` (in this same folder) extends this with shape, rotation,
 * and angular dynamics for simulations that need bodies to spin or rest
 * on top of each other.
 */
export class Particle {
  readonly id: number;
  position: Vector2;
  velocity: Vector2;
  /** Updated by `World.step()` after integration; read-only from the outside. */
  readonly acceleration = new Vector2(0, 0);

  mass: number;
  /** 1/mass — precomputed since it's what every force/impulse calculation actually needs. 0 for static (infinite-mass) bodies. */
  invMass: number;
  isStatic: boolean;
  damping: number;
  restitution: number;
  userData: Record<string, unknown>;

  /** Accumulated this step by `applyForce`; reset to zero after each `World.step()`. */
  private forceAccum = new Vector2(0, 0);

  constructor(options: ParticleOptions = {}) {
    this.id = nextParticleId++;
    this.position = options.position
      ? Vector2.from(options.position)
      : new Vector2();
    this.velocity = options.velocity
      ? Vector2.from(options.velocity)
      : new Vector2();
    this.isStatic = options.isStatic ?? false;
    this.mass = this.isStatic ? Infinity : (options.mass ?? 1);
    this.invMass = this.isStatic || this.mass === Infinity ? 0 : 1 / this.mass;
    this.damping = options.damping ?? 0;
    this.restitution = options.restitution ?? 0.6;
    this.userData = options.userData ?? {};
  }

  /** Accumulate a force (Newtons) to be applied on the next integration step. Forces — unlike impulses — are continuous and get reset every step. */
  applyForce(force: { x: number; y: number }): void {
    if (this.isStatic) return;
    this.forceAccum.addInPlace(force);
  }

  /**
   * An impulse (N·s) changes velocity instantly: Δv = J / m. Used for
   * collision response and instantaneous kicks, as opposed to `applyForce`
   * which acts continuously over a timestep.
   */
  applyImpulse(impulse: { x: number; y: number }): void {
    if (this.isStatic) return;
    this.velocity.addScaledInPlace(impulse, this.invMass);
  }

  /** Net force currently accumulated (before this step's integration clears it). */
  get netForce(): Vector2 {
    return this.forceAccum.clone();
  }

  consumeForces(): Vector2 {
    const f = this.forceAccum;
    this.forceAccum = new Vector2(0, 0);
    return f;
  }

  // --- Educational readouts ------------------------------------------------

  get speed(): number {
    return this.velocity.magnitude();
  }

  /** p = m v */
  get momentum(): Vector2 {
    return this.velocity.scale(this.isStatic ? 0 : this.mass);
  }

  /** KE = ½ m v² */
  get kineticEnergy(): number {
    return this.isStatic
      ? 0
      : 0.5 * this.mass * this.velocity.magnitudeSquared();
  }

  /** PE = m g h, measured above `groundY` under gravitational strength `g`. */
  potentialEnergy(g: number, groundY = 0): number {
    return this.isStatic
      ? 0
      : this.mass * g * Math.max(0, this.position.y - groundY);
  }
}
