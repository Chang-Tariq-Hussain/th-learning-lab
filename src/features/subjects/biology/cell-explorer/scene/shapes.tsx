import { beanPath, blobPath, rotatePoint, smoothClosedPath, wavyTubePath, type Point } from "../utils/organic-path";
import { ORGANELLES } from "../data/organelles";
import type { OrganelleId } from "../types";
import { gradId, tones } from "./palette";

/** Deterministic pseudo-random in [0, 1): shapes must render identically on every render. */
export function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Smooth open path (Catmull-Rom) through points. */
export function smoothOpenPath(points: Point[]): string {
  const n = points.length;
  if (n < 2) return "";
  const at = (i: number): Point => points[Math.min(n - 1, Math.max(0, i))]!;
  let d = `M ${points[0]!.x.toFixed(1)} ${points[0]!.y.toFixed(1)} `;
  for (let i = 0; i < n - 1; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    d += `C ${(p1.x + (p2.x - p0.x) / 6).toFixed(1)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(1)}, ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} `;
  }
  return d;
}

export function roundRectPath(x: number, y: number, w: number, h: number, r: number): string {
  return `M ${x + r} ${y} H ${x + w - r} Q ${x + w} ${y} ${x + w} ${y + r} V ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} H ${x + r} Q ${x} ${y + h} ${x} ${y + h - r} V ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;
}

/** Points on a gently wavy arc around (cx, cy). Angles in degrees (0 = right, 90 = down). */
export function arcPoints(cx: number, cy: number, r: number, a0: number, a1: number, steps: number, wobble: number, seed: number): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = ((a0 + (a1 - a0) * t) * Math.PI) / 180;
    const rr = r + Math.sin(t * Math.PI * 4 + seed) * wobble;
    pts.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr });
  }
  return pts;
}

/** Shared gradients and filters. Rendered once per scene. Gradients are for filled shapes only: a gradient on a perfectly horizontal stroke has no bounding box and would not draw. */
export function SceneDefs() {
  const ids = Object.keys(ORGANELLES) as OrganelleId[];
  return (
    <defs>
      {ids.map((id) => {
        const t = tones(id);
        return (
          <radialGradient key={id} id={gradId(id)} cx="35%" cy="28%" r="85%">
            <stop offset="0%" stopColor={t.light} />
            <stop offset="55%" stopColor={t.base} />
            <stop offset="100%" stopColor={t.dark} />
          </radialGradient>
        );
      })}
      <radialGradient id="ce-cyto-animal" cx="38%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#FFF8F2" />
        <stop offset="55%" stopColor="#FCE2D4" />
        <stop offset="100%" stopColor="#F2BBA6" />
      </radialGradient>
      <radialGradient id="ce-cyto-plant" cx="38%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#F7FCEB" />
        <stop offset="60%" stopColor="#E2F1C6" />
        <stop offset="100%" stopColor="#C5E09B" />
      </radialGradient>
      <radialGradient id="ce-vacuole-big" cx="40%" cy="32%" r="80%">
        <stop offset="0%" stopColor="#F2FAFF" />
        <stop offset="60%" stopColor="#CFE8FA" />
        <stop offset="100%" stopColor="#9FCBEE" />
      </radialGradient>
      <linearGradient id="ce-wall" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E6D4A4" />
        <stop offset="100%" stopColor="#B98F52" />
      </linearGradient>
      <filter id="ce-shadow" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#3B1E14" floodOpacity="0.22" />
      </filter>
      <filter id="ce-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="3.2" floodColor="#14B8A6" floodOpacity="0.95" />
        <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor="#FFFFFF" floodOpacity="0.9" />
      </filter>
      <pattern id="ce-speckle" width="26" height="26" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="7" r="1.1" fill="#8A5A44" opacity="0.16" />
        <circle cx="18" cy="15" r="0.9" fill="#8A5A44" opacity="0.14" />
        <circle cx="11" cy="22" r="1.2" fill="#8A5A44" opacity="0.12" />
      </pattern>
    </defs>
  );
}

/* ----------------------------- membrane tubes ----------------------------- */

function Tube({ d, id, width = 7 }: { d: string; id: OrganelleId; width?: number }) {
  const t = tones(id);
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={t.dark} strokeWidth={width + 2.4} />
      <path d={d} stroke={t.base} strokeWidth={width} />
      <path d={d} stroke={t.light} strokeWidth={width * 0.32} transform="translate(0 -1.2)" opacity={0.85} />
    </g>
  );
}

/** Branching network of tubes with no ribosomes: the smooth ER. */
export function SmoothERShape({ tubes }: { tubes: Point[][] }) {
  return (
    <g>
      {tubes.map((pts, i) => (
        <Tube key={i} id="smoothER" d={smoothOpenPath(pts)} width={6.5} />
      ))}
    </g>
  );
}

export interface RoughERProps {
  cx: number;
  cy: number;
  radii: number[];
  a0: number;
  a1: number;
}

/** Folded sheets curving around the nucleus, studded with ribosomes on their outer face. */
export function RoughERShape({ cx, cy, radii, a0, a1 }: RoughERProps) {
  return (
    <g>
      {radii.map((r, i) => {
        const pts = arcPoints(cx, cy, r, a0 + i * 2, a1 - i * 4, 14, 3.2, i * 1.3);
        const dots = arcPoints(cx, cy, r + 5.4, a0 + i * 2 + 2, a1 - i * 4 - 2, Math.round((r * 1.5) / 7), 3.2, i * 1.3);
        return (
          <g key={i}>
            <Tube id="roughER" d={smoothOpenPath(pts)} width={6.2} />
            {dots.map((p, j) => (
              <circle key={j} cx={p.x} cy={p.y} r={1.9} fill={`url(#${gradId("ribosomes")})`} stroke="#2036B0" strokeWidth={0.3} />
            ))}
          </g>
        );
      })}
    </g>
  );
}

/* ------------------------------ nucleus parts ----------------------------- */

export function nucleusOutline(cx: number, cy: number, r: number, inset = 0): string {
  return blobPath(cx, cy, r - inset, { phase: 0.6, amplitude: 0.035, amplitude2: 0.02, pointCount: 26 });
}

export function NucleusBody({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <path d={nucleusOutline(cx, cy, r, 1)} fill={`url(#${gradId("nucleus")})`} />
      {[0, 1, 2, 3].map((i) => {
        const len = r * (1.0 + i * 0.1);
        return (
          <path
            key={i}
            d={wavyTubePath(-len / 2, 0, len, 4.5, 4, i * 1.3)}
            transform={`translate(${cx - r * 0.06} ${cy + (i - 1.5) * r * 0.3}) rotate(${-22 + i * 16})`}
            stroke={tones("nucleus").dark}
            strokeWidth={1.2}
            fill="none"
            opacity={0.3}
            strokeLinecap="round"
          />
        );
      })}
      <ellipse cx={cx - r * 0.3} cy={cy - r * 0.34} rx={r * 0.3} ry={r * 0.18} fill="#FFFFFF" opacity={0.28} />
    </g>
  );
}

export function NuclearEnvelopeShape({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const t = tones("nuclearEnvelope");
  const pores = 14;
  return (
    <g fill="none">
      {/* wide invisible stroke = comfortable click target on the thin ring */}
      <path d={nucleusOutline(cx, cy, r, 2)} stroke="transparent" strokeWidth={16} pointerEvents="stroke" />
      <path d={nucleusOutline(cx, cy, r, 0)} stroke={t.dark} strokeWidth={2.2} />
      <path d={nucleusOutline(cx, cy, r, 5)} stroke={t.base} strokeWidth={1.6} />
      {Array.from({ length: pores }, (_, i) => {
        const a = (i / pores) * Math.PI * 2 + 0.2;
        const px = cx + Math.cos(a) * (r - 2.6);
        const py = cy + Math.sin(a) * (r - 2.6);
        return <ellipse key={i} cx={px} cy={py} rx={2.6} ry={4.2} transform={`rotate(${(a * 180) / Math.PI} ${px} ${py})`} fill="#F4EEFF" stroke={t.dark} strokeWidth={1} />;
      })}
    </g>
  );
}

export function NucleolusShape({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${gradId("nucleolus")})`} stroke={tones("nucleolus").dark} strokeWidth={1} />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.35} r={r * 0.22} fill="#FFFFFF" opacity={0.3} />
    </g>
  );
}

/* ------------------------------- organelles ------------------------------- */

export interface Oval {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotate: number;
}

export function MitochondrionShape({ cx, cy, rx, ry, rotate }: Oval) {
  const t = tones("mitochondria");
  const outer = beanPath(0, 0, rx, ry, 0);
  const inner = beanPath(0, 0, rx * 0.86, ry * 0.7, 0);
  const folds = 5;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
      <path d={outer} fill={`url(#${gradId("mitochondria")})`} stroke={t.dark} strokeWidth={1.8} />
      <path d={inner} fill={t.light} fillOpacity={0.55} stroke={t.dark} strokeWidth={1.1} opacity={0.9} />
      {/* cristae: folds of the inner membrane reaching in from alternate sides */}
      {Array.from({ length: folds }, (_, i) => {
        const x = (i - (folds - 1) / 2) * rx * 0.3;
        const fromTop = i % 2 === 0;
        const y0 = fromTop ? -ry * 0.68 : ry * 0.68;
        const y1 = fromTop ? ry * 0.12 : -ry * 0.12;
        return <path key={i} d={`M ${x} ${y0} C ${x + 3} ${y0 * 0.4}, ${x - 3} ${y1 * 0.6}, ${x} ${y1}`} stroke={t.dark} strokeWidth={1.3} fill="none" strokeLinecap="round" />;
      })}
      <ellipse cx={-rx * 0.35} cy={-ry * 0.55} rx={rx * 0.25} ry={ry * 0.14} fill="#FFFFFF" opacity={0.35} />
    </g>
  );
}

export function ChloroplastShape({ cx, cy, rx, ry, rotate }: Oval) {
  const t = tones("chloroplast");
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
      <ellipse cx={0} cy={0} rx={rx} ry={ry} fill={`url(#${gradId("chloroplast")})`} stroke={t.dark} strokeWidth={1.8} />
      <ellipse cx={0} cy={0} rx={rx - 2.6} ry={ry - 2.6} fill="none" stroke={t.dark} strokeWidth={0.8} opacity={0.6} />
      {/* grana: stacks of flat thylakoid discs joined by thin lamellae */}
      <path d={`M ${-rx * 0.62} 0 L ${rx * 0.62} 0`} stroke={t.dark} strokeWidth={0.9} opacity={0.7} />
      {[-0.5, 0, 0.5].map((f, gi) => (
        <g key={gi} transform={`translate(${rx * f} ${gi === 1 ? -ry * 0.1 : ry * 0.08})`}>
          {[-1.5, -0.5, 0.5, 1.5].map((s, si) => (
            <rect key={si} x={-rx * 0.15} y={s * 2.5 - 1.05} width={rx * 0.3} height={2.1} rx={1} fill="#1F6B1A" stroke="#C8F2B0" strokeWidth={0.35} />
          ))}
        </g>
      ))}
      <ellipse cx={-rx * 0.4} cy={-ry * 0.55} rx={rx * 0.22} ry={ry * 0.13} fill="#FFFFFF" opacity={0.33} />
    </g>
  );
}

export interface GolgiProps {
  cx: number;
  cy: number;
  width: number;
  rotate: number;
}

/** Stack of curved, flattened sacs that shrink toward the shipping face, with swollen rims. */
export function GolgiShape({ cx, cy, width, rotate }: GolgiProps) {
  const t = tones("golgi");
  const sacs = 5;
  return (
    <g>
      {Array.from({ length: sacs }, (_, i) => {
        const y = (i - (sacs - 1) / 2) * 9.5;
        const half = width / 2 - i * 3.2;
        const bow = -10 + i * 0.5;
        const p1 = rotatePoint(cx, cy, -half, y, rotate);
        const c = rotatePoint(cx, cy, 0, y + bow, rotate);
        const p2 = rotatePoint(cx, cy, half, y, rotate);
        const d = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${c.x.toFixed(1)} ${c.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
        return (
          <g key={i}>
            <Tube id="golgi" d={d} width={5.6} />
            <circle cx={p1.x} cy={p1.y} r={3.6} fill={t.base} stroke={t.dark} strokeWidth={1} />
            <circle cx={p2.x} cy={p2.y} r={3.6} fill={t.base} stroke={t.dark} strokeWidth={1} />
          </g>
        );
      })}
    </g>
  );
}

export function VesicleShape({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const t = tones("vesicles");
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${gradId("vesicles")})`} stroke={t.dark} strokeWidth={1.3} />
      <circle cx={cx - r * 0.35} cy={cy - r * 0.4} r={r * 0.28} fill="#FFFFFF" opacity={0.55} />
    </g>
  );
}

export function VacuoleShape({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const t = tones("vacuole");
  return (
    <g>
      <path d={blobPath(cx, cy, r, { amplitude: 0.05, phase: cx, pointCount: 16 })} fill={`url(#${gradId("vacuole")})`} stroke={t.dark} strokeWidth={1.6} />
      <ellipse cx={cx - r * 0.3} cy={cy - r * 0.38} rx={r * 0.34} ry={r * 0.2} fill="#FFFFFF" opacity={0.5} />
    </g>
  );
}

export interface RibosomeSpec {
  cx: number;
  cy: number;
  count: number;
  seed: number;
}

export function ribosomePoints({ cx, cy, count, seed }: RibosomeSpec): Point[] {
  // A loose beaded curve: ribosomes strung along a messenger RNA strand.
  const pts: Point[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / Math.max(1, count - 1) - 0.5;
    pts.push({
      x: cx + t * count * 5.4 + (rand(seed + i) - 0.5) * 3,
      y: cy + Math.sin(t * 5 + seed) * 7 + (rand(seed * 3 + i) - 0.5) * 3,
    });
  }
  return pts;
}

export function RibosomeCluster({ spec }: { spec: RibosomeSpec }) {
  const pts = ribosomePoints(spec);
  const reach = spec.count * 3.4 + 10;
  return (
    <g>
      {/* generous invisible target: the dots themselves are only a few units wide */}
      <circle cx={spec.cx} cy={spec.cy} r={reach} fill="transparent" />
      <path d={smoothOpenPath(pts)} fill="none" stroke="#5B6FD6" strokeWidth={0.7} opacity={0.6} />
      {pts.map((p, i) => {
        const spin = (rand(spec.seed + i * 7) - 0.5) * 80;
        return (
          <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${spin.toFixed(0)})`}>
            <ellipse cx={0} cy={1.2} rx={2.7} ry={2.2} fill={`url(#${gradId("ribosomes")})`} stroke="#2036B0" strokeWidth={0.35} />
            <ellipse cx={0} cy={-1.7} rx={1.9} ry={1.6} fill={`url(#${gradId("ribosomes")})`} stroke="#2036B0" strokeWidth={0.35} />
          </g>
        );
      })}
    </g>
  );
}

/** Channel crossing the cell wall, with a thin ER thread (desmotubule) down the middle. Drawn in local coordinates: wall runs along x, channel along y. */
export function PlasmodesmaShape({ x, y, rotate }: { x: number; y: number; rotate: number }) {
  const t = tones("plasmodesmata");
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x={-10} y={-4.2} width={20} height={8.4} rx={1} fill="transparent" />
      <path d="M -11 -7 L -6 -3.2 L 6 -3.2 L 11 -7 L 11 7 L 6 3.2 L -6 3.2 L -11 7 Z" fill="#EAF6D4" stroke={t.dark} strokeWidth={1.3} strokeLinejoin="round" />
      <line x1={-9} y1={0} x2={9} y2={0} stroke={t.dark} strokeWidth={1.8} strokeLinecap="round" />
      <line x1={-9} y1={0} x2={9} y2={0} stroke={t.light} strokeWidth={0.6} strokeLinecap="round" />
    </g>
  );
}

export { smoothClosedPath };
