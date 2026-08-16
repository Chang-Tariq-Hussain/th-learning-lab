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
  /** What both sides were divided by to reach a:b. */
  divisor: number;
  alreadySimplest: boolean;
}

/**
 * Reduces a:b to lowest terms by dividing both sides by their greatest
 * common divisor — the same idea as simplifying a fraction, applied to
 * two whole quantities instead of one number over another.
 */
export function simplifyRatio(a: number, b: number): SimplifiedRatio {
  if (a === 0 && b === 0) {
    return { a: 0, b: 0, divisor: 1, alreadySimplest: true };
  }
  const divisor = gcd(a, b) || 1;
  return {
    a: a / divisor,
    b: b / divisor,
    divisor,
    alreadySimplest: divisor === 1,
  };
}

/** Two ratios "match" when they reduce to the same simplest form. Zero on either side never matches. */
export function ratiosMatch(a1: number, b1: number, a2: number, b2: number): boolean {
  if (a1 === 0 || b1 === 0) return false;
  const s1 = simplifyRatio(a1, b1);
  const s2 = simplifyRatio(a2, b2);
  return s1.a === s2.a && s1.b === s2.b;
}
