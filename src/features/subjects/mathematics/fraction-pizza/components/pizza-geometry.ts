export interface Point {
  x: number;
  y: number;
}

/** `angleDeg` is measured clockwise from straight up (12 o'clock), matching how a pizza is normally described as being cut. */
export function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): Point {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** SVG path for one pizza wedge, from `startAngle` to `endAngle` (degrees, clockwise from 12 o'clock). */
export function wedgePath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
}

/** The direction (unit vector) a wedge "points" — used to pull a selected/hovered slice outward realistically. */
export function wedgeDirection(startAngle: number, endAngle: number): Point {
  const mid = (startAngle + endAngle) / 2;
  const rad = ((mid - 90) * Math.PI) / 180;
  return { x: Math.cos(rad), y: Math.sin(rad) };
}

/** Evenly divides a full circle into `count` wedges, returning each one's [start, end) angle range. */
export function wedgeAngles(count: number): { start: number; end: number }[] {
  const step = 360 / count;
  return Array.from({ length: count }, (_, i) => ({
    start: i * step,
    end: (i + 1) * step,
  }));
}
