/**
 * Pure, framework-free physics for Gravitation — mirrors the
 * convention set by `circular-motion/physics.ts` and
 * `work-energy-power/model.ts`: plain functions on plain numbers, no
 * React or engine dependency, so the formulas themselves are easy to
 * read and test in isolation from how they're wired into the lab.
 *
 * Two distinct unit systems are used deliberately, and each function
 * below says which it's for:
 *
 * - **Force Lab** (`computeGravitationalForceReal`, the `WORLD_PRESETS`
 *   table) uses the *real* gravitational constant and real-scale
 *   planetary masses/gravities — nothing is fudged, so the numbers
 *   these produce are physically accurate, just naturally very large
 *   or very small, exactly as real gravitation is.
 * - **Orbit** (`computeOrbitalSpeed`, `computeEscapeVelocity`, and the
 *   engine's `NewtonianGravity` force generator with a configurable
 *   G) uses small idealized "toy" units so an orbit is visible on a
 *   normal canvas over a few seconds — the same trade-off the engine's
 *   own `NewtonianGravity` doc comment describes ("G left configurable
 *   ... so a simulation can use game units where orbits are visible on
 *   a normal-sized canvas"). The lab labels this clearly as
 *   illustrative, not to astronomical scale, so nothing dishonest is
 *   implied about real orbital distances or periods.
 *
 * Both unit systems obey the exact same two formulas — that's the
 * point being taught, not the specific numbers.
 */

/** The real gravitational constant, N·m²/kg². Used only by the Force Lab (real SI units), never by the toy-unit Orbit lab. */
export const G_REAL = 6.674e-11;

/** F = G m₁m₂ / r² — works for any consistent unit system; callers supply G. */
export function computeGravitationalForce(m1: number, m2: number, r: number, G: number): number {
  if (r <= 0) return Infinity;
  return (G * m1 * m2) / (r * r);
}

/** g = GM / r² — the gravitational acceleration a (comparatively small) object experiences at distance r from a mass M. Notice m (the smaller object's own mass) never appears — this is exactly why gravitational acceleration doesn't depend on the falling object's mass. */
export function computeGravitationalAcceleration(M: number, r: number, G: number): number {
  if (r <= 0) return Infinity;
  return (G * M) / (r * r);
}

/** W = m g — weight is the force gravity exerts on an object of mass m, at whatever local gravitational acceleration g applies. */
export function computeWeight(m: number, g: number): number {
  return m * g;
}

/** The speed needed for a perfectly circular orbit at radius r around a (much larger, effectively fixed) central mass M: v = √(GM/r), derived by setting centripetal acceleration v²/r equal to gravitational acceleration GM/r². */
export function computeOrbitalSpeed(M: number, r: number, G: number): number {
  if (r <= 0) return 0;
  return Math.sqrt((G * M) / r);
}

/** The minimum speed needed to escape a central mass M's gravity entirely from radius r, never to fall back: v = √(2GM/r) — exactly √2 times the circular orbital speed at the same radius. */
export function computeEscapeVelocity(M: number, r: number, G: number): number {
  if (r <= 0) return 0;
  return Math.sqrt((2 * G * M) / r);
}

/** Formats a value with scientific notation once it's too large or small to read comfortably as a plain decimal — real gravitational forces and constants routinely fall far outside the range a fixed decimal count reads well at. */
export function formatScientific(value: number, digits = 3): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";
  const abs = Math.abs(value);
  if (abs >= 1e-3 && abs < 1e5) {
    if (abs >= 100) return value.toFixed(0);
    if (abs >= 1) return value.toFixed(2);
    return value.toFixed(4);
  }
  return value.toExponential(digits - 1).replace("e+", "×10^").replace("e-", "×10^-");
}

/** Simpler fixed-decimal formatter for toy-unit Orbit readouts, which never get astronomically large or small. */
export function formatReadout(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  if (abs >= 100) return value.toFixed(0);
  if (abs >= 10) return value.toFixed(1);
  return value.toFixed(2);
}

// ---------------------------------------------------------------------------
// Weight & Worlds — real published surface gravities, for the "same mass,
// different weight" comparison. Values in m/s²; Earth's matches the
// GRAVITY_PRESETS constant `newtons-laws/physics.ts` already uses (kept as
// this topic's own small copy of the shared constant, per that file's own
// documented convention, rather than a cross-topic import).
// ---------------------------------------------------------------------------

export interface WorldGravityPreset {
  key: string;
  label: string;
  /** Surface gravitational acceleration, m/s². */
  g: number;
}

export const WORLD_PRESETS: WorldGravityPreset[] = [
  { key: "mercury", label: "Mercury", g: 3.7 },
  { key: "venus", label: "Venus", g: 8.87 },
  { key: "moon", label: "The Moon", g: 1.62 },
  { key: "mars", label: "Mars", g: 3.71 },
  { key: "earth", label: "Earth", g: 9.81 },
  { key: "jupiter", label: "Jupiter", g: 24.79 },
];
