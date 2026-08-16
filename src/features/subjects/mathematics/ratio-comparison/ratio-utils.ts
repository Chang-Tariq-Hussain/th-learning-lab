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
  divisor: number;
}

/** Reduces a:b to lowest terms by dividing both sides by their greatest common divisor. */
export function simplifyRatio(a: number, b: number): SimplifiedRatio {
  const divisor = gcd(a, b) || 1;
  return { a: a / divisor, b: b / divisor, divisor };
}

/** Two ratios are equivalent when they reduce to the same simplest form. */
export function isEquivalent(a1: number, b1: number, a2: number, b2: number): boolean {
  const s1 = simplifyRatio(a1, b1);
  const s2 = simplifyRatio(a2, b2);
  return s1.a === s2.a && s1.b === s2.b;
}
