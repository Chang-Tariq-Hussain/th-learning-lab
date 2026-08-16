import type { Particle } from "./types";

/**
 * The stage is one 0-100 coordinate space split by a membrane at
 * x = 50. Everything below is expressed as percentages so the
 * rendering layer just does `left: ${x}%` / `top: ${y}%` with a CSS
 * transition — no rAF loop, no pixel math, no engine.
 */
const LEFT_MIN = 6;
const LEFT_MAX = 44;
const RIGHT_MIN = 56;
const RIGHT_MAX = 94;
const Y_MIN = 12;
const Y_MAX = 88;

/** How long a "Start" animation takes — slow enough to visibly watch, per the spec. */
export const TRANSITION_MS = 3200;

// ---------------------------------------------------------------------------
// Diffusion
// ---------------------------------------------------------------------------

const DIFFUSION_OUTSIDE_COUNT = 10;
const DIFFUSION_INSIDE_COUNT = 4;
export const DIFFUSION_TOTAL = DIFFUSION_OUTSIDE_COUNT + DIFFUSION_INSIDE_COUNT;

/**
 * Deterministic (index-driven, no Math.random) so the very first paint
 * is identical on server and client — avoids hydration mismatches.
 * Left/outside starts crowded, right/inside starts sparse.
 */
export function createInitialDiffusionParticles(): Particle[] {
  const particles: Particle[] = [];

  for (let i = 0; i < DIFFUSION_OUTSIDE_COUNT; i++) {
    particles.push({
      id: `diff-outside-${i}`,
      xPercent: LEFT_MIN + ((i * 37) % 100) * ((LEFT_MAX - LEFT_MIN) / 100),
      yPercent: Y_MIN + ((i * 53) % 100) * ((Y_MAX - Y_MIN) / 100),
    });
  }

  for (let i = 0; i < DIFFUSION_INSIDE_COUNT; i++) {
    particles.push({
      id: `diff-inside-${i}`,
      xPercent: RIGHT_MIN + ((i * 61) % 100) * ((RIGHT_MAX - RIGHT_MIN) / 100),
      yPercent: Y_MIN + ((i * 41) % 100) * ((Y_MAX - Y_MIN) / 100),
    });
  }

  return particles;
}

/**
 * Target layout once "Start Diffusion" is pressed: every particle gets
 * a fresh, roughly-even spot across the *whole* stage (not just its
 * old side), so the CSS transition reads as "spreading out until
 * evenly mixed" — the one idea this mode needs to teach.
 */
export function createDiffusedParticles(particles: Particle[]): Particle[] {
  return particles.map((particle, index) => {
    const onLeft = index % 2 === 0;
    const [min, max] = onLeft ? [LEFT_MIN, LEFT_MAX] : [RIGHT_MIN, RIGHT_MAX];
    return {
      ...particle,
      xPercent: min + Math.random() * (max - min),
      yPercent: Y_MIN + Math.random() * (Y_MAX - Y_MIN),
    };
  });
}

// ---------------------------------------------------------------------------
// Osmosis
// ---------------------------------------------------------------------------

const WATER_PER_SIDE = 6;
export const WATER_TOTAL = WATER_PER_SIDE * 2;
/** How many water dots cross toward the high-solute side when osmosis runs. */
const WATER_CROSSING_COUNT = 3;

const SOLUTE_LOW_COUNT = 2;
const SOLUTE_HIGH_COUNT = 7;

export function createInitialWaterParticles(): Particle[] {
  const particles: Particle[] = [];

  for (let i = 0; i < WATER_PER_SIDE; i++) {
    particles.push({
      id: `water-low-${i}`,
      xPercent: LEFT_MIN + ((i * 29) % 100) * ((LEFT_MAX - LEFT_MIN) / 100),
      yPercent: Y_MIN + ((i * 47) % 100) * ((Y_MAX - Y_MIN) / 100),
    });
  }

  for (let i = 0; i < WATER_PER_SIDE; i++) {
    particles.push({
      id: `water-high-${i}`,
      xPercent: RIGHT_MIN + ((i * 31) % 100) * ((RIGHT_MAX - RIGHT_MIN) / 100),
      yPercent: Y_MIN + ((i * 43) % 100) * ((Y_MAX - Y_MIN) / 100),
    });
  }

  return particles;
}

/** Fixed, non-moving solute dots — solute never crosses the membrane in this simplified model. */
export function createSoluteParticles(): Particle[] {
  const particles: Particle[] = [];

  for (let i = 0; i < SOLUTE_LOW_COUNT; i++) {
    particles.push({
      id: `solute-low-${i}`,
      xPercent: LEFT_MIN + ((i * 67) % 100) * ((LEFT_MAX - LEFT_MIN) / 100),
      yPercent: Y_MIN + ((i * 71) % 100) * ((Y_MAX - Y_MIN) / 100),
    });
  }

  for (let i = 0; i < SOLUTE_HIGH_COUNT; i++) {
    particles.push({
      id: `solute-high-${i}`,
      xPercent: RIGHT_MIN + ((i * 59) % 100) * ((RIGHT_MAX - RIGHT_MIN) / 100),
      yPercent: Y_MIN + ((i * 37) % 100) * ((Y_MAX - Y_MIN) / 100),
    });
  }

  return particles;
}

/**
 * Moves a handful of water dots from the low-solute side to the
 * high-solute side — water follows solute in this simplified model.
 * The dots that started on the high side stay put.
 */
export function createOsmosedWaterParticles(particles: Particle[]): Particle[] {
  let crossed = 0;
  return particles.map((particle) => {
    const startedLow = particle.id.startsWith("water-low-");
    if (startedLow && crossed < WATER_CROSSING_COUNT) {
      crossed += 1;
      return {
        ...particle,
        xPercent: RIGHT_MIN + Math.random() * (RIGHT_MAX - RIGHT_MIN),
        yPercent: Y_MIN + Math.random() * (Y_MAX - Y_MIN),
      };
    }
    return particle;
  });
}

/** Water-level fill height (percent of chamber height) for the two chambers, before and after osmosis. */
export const WATER_LEVEL_IDLE = { low: 55, high: 55 } as const;
export const WATER_LEVEL_DONE = { low: 40, high: 70 } as const;
