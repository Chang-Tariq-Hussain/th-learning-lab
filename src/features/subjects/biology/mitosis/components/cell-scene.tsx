"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { OrganelleHotspot } from "@/features/subjects/biology/cell-explorer/components/organelle-hotspot";

export interface CellSceneProps {
  stageIndex: number;
  /** Currently selected structure id ("chromosome" | "spindle" | "centrosome" | "nucleus"), or null. */
  selectedId: string | null;
  onSelect: (id: string) => void;
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

const CENTROSOME_COLOR = "#475569";

interface CentrosomeLayout {
  /** Horizontal distance of each pole from CENTER.x (poles are mirrored left/right). */
  poleOffset: number;
  opacity: number;
}

/**
 * Centrosomes duplicate before mitosis begins, so both are already
 * present (faint, still close together) at Interphase — they're just
 * not yet organizing anything. They migrate apart through Prophase,
 * hold their positions at the two poles for Metaphase/Anaphase (this
 * is what "opposite poles" means visually), then fade as the spindle
 * disassembles during Telophase/Cytokinesis.
 */
const CENTROSOME_LAYOUT: CentrosomeLayout[] = [
  { poleOffset: 16, opacity: 0.5 },
  { poleOffset: 95, opacity: 1 },
  { poleOffset: 140, opacity: 1 },
  { poleOffset: 140, opacity: 1 },
  { poleOffset: 140, opacity: 0.8 },
  { poleOffset: 140, opacity: 0 },
];

/**
 * Spindle fiber opacity per stage. Fibers are absent at Interphase
 * (nothing to attach to yet), fade in through Prophase as the spindle
 * apparatus assembles, stay fully visible while doing the actual work
 * of aligning (Metaphase) and separating (Anaphase) chromosomes, then
 * fade out as the spindle disassembles (Telophase/Cytokinesis).
 */
const SPINDLE_OPACITY = [0, 0.45, 1, 1, 0.3, 0];

interface NucleusLayout {
  mainOpacity: number;
  poleOpacity: number;
  poleCx: number;
  poleR: number;
  /** True only while the envelope is actively breaking down (Prophase) — rendered as a perforated/dashed outline instead of a solid one, a distinct visual cue from "fading out." */
  envelopeDashed: boolean;
}

/** Main (single, pre-division) nucleus fades out across Prophase; the two new nuclei fade in at Telophase and recenter once the cell has physically split at Cytokinesis. */
const NUCLEUS_LAYOUT: NucleusLayout[] = [
  { mainOpacity: 1, poleOpacity: 0, poleCx: 150, poleR: 40, envelopeDashed: false },
  { mainOpacity: 0.25, poleOpacity: 0, poleCx: 150, poleR: 40, envelopeDashed: true },
  { mainOpacity: 0, poleOpacity: 0, poleCx: 150, poleR: 40, envelopeDashed: false },
  { mainOpacity: 0, poleOpacity: 0, poleCx: 150, poleR: 40, envelopeDashed: false },
  { mainOpacity: 0, poleOpacity: 1, poleCx: 150, poleR: 40, envelopeDashed: false },
  { mainOpacity: 0, poleOpacity: 1, poleCx: 125, poleR: 36, envelopeDashed: false },
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

/** A centrosome, drawn as a small aster: a pair of short perpendicular rods with a few radiating microtubule stubs, rather than a plain dot, so it visually reads as "the thing spindle fibers come from." */
function Centrosome({ cx, cy, opacity }: { cx: number; cy: number; opacity: number }) {
  const spokes = [-60, -20, 20, 60, 100, 140, 180, 220];
  return (
    <motion.g animate={{ opacity }} transition={TWEEN}>
      {spokes.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(rad) * 9}
            y2={cy + Math.sin(rad) * 9}
            stroke={CENTROSOME_COLOR}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={3} fill={CENTROSOME_COLOR} />
    </motion.g>
  );
}

/** One kinetochore-style spindle fiber, from a centrosome to the point on a chromosome pair it's currently pulling toward/holding. */
function SpindleFiber({ x1, y1, x2, y2, opacity }: { x1: number; y1: number; x2: number; y2: number; opacity: number }) {
  return (
    <motion.line
      stroke={CENTROSOME_COLOR}
      strokeWidth={1.25}
      strokeOpacity={0.55}
      animate={{ x1, y1, x2, y2, opacity }}
      transition={TWEEN}
    />
  );
}

/**
 * Wraps `children` in `OrganelleHotspot` only when `interactive` is
 * true, so an invisible/near-invisible structure (opacity ~0 for its
 * current stage) never leaves behind a clickable-but-unseeable hit
 * area. Kept local to this file rather than changing
 * `OrganelleHotspot` itself, since that component is shared with Cell
 * Explorer and doesn't need a visibility concept of its own.
 */
function MaybeHotspot({
  interactive,
  id,
  label,
  selectedId,
  onSelect,
  children,
}: {
  interactive: boolean;
  id: string;
  label: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  children: ReactNode;
}) {
  if (!interactive) return <>{children}</>;
  return (
    <OrganelleHotspot id={id} label={label} isSelected={selectedId === id} onSelect={onSelect}>
      {children}
    </OrganelleHotspot>
  );
}

function Nucleus({
  cx,
  cy,
  r,
  opacity,
  dna,
  envelopeDashed,
}: {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
  dna?: boolean;
  /** Renders the envelope's outline as perforated dashes instead of a solid ring — the visual cue for "the envelope is breaking down," distinct from just fading. */
  envelopeDashed?: boolean;
}) {
  return (
    <motion.g animate={{ opacity }} transition={TWEEN}>
      <motion.circle
        cy={cy}
        fill="#8B7BC7"
        fillOpacity={0.4}
        stroke="#5B4B9E"
        strokeWidth={2}
        strokeDasharray={envelopeDashed ? "6 5" : undefined}
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
export function CellScene({ stageIndex, selectedId, onSelect }: CellSceneProps) {
  const chromosomes = CHROMOSOME_LAYOUT[stageIndex] ?? CHROMOSOME_LAYOUT[0]!;
  const nucleus = NUCLEUS_LAYOUT[stageIndex] ?? NUCLEUS_LAYOUT[0]!;
  const membrane = MEMBRANE_LAYOUT[stageIndex] ?? MEMBRANE_LAYOUT[0]!;
  const centrosome = CENTROSOME_LAYOUT[stageIndex] ?? CENTROSOME_LAYOUT[0]!;
  const spindleOpacity = SPINDLE_OPACITY[stageIndex] ?? 0;

  const rightPoleCx = VIEW_WIDTH - membrane.splitCx;
  const leftCentrosomeX = CENTER.x - centrosome.poleOffset;
  const rightCentrosomeX = CENTER.x + centrosome.poleOffset;
  /** How far each chromosome pair's kinetochore attach point has traveled off-center — 0 at Metaphase (still at the plate), growing through Anaphase as chromatids separate. */
  const attachSpread = chromosomes.splitDistance * chromosomes.scale;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label="An animal cell dividing through the stages of mitosis into two daughter cells, showing chromosomes, centrosomes, and spindle fibers"
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

      {/* Main nucleus (Interphase → early Prophase) — dashed outline during Prophase signals the envelope actively perforating/breaking down, not just fading */}
      <MaybeHotspot
        interactive={nucleus.mainOpacity > 0.05}
        id="nucleus"
        label="Nucleus"
        selectedId={selectedId}
        onSelect={onSelect}
      >
        <Nucleus cx={CENTER.x} cy={CENTER.y} r={58} opacity={nucleus.mainOpacity} dna envelopeDashed={nucleus.envelopeDashed} />
      </MaybeHotspot>

      {/* Two new nuclei (Telophase onward), recentering into the split cells at Cytokinesis */}
      <MaybeHotspot interactive={nucleus.poleOpacity > 0.05} id="nucleus" label="Nucleus" selectedId={selectedId} onSelect={onSelect}>
        <Nucleus cx={nucleus.poleCx} cy={CENTER.y} r={nucleus.poleR} opacity={nucleus.poleOpacity} />
      </MaybeHotspot>
      <MaybeHotspot interactive={nucleus.poleOpacity > 0.05} id="nucleus" label="Nucleus" selectedId={selectedId} onSelect={onSelect}>
        <Nucleus cx={VIEW_WIDTH - nucleus.poleCx} cy={CENTER.y} r={nucleus.poleR} opacity={nucleus.poleOpacity} />
      </MaybeHotspot>

      {/* Spindle fibers — one pair per chromosome row, pole → kinetochore, drawn under the chromosomes they're attached to */}
      <MaybeHotspot
        interactive={spindleOpacity > 0.05}
        id="spindle"
        label="Spindle fibers"
        selectedId={selectedId}
        onSelect={onSelect}
      >
        <>
          {CHROMOSOME_COLORS.map((_, i) => {
            const cy = CENTER.y + chromosomes.dy[i]!;
            return (
              <g key={i}>
                <SpindleFiber
                  x1={leftCentrosomeX}
                  y1={CENTER.y}
                  x2={CENTER.x - attachSpread}
                  y2={cy}
                  opacity={spindleOpacity}
                />
                <SpindleFiber
                  x1={rightCentrosomeX}
                  y1={CENTER.y}
                  x2={CENTER.x + attachSpread}
                  y2={cy}
                  opacity={spindleOpacity}
                />
              </g>
            );
          })}
        </>
      </MaybeHotspot>

      {/* Centrosomes — one pair, migrating to opposite poles and organizing the spindle */}
      <MaybeHotspot interactive={centrosome.opacity > 0.05} id="centrosome" label="Centrosome" selectedId={selectedId} onSelect={onSelect}>
        <Centrosome cx={leftCentrosomeX} cy={CENTER.y} opacity={centrosome.opacity} />
      </MaybeHotspot>
      <MaybeHotspot interactive={centrosome.opacity > 0.05} id="centrosome" label="Centrosome" selectedId={selectedId} onSelect={onSelect}>
        <Centrosome cx={rightCentrosomeX} cy={CENTER.y} opacity={centrosome.opacity} />
      </MaybeHotspot>

      {/* Chromosomes — four pairs of sister chromatids, positioned/split per stage */}
      {CHROMOSOME_COLORS.map((color, i) => (
        <MaybeHotspot
          key={i}
          interactive={chromosomes.opacity > 0.05}
          id="chromosome"
          label="Chromosome"
          selectedId={selectedId}
          onSelect={onSelect}
        >
          <ChromosomePair
            cx={CENTER.x + chromosomes.dx[i]!}
            cy={CENTER.y + chromosomes.dy[i]!}
            rotation={chromosomes.rotation[i]!}
            splitDistance={chromosomes.splitDistance}
            opacity={chromosomes.opacity}
            scale={chromosomes.scale}
            color={color}
          />
        </MaybeHotspot>
      ))}
    </svg>
  );
}
