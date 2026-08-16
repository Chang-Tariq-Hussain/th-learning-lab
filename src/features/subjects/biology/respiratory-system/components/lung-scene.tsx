"use client";

import {
  ALVEOLI_POINT,
  CARINA,
  LUNG_CENTER,
  MOUTH,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  airPathPoint,
  lungRadii,
} from "../respiratory-model";
import type { AirStageId, BreathDirection } from "../types";

interface LungSceneProps {
  phase: number;
  direction: BreathDirection;
  running: boolean;
  activeStage: AirStageId | null;
}

const PARTICLES_PER_SIDE = 3;
const PARTICLE_GAP = 0.16;

function dimOpacity(part: "mouth" | "trachea" | "bronchi" | "alveoli", activeStage: AirStageId | null): number {
  if (!activeStage) return 1;
  const stageHighlight: Record<AirStageId, string> = {
    mouth: "mouth",
    trachea: "trachea",
    bronchi: "bronchi",
    bronchioles: "bronchi",
    alveoli: "alveoli",
  };
  return stageHighlight[activeStage] === part ? 1 : 0.3;
}

/**
 * A recognizable lung silhouette: rounded apex, bulging costal (outer)
 * surface, and a concave mediastinal (inner) surface with a cardiac notch
 * near the base on the left lung, so the pair reads as anatomy rather than
 * two ovals. `mirror` flips the shape for the opposite side.
 */
function lungPath(cx: number, cy: number, rx: number, ry: number, mirror: boolean): string {
  const s = mirror ? -1 : 1;
  const x = (v: number) => cx + s * v;
  return [
    `M ${x(-rx * 0.1)} ${cy - ry}`,
    `C ${x(rx * 0.6)} ${cy - ry * 0.96}, ${x(rx * 1.02)} ${cy - ry * 0.55}, ${x(rx * 0.98)} ${cy - ry * 0.05}`,
    `C ${x(rx * 0.95)} ${cy + ry * 0.4}, ${x(rx * 0.8)} ${cy + ry * 0.78}, ${x(rx * 0.42)} ${cy + ry * 0.98}`,
    `C ${x(rx * 0.12)} ${cy + ry * 1.1}, ${x(-rx * 0.1)} ${cy + ry * 0.98}, ${x(-rx * 0.22)} ${cy + ry * 0.7}`,
    `C ${x(-rx * 0.32)} ${cy + ry * 0.5}, ${x(-rx * 0.14)} ${cy + ry * 0.42}, ${x(-rx * 0.24)} ${cy + ry * 0.22}`,
    `C ${x(-rx * 0.4)} ${cy - ry * 0.05}, ${x(-rx * 0.3)} ${cy - ry * 0.55}, ${x(-rx * 0.12)} ${cy - ry * 0.85}`,
    "Z",
  ].join(" ");
}

function lungFissures(cx: number, cy: number, rx: number, ry: number, mirror: boolean): string[] {
  const s = mirror ? -1 : 1;
  const x = (v: number) => cx + s * v;
  return [
    `M ${x(-rx * 0.05)} ${cy - ry * 0.35} Q ${x(rx * 0.55)} ${cy - ry * 0.05}, ${x(rx * 0.6)} ${cy + ry * 0.35}`,
    `M ${x(-rx * 0.05)} ${cy + ry * 0.15} Q ${x(rx * 0.4)} ${cy + ry * 0.35}, ${x(rx * 0.35)} ${cy + ry * 0.72}`,
  ];
}

/** A simple two-level branching airway: trunk -> bronchi -> a few bronchioles, ending near the alveoli. */
function airwayBranches(from: { x: number; y: number }, to: { x: number; y: number }, mirror: boolean): string[] {
  const s = mirror ? -1 : 1;
  const midX = from.x + (to.x - from.x) * 0.55;
  const midY = from.y + (to.y - from.y) * 0.5;
  const branches: string[] = [`M ${from.x} ${from.y} L ${midX} ${midY}`];
  const tips = [
    { x: to.x - 6 * s, y: to.y - 10 },
    { x: to.x + 4 * s, y: to.y - 2 },
    { x: to.x - 2 * s, y: to.y + 10 },
  ];
  for (const tip of tips) {
    branches.push(`M ${midX} ${midY} L ${tip.x} ${tip.y}`);
  }
  return branches;
}

export function LungScene({ phase, direction, running, activeStage }: LungSceneProps) {
  const { rx, ry } = lungRadii(phase);

  const particles = (["left", "right"] as const).flatMap((side) =>
    Array.from({ length: PARTICLES_PER_SIDE }, (_, i) => {
      const offset = i * PARTICLE_GAP * (direction === "in" ? -1 : 1);
      const t = Math.min(1, Math.max(0, phase + offset));
      const point = airPathPoint(t, side);
      return { key: `${side}-${i}`, point, visible: running || phase > 0 };
    })
  );

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label="An animated diagram of the airway and lungs, showing air moving in during inhale and out during exhale"
    >
      <defs>
        <radialGradient id="ls-lung" cx="38%" cy="22%" r="90%">
          <stop offset="0%" stopColor="#F3FBFA" />
          <stop offset="55%" stopColor="#CDEFE9" />
          <stop offset="100%" stopColor="#9FD8CE" />
        </radialGradient>
        <radialGradient id="ls-alveolus" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FBD6DC" />
          <stop offset="100%" stopColor="#E88FA0" />
        </radialGradient>
        <filter id="ls-depth" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0D9488" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Bronchi + bronchioles (carina to each lung's alveoli region) */}
      <g opacity={dimOpacity("bronchi", activeStage)} className="transition-opacity duration-300">
        {(["left", "right"] as const).map((side) => {
          const mirror = side === "right";
          const target = { x: LUNG_CENTER[side].x, y: LUNG_CENTER[side].y + 18 };
          return airwayBranches(CARINA, target, mirror).map((d, i) => (
            <path
              key={`${side}-${i}`}
              d={d}
              fill="none"
              className="stroke-subject-biology/70 dark:stroke-subject-biology/60"
              strokeWidth={i === 0 ? 7 : 3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ));
        })}
      </g>

      {/* Trachea, with cartilage-ring texture */}
      <g opacity={dimOpacity("trachea", activeStage)} className="transition-opacity duration-300">
        <line
          x1={MOUTH.x}
          y1={MOUTH.y + 10}
          x2={CARINA.x}
          y2={CARINA.y}
          className="stroke-ink/30 dark:stroke-bone/30"
          strokeWidth={12}
          strokeLinecap="round"
        />
        {Array.from({ length: 6 }, (_, i) => {
          const y = MOUTH.y + 16 + i * ((CARINA.y - MOUTH.y - 20) / 6);
          return (
            <line
              key={i}
              x1={MOUTH.x - 5}
              y1={y}
              x2={MOUTH.x + 5}
              y2={y}
              className="stroke-bone/70 dark:stroke-chalkboard/60"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* Lungs */}
      {(["left", "right"] as const).map((side) => {
        const mirror = side === "right";
        return (
          <g key={side}>
            <path
              d={lungPath(LUNG_CENTER[side].x, LUNG_CENTER[side].y, rx, ry, mirror)}
              fill="url(#ls-lung)"
              filter="url(#ls-depth)"
              className="stroke-subject-biology/50 dark:stroke-subject-biology/40 transition-[d] duration-150"
              strokeWidth={2}
              strokeLinejoin="round"
            />
            {lungFissures(LUNG_CENTER[side].x, LUNG_CENTER[side].y, rx, ry, mirror).map((d, i) => (
              <path key={i} d={d} fill="none" className="stroke-subject-biology/25 dark:stroke-subject-biology/20" strokeWidth={1} />
            ))}
          </g>
        );
      })}

      {/* Alveoli clusters (grape-like sacs) */}
      <g opacity={dimOpacity("alveoli", activeStage)} className="transition-opacity duration-300">
        {(["left", "right"] as const).map((side) => {
          const p = ALVEOLI_POINT[side];
          const dots = [
            { dx: -9, dy: -4, r: 5 },
            { dx: 0, dy: -8, r: 4.5 },
            { dx: 9, dy: -3, r: 5 },
            { dx: -6, dy: 6, r: 4.5 },
            { dx: 6, dy: 7, r: 5 },
            { dx: 0, dy: 2, r: 4 },
          ];
          return (
            <g key={side}>
              {dots.map((d, i) => (
                <circle
                  key={i}
                  cx={p.x + d.dx}
                  cy={p.y + d.dy}
                  r={d.r}
                  fill="url(#ls-alveolus)"
                  className="opacity-90 stroke-rose-500/50 dark:opacity-70 dark:stroke-rose-400/40"
                  strokeWidth={1}
                />
              ))}
            </g>
          );
        })}
      </g>

      {/* Mouth / nose */}
      <g opacity={dimOpacity("mouth", activeStage)} className="transition-opacity duration-300">
        <ellipse
          cx={MOUTH.x}
          cy={MOUTH.y}
          rx={18}
          ry={9}
          className="fill-white stroke-ink/40 dark:fill-chalkboard dark:stroke-bone/40"
          strokeWidth={2}
        />
      </g>

      {/* Labels */}
      <text x={LUNG_CENTER.left.x} y={LUNG_CENTER.left.y - ry - 8} textAnchor="middle" className="fill-ink/60 dark:fill-bone/60 font-mono text-[9px] uppercase tracking-wide">
        Lung
      </text>
      <text x={LUNG_CENTER.right.x} y={LUNG_CENTER.right.y - ry - 8} textAnchor="middle" className="fill-ink/60 dark:fill-bone/60 font-mono text-[9px] uppercase tracking-wide">
        Lung
      </text>

      {/* Air particles */}
      {particles.map((p) =>
        p.visible ? (
          <circle
            key={p.key}
            cx={p.point.x}
            cy={p.point.y}
            r={3.5}
            className="fill-sky-500 stroke-sky-700 dark:fill-sky-400 dark:stroke-sky-600"
            strokeWidth={1}
          />
        ) : null
      )}
    </svg>
  );
}
