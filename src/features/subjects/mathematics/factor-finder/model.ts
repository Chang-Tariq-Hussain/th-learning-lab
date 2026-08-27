export type Mode = "factors" | "multiples";

/** Highest candidate factor shown as a tile — kept small (12×12
 *  multiplication-table territory) so every target's true factors in
 *  this range are findable by tapping, without the grid growing huge. */
export const FACTOR_CANDIDATE_MAX = 12;

/** Range of composite targets used in Factors mode — large enough to
 *  have several factors below `FACTOR_CANDIDATE_MAX`, small enough to
 *  stay mental-math friendly. */
const FACTOR_TARGET_MIN = 12;
const FACTOR_TARGET_MAX = 60;

/** Upper bound of the multiples grid in Multiples mode. */
export const MULTIPLES_GRID_MAX = 50;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Every factor of `n` from 1 to n itself, ascending. */
export function factorsOf(n: number): number[] {
  const factors: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) factors.push(i);
  }
  return factors;
}

/** The factors of `n` that fall within the tappable candidate range
 *  (1..FACTOR_CANDIDATE_MAX) — what the student is actually asked to find. */
export function findableFactors(n: number): number[] {
  return factorsOf(n).filter((f) => f <= FACTOR_CANDIDATE_MAX);
}

/** `n`'s pair partner for a given factor, e.g. partnerFor(12, 3) = 4. */
export function partnerFor(n: number, factor: number): number {
  return n / factor;
}

export function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

/** Picks a random composite target with at least 3 findable factors
 *  (so the round isn't trivially short), retrying to avoid repeating
 *  the immediately preceding target. */
export function nextFactorTarget(exclude?: number): number {
  let candidate = randomInt(FACTOR_TARGET_MIN, FACTOR_TARGET_MAX);
  let attempts = 0;
  while ((candidate === exclude || findableFactors(candidate).length < 3) && attempts < 30) {
    candidate = randomInt(FACTOR_TARGET_MIN, FACTOR_TARGET_MAX);
    attempts++;
  }
  return candidate;
}

/** Every multiple of `base` from base up to `max`, ascending. */
export function multiplesOf(base: number, max: number): number[] {
  const multiples: number[] = [];
  for (let m = base; m <= max; m += base) multiples.push(m);
  return multiples;
}

/** Picks a random base (3-9, skipping 1 and 2 as too trivial to
 *  search a 50-cell grid for) for Multiples mode, avoiding an
 *  immediate repeat. */
export function nextMultipleBase(exclude?: number): number {
  let candidate = randomInt(3, 9);
  let attempts = 0;
  while (candidate === exclude && attempts < 10) {
    candidate = randomInt(3, 9);
    attempts++;
  }
  return candidate;
}
