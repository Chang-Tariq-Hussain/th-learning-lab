import { Particle } from "../core/particle";
import { RigidBody } from "../core/rigid-body";

/** An `Integrator` advances one body's motion by `dt` seconds, given whatever force/torque it accumulated this step. */
export type Integrator = (body: Particle, dt: number) => void;

/**
 * Semi-implicit (symplectic) Euler — the default and recommended
 * integrator. Updates velocity from acceleration *first*, then updates
 * position using the *new* velocity (as opposed to explicit Euler,
 * which uses the old velocity for both). This small reordering makes it
 * far more energy-stable over many steps, which is why
 * `projectile-motion/physics.ts` also uses it — a pendulum integrated
 * this way swings indefinitely instead of visibly gaining or losing
 * height over time.
 */
export const semiImplicitEuler: Integrator = (body, dt) => {
  if (body.isStatic) return;

  const force = body.consumeForces();
  body.acceleration.copyFrom(force).scaleInPlace(body.invMass);

  body.velocity.addScaledInPlace(body.acceleration, dt);
  if (body.damping > 0) body.velocity.scaleInPlace(1 - body.damping);
  body.position.addScaledInPlace(body.velocity, dt);

  if (body instanceof RigidBody) {
    const torque = body.consumeTorque();
    const angularAcceleration = torque * body.invMomentOfInertia;
    body.angularVelocity += angularAcceleration * dt;
    body.rotation += body.angularVelocity * dt;
  }
};

/**
 * Explicit (forward) Euler — included mainly so a lesson can *show* the
 * difference: this integrator uses the pre-update velocity to move
 * position, which is simpler to derive by hand but visibly leaks energy
 * (or gains it) over time, especially with springs or long pendulum
 * swings. Prefer `semiImplicitEuler` for anything students will watch
 * run for more than a few seconds.
 */
export const explicitEuler: Integrator = (body, dt) => {
  if (body.isStatic) return;

  const force = body.consumeForces();
  body.acceleration.copyFrom(force).scaleInPlace(body.invMass);

  // Position uses the OLD velocity — the key difference from semi-implicit Euler.
  body.position.addScaledInPlace(body.velocity, dt);
  body.velocity.addScaledInPlace(body.acceleration, dt);
  if (body.damping > 0) body.velocity.scaleInPlace(1 - body.damping);

  if (body instanceof RigidBody) {
    const torque = body.consumeTorque();
    const angularAcceleration = torque * body.invMomentOfInertia;
    body.rotation += body.angularVelocity * dt;
    body.angularVelocity += angularAcceleration * dt;
  }
};
