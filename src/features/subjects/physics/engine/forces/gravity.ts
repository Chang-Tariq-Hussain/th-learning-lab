import { Vector2 } from "../math/vector2";
import type { Particle } from "../core/particle";
import type { ForceGenerator } from "./force";

/**
 * Uniform gravitational field — every body gets the same acceleration
 * `g`, regardless of mass (F = m g, so a = F/m = g). This is what every
 * "ball falls to the ground" or "projectile arcs through the air"
 * scenario needs, and matches the constant-g model used in
 * `projectile-motion/physics.ts`.
 */
export class UniformGravity implements ForceGenerator {
  constructor(
    private bodies: Particle[],
    public strength = 9.81,
    public direction: { x: number; y: number } = { x: 0, y: -1 },
  ) {}

  apply(): void {
    const dir = Vector2.from(this.direction).normalize();
    for (const body of this.bodies) {
      if (body.isStatic) continue;
      // F = m g — scaling by mass here (rather than applying acceleration
      // directly) keeps this a genuine force, so it composes correctly
      // with every other force in the accumulator.
      body.applyForce(dir.scale(this.strength * body.mass));
    }
  }
}

/**
 * Newtonian gravity between two point masses: F = G m₁m₂ / r². Optional
 * and separate from `UniformGravity` — useful for an orbital-motion
 * simulation, where gravity has to fall off with distance and depend on
 * both masses, unlike the constant field used for everyday projectiles.
 */
export class NewtonianGravity implements ForceGenerator {
  /** G is left configurable (rather than hardcoded to 6.674e-11) so a simulation can use "game units" where orbits are visible on a normal-sized canvas. */
  constructor(
    private bodies: Particle[],
    public G = 1,
    public softening = 0.05,
  ) {}

  apply(): void {
    for (let i = 0; i < this.bodies.length; i++) {
      const a = this.bodies[i]!;
      if (a.isStatic) continue;
      for (let j = 0; j < this.bodies.length; j++) {
        if (i === j) continue;
        const b = this.bodies[j]!;
        const rVec = Vector2.sub(b.position, a.position);
        // Softening avoids a divide-by-near-zero singularity (and the
        // resulting numerical explosion) when two bodies pass very close.
        const distSq =
          rVec.magnitudeSquared() + this.softening * this.softening;
        const forceMag = (this.G * a.mass * b.mass) / distSq;
        a.applyForce(rVec.normalize().scale(forceMag));
      }
    }
  }
}
