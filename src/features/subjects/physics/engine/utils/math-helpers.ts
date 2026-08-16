export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Inverse of `lerp` — where does `value` sit between `a` and `b`, as a 0–1 fraction? */
export function inverseLerp(a: number, b: number, value: number): number {
  return a === b ? 0 : (value - a) / (b - a);
}

/** Remap `value` from the [inMin, inMax] range to [outMin, outMax], e.g. converting a slider 0–100 into a force 0–500. */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return lerp(outMin, outMax, inverseLerp(inMin, inMax, value));
}

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/** Smoothstep — an ease-in/ease-out 0→1 curve, nicer than linear `lerp` for animating a UI value. */
export function smoothstep(t: number): number {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

// --- Random generators -------------------------------------------------

export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max + 1));
}

export function randomSign(): 1 | -1 {
  return Math.random() < 0.5 ? -1 : 1;
}

/**
 * A seeded pseudo-random generator (mulberry32). Use this instead of
 * `Math.random()` whenever a simulation needs *repeatable* randomness —
 * e.g. "Challenge Mode" spawning the same layout of targets for every
 * student who gets seed #4271, so results are comparable.
 */
export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
