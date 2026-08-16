/**
 * Projectile motion physics.
 *
 * Kept free of React/canvas/framework imports on purpose: every function
 * here is a pure function of numbers in, numbers out, so it can be unit
 * tested or reused (e.g. server-side, in a worker) independent of the UI.
 *
 * Coordinate convention: launch point is the origin (0, 0). +x is the
 * direction of travel, +y is up. Gravity is a positive scalar (m/s^2);
 * its effect is subtracted, never a signed input.
 */

export interface GravityPreset {
  key: string;
  label: string;
  /** m/s^2 */
  value: number;
}

export const GRAVITY_PRESETS: GravityPreset[] = [
  { key: "moon", label: "Moon", value: 1.62 },
  { key: "mars", label: "Mars", value: 3.71 },
  { key: "earth", label: "Earth", value: 9.81 },
  { key: "jupiter", label: "Jupiter", value: 24.79 },
  { key: "custom", label: "Custom", value: NaN },
];

export function resolveGravity(presetKey: string, customValue: number): number {
  if (presetKey === "custom") return customValue;
  return GRAVITY_PRESETS.find((p) => p.key === presetKey)?.value ?? 9.81;
}

/** Launch inputs shared by every calculation below. */
export interface LaunchParams {
  /** Launch speed, m/s */
  speed: number;
  /** Launch angle above horizontal, degrees */
  angleDeg: number;
  /** Gravitational acceleration, m/s^2 */
  gravity: number;
  /** kg — only used for energy readouts, motion itself is mass-independent */
  mass: number;
  /**
   * Simple linear-in-velocity-squared drag coefficient (kg/m, already
   * divided by mass). 0 disables air resistance. When > 0 the closed-form
   * equations below no longer apply exactly, so the simulation switches
   * to numerical integration (see `simulateTrajectory`).
   */
  dragCoefficient: number;
}

export interface KinematicState {
  t: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
}

const toRadians = (deg: number) => (deg * Math.PI) / 180;

// ---------------------------------------------------------------------------
// Closed-form (no air resistance) equations — the ones shown in the
// Formula panel. These are exact only when dragCoefficient === 0; they're
// still computed and labeled as the "ideal" reference case even when drag
// is enabled, so students can compare ideal vs. drag-affected motion.
// ---------------------------------------------------------------------------

/** x = v cos(theta) t */
export function idealX(t: number, { speed, angleDeg }: LaunchParams): number {
  return speed * Math.cos(toRadians(angleDeg)) * t;
}

/** y = v sin(theta) t - 1/2 g t^2 */
export function idealY(t: number, { speed, angleDeg, gravity }: LaunchParams): number {
  return speed * Math.sin(toRadians(angleDeg)) * t - 0.5 * gravity * t * t;
}

/** H = v^2 sin^2(theta) / (2g) */
export function idealMaxHeight({ speed, angleDeg, gravity }: LaunchParams): number {
  const s = Math.sin(toRadians(angleDeg));
  return (speed * speed * s * s) / (2 * gravity);
}

/** T = 2 v sin(theta) / g */
export function idealTimeOfFlight({ speed, angleDeg, gravity }: LaunchParams): number {
  return (2 * speed * Math.sin(toRadians(angleDeg))) / gravity;
}

/** R = v^2 sin(2 theta) / g */
export function idealRange({ speed, angleDeg, gravity }: LaunchParams): number {
  return (speed * speed * Math.sin(toRadians(2 * angleDeg))) / gravity;
}

// ---------------------------------------------------------------------------
// Numerical simulation — used for both drawing (works identically with or
// without drag) and, when drag is enabled, for deriving range/height/time
// of flight numerically since no closed form exists.
// ---------------------------------------------------------------------------

export interface Trajectory {
  points: KinematicState[];
  maxHeight: number;
  maxHeightTime: number;
  range: number;
  timeOfFlight: number;
}

/**
 * Semi-implicit (symplectic) Euler integration. Chosen over plain Euler
 * because it conserves energy far better over many steps, which matters
 * for a simulation students may run at 10x speed for several seconds.
 * With dragCoefficient = 0 this reduces to the exact analytic trajectory
 * to within floating-point/step-size error.
 */
export function simulateTrajectory(
  params: LaunchParams,
  dt = 1 / 240,
  maxSeconds?: number
): Trajectory {
  // Drag only ever shortens a flight relative to the ideal (drag-free)
  // case, so the ideal time-of-flight is a safe basis for an adaptive
  // cap — this keeps the loop cheap for typical short flights while
  // still covering extreme low-gravity / high-angle / high-speed inputs
  // that would otherwise get truncated mid-flight by a fixed cap.
  const idealEstimate = idealTimeOfFlight(params);
  const cap = maxSeconds ?? Math.max(20, (Number.isFinite(idealEstimate) ? idealEstimate : 20) * 2.5 + 5);

  const angle = toRadians(params.angleDeg);
  let x = 0;
  let y = 0;
  let vx = params.speed * Math.cos(angle);
  let vy = params.speed * Math.sin(angle);
  let t = 0;

  const points: KinematicState[] = [{ t, x, y, vx, vy, speed: params.speed }];
  let maxHeight = 0;
  let maxHeightTime = 0;

  while (y >= 0 && t < cap) {
    const v = Math.hypot(vx, vy);
    const dragAx = -params.dragCoefficient * v * vx;
    const dragAy = -params.dragCoefficient * v * vy;

    vx += dragAx * dt;
    vy += (-params.gravity + dragAy) * dt;
    x += vx * dt;
    y += vy * dt;
    t += dt;

    if (y > maxHeight) {
      maxHeight = y;
      maxHeightTime = t;
    }

    points.push({ t, x, y, vx, vy, speed: Math.hypot(vx, vy) });
  }

  // The loop overshoots below ground on the final step; interpolate back
  // to the exact y = 0 crossing so range/time-of-flight are accurate
  // rather than off by up to one dt.
  const last = points[points.length - 1]!;
  const prev = points[points.length - 2] ?? last;
  if (last.y < 0 && prev.y >= 0 && prev !== last) {
    const frac = prev.y / (prev.y - last.y);
    const landingT = prev.t + (last.t - prev.t) * frac;
    const landingX = prev.x + (last.x - prev.x) * frac;
    points[points.length - 1] = {
      t: landingT,
      x: landingX,
      y: 0,
      vx: prev.vx + (last.vx - prev.vx) * frac,
      vy: prev.vy + (last.vy - prev.vy) * frac,
      speed: Math.hypot(last.vx, last.vy),
    };
  }

  const final = points[points.length - 1]!;
  return {
    points,
    maxHeight,
    maxHeightTime,
    range: final.x,
    timeOfFlight: final.t,
  };
}

/** Sample a precomputed trajectory at an arbitrary time via linear interpolation. */
export function sampleTrajectory(trajectory: Trajectory, t: number): KinematicState {
  const { points } = trajectory;
  const last = points[points.length - 1]!;
  if (t <= 0) return points[0]!;
  if (t >= last.t) return last;

  // Binary search for the surrounding samples (points are stored in
  // increasing time order at a fixed dt, so this is O(log n) per lookup).
  let lo = 0;
  let hi = points.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (points[mid]!.t <= t) lo = mid;
    else hi = mid;
  }
  const a = points[lo]!;
  const b = points[hi]!;
  const span = b.t - a.t || 1;
  const frac = (t - a.t) / span;
  return {
    t,
    x: a.x + (b.x - a.x) * frac,
    y: a.y + (b.y - a.y) * frac,
    vx: a.vx + (b.vx - a.vx) * frac,
    vy: a.vy + (b.vy - a.vy) * frac,
    speed: a.speed + (b.speed - a.speed) * frac,
  };
}

export interface EnergyState {
  potential: number;
  kinetic: number;
  total: number;
}

/** PE = mgh, KE = 1/2 m v^2 — evaluated at a given kinematic state. */
export function computeEnergy(state: KinematicState, mass: number, gravity: number): EnergyState {
  const potential = mass * gravity * Math.max(0, state.y);
  const kinetic = 0.5 * mass * state.speed * state.speed;
  return { potential, kinetic, total: potential + kinetic };
}
