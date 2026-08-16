import type { Particle } from "../core/particle";
import type { ForceGenerator } from "./force";

export type DragModel = "linear" | "quadratic";

/**
 * Air resistance opposing a body's current velocity.
 *
 *  - **Linear** drag: F = -c*v - proportional to speed, the model
 *    that's analytically solvable and closest to real drag at low
 *    speeds (e.g. a marble falling through syrup).
 *  - **Quadratic** drag: F = -c*|v|*v - proportional to speed squared,
 *    the more realistic model at everyday speeds (a thrown ball, a
 *    falling skydiver) and the one `projectile-motion/physics.ts` uses
 *    for its own numeric fallback when air resistance is switched on -
 *    this class exists so any *other* simulation built on the engine
 *    (e.g. a future Free Fall lesson comparing drag models) can reuse
 *    the same two formulas instead of re-deriving them.
 */
export class Drag implements ForceGenerator {
  constructor(
    private bodies: Particle[],
    public coefficient: number,
    public model: DragModel = "quadratic",
  ) {}

  apply(): void {
    for (const body of this.bodies) {
      if (body.isStatic) continue;
      const speed = body.velocity.magnitude();
      if (speed === 0) continue;

      const magnitude =
        this.model === "linear"
          ? this.coefficient * speed
          : this.coefficient * speed * speed;

      // Force points opposite the velocity direction (velocity / speed = unit vector).
      body.applyForce(body.velocity.scale(-magnitude / speed));
    }
  }
}
