/** Greatest common divisor via the Euclidean algorithm. gcd(0, n) = n, gcd(0, 0) = 0. */
export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    [x, y] = [y, x % y];
  }
  return x;
}

export interface SimplifiedRatio {
  a: number;
  b: number;
}

/** Reduces a:b to lowest terms by dividing both sides by their greatest common divisor. */
export function simplifyRatio(a: number, b: number): SimplifiedRatio {
  const divisor = gcd(a, b) || 1;
  return { a: a / divisor, b: b / divisor };
}

/** Random integer in [min, max], inclusive on both ends. */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Fisher–Yates shuffle — returns a new array, leaves the input untouched. */
export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

/** Picks one random element from a non-empty array. */
export function pickOne<T>(items: readonly T[]): T {
  return items[randInt(0, items.length - 1)]!;
}
