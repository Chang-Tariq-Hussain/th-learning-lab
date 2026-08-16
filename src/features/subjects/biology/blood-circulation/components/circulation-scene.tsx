"use client";

import {
  OXYGEN_COLOR,
  PARTICLE_COUNT,
  SEGMENTS,
  SHAPE_CENTERS,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  pointOnLoop,
  segmentPath,
  type Focus,
  type SegmentId,
  type ShapeId,
} from "../circulation-model";

interface CirculationSceneProps {
  phase: number;
  focus: Focus | null;
}

const SEGMENT_STROKE: Record<SegmentId, string> = {
  A: "stroke-sky-500/70 dark:stroke-sky-400/60",
  B: "stroke-sky-500/70 dark:stroke-sky-400/60",
  C: "stroke-rose-500/70 dark:stroke-rose-400/60",
  D: "stroke-rose-500/70 dark:stroke-rose-400/60",
};

function isDimmed(id: SegmentId | ShapeId, focus: Focus | null, list: "segments" | "shapes"): boolean {
  if (!focus) return false;
  const active: string[] = focus[list];
  if (active.length === 0) return false;
  return !active.includes(id);
}

function isShapeActive(id: ShapeId, focus: Focus | null): boolean {
  return !!focus && focus.shapes.includes(id);
}

/**
 * A simplified lung silhouette: rounded apex, bulging costal (outer) surface,
 * a shallow concave mediastinal (inner) surface. `mirror` flips it for the
 * opposite side so left/right read as a matched pair rather than blobs.
 */
function lungPath(cx: number, cy: number, rx: number, ry: number, mirror: boolean): string {
  const s = mirror ? -1 : 1;
  const x = (v: number) => cx + s * v;
  return [
    `M ${x(-rx * 0.15)} ${cy - ry}`,
    `C ${x(rx * 0.55)} ${cy - ry * 0.98}, ${x(rx)} ${cy - ry * 0.5}, ${x(rx * 0.95)} ${cy}`,
    `C ${x(rx * 0.9)} ${cy + ry * 0.55}, ${x(rx * 0.55)} ${cy + ry * 0.95}, ${x(rx * 0.1)} ${cy + ry}`,
    `C ${x(-rx * 0.25)} ${cy + ry * 0.9}, ${x(-rx * 0.35)} ${cy + ry * 0.5}, ${x(-rx * 0.18)} ${cy + ry * 0.15}`,
    `C ${x(-rx * 0.32)} ${cy - ry * 0.05}, ${x(-rx * 0.28)} ${cy - ry * 0.5}, ${x(-rx * 0.15)} ${cy - ry}`,
    "Z",
  ].join(" ");
}

function lungFissure(cx: number, cy: number, rx: number, ry: number, mirror: boolean): string {
  const s = mirror ? -1 : 1;
  const x = (v: number) => cx + s * v;
  return `M ${x(-rx * 0.05)} ${cy - ry * 0.2} Q ${x(rx * 0.5)} ${cy + ry * 0.1}, ${x(rx * 0.55)} ${cy + ry * 0.55}`;
}

/** Simplified heart silhouette (apex pointing down), split into a right and left half along the septum. */
function heartHalfPath(cx: number, top: number, apexY: number, halfWidth: number, mirror: boolean): string {
  const s = mirror ? -1 : 1;
  const x = (v: number) => cx + s * v;
  return [
    `M ${cx} ${top + 10}`,
    `C ${x(4)} ${top - 6}, ${x(halfWidth * 0.4)} ${top - 12}, ${x(halfWidth * 0.75)} ${top + 2}`,
    `C ${x(halfWidth * 1.05)} ${top + 16}, ${x(halfWidth)} ${top + 38}, ${x(halfWidth * 0.85)} ${top + 56}`,
    `C ${x(halfWidth * 0.7)} ${top + 74}, ${x(halfWidth * 0.4)} ${apexY - 26}, ${cx} ${apexY}`,
    `Z`,
  ].join(" ");
}

export function CirculationScene({ phase, focus }: CirculationSceneProps) {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const t = phase + i / PARTICLE_COUNT;
    const { point, segment } = pointOnLoop(t);
    return { key: i, point, oxygen: segment.oxygen };
  });

  const lungsDim = focus && focus.shapes.length > 0 && !isShapeActive("lungs", focus);
  const heartDim = focus && focus.shapes.length > 0 && !isShapeActive("heart", focus);
  const bodyDim = focus && focus.shapes.length > 0 && !isShapeActive("body", focus);

  const heartTop = SHAPE_CENTERS.heart.y - 34;
  const heartApex = SHAPE_CENTERS.heart.y + 44;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label="An animated diagram of blood circulating between the body, heart, and lungs"
    >
      <defs>
        <radialGradient id="cs-lung" cx="35%" cy="25%" r="90%">
          <stop offset="0%" stopColor="#F3FBFA" />
          <stop offset="60%" stopColor="#CDEFE9" />
          <stop offset="100%" stopColor="#9FD8CE" />
        </radialGradient>
        <radialGradient id="cs-heart-r" cx="30%" cy="25%" r="90%">
          <stop offset="0%" stopColor="#E4F3FC" />
          <stop offset="55%" stopColor="#AADAF5" />
          <stop offset="100%" stopColor="#6FB6E6" />
        </radialGradient>
        <radialGradient id="cs-heart-l" cx="70%" cy="25%" r="90%">
          <stop offset="0%" stopColor="#FCE9EC" />
          <stop offset="55%" stopColor="#F3B4C0" />
          <stop offset="100%" stopColor="#E1798D" />
        </radialGradient>
        <radialGradient id="cs-body" cx="35%" cy="25%" r="90%">
          <stop offset="0%" stopColor="#F3FBFA" />
          <stop offset="100%" stopColor="#BEE6DE" />
        </radialGradient>
        <filter id="cs-depth" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0D9488" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Vessel segments */}
      {SEGMENTS.map((segment) => {
        const dimmed = isDimmed(segment.id, focus, "segments");
        return (
          <path
            key={segment.id}
            d={segmentPath(segment)}
            fill="none"
            strokeWidth={dimmed ? 6 : 9}
            strokeLinecap="round"
            className={`${SEGMENT_STROKE[segment.id]} transition-opacity duration-300`}
            opacity={dimmed ? 0.18 : 1}
          />
        );
      })}

      {/* Lungs */}
      <g opacity={lungsDim ? 0.35 : 1} className="transition-opacity duration-300">
        {[false, true].map((mirror) => {
          const cx = SHAPE_CENTERS.lungs.x + (mirror ? 42 : -42);
          return (
            <g key={mirror ? "right" : "left"}>
              <path
                d={lungPath(cx, SHAPE_CENTERS.lungs.y, 30, 44, mirror)}
                fill="url(#cs-lung)"
                filter="url(#cs-depth)"
                className={isShapeActive("lungs", focus) ? "stroke-subject-biology" : "stroke-ink/15 dark:stroke-bone/15"}
                strokeWidth={isShapeActive("lungs", focus) ? 3 : 1.5}
                strokeLinejoin="round"
              />
              <path
                d={lungFissure(cx, SHAPE_CENTERS.lungs.y, 30, 44, mirror)}
                fill="none"
                className="stroke-subject-biology/30 dark:stroke-subject-biology/25"
                strokeWidth={1}
              />
            </g>
          );
        })}
        <text x={SHAPE_CENTERS.lungs.x} y={SHAPE_CENTERS.lungs.y + 4} textAnchor="middle" className="fill-ink/70 dark:fill-bone/70 font-mono text-[11px] font-semibold uppercase tracking-wide">
          Lungs
        </text>
      </g>

      {/* Heart */}
      <g opacity={heartDim ? 0.35 : 1} className="transition-opacity duration-300">
        <path
          d={heartHalfPath(SHAPE_CENTERS.heart.x, heartTop, heartApex, 38, false)}
          fill="url(#cs-heart-r)"
          filter="url(#cs-depth)"
          className={isShapeActive("heart", focus) ? "stroke-subject-biology" : "stroke-ink/15 dark:stroke-bone/15"}
          strokeWidth={isShapeActive("heart", focus) ? 3 : 1.5}
          strokeLinejoin="round"
        />
        <path
          d={heartHalfPath(SHAPE_CENTERS.heart.x, heartTop, heartApex, 38, true)}
          fill="url(#cs-heart-l)"
          filter="url(#cs-depth)"
          className={isShapeActive("heart", focus) ? "stroke-subject-biology" : "stroke-ink/15 dark:stroke-bone/15"}
          strokeWidth={isShapeActive("heart", focus) ? 3 : 1.5}
          strokeLinejoin="round"
        />
        {/* septum */}
        <line
          x1={SHAPE_CENTERS.heart.x}
          y1={heartTop + 6}
          x2={SHAPE_CENTERS.heart.x}
          y2={heartApex - 4}
          className="stroke-rose-700/40 dark:stroke-rose-300/30"
          strokeWidth={1.5}
        />
        {/* great vessel stub */}
        <path
          d={`M ${SHAPE_CENTERS.heart.x - 10} ${heartTop + 4} C ${SHAPE_CENTERS.heart.x - 4} ${heartTop - 16}, ${SHAPE_CENTERS.heart.x + 4} ${heartTop - 18}, ${SHAPE_CENTERS.heart.x + 6} ${heartTop - 6}`}
          fill="none"
          className="stroke-rose-400/60 dark:stroke-rose-500/50"
          strokeWidth={5}
          strokeLinecap="round"
        />
        <text x={SHAPE_CENTERS.heart.x} y={heartApex + 18} textAnchor="middle" className="fill-ink/70 dark:fill-bone/70 font-mono text-[11px] font-semibold uppercase tracking-wide">
          Heart
        </text>
        <text x={SHAPE_CENTERS.heart.x - 18} y={SHAPE_CENTERS.heart.y + 2} textAnchor="middle" className="fill-sky-800 dark:fill-sky-200 font-mono text-[9px] font-medium">
          R
        </text>
        <text x={SHAPE_CENTERS.heart.x + 18} y={SHAPE_CENTERS.heart.y + 2} textAnchor="middle" className="fill-rose-800 dark:fill-rose-200 font-mono text-[9px] font-medium">
          L
        </text>
      </g>

      {/* Body */}
      <g opacity={bodyDim ? 0.35 : 1} className="transition-opacity duration-300">
        <path
          d={`M ${SHAPE_CENTERS.body.x - 34} ${SHAPE_CENTERS.body.y - 26}
              C ${SHAPE_CENTERS.body.x - 44} ${SHAPE_CENTERS.body.y - 26}, ${SHAPE_CENTERS.body.x - 60} ${SHAPE_CENTERS.body.y - 14}, ${SHAPE_CENTERS.body.x - 60} ${SHAPE_CENTERS.body.y}
              C ${SHAPE_CENTERS.body.x - 60} ${SHAPE_CENTERS.body.y + 14}, ${SHAPE_CENTERS.body.x - 44} ${SHAPE_CENTERS.body.y + 26}, ${SHAPE_CENTERS.body.x - 34} ${SHAPE_CENTERS.body.y + 26}
              L ${SHAPE_CENTERS.body.x + 34} ${SHAPE_CENTERS.body.y + 26}
              C ${SHAPE_CENTERS.body.x + 44} ${SHAPE_CENTERS.body.y + 26}, ${SHAPE_CENTERS.body.x + 60} ${SHAPE_CENTERS.body.y + 14}, ${SHAPE_CENTERS.body.x + 60} ${SHAPE_CENTERS.body.y}
              C ${SHAPE_CENTERS.body.x + 60} ${SHAPE_CENTERS.body.y - 14}, ${SHAPE_CENTERS.body.x + 44} ${SHAPE_CENTERS.body.y - 26}, ${SHAPE_CENTERS.body.x + 34} ${SHAPE_CENTERS.body.y - 26}
              Z`}
          fill="url(#cs-body)"
          className={isShapeActive("body", focus) ? "stroke-subject-biology" : "stroke-ink/15 dark:stroke-bone/15"}
          strokeWidth={isShapeActive("body", focus) ? 3 : 1.5}
        />
        {/* capillary bed hint */}
        <path
          d={`M ${SHAPE_CENTERS.body.x - 30} ${SHAPE_CENTERS.body.y} q 10 -10 20 0 q 10 10 20 0 q 10 -10 20 0`}
          fill="none"
          className="stroke-rose-400/30 dark:stroke-rose-400/25"
          strokeWidth={1.5}
        />
        <text x={SHAPE_CENTERS.body.x} y={SHAPE_CENTERS.body.y + 4} textAnchor="middle" className="fill-ink/70 dark:fill-bone/70 font-mono text-[11px] font-semibold uppercase tracking-wide">
          Body
        </text>
      </g>

      {/* Flowing particles */}
      {particles.map((p) => (
        <circle key={p.key} cx={p.point.x} cy={p.point.y} r={5} className={OXYGEN_COLOR[p.oxygen]} strokeWidth={1.5} />
      ))}
    </svg>
  );
}
