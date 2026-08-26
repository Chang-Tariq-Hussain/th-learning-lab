/**
 * Pure, framework-free physics for uniform circular motion. Mirrors
 * the convention `projectile-motion/physics.ts` and
 * `work-energy-power/model.ts` established: plain functions taking
 * and returning plain numbers, so this file is trivially testable on
 * its own and carries no dependency on React, canvas, or the
 * simulation framework.
 *
 * Everything here models *uniform* circular motion — constant speed
 * around a fixed-radius circle. That's the right scope for this
 * topic: it's exactly the case where "constant speed but still
 * accelerating" is the whole point, and where v, a_c, and F_c reduce
 * to the clean textbook formulas below rather than needing calculus.
 */

export interface CircularMotionParams {
  /** Radius of the circular path, in meters. */
  radiusM: number;
  /** Constant (tangential) speed around the circle, in meters/second. */
  speedMs: number;
  /** Mass of the orbiting object, in kilograms — affects centripetal
   *  force only, never the motion's shape or the acceleration. */
  massKg: number;
}

/** ω = v / r. The rate the angle sweeps out, in radians/second. */
export function computeAngularVelocity(radiusM: number, speedMs: number): number {
  if (radiusM <= 0) return 0;
  return speedMs / radiusM;
}

/** T = 2πr / v (equivalently 2π / ω). Time for one full revolution, in seconds. */
export function computePeriod(radiusM: number, speedMs: number): number {
  if (speedMs <= 0) return Infinity;
  return (2 * Math.PI * radiusM) / speedMs;
}

/** f = 1 / T. Revolutions per second (Hz). */
export function computeFrequency(radiusM: number, speedMs: number): number {
  const period = computePeriod(radiusM, speedMs);
  if (!Number.isFinite(period) || period <= 0) return 0;
  return 1 / period;
}

/** a_c = v² / r. Magnitude of centripetal acceleration, in m/s², always
 *  directed toward the circle's center. */
export function computeCentripetalAcceleration(radiusM: number, speedMs: number): number {
  if (radiusM <= 0) return 0;
  return (speedMs * speedMs) / radiusM;
}

/** F_c = m v² / r. The *net* inward force required to keep the object
 *  on the circular path — not a separate, mysterious force of its
 *  own, but whatever real force (tension, gravity, friction, the
 *  normal force on a curve) happens to be supplying it. */
export function computeCentripetalForce(radiusM: number, speedMs: number, massKg: number): number {
  return massKg * computeCentripetalAcceleration(radiusM, speedMs);
}

export interface CircularMotionState {
  /** Angular position, in radians, wrapped to [0, 2π). Measured
   *  counterclockwise from the positive x-axis (3 o'clock), the same
   *  convention as standard math/unit-circle diagrams. */
  angleRad: number;
  /** Position on the circle, in meters, relative to the center. */
  position: { x: number; y: number };
  /** Tangential velocity vector, in m/s — always perpendicular to the
   *  radius, pointing in the direction of travel. */
  velocity: { x: number; y: number };
  /** Centripetal acceleration vector, in m/s² — always points from
   *  the current position straight toward the center. */
  acceleration: { x: number; y: number };
}

/**
 * Full kinematic state at time `t` (seconds since motion started),
 * for a fixed radius/speed. `direction` is +1 for counterclockwise,
 * -1 for clockwise — the sense of travel doesn't change any of the
 * scalar quantities (v, a_c, F_c, T, f), only which way the vectors
 * point, which is exactly the point this topic's Predict section
 * asks students to reason about.
 */
export function computeState(
  t: number,
  { radiusM, speedMs }: Pick<CircularMotionParams, "radiusM" | "speedMs">,
  direction: 1 | -1 = 1,
): CircularMotionState {
  const omega = computeAngularVelocity(radiusM, speedMs) * direction;
  const rawAngle = omega * t;
  const twoPi = 2 * Math.PI;
  const angleRad = ((rawAngle % twoPi) + twoPi) % twoPi;

  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  const position = { x: radiusM * cos, y: radiusM * sin };

  // Tangent direction: d/dt (r cosθ, r sinθ) = rω(-sinθ, cosθ).
  const velocity = {
    x: -speedMs * direction * sin,
    y: speedMs * direction * cos,
  };

  // Centripetal acceleration points from position to center: -(cosθ, sinθ) * a_c.
  const aMag = computeCentripetalAcceleration(radiusM, speedMs);
  const acceleration = { x: -aMag * cos, y: -aMag * sin };

  return { angleRad, position, velocity, acceleration };
}

/** Formats a value with a sensible number of decimal places for a
 *  live readout — whole numbers read cleanest above 100, otherwise
 *  two decimals is enough precision without noise. Mirrors
 *  `formatEnergyValue` in `work-energy-power/model.ts`. */
export function formatReadout(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  if (abs >= 100) return value.toFixed(0);
  if (abs >= 10) return value.toFixed(1);
  return value.toFixed(2);
}
