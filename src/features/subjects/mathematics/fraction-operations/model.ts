export interface Fraction {
  num: number;
  den: number;
}

export type Operation = "add" | "subtract" | "multiply" | "divide";

/** Denominators offered on the pickers — friendly, commonly-taught
 *  values rather than every possible integer. */
export const DENOMINATOR_OPTIONS = [2, 3, 4, 5, 6, 8, 10, 12];

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    [x, y] = [y, x % y];
  }
  return x || 1;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

/** Reduces a fraction to lowest terms. `den` is always kept positive
 *  (a negative result surfaces through `num` instead). */
export function simplify(f: Fraction): Fraction {
  if (f.num === 0) return { num: 0, den: 1 };
  const divisor = gcd(f.num, f.den);
  const sign = f.den < 0 ? -1 : 1;
  return { num: (f.num / divisor) * sign, den: (f.den / divisor) * sign };
}

/** Converts a (possibly improper) fraction into a mixed-number
 *  string, e.g. 11/4 -> "2 3/4", 8/4 -> "2", 3/4 -> "3/4". */
export function toMixedString(f: Fraction): string {
  const simplified = simplify(f);
  const sign = simplified.num < 0 ? "-" : "";
  const num = Math.abs(simplified.num);
  const den = simplified.den;
  if (num === 0) return "0";
  const whole = Math.floor(num / den);
  const rem = num % den;
  if (whole === 0) return `${sign}${num}/${den}`;
  if (rem === 0) return `${sign}${whole}`;
  return `${sign}${whole} ${rem}/${den}`;
}

/** Addition/subtraction share the "convert to a common denominator,
 *  then combine numerators" shape — one helper, sign of the second
 *  numerator flips for subtraction. */
function combine(a: Fraction, b: Fraction, sign: 1 | -1): Fraction {
  const commonDen = lcm(a.den, b.den);
  const scaledA = a.num * (commonDen / a.den);
  const scaledB = b.num * (commonDen / b.den);
  return { num: scaledA + sign * scaledB, den: commonDen };
}

export function addFractions(a: Fraction, b: Fraction): Fraction {
  return combine(a, b, 1);
}

export function subtractFractions(a: Fraction, b: Fraction): Fraction {
  return combine(a, b, -1);
}

export function multiplyFractions(a: Fraction, b: Fraction): Fraction {
  return { num: a.num * b.num, den: a.den * b.den };
}

export function divideFractions(a: Fraction, b: Fraction): Fraction {
  if (b.num === 0) return { num: 0, den: 1 };
  return multiplyFractions(a, { num: b.den, den: b.num });
}

export function computeOperation(operation: Operation, a: Fraction, b: Fraction): Fraction {
  switch (operation) {
    case "add":
      return addFractions(a, b);
    case "subtract":
      return subtractFractions(a, b);
    case "multiply":
      return multiplyFractions(a, b);
    case "divide":
      return divideFractions(a, b);
  }
}

export const OPERATION_SYMBOLS: Record<Operation, string> = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
};

export const OPERATION_LABELS: Record<Operation, string> = {
  add: "Add",
  subtract: "Subtract",
  multiply: "Multiply",
  divide: "Divide",
};
