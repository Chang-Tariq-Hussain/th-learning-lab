"use client";

import { motion } from "framer-motion";

export interface CellSceneProps {
  stageIndex: number;
}

const VIEW_WIDTH = 440;
const VIEW_HEIGHT = 320;
const CENTER = { x: 220, y: 160 };

const TWEEN = { duration: 0.9, ease: "easeInOut" as const };

const CHROMOSOME_COLORS = ["#22D3EE", "#D97706", "#34D399", "#3B82F6"];

interface ChromosomeStageLayout {
  dx: number[];
  dy: number[];
  rotation: number[];
  /** 0 = joined into one X shape (a chromosome). Growing values pull the two sister chromatids apart. */
  splitDistance: number;
  opacity: number;
  scale: number;
}

/** One entry per stage index (0 Interphase … 5 Cytokinesis). Chromosomes are invisible during Interphase — DNA is just a texture inside the nucleus at that point. */
const CHROMOSOME_LAYOUT: ChromosomeStageLayout[] = [
  { dx: [0, 0, 0, 0], dy: [0, 0, 0, 0], rotation: [0, 0, 0, 0], splitDistance: 0, opacity: 0, scale: 0.7 },
  { dx: [-32, 30, -24, 26], dy: [-26, -13, 14, 27], rotation: [-18, 12, -22, 16], splitDistance: 0, opacity: 1, scale: 0.85 },
  { dx: [0, 0, 0, 0], dy: [-48, -16, 16, 48], rotation: [0, 0, 0, 0], splitDistance: 0, opacity: 1, scale: 1 },
  { dx: [0, 0, 0, 0], dy: [-48, -16, 16, 48], rotation: [0, 0, 0, 0], splitDistance: 74, opacity: 1, scale: 1 },
  { dx: [0, 0, 0, 0], dy: [-20, -7, 7, 20], rotation: [0, 0, 0, 0], splitDistance: 78, opacity: 0.35, scale: 0.78 },
  { dx: [0, 0, 0, 0], dy: [-20, -7, 7, 20], rotation: [0, 0, 0, 0], splitDistance: 78, opacity: 0, scale: 0.78 },
];

interface NucleusLayout {
  mainOpacity: number;
  poleOpacity: number;
  poleCx: number;
  poleR: number;
}

/** Main (single, pre-division) nucleus fades out across Prophase; the two new nuclei fade in at Telophase and recenter once the cell has physically split at Cytokinesis. */
const NUCLEUS_LAYOUT: NucleusLayout[] = [
  { mainOpacity: 1, poleOpacity: 0, poleCx: 150, poleR: 40 },
  { mainOpacity: 0.25, poleOpacity: 0, poleCx: 150, poleR: 40 },
  { mainOpacity: 0, poleOpacity: 0, poleCx: 150, poleR: 40 },
  { mainOpacity: 0, poleOpacity: 0, poleCx: 150, poleR: 40 },
  { mainOpacity: 0, poleOpacity: 1, poleCx: 150, poleR: 40 },
  { mainOpacity: 0, poleOpacity: 1, poleCx: 125, poleR: 36 },
];

interface MembraneLayout {
  wholeOpacity: number;
  splitOpacity: number;
  splitCx: number;
  splitRx: number;
  furrowOpacity: number;
}

const MEMBRANE_LAYOUT: MembraneLayout[] = [
  { wholeOpacity: 1, splitOpacity: 0, splitCx: 125, splitRx: 95, furrowOpacity: 0 },
  { wholeOpacity: 1, splitOpacity: 0, splitCx: 125, splitRx: 95, furrowOpacity: 0 },
  { wholeOpacity: 1, splitOpacity: 0, splitCx: 125, splitRx: 95, furrowOpacity: 0 },
  { wholeOpacity: 1, splitOpacity: 0, splitCx: 125, splitRx: 95, furrowOpacity: 0 },
  { wholeOpacity: 1, splitOpacity: 0, splitCx: 125, splitRx: 95, furrowOpacity: 1 },
  { wholeOpacity: 0, splitOpacity: 1, splitCx: 125, splitRx: 95, furrowOpacity: 0 },
];

/** Rotates a point around the origin by `deg` degrees. */
function rotatePoint(x: number, y: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [x * cos - y * sin, x * sin + y * cos];
}

/**
 * Builds an absolute "M x y Q x y x y" path for one sister chromatid.
 * `armSign` picks which of the two mirrored arms (they together read
 * as an X when `splitDistance` is 0); `splitDistance` slides that arm
 * away from the centromere along local +/-x before scale, rotation,
 * and the (cx, cy) placement are applied — deliberately built as
 * plain absolute coordinates (not an SVG `transform`) so the whole
 * shape can be tweened with a single `animate={{ d }}`, the same
 * attribute-level animation already used for cx/r elsewhere in this
 * file, rather than framer-motion's transform system.
 */
function chromatidPath(armSign: 1 | -1, splitDistance: number, rotation: number, scale: number, cx: number, cy: number): string {
  const localPoints: Array<[number, number]> = armSign === 1 ? [[4, -15], [-6, 0], [4, 15]] : [[-4, -15], [6, 0], [-4, 15]];

  const absolute: Array<[number, number]> = localPoints.map(([x, y]) => {
    const shiftedX = x + armSign * splitDistance;
    const [rx, ry] = rotatePoint(shiftedX * scale, y * scale, rotation);
    return [rx + cx, ry + cy];
  });

  const p0 = absolute[0]!;
  const p1 = absolute[1]!;
  const p2 = absolute[2]!;
  return `M ${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`;
}

function ChromosomePair({
  cx,
  cy,
  rotation,
  splitDistance,
  opacity,
  scale,
  color,
}: {
  cx: number;
  cy: number;
  rotation: number;
  splitDistance: number;
  opacity: number;
  scale: number;
  color: string;
}) {
  return (
    <motion.g animate={{ opacity }} transition={TWEEN}>
      {/* Two sister chromatids, joined at a centromere when splitDistance is 0 (reads as an X) and sliding apart as it grows. */}
      <motion.path
        stroke={color}
        strokeWidth={4.5}
        strokeLinecap="round"
        fill="none"
        animate={{ d: chromatidPath(1, splitDistance, rotation, scale, cx, cy) }}
        transition={TWEEN}
      />
      <motion.path
        stroke={color}
        strokeWidth={4.5}
        strokeLinecap="round"
        fill="none"
        animate={{ d: chromatidPath(-1, splitDistance, rotation, scale, cx, cy) }}
        transition={TWEEN}
      />
      <motion.circle r={3} fill={color} animate={{ cx, cy, opacity: splitDistance < 4 ? 1 : 0 }} transition={TWEEN} />
    </motion.g>
  );
}

function Nucleus({ cx, cy, r, opacity, dna }: { cx: number; cy: number; r: number; opacity: number; dna?: boolean }) {
  return (
    <motion.g animate={{ opacity }} transition={TWEEN}>
      <motion.circle
        cy={cy}
        fill="#8B7BC7"
        fillOpacity={0.4}
        stroke="#5B4B9E"
        strokeWidth={2}
        animate={{ cx, r }}
        transition={TWEEN}
      />
      <motion.circle cy={cy} fill="url(#nucleus-texture)" animate={{ cx, r }} transition={TWEEN} />
      {dna ? (
        <g stroke="#5B4B9E" strokeOpacity={0.45} strokeWidth={2} strokeLinecap="round" fill="none">
          <path d={`M ${cx - r * 0.45} ${cy - r * 0.3} q 10 12 0 24`} />
          <path d={`M ${cx - r * 0.1} ${cy - r * 0.4} q 10 16 0 32`} />
          <path d={`M ${cx + r * 0.3} ${cy - r * 0.25} q 10 10 0 20`} />
        </g>
      ) : null}
    </motion.g>
  );
}

/**
 * Purely presentational, same "one lookup table, no physics" spirit
 * as the rest of the project's biology scenes — every element's
 * position/opacity is a plain array lookup keyed by `stageIndex`,
 * with framer-motion supplying the tween whenever that index changes
 * (whether from Start's timer or a manual Next Stage click).
 */
export function CellScene({ stageIndex }: CellSceneProps) {
  const chromosomes = CHROMOSOME_LAYOUT[stageIndex] ?? CHROMOSOME_LAYOUT[0]!;
  const nucleus = NUCLEUS_LAYOUT[stageIndex] ?? NUCLEUS_LAYOUT[0]!;
  const membrane = MEMBRANE_LAYOUT[stageIndex] ?? MEMBRANE_LAYOUT[0]!;

  const rightPoleCx = VIEW_WIDTH - membrane.splitCx;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label="An animal cell dividing through the stages of mitosis into two daughter cells"
    >
      <defs>
        <radialGradient id="cytoplasm-fill-mitosis" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#FFFBF6" />
          <stop offset="45%" stopColor="#DFF5F2" />
          <stop offset="100%" stopColor="#AEE1DA" />
        </radialGradient>
        <radialGradient id="nucleus-texture" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
        </radialGradient>
        <filter id="mitosis-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0D9488" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Whole (pre-division) cell membrane */}
      <motion.ellipse
        cx={CENTER.x}
        cy={CENTER.y}
        rx={165}
        ry={112}
        fill="url(#cytoplasm-fill-mitosis)"
        stroke="#0D9488"
        strokeWidth={3}
        filter="url(#mitosis-shadow)"
        animate={{ opacity: membrane.wholeOpacity }}
        transition={TWEEN}
      />

      {/* Cleavage furrow cue, shown only while the membrane is pinching (Telophase) */}
      <motion.g animate={{ opacity: membrane.furrowOpacity }} transition={TWEEN} stroke="#0D9488" strokeWidth={3} strokeLinecap="round" fill="none">
        <path d={`M ${CENTER.x} ${CENTER.y - 108} Q ${CENTER.x - 26} ${CENTER.y - 40} ${CENTER.x} ${CENTER.y - 6}`} />
        <path d={`M ${CENTER.x} ${CENTER.y + 108} Q ${CENTER.x - 26} ${CENTER.y + 40} ${CENTER.x} ${CENTER.y + 6}`} />
      </motion.g>

      {/* Two separate daughter cells, shown only once division completes */}
      <motion.g animate={{ opacity: membrane.splitOpacity }} transition={TWEEN}>
        <ellipse cx={membrane.splitCx} cy={CENTER.y} rx={membrane.splitRx} ry={100} fill="url(#cytoplasm-fill-mitosis)" stroke="#0D9488" strokeWidth={3} />
        <ellipse cx={rightPoleCx} cy={CENTER.y} rx={membrane.splitRx} ry={100} fill="url(#cytoplasm-fill-mitosis)" stroke="#0D9488" strokeWidth={3} />
      </motion.g>

      {/* Main nucleus (Interphase → early Prophase) */}
      <Nucleus cx={CENTER.x} cy={CENTER.y} r={58} opacity={nucleus.mainOpacity} dna />

      {/* Two new nuclei (Telophase onward), recentering into the split cells at Cytokinesis */}
      <Nucleus cx={nucleus.poleCx} cy={CENTER.y} r={nucleus.poleR} opacity={nucleus.poleOpacity} />
      <Nucleus cx={VIEW_WIDTH - nucleus.poleCx} cy={CENTER.y} r={nucleus.poleR} opacity={nucleus.poleOpacity} />

      {/* Chromosomes — four pairs of sister chromatids, positioned/split per stage */}
      {CHROMOSOME_COLORS.map((color, i) => (
        <ChromosomePair
          key={i}
          cx={CENTER.x + chromosomes.dx[i]!}
          cy={CENTER.y + chromosomes.dy[i]!}
          rotation={chromosomes.rotation[i]!}
          splitDistance={chromosomes.splitDistance}
          opacity={chromosomes.opacity}
          scale={chromosomes.scale}
          color={color}
        />
      ))}
    </svg>
  );
}
