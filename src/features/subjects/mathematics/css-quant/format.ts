export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

/** Trim floating noise and trailing zeros: 12.50 -> "12.5", 3 -> "3". */
export function num(n: number, dp = 2): string {
  const r = Number(n.toFixed(dp));
  return Object.is(r, -0) ? "0" : String(r);
}

/** Reduced fraction text: frac(6, 4) -> "3/2", frac(6, 3) -> "2". */
export function frac(n: number, d: number): string {
  const g = gcd(n, d);
  const nn = n / g;
  const dd = d / g;
  return dd === 1 ? String(nn) : `${nn}/${dd}`;
}

export function simplifyRatio(parts: number[]): number[] {
  const g = parts.reduce((x, y) => gcd(x, y));
  return parts.map((p) => p / g);
}

export function ratioText(parts: number[]): string {
  return parts.join(" : ");
}

/** Mixed-number text for a positive fraction: mixedText(24, 5) -> "4 4/5". */
export function mixedText(n: number, d: number): string {
  const g = gcd(n, d);
  const nn = n / g;
  const dd = d / g;
  if (dd === 1) return String(nn);
  const whole = Math.floor(nn / dd);
  const rem = nn % dd;
  return whole === 0 ? `${rem}/${dd}` : `${whole} ${rem}/${dd}`;
}
