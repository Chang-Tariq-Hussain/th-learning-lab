import { Vector2 } from "../math/vector2";
import { Particle } from "../core/particle";
import type { ForceGenerator } from "./force";

export interface SpringOptions {
  /** N/m — how stiff the spring is (Hooke's law constant). */
  stiffness: number;
  /** Natural length in meters — the distance at which the spring exerts no force. */
  restLength: number;
  /** Velocity-proportional damping, 0 = none. Without this, a spring oscillates forever. */
  damping?: number;
}

/**
 * A single spring connecting `bodyA` to either `bodyB` or a fixed
 * `anchor` point (for a "spring hanging from the ceiling" scenario).
 * Implements Hooke's law, `F = -k x`, where `x` is displacement from
 * rest length, plus a velocity-proportional damping term so energy
 * actually bleeds out of the system instead of oscillating forever —
 * the same qualitative behavior as a real spring with internal friction.
 */
export class Spring implements ForceGenerator {
  bodyB: Particle | null;
  anchor: Vector2 | null;
  stiffness: number;
  restLength: number;
  damping: number;

  constructor(
    public bodyA: Particle,
    target: Particle | { x: number; y: number },
    options: SpringOptions,
  ) {
    if (target instanceof Particle) {
      this.bodyB = target;
      this.anchor = null;
    } else {
      this.bodyB = null;
      this.anchor = Vector2.from(target);
    }
    this.stiffness = options.stiffness;
    this.restLength = options.restLength;
    this.damping = options.damping ?? 0;
  }

  private get otherPosition(): Vector2 {
    return this.bodyB ? this.bodyB.position : this.anchor!;
  }

  private get otherVelocity(): Vector2 {
    return this.bodyB ? this.bodyB.velocity : Vector2.zero();
  }

  /** Current extension beyond rest length — positive when stretched, negative when compressed. Useful for a live "spring extension" readout. */
  get extension(): number {
    return (
      Vector2.distance(this.bodyA.position, this.otherPosition) -
      this.restLength
    );
  }

  /** ½ k x² — energy stored in the spring at its current extension. */
  get potentialEnergy(): number {
    const x = this.extension;
    return 0.5 * this.stiffness * x * x;
  }

  apply(): void {
    const delta = Vector2.sub(this.otherPosition, this.bodyA.position);
    const distance = delta.magnitude();
    if (distance === 0) return;
    const direction = delta.scale(1 / distance);

    const springForceMag = this.stiffness * (distance - this.restLength);

    // Damping opposes relative velocity along the spring's own axis only
    // (not perpendicular motion), which is what keeps a swinging spring
    // from being unphysically slowed sideways.
    const relativeVelocity = Vector2.sub(
      this.otherVelocity,
      this.bodyA.velocity,
    );
    const dampingForceMag =
      this.damping * Vector2.dot(relativeVelocity, direction);

    const totalForce = direction.scale(springForceMag + dampingForceMag);
    this.bodyA.applyForce(totalForce);
    if (this.bodyB && !this.bodyB.isStatic) {
      this.bodyB.applyForce(totalForce.scale(-1));
    }
  }
}
