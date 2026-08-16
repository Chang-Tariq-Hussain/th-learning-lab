"use client";

import { motion } from "framer-motion";

export interface CellSceneProps {
  stageIndex: number;
}

const VIEW_WIDTH = 440;
const VIEW_HEIGHT = 320;
const TWEEN = { duration: 0.9, ease: "easeInOut" as const };

/** Two homologous pairs, told apart by size (large/small) and by color (maternal/paternal origin) — the spec's "matching colors/shapes to identify homologous chromosomes." */
const PAIR1_MATERNAL = "#3B82F6"; // blue, large
const PAIR1_PATERNAL = "#EF4444"; // red, large
const PAIR2_MATERNAL = "#14B8A6"; // teal, small
const PAIR2_PATERNAL = "#F59E0B"; // orange, small

/** Rotates a point around the origin by `deg` degrees. */
function rotatePoint(x: number, y: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [x * cos - y * sin, x * sin + y * cos];
}

/** Builds one sister-chromatid arm as an absolute "M x y Q x y x y" path — same construction Mitosis uses, duplicated here so this simulation stays self-contained. */
function chromatidPath(armSign: 1 | -1, splitDistance: number, rotation: number, scale: number, cx: number, cy: number): string {
  const localPoints: Array<[number, number]> = armSign === 1 ? [[4, -15], [-6, 0], [4, 15]] : [[-4, -15], [6, 0], [-4, 15]];
  const absolute = localPoints.map(([x, y]) => {
    const shiftedX = x + armSign * splitDistance;
    const [rx, ry] = rotatePoint(shiftedX * scale, y * scale, rotation);
    return [rx + cx, ry + cy] as [number, number];
  });
  const [p0, p1, p2] = absolute as [[number, number], [number, number], [number, number]];
  return `M ${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`;
}

/** A single unpaired chromatid — half of an X, used for the four final haploid cells where sister chromatids have fully separated into different cells. */
function singleStrandPath(rotation: number, scale: number, cx: number, cy: number): string {
  const localPoints: Array<[number, number]> = [[0, -15], [3, 0], [0, 15]];
  const absolute = localPoints.map(([x, y]) => {
    const [rx, ry] = rotatePoint(x * scale, y * scale, rotation);
    return [rx + cx, ry + cy] as [number, number];
  });
  const [p0, p1, p2] = absolute as [[number, number], [number, number], [number, number]];
  return `M ${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`;
}

/** A duplicated chromosome — two sister chromatids joined at a centromere (splitDistance 0) or pulled apart along local x/y once `splitDistance` grows. */
function Chromosome({ cx, cy, rotation, splitDistance, scale, color }: { cx: number; cy: number; rotation: number; splitDistance: number; scale: number; color: string }) {
  return (
    <motion.g>
      <motion.path stroke={color} strokeWidth={4} strokeLinecap="round" fill="none" animate={{ d: chromatidPath(1, splitDistance, rotation, scale, cx, cy) }} transition={TWEEN} />
      <motion.path stroke={color} strokeWidth={4} strokeLinecap="round" fill="none" animate={{ d: chromatidPath(-1, splitDistance, rotation, scale, cx, cy) }} transition={TWEEN} />
      <motion.circle r={2.6} fill={color} animate={{ cx, cy, opacity: splitDistance < 4 ? 1 : 0 }} transition={TWEEN} />
    </motion.g>
  );
}

/** A single, already-separated chromatid — what's left in each of the four final haploid cells. */
function SingleChromosome({ cx, cy, rotation, scale, color }: { cx: number; cy: number; rotation: number; scale: number; color: string }) {
  return <motion.path stroke={color} strokeWidth={4} strokeLinecap="round" fill="none" animate={{ d: singleStrandPath(rotation, scale, cx, cy) }} transition={TWEEN} />;
}

interface CellRect {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

const SINGLE_CELL: CellRect = { cx: 220, cy: 160, rx: 160, ry: 108 };
const DOUBLE_CELLS: [CellRect, CellRect] = [
  { cx: 125, cy: 160, rx: 92, ry: 96 },
  { cx: 315, cy: 160, rx: 92, ry: 96 },
];
const QUAD_CELLS: [CellRect, CellRect, CellRect, CellRect] = [
  { cx: 95, cy: 95, rx: 68, ry: 54 },
  { cx: 95, cy: 225, rx: 68, ry: 54 },
  { cx: 345, cy: 95, rx: 68, ry: 54 },
  { cx: 345, cy: 225, rx: 68, ry: 54 },
];

/** Which layer of cells (1, 2, or 4) is visible at each stage. All three layers are always in the DOM — only opacity toggles — so framer-motion can cross-fade between them, the same trick Mitosis uses for its whole-vs-split membrane. */
const CELL_LAYER_OPACITY: Array<{ single: number; double: number; quad: number }> = [
  { single: 1, double: 0, quad: 0 }, // DNA Replication
  { single: 1, double: 0, quad: 0 }, // Prophase I
  { single: 1, double: 0, quad: 0 }, // Metaphase I
  { single: 1, double: 0, quad: 0 }, // Anaphase I
  { single: 0, double: 1, quad: 0 }, // Telophase I
  { single: 0, double: 1, quad: 0 }, // Prophase II
  { single: 0, double: 1, quad: 0 }, // Metaphase II
  { single: 0, double: 1, quad: 0 }, // Anaphase II
  { single: 0, double: 0, quad: 1 }, // Telophase II
];

interface TokenLayout {
  cell: "single" | "left" | "right";
  dx: number;
  dy: number;
  rotation: number;
  splitDistance: number;
  scale: number;
}

/** One entry per stage for each of the four chromosomes (T1 pair-1 maternal, T2 pair-1 paternal, T3 pair-2 maternal, T4 pair-2 paternal). Positions are local offsets from whichever cell that chromosome currently belongs to. */
const TOKEN_LAYOUT: Record<"T1" | "T2" | "T3" | "T4", TokenLayout[]> = {
  T1: [
    { cell: "single", dx: -60, dy: -42, rotation: -14, splitDistance: 0, scale: 0.85 },
    { cell: "single", dx: -14, dy: -50, rotation: -8, splitDistance: 0, scale: 0.85 },
    { cell: "single", dx: -13, dy: -46, rotation: 0, splitDistance: 0, scale: 0.92 },
    { cell: "single", dx: -72, dy: -38, rotation: 0, splitDistance: 0, scale: 0.9 },
    { cell: "left", dx: 0, dy: -38, rotation: 0, splitDistance: 0, scale: 0.85 },
    { cell: "left", dx: -8, dy: -30, rotation: -10, splitDistance: 0, scale: 0.85 },
    { cell: "left", dx: 0, dy: -34, rotation: 0, splitDistance: 0, scale: 0.92 },
    { cell: "left", dx: 0, dy: -34, rotation: 90, splitDistance: 30, scale: 0.92 },
    { cell: "left", dx: 0, dy: -34, rotation: 90, splitDistance: 30, scale: 0.92 },
  ],
  T2: [
    { cell: "single", dx: 60, dy: -42, rotation: 14, splitDistance: 0, scale: 0.85 },
    { cell: "single", dx: 14, dy: -50, rotation: 8, splitDistance: 0, scale: 0.85 },
    { cell: "single", dx: 13, dy: -46, rotation: 0, splitDistance: 0, scale: 0.92 },
    { cell: "single", dx: 72, dy: -38, rotation: 0, splitDistance: 0, scale: 0.9 },
    { cell: "right", dx: 0, dy: -38, rotation: 0, splitDistance: 0, scale: 0.85 },
    { cell: "right", dx: -8, dy: -30, rotation: 10, splitDistance: 0, scale: 0.85 },
    { cell: "right", dx: 0, dy: -34, rotation: 0, splitDistance: 0, scale: 0.92 },
    { cell: "right", dx: 0, dy: -34, rotation: 90, splitDistance: 30, scale: 0.92 },
    { cell: "right", dx: 0, dy: -34, rotation: 90, splitDistance: 30, scale: 0.92 },
  ],
  T3: [
    { cell: "single", dx: -55, dy: 40, rotation: 10, splitDistance: 0, scale: 0.7 },
    { cell: "single", dx: -12, dy: 38, rotation: 8, splitDistance: 0, scale: 0.7 },
    { cell: "single", dx: -11, dy: 20, rotation: 0, splitDistance: 0, scale: 0.76 },
    { cell: "single", dx: -68, dy: 32, rotation: 0, splitDistance: 0, scale: 0.76 },
    { cell: "left", dx: 0, dy: 30, rotation: 0, splitDistance: 0, scale: 0.7 },
    { cell: "left", dx: 8, dy: 28, rotation: 10, splitDistance: 0, scale: 0.7 },
    { cell: "left", dx: 0, dy: 30, rotation: 0, splitDistance: 0, scale: 0.76 },
    { cell: "left", dx: 0, dy: 30, rotation: 90, splitDistance: 26, scale: 0.76 },
    { cell: "left", dx: 0, dy: 30, rotation: 90, splitDistance: 26, scale: 0.76 },
  ],
  T4: [
    { cell: "single", dx: 55, dy: 40, rotation: -10, splitDistance: 0, scale: 0.7 },
    { cell: "single", dx: 12, dy: 38, rotation: -8, splitDistance: 0, scale: 0.7 },
    { cell: "single", dx: 11, dy: 20, rotation: 0, splitDistance: 0, scale: 0.76 },
    { cell: "single", dx: 68, dy: 32, rotation: 0, splitDistance: 0, scale: 0.76 },
    { cell: "right", dx: 0, dy: 30, rotation: 0, splitDistance: 0, scale: 0.7 },
    { cell: "right", dx: -8, dy: 28, rotation: -10, splitDistance: 0, scale: 0.7 },
    { cell: "right", dx: 0, dy: 30, rotation: 0, splitDistance: 0, scale: 0.76 },
    { cell: "right", dx: 0, dy: 30, rotation: 90, splitDistance: 26, scale: 0.76 },
    { cell: "right", dx: 0, dy: 30, rotation: 90, splitDistance: 26, scale: 0.76 },
  ],
};

const TOKEN_COLOR: Record<"T1" | "T2" | "T3" | "T4", string> = {
  T1: PAIR1_MATERNAL,
  T2: PAIR1_PATERNAL,
  T3: PAIR2_MATERNAL,
  T4: PAIR2_PATERNAL,
};

/** T1–T4 (the four duplicated chromosomes) are visible through Anaphase II; the final Telophase II stage swaps them for eight single, already-separated chromatids in the four haploid cells. */
const TOKEN_GROUP_OPACITY = [1, 1, 1, 1, 1, 1, 1, 1, 0];
const FINAL_GROUP_OPACITY = [0, 0, 0, 0, 0, 0, 0, 0, 1];

/** Small marker showing a crossover event between paired homologs — only shown during Prophase I, per the spec's "keep crossing over simple." */
const CROSSOVER_OPACITY = [0, 1, 0, 0, 0, 0, 0, 0, 0];

function cellFor(rect: "single" | "left" | "right"): CellRect {
  if (rect === "single") return SINGLE_CELL;
  return rect === "left" ? DOUBLE_CELLS[0] : DOUBLE_CELLS[1];
}

export function CellScene({ stageIndex }: CellSceneProps) {
  const layers = CELL_LAYER_OPACITY[stageIndex] ?? CELL_LAYER_OPACITY[0]!;
  const groupOpacity = TOKEN_GROUP_OPACITY[stageIndex] ?? 1;
  const finalOpacity = FINAL_GROUP_OPACITY[stageIndex] ?? 0;
  const crossoverOpacity = CROSSOVER_OPACITY[stageIndex] ?? 0;

  const tokenIds: Array<"T1" | "T2" | "T3" | "T4"> = ["T1", "T2", "T3", "T4"];

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label="A simplified cell with two homologous chromosome pairs dividing through meiosis into four haploid cells"
    >
      <defs>
        <radialGradient id="cytoplasm-fill-meiosis" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#FFFBF6" />
          <stop offset="45%" stopColor="#DFF5F2" />
          <stop offset="100%" stopColor="#AEE1DA" />
        </radialGradient>
        <filter id="meiosis-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#0D9488" floodOpacity="0.16" />
        </filter>
      </defs>

      {/* Single whole cell — DNA Replication through Anaphase I */}
      <motion.ellipse
        cx={SINGLE_CELL.cx}
        cy={SINGLE_CELL.cy}
        rx={SINGLE_CELL.rx}
        ry={SINGLE_CELL.ry}
        fill="url(#cytoplasm-fill-meiosis)"
        stroke="#0D9488"
        strokeWidth={3}
        filter="url(#meiosis-shadow)"
        animate={{ opacity: layers.single }}
        transition={TWEEN}
      />

      {/* Two cells — Telophase I through Anaphase II */}
      <motion.g animate={{ opacity: layers.double }} transition={TWEEN}>
        {DOUBLE_CELLS.map((cell, i) => (
          <ellipse key={i} cx={cell.cx} cy={cell.cy} rx={cell.rx} ry={cell.ry} fill="url(#cytoplasm-fill-meiosis)" stroke="#0D9488" strokeWidth={3} />
        ))}
      </motion.g>

      {/* Four final haploid cells — Telophase II */}
      <motion.g animate={{ opacity: layers.quad }} transition={TWEEN}>
        {QUAD_CELLS.map((cell, i) => (
          <ellipse key={i} cx={cell.cx} cy={cell.cy} rx={cell.rx} ry={cell.ry} fill="url(#cytoplasm-fill-meiosis)" stroke="#0D9488" strokeWidth={2.5} />
        ))}
      </motion.g>

      {/* Crossover marker between paired homologs, Prophase I only */}
      <motion.g animate={{ opacity: crossoverOpacity }} transition={TWEEN} stroke="#94785C" strokeWidth={2} strokeDasharray="3 3">
        <line x1={SINGLE_CELL.cx - 14} y1={SINGLE_CELL.cy - 50} x2={SINGLE_CELL.cx + 14} y2={SINGLE_CELL.cy - 50} />
        <line x1={SINGLE_CELL.cx - 12} y1={SINGLE_CELL.cy + 38} x2={SINGLE_CELL.cx + 12} y2={SINGLE_CELL.cy + 38} />
      </motion.g>

      {/* The four duplicated chromosomes, tracked through Anaphase II */}
      <motion.g animate={{ opacity: groupOpacity }} transition={TWEEN}>
        {tokenIds.map((id) => {
          const layout = TOKEN_LAYOUT[id][stageIndex] ?? TOKEN_LAYOUT[id][0]!;
          const cell = cellFor(layout.cell);
          return (
            <Chromosome
              key={id}
              cx={cell.cx + layout.dx}
              cy={cell.cy + layout.dy}
              rotation={layout.rotation}
              splitDistance={layout.splitDistance}
              scale={layout.scale}
              color={TOKEN_COLOR[id]}
            />
          );
        })}
      </motion.g>

      {/* Eight single chromatids in the four final haploid cells */}
      <motion.g animate={{ opacity: finalOpacity }} transition={TWEEN}>
        {QUAD_CELLS.map((cell, i) => {
          const isLeftLineage = i < 2;
          const largeColor = isLeftLineage ? PAIR1_MATERNAL : PAIR1_PATERNAL;
          const smallColor = isLeftLineage ? PAIR2_MATERNAL : PAIR2_PATERNAL;
          const flip = i % 2 === 0 ? 1 : -1;
          return (
            <g key={i}>
              <SingleChromosome cx={cell.cx} cy={cell.cy - 16} rotation={-8 * flip} scale={0.78} color={largeColor} />
              <SingleChromosome cx={cell.cx} cy={cell.cy + 14} rotation={8 * flip} scale={0.62} color={smallColor} />
            </g>
          );
        })}
      </motion.g>
    </svg>
  );
}
