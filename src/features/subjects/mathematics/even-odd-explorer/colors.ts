/**
 * Even → blue, odd → amber, matching the "positive/negative/zero"
 * convention in `number-line/colors.ts`: plain hex, not the
 * Mathematics subject token, because these colors mean "even/odd"
 * specifically, not "belongs to Mathematics."
 */
export const EVEN_COLOR = "#3D5AFE";
export const ODD_COLOR = "#F2A65A";

export function colorForParity(n: number): string {
  return isEven(n) ? EVEN_COLOR : ODD_COLOR;
}

export function isEven(n: number): boolean {
  return ((n % 2) + 2) % 2 === 0;
}
