"use client";

import { clamp01, lerp, stepProgress } from "../model";

export interface PlantSceneProps {
  progress: number;
  onLeafClick?: () => void;
}

// Compass-style layout inspired by the reference diagram: sun + light
// top-left, CO2 from the air on the left, water from the soil at
// bottom-left, oxygen leaving top-right, sugar leaving right — all
// converging on/departing from one shared leaf-cluster center.
const SUN = { x: 66, y: 58 };
const CLOUD = { x: 308, y: 64 };
const LEAF_CENTER = { x: 200, y: 165 };
const GROUND_Y = 250;
const ROOT_BASE = { x: 200, y: GROUND_Y };
const WATER_SOURCE = { x: 108, y: 308 };
const CO2_SOURCE = { x: 58, y: 176 };
const OXYGEN_EXIT = { x: 334, y: 64 };
const GLUCOSE_EXIT = { x: 324, y: 208 };

interface LeafSpec {
  y: number;
  side: -1 | 1;
  len: number;
  width: number;
  angle: number;
}

// Hand-tuned to fan out like the reference: larger leaves lower on the
// stem, smaller near the top, alternating left/right.
const LEAVES: LeafSpec[] = [
  { y: 232, side: -1, len: 42, width: 20, angle: -115 },
  { y: 232, side: 1, len: 40, width: 19, angle: -65 },
  { y: 200, side: -1, len: 52, width: 24, angle: -125 },
  { y: 200, side: 1, len: 50, width: 23, angle: -55 },
  { y: 168, side: -1, len: 46, width: 21, angle: -130 },
  { y: 168, side: 1, len: 48, width: 22, angle: -50 },
  { y: 135, side: 1, len: 30, width: 14, angle: -70 },
];

const GRASS_X = [10, 26, 44, 60, 80, 100, 120, 140, 160, 240, 260, 280, 300, 320, 340, 360, 380];

const MINERAL_DOTS = Array.from({ length: 14 }, (_, i) => ({
  x: 20 + ((i * 53) % 360),
  y: 268 + ((i * 37) % 44),
  r: 1.5 + (i % 3) * 0.5,
}));

function Leaf({ spec }: { spec: LeafSpec }) {
  const { y, len, width, angle } = spec;
  const path = `M 0 0 Q ${len * 0.32} ${-width / 2} ${len} 0 Q ${len * 0.32} ${width / 2} 0 0 Z`;
  const veinTs = [0.28, 0.48, 0.68];

  return (
    <g transform={`translate(${LEAF_CENTER.x} ${y}) rotate(${angle})`}>
      <path d={path} className="fill-emerald-500 stroke-emerald-700 dark:fill-emerald-600" strokeWidth={1.5} />
      <line x1={0} y1={0} x2={len * 0.88} y2={0} className="stroke-emerald-700/70" strokeWidth={1} />
      {veinTs.map((t, i) => {
        const x0 = t * len;
        const spread = width * 0.36 * (1 - t * 0.4);
        const x1 = x0 + len * 0.12;
        return (
          <g key={i} className="stroke-emerald-700/50" strokeWidth={0.75}>
            <line x1={x0} y1={0} x2={x1} y2={-spread} />
            <line x1={x0} y1={0} x2={x1} y2={spread} />
          </g>
        );
      })}
    </g>
  );
}

function reactionFade(progress: number): number {
  return 1 - stepProgress(progress, "reaction");
}

/** Pulses up then back down across the "reaction" window — a simple stand-in for a glow, no particle physics. */
function glowPulse(progress: number): number {
  const t = stepProgress(progress, "reaction");
  return Math.sin(Math.PI * t);
}

export function PlantScene({ progress, onLeafClick }: PlantSceneProps) {
  const lightT = stepProgress(progress, "light");
  const waterT = stepProgress(progress, "water");
  const co2T = stepProgress(progress, "co2");
  const glucoseT = stepProgress(progress, "glucose");
  const oxygenT = stepProgress(progress, "oxygen");
  const fadeOnReaction = reactionFade(progress);
  const glow = glowPulse(progress);

  const lightPos = { x: lerp(SUN.x, LEAF_CENTER.x, lightT), y: lerp(SUN.y, LEAF_CENTER.y, lightT) };
  const waterPos = { x: lerp(WATER_SOURCE.x, LEAF_CENTER.x, waterT), y: lerp(WATER_SOURCE.y, LEAF_CENTER.y, waterT) };
  const co2Pos = { x: lerp(CO2_SOURCE.x, LEAF_CENTER.x - 15, co2T), y: lerp(CO2_SOURCE.y, LEAF_CENTER.y, co2T) };

  const o2ExitOpacity = clamp01(1 - Math.max(0, (oxygenT - 0.7) / 0.3));
  const o2Pos = { x: lerp(LEAF_CENTER.x + 20, OXYGEN_EXIT.x, oxygenT), y: lerp(LEAF_CENTER.y - 20, OXYGEN_EXIT.y, oxygenT) };
  const o2Pos2 = { x: lerp(LEAF_CENTER.x + 10, OXYGEN_EXIT.x - 30, oxygenT), y: lerp(LEAF_CENTER.y - 10, OXYGEN_EXIT.y + 24, oxygenT) };

  const glucosePos = { x: lerp(LEAF_CENTER.x + 18, GLUCOSE_EXIT.x, glucoseT * 0.6), y: lerp(LEAF_CENTER.y, GLUCOSE_EXIT.y, glucoseT * 0.6) };

  return (
    <svg
      viewBox="0 0 400 320"
      className="h-full w-full"
      role="img"
      aria-label="A simple plant using sunlight, water, and carbon dioxide to photosynthesize"
    >
      {/* Sky */}
      <rect x={0} y={0} width={400} height={GROUND_Y} className="fill-sky-50 dark:fill-white/[0.02]" />

      {/* Clouds */}
      <g className="fill-sky-200/80 dark:fill-sky-400/10">
        <ellipse cx={CLOUD.x} cy={CLOUD.y} rx={26} ry={14} />
        <ellipse cx={CLOUD.x + 22} cy={CLOUD.y + 4} rx={20} ry={11} />
        <ellipse cx={CLOUD.x - 20} cy={CLOUD.y + 6} rx={17} ry={10} />
      </g>

      {/* Soil, layered */}
      <rect x={0} y={GROUND_Y} width={400} height={22} className="fill-amber-700/80 dark:fill-amber-800/60" />
      <rect x={0} y={GROUND_Y + 22} width={400} height={24} className="fill-amber-800/85 dark:fill-amber-900/60" />
      <rect x={0} y={GROUND_Y + 46} width={400} height={320 - GROUND_Y - 46} className="fill-amber-950/70 dark:fill-amber-950/70" />
      {MINERAL_DOTS.map((dot, i) => (
        <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} className="fill-amber-300/50" />
      ))}
      <rect x={0} y={GROUND_Y} width={400} height={3} className="fill-emerald-800/50" />

      {/* Grass tufts along the ground line */}
      <g className="fill-emerald-600/80">
        {GRASS_X.map((x, i) => (
          <path key={i} d={`M ${x} ${GROUND_Y} L ${x + 3} ${GROUND_Y - 12} L ${x + 6} ${GROUND_Y} Z`} />
        ))}
      </g>

      {/* Sun */}
      <g>
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const x1 = SUN.x + Math.cos(angle) * 24;
          const y1 = SUN.y + Math.sin(angle) * 24;
          const x2 = SUN.x + Math.cos(angle) * 34;
          const y2 = SUN.y + Math.sin(angle) * 34;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-amber-400" strokeWidth={3} strokeLinecap="round" />;
        })}
        <circle cx={SUN.x} cy={SUN.y} r={19} className="fill-amber-300 stroke-amber-500" strokeWidth={2} />
      </g>

      {/* Roots, branching from the stem base into the soil */}
      <g className="stroke-amber-950/70 dark:stroke-amber-900/70" strokeWidth={2.5} strokeLinecap="round" fill="none">
        <path d={`M ${ROOT_BASE.x} ${GROUND_Y} Q ${ROOT_BASE.x - 30} ${GROUND_Y + 25} ${ROOT_BASE.x - 55} ${GROUND_Y + 45}`} />
        <path d={`M ${ROOT_BASE.x - 30} ${GROUND_Y + 18} Q ${ROOT_BASE.x - 45} ${GROUND_Y + 35} ${ROOT_BASE.x - 60} ${GROUND_Y + 30}`} strokeWidth={1.5} />
        <path d={`M ${ROOT_BASE.x} ${GROUND_Y} Q ${ROOT_BASE.x - 5} ${GROUND_Y + 35} ${ROOT_BASE.x - 8} ${GROUND_Y + 66}`} />
        <path d={`M ${ROOT_BASE.x} ${GROUND_Y} Q ${ROOT_BASE.x + 8} ${GROUND_Y + 35} ${ROOT_BASE.x + 5} ${GROUND_Y + 66}`} />
        <path d={`M ${ROOT_BASE.x} ${GROUND_Y} Q ${ROOT_BASE.x + 32} ${GROUND_Y + 22} ${ROOT_BASE.x + 56} ${GROUND_Y + 42}`} />
        <path d={`M ${ROOT_BASE.x + 32} ${GROUND_Y + 16} Q ${ROOT_BASE.x + 46} ${GROUND_Y + 32} ${ROOT_BASE.x + 62} ${GROUND_Y + 26}`} strokeWidth={1.5} />
      </g>

      {/* Stem */}
      <rect x={LEAF_CENTER.x - 4} y={108} width={8} height={GROUND_Y - 108} rx={3} className="fill-emerald-700" />

      {/* Leaf glow (behind the leaves, pulses during the reaction step) */}
      <circle cx={LEAF_CENTER.x} cy={LEAF_CENTER.y} r={78} className="fill-amber-300" opacity={glow * 0.32} />

      {/* Leaves */}
      <g>
        {LEAVES.map((spec, i) => (
          <Leaf key={i} spec={spec} />
        ))}
        {/* Invisible click target over the whole leaf cluster */}
        <circle
          cx={LEAF_CENTER.x}
          cy={LEAF_CENTER.y}
          r={92}
          fill="transparent"
          onClick={onLeafClick}
          className={onLeafClick ? "cursor-pointer" : undefined}
          role={onLeafClick ? "button" : undefined}
          aria-label={onLeafClick ? "Show a close-up of what happens inside the leaf" : undefined}
        />
      </g>

      {/* Static compass labels, always visible like the reference diagram */}
      <g className="fill-ink-soft text-[11px] font-medium dark:fill-bone-soft">
        <text x={SUN.x - 8} y={SUN.y + 46}>Light Energy</text>
        <text x={CO2_SOURCE.x - 22} y={CO2_SOURCE.y + 30}>CO&#8322;</text>
        <text x={WATER_SOURCE.x - 20} y={WATER_SOURCE.y + 18}>Water</text>
        <text x={OXYGEN_EXIT.x - 14} y={OXYGEN_EXIT.y - 26}>Oxygen</text>
        <text x={GLUCOSE_EXIT.x - 14} y={GLUCOSE_EXIT.y + 26}>Glucose</text>
      </g>

      {/* Traveling light */}
      <circle cx={lightPos.x} cy={lightPos.y} r={7} className="fill-amber-300 stroke-amber-500" strokeWidth={1.5} opacity={lightT * fadeOnReaction} />

      {/* Traveling water drop */}
      <circle cx={waterPos.x} cy={waterPos.y} r={6} className="fill-sky-500" opacity={waterT * fadeOnReaction} />

      {/* Traveling CO2 */}
      <g opacity={co2T * fadeOnReaction}>
        <circle cx={co2Pos.x} cy={co2Pos.y} r={9} className="fill-white stroke-ink-soft/50 dark:fill-white/10 dark:stroke-bone-soft/40" strokeWidth={1.5} />
        <text x={co2Pos.x} y={co2Pos.y + 4} textAnchor="middle" className="fill-ink-soft text-[9px] font-medium dark:fill-bone-soft">
          CO&#8322;
        </text>
      </g>

      {/* Glucose produced, drifting slightly toward the export arrow */}
      <g opacity={glucoseT} transform={`translate(${glucosePos.x} ${glucosePos.y}) scale(${lerp(0.4, 1, glucoseT)})`}>
        <circle r={14} className="fill-rose-300 stroke-rose-500" strokeWidth={1.5} />
        <text y={4} textAnchor="middle" className="fill-rose-900 text-[12px] font-semibold">
          G
        </text>
      </g>

      {/* Oxygen released, drifting toward the top-right exit */}
      <g opacity={o2ExitOpacity}>
        <circle cx={o2Pos.x} cy={o2Pos.y} r={7} className="fill-sky-200 stroke-sky-500 dark:fill-sky-400/30" strokeWidth={1.5} />
        <text x={o2Pos.x} y={o2Pos.y + 4} textAnchor="middle" className="fill-sky-700 text-[9px] font-medium dark:fill-sky-300">
          O&#8322;
        </text>
      </g>
      <g opacity={o2ExitOpacity}>
        <circle cx={o2Pos2.x} cy={o2Pos2.y} r={7} className="fill-sky-200 stroke-sky-500 dark:fill-sky-400/30" strokeWidth={1.5} />
        <text x={o2Pos2.x} y={o2Pos2.y + 4} textAnchor="middle" className="fill-sky-700 text-[9px] font-medium dark:fill-sky-300">
          O&#8322;
        </text>
      </g>
    </svg>
  );
}
