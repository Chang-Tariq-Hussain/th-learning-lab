"use client";

import { clamp01, lerp, stepProgress } from "../model";

export interface CellSceneProps {
  progress: number;
}

const VIEW_WIDTH = 400;
const VIEW_HEIGHT = 320;

const CELL_CENTER = { x: 200, y: 170 };
const CELL_RX = 165;
const CELL_RY = 125;

const MITO_POS = { x: 215, y: 175 };

const GLUCOSE_SOURCE = { x: 12, y: 195 };
const GLUCOSE_WAYPOINT = { x: 92, y: 195 };
const OXYGEN_SOURCE = { x: 150, y: 8 };
const OXYGEN_WAYPOINT = { x: 172, y: 72 };
const CO2_EXIT = { x: 388, y: 262 };
const WATER_SETTLE = { x: 215, y: 228 };

/** Pulses up then back down across the "mitochondrion" window — a simple stand-in for a highlight, no particle physics. */
function glowPulse(progress: number): number {
  const t = stepProgress(progress, "mitochondrion");
  return Math.sin(Math.PI * t);
}

/**
 * A shared "glossy bead" look for every small molecule (glucose,
 * oxygen, carbon dioxide, water) — a radial gradient fill plus a
 * bright highlight dot, so each reads as a rounded 3D particle rather
 * than a flat circle, at basically no extra layout cost.
 */
function MoleculeBead({
  x,
  y,
  r,
  gradientId,
  strokeColor,
  label,
  labelColor,
  labelSize = 10,
}: {
  x: number;
  y: number;
  r: number;
  gradientId: string;
  strokeColor: string;
  label: string;
  labelColor: string;
  labelSize?: number;
}) {
  return (
    <g filter="url(#particle-shadow)">
      <circle cx={x} cy={y} r={r} fill={`url(#${gradientId})`} stroke={strokeColor} strokeWidth={1.5} />
      <ellipse cx={x - r * 0.32} cy={y - r * 0.4} rx={r * 0.4} ry={r * 0.26} fill="#FFFFFF" opacity={0.55} />
      <text x={x} y={y + labelSize * 0.35} textAnchor="middle" fontSize={labelSize} fontWeight={600} fill={labelColor}>
        {label}
      </text>
    </g>
  );
}

function Mitochondrion({ glow }: { glow: number }) {
  return (
    <g transform={`translate(${MITO_POS.x} ${MITO_POS.y}) rotate(-12)`}>
      <ellipse rx={82} ry={4 + glow * 46} fill="#FBBF24" opacity={glow * 0.32} />

      <ellipse rx={50} ry={27} fill="url(#mito-body-fill)" filter="url(#mito-shadow)" />

      {/* Rim shading for volume, following the same outline as the body fill */}
      <ellipse rx={50} ry={27} fill="url(#mito-rim-shading)" />

      {/* Outer membrane */}
      <ellipse rx={50} ry={27} fill="none" stroke="#8F332A" strokeWidth={2} />

      {/* Simplified cristae (inner folds) — a few wavy lines with soft gradient shading, not an accurate membrane structure */}
      <g stroke="#8F332A" strokeOpacity={0.65} strokeWidth={2} fill="none" strokeLinecap="round">
        <path d="M -34 -12 Q -23 -20 -12 -12 Q -1 -3 10 -12" />
        <path d="M -34 -1 Q -23 -9 -12 -1 Q -1 8 10 -1" />
        <path d="M -34 10 Q -23 2 -12 10 Q -1 19 10 10" />
      </g>

      {/* A small highlight bloom suggesting a light source, echoing the cell body's own highlight */}
      <ellipse cx={-16} cy={-11} rx={16} ry={9} fill="#FFFFFF" opacity={0.22} />
    </g>
  );
}

/**
 * Purely presentational, same pattern as Photosynthesis's `PlantScene`:
 * one fixed cell + mitochondrion, position/opacity of every particle
 * driven entirely by `progress`. Glucose and oxygen each enter from
 * outside the cell, pause just inside the membrane, then travel
 * together to the mitochondrion, which glows briefly before energy,
 * carbon dioxide, and water appear.
 */
export function CellScene({ progress }: CellSceneProps) {
  const glucoseEnterT = stepProgress(progress, "glucose");
  const oxygenEnterT = stepProgress(progress, "oxygen");
  const movingT = stepProgress(progress, "moving");
  const glow = glowPulse(progress);
  const energyT = stepProgress(progress, "energy");
  const co2T = stepProgress(progress, "co2");
  const waterT = stepProgress(progress, "water");

  const glucoseStaged = {
    x: lerp(GLUCOSE_SOURCE.x, GLUCOSE_WAYPOINT.x, glucoseEnterT),
    y: lerp(GLUCOSE_SOURCE.y, GLUCOSE_WAYPOINT.y, glucoseEnterT),
  };
  const glucosePos = { x: lerp(glucoseStaged.x, MITO_POS.x, movingT), y: lerp(glucoseStaged.y, MITO_POS.y, movingT) };

  const oxygenStaged = {
    x: lerp(OXYGEN_SOURCE.x, OXYGEN_WAYPOINT.x, oxygenEnterT),
    y: lerp(OXYGEN_SOURCE.y, OXYGEN_WAYPOINT.y, oxygenEnterT),
  };
  const oxygenPos = { x: lerp(oxygenStaged.x, MITO_POS.x, movingT), y: lerp(oxygenStaged.y, MITO_POS.y, movingT) };

  // Both reactants fade out as they're "consumed" once they reach the mitochondrion.
  const reactantFade = 1 - stepProgress(progress, "mitochondrion");

  const co2Pos = { x: lerp(MITO_POS.x, CO2_EXIT.x, co2T), y: lerp(MITO_POS.y, CO2_EXIT.y, co2T) };
  const co2Opacity = clamp01(1 - Math.max(0, (co2T - 0.7) / 0.3));

  const waterPos = { x: lerp(MITO_POS.x, WATER_SETTLE.x, waterT), y: lerp(MITO_POS.y, WATER_SETTLE.y, waterT) };

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label="A simple cell with a mitochondrion, using glucose and oxygen to release energy"
    >
      <defs>
        {/* Warm cream-to-teal cytoplasm gradient, echoing the light-source-from-upper-left treatment used across the platform's other cell illustrations */}
        <radialGradient id="cytoplasm-fill-resp" cx="36%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#FFFDFA" />
          <stop offset="45%" stopColor="#E9F8F5" />
          <stop offset="80%" stopColor="#CDEEE7" />
          <stop offset="100%" stopColor="#AEE1DA" />
        </radialGradient>

        {/* A darker wash toward the rim only, for gentle dimensional shading */}
        <radialGradient id="cytoplasm-shading-resp" cx="40%" cy="34%" r="74%">
          <stop offset="55%" stopColor="#0F5C52" stopOpacity={0} />
          <stop offset="88%" stopColor="#0F5C52" stopOpacity={0.05} />
          <stop offset="100%" stopColor="#0F5C52" stopOpacity={0.14} />
        </radialGradient>

        <radialGradient id="mito-body-fill" cx="34%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#F5A392" />
          <stop offset="55%" stopColor="#E0776B" />
          <stop offset="100%" stopColor="#C1594C" />
        </radialGradient>
        <radialGradient id="mito-rim-shading" cx="40%" cy="32%" r="76%">
          <stop offset="55%" stopColor="#5A1F16" stopOpacity={0} />
          <stop offset="100%" stopColor="#5A1F16" stopOpacity={0.22} />
        </radialGradient>

        <radialGradient id="glucose-fill" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FECDD3" />
          <stop offset="100%" stopColor="#E6567A" />
        </radialGradient>
        <radialGradient id="oxygen-fill" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#5BAEE8" />
        </radialGradient>
        <radialGradient id="co2-fill" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#D7DEE0" />
        </radialGradient>
        <radialGradient id="water-fill" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#BFE0FE" />
          <stop offset="100%" stopColor="#3E82D6" />
        </radialGradient>

        <filter id="cell-drop-shadow-resp" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#0D9488" floodOpacity="0.2" />
        </filter>
        <filter id="mito-shadow" x="-40%" y="-60%" width="180%" height="220%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#6B241A" floodOpacity="0.3" />
        </filter>
        <filter id="particle-shadow" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#1F2937" floodOpacity="0.2" />
        </filter>
        <filter id="spark-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Cell membrane + cytoplasm, layered gradient fill + rim shading + bilayer highlight, matching the platform's other cell illustrations */}
      <ellipse
        cx={CELL_CENTER.x}
        cy={CELL_CENTER.y}
        rx={CELL_RX}
        ry={CELL_RY}
        fill="url(#cytoplasm-fill-resp)"
        filter="url(#cell-drop-shadow-resp)"
      />
      <ellipse cx={CELL_CENTER.x} cy={CELL_CENTER.y} rx={CELL_RX} ry={CELL_RY} fill="url(#cytoplasm-shading-resp)" />
      <ellipse
        cx={CELL_CENTER.x}
        cy={CELL_CENTER.y}
        rx={CELL_RX}
        ry={CELL_RY}
        fill="none"
        stroke="#0D9488"
        strokeWidth={3}
      />
      <ellipse
        cx={CELL_CENTER.x}
        cy={CELL_CENTER.y}
        rx={CELL_RX - 6}
        ry={CELL_RY - 6}
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity={0.5}
        strokeWidth={1.5}
      />
      <ellipse cx={CELL_CENTER.x - 60} cy={CELL_CENTER.y - 55} rx={58} ry={34} fill="#FFFFFF" opacity={0.22} />

      <Mitochondrion glow={glow} />

      {/* Glucose */}
      <g opacity={glucoseEnterT * reactantFade}>
        <MoleculeBead
          x={glucosePos.x}
          y={glucosePos.y}
          r={13}
          gradientId="glucose-fill"
          strokeColor="#C0355A"
          label="G"
          labelColor="#7A1233"
        />
      </g>

      {/* Oxygen */}
      <g opacity={oxygenEnterT * reactantFade}>
        <MoleculeBead
          x={oxygenPos.x}
          y={oxygenPos.y}
          r={12}
          gradientId="oxygen-fill"
          strokeColor="#2E7AB8"
          label="O₂"
          labelColor="#0C4A79"
          labelSize={9}
        />
      </g>

      {/* Energy sparks */}
      <g opacity={energyT} filter="url(#spark-glow)">
        {[-1, 0, 1].map((i) => {
          const sparkX = MITO_POS.x + i * 20;
          const sparkY = MITO_POS.y - 44 - Math.abs(i) * 6;
          const scale = lerp(0.3, 1, energyT);
          return (
            <g key={i} transform={`translate(${sparkX} ${sparkY}) scale(${scale})`}>
              <path
                d="M 0 -10 L 4 -2 L 10 -2 L 2 4 L 4 12 L -2 5 L -9 8 L -4 0 L -8 -6 Z"
                fill="#FCD34D"
                stroke="#D97706"
                strokeWidth={1}
              />
            </g>
          );
        })}
      </g>

      {/* Carbon dioxide, leaving the cell */}
      <g opacity={co2Opacity * (co2T > 0 ? 1 : 0)}>
        <MoleculeBead
          x={co2Pos.x}
          y={co2Pos.y}
          r={10}
          gradientId="co2-fill"
          strokeColor="#94A3B8"
          label="CO₂"
          labelColor="#334155"
          labelSize={9}
        />
      </g>

      {/* Water, produced and settling near the mitochondrion */}
      <g opacity={waterT} transform={`translate(${waterPos.x} ${waterPos.y}) scale(${lerp(0.4, 1, waterT)})`}>
        <MoleculeBead x={0} y={0} r={11} gradientId="water-fill" strokeColor="#2563A8" label="H₂O" labelColor="#0B2E57" labelSize={8} />
      </g>
    </svg>
  );
}
