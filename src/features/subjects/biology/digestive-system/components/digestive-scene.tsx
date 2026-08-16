"use client";

import {
  MOUTH,
  STAGE_POINTS,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  foodPointAt,
  pointsToPath,
} from "../digestive-model";
import type { Point } from "../types";
import type { StageId } from "../types";

interface DigestiveSceneProps {
  progress: number;
  showFood: boolean;
  highlight: StageId | null;
}

function opacityFor(id: StageId, highlight: StageId | null): number {
  if (!highlight) return 1;
  return highlight === id ? 1 : 0.28;
}

/**
 * Turns a hand-placed waypoint chain into a flowing, rounded path instead of
 * a sharp-cornered zigzag — used so the intestines read as coiled tubes
 * rather than a schematic route line. Purely decorative; the food particle
 * still travels along the original straight-segment chain from the model.
 */
function smoothTube(points: Point[]): string {
  if (points.length < 3) return pointsToPath(points);
  let d = `M ${points[0]!.x} ${points[0]!.y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i]!;
    const next = points[i + 1]!;
    const midX = (p.x + next.x) / 2;
    const midY = (p.y + next.y) / 2;
    d += ` Q ${p.x} ${p.y}, ${midX} ${midY}`;
  }
  const last = points[points.length - 1]!;
  d += ` L ${last.x} ${last.y}`;
  return d;
}

// A recognizable stomach silhouette (J-shaped sac), hand-fitted so its
// cardia (top) meets the esophagus at (150, 95) and its pylorus (bottom
// left) meets the small intestine at roughly (110, 155).
const STOMACH_PATH = `
  M 150 93
  C 172 90, 182 108, 178 126
  C 175 142, 160 152, 145 154
  C 132 156, 118 156, 110 152
  C 100 147, 96 138, 102 130
  C 106 124, 114 122, 118 114
  C 122 104, 112 96, 112 88
  C 112 78, 128 76, 138 82
  C 143 85, 147 88, 150 93
  Z
`;

export function DigestiveScene({ progress, showFood, highlight }: DigestiveSceneProps) {
  const food = foodPointAt(progress);

  const smallIntestinePath = smoothTube(STAGE_POINTS["small-intestine"]);
  const largeIntestinePath = smoothTube(STAGE_POINTS["large-intestine"]);

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label="An animated diagram of the digestive tract, from mouth to rectum, with a food particle moving through it"
    >
      <defs>
        <radialGradient id="ds-stomach" cx="32%" cy="28%" r="85%">
          <stop offset="0%" stopColor="#FFF6E1" />
          <stop offset="55%" stopColor="#F9DE9E" />
          <stop offset="100%" stopColor="#E8B563" />
        </radialGradient>
        <linearGradient id="ds-small" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#12A79A" />
        </linearGradient>
        <filter id="ds-depth" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#B87A2E" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Large intestine (frame), with a dashed halo suggesting haustra segmentation */}
      <g opacity={opacityFor("large-intestine", highlight)} className="transition-opacity duration-300">
        <path
          d={largeIntestinePath}
          fill="none"
          className="stroke-rose-300/60 dark:stroke-rose-400/30"
          strokeWidth={16}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="11 5"
        />
        <path
          d={largeIntestinePath}
          fill="none"
          className="stroke-rose-500/75 dark:stroke-rose-400/55"
          strokeWidth={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Small intestine (coiled tube) */}
      <path
        d={smallIntestinePath}
        fill="none"
        stroke="url(#ds-small)"
        className="opacity-90 transition-opacity duration-300"
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacityFor("small-intestine", highlight)}
      />

      {/* Stomach */}
      <g opacity={opacityFor("stomach", highlight)} className="transition-opacity duration-300">
        <path
          d={STOMACH_PATH}
          fill="url(#ds-stomach)"
          filter="url(#ds-depth)"
          className="stroke-amber-700/50 dark:stroke-amber-400/50"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {/* rugae (inner fold lines) */}
        <path d="M 128 100 C 122 112, 122 128, 132 140" fill="none" className="stroke-amber-700/30 dark:stroke-amber-200/25" strokeWidth={1.5} strokeLinecap="round" />
        <path d="M 140 96 C 134 112, 136 132, 148 146" fill="none" className="stroke-amber-700/25 dark:stroke-amber-200/20" strokeWidth={1.5} strokeLinecap="round" />
        <text x={140} y={124} textAnchor="middle" className="fill-ink/60 dark:fill-bone/60 font-mono text-[8px] uppercase tracking-wide">
          Stomach
        </text>
      </g>

      {/* Esophagus */}
      <path
        d={pointsToPath(STAGE_POINTS.esophagus)}
        fill="none"
        className="stroke-ink/40 dark:stroke-bone/40 transition-opacity duration-300"
        strokeWidth={9}
        strokeLinecap="round"
        opacity={opacityFor("esophagus", highlight)}
      />

      {/* Rectum */}
      <path
        d={pointsToPath(STAGE_POINTS.rectum)}
        fill="none"
        className="stroke-ink/40 dark:stroke-bone/40 transition-opacity duration-300"
        strokeWidth={9}
        strokeLinecap="round"
        opacity={opacityFor("rectum", highlight)}
      />

      {/* Mouth */}
      <g opacity={opacityFor("mouth", highlight)} className="transition-opacity duration-300">
        <ellipse
          cx={MOUTH.x}
          cy={MOUTH.y}
          rx={16}
          ry={9}
          className="fill-white stroke-ink/40 dark:fill-chalkboard dark:stroke-bone/40"
          strokeWidth={2}
        />
      </g>

      {/* Labels */}
      <text x={150} y={382} textAnchor="middle" className="fill-ink/60 dark:fill-bone/60 font-mono text-[9px] uppercase tracking-wide">
        Rectum
      </text>
      <text x={245} y={92} textAnchor="middle" className="fill-ink/60 dark:fill-bone/60 font-mono text-[8px] uppercase tracking-wide">
        Large intestine
      </text>

      {/* Food particle */}
      {showFood ? (
        <circle cx={food.x} cy={food.y} r={6} className="fill-pine-600 stroke-pine-700 dark:fill-pine-300 dark:stroke-pine-500" strokeWidth={1.5} />
      ) : null}
    </svg>
  );
}
