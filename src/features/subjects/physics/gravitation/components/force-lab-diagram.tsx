"use client";

const SVG_WIDTH = 560;
const SVG_HEIGHT = 220;
const CENTER_Y = 110;
const MIN_SEP = 90;
const MAX_SEP = 420;
const MIN_R = 20;
const MAX_R = 52;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/** Maps a slider value's own range onto a display range — a plain linear map, since this diagram is explicitly illustrative rather than to-scale (real masses/distances span far too many orders of magnitude to draw proportionally). */
function mapRange(value: number, inLo: number, inHi: number, outLo: number, outHi: number): number {
  const t = clamp((value - inLo) / (inHi - inLo), 0, 1);
  return outLo + t * (outHi - outLo);
}

export interface ForceLabDiagramProps {
  mass1: number;
  mass2: number;
  distance: number;
}

/**
 * A static (non-animated) two-body diagram — Force Lab is about
 * reading off a relationship across slider settings, not watching
 * motion, so unlike the Orbit panel this doesn't need the canvas
 * framework or the physics engine, the same reasoning
 * `simple-forces`/`work-energy-power` use for their own plain-SVG
 * panels. Circle sizes and separation are illustrative (mapped from
 * each slider's own range), not physically to-scale — real planetary
 * masses and distances span far too many orders of magnitude to draw
 * proportionally on one canvas.
 */
export function ForceLabDiagram({ mass1, mass2, distance }: ForceLabDiagramProps) {
  const sep = mapRange(distance, 1, 50, MIN_SEP, MAX_SEP);
  const r1 = mapRange(Math.cbrt(mass1), Math.cbrt(0.1), Math.cbrt(20), MIN_R, MAX_R);
  const r2 = mapRange(Math.cbrt(mass2), Math.cbrt(0.1), Math.cbrt(20), MIN_R, MAX_R);

  const centerX = SVG_WIDTH / 2;
  const x1 = centerX - sep / 2;
  const x2 = centerX + sep / 2;

  const arrowGap = 6;
  const arrowLen = Math.max(18, sep / 2 - r1 - r2 - arrowGap * 2);

  return (
    <svg
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      className="mx-auto w-full max-w-xl"
      role="img"
      aria-label={`Two masses, ${mass1.toFixed(2)} and ${mass2.toFixed(2)} times ten to the twenty-fourth kilograms, separated by ${distance.toFixed(1)} times ten to the sixth meters, attracting each other.`}
    >
      {/* Dashed distance line + measurement */}
      <line x1={x1} y1={CENTER_Y - r1 - 22} x2={x2} y2={CENTER_Y - r2 - 22} strokeWidth={1} strokeDasharray="3 4" className="stroke-ink/25 dark:stroke-bone/25" />
      <text x={centerX} y={CENTER_Y - r1 - 30} textAnchor="middle" className="fill-ink-soft font-mono text-[10px] dark:fill-bone-soft">
        r = {distance.toFixed(1)} ×10⁶ m
      </text>

      {/* Attraction arrows, pointing toward each other */}
      <g className="stroke-[#E0524F] fill-[#E0524F]">
        <line x1={x1 + r1 + arrowGap} y1={CENTER_Y} x2={x1 + r1 + arrowGap + arrowLen} y2={CENTER_Y} strokeWidth={2.5} />
        <polygon points={`${x1 + r1 + arrowGap + arrowLen},${CENTER_Y} ${x1 + r1 + arrowGap + arrowLen - 8},${CENTER_Y - 5} ${x1 + r1 + arrowGap + arrowLen - 8},${CENTER_Y + 5}`} />

        <line x1={x2 - r2 - arrowGap} y1={CENTER_Y} x2={x2 - r2 - arrowGap - arrowLen} y2={CENTER_Y} strokeWidth={2.5} />
        <polygon points={`${x2 - r2 - arrowGap - arrowLen},${CENTER_Y} ${x2 - r2 - arrowGap - arrowLen + 8},${CENTER_Y - 5} ${x2 - r2 - arrowGap - arrowLen + 8},${CENTER_Y + 5}`} />
      </g>

      {/* The two masses */}
      <circle cx={x1} cy={CENTER_Y} r={r1} className="fill-[#3D5AFE]" />
      <text x={x1} y={CENTER_Y + r1 + 20} textAnchor="middle" className="fill-ink font-mono text-[11px] font-semibold dark:fill-bone">
        m₁ = {mass1.toFixed(2)}
      </text>

      <circle cx={x2} cy={CENTER_Y} r={r2} className="fill-[#2E9E5B]" />
      <text x={x2} y={CENTER_Y + r2 + 20} textAnchor="middle" className="fill-ink font-mono text-[11px] font-semibold dark:fill-bone">
        m₂ = {mass2.toFixed(2)}
      </text>
    </svg>
  );
}
