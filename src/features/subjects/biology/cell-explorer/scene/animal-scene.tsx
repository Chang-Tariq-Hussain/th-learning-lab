import { blobPath } from "../utils/organic-path";
import { Part } from "./part";
import type { LabelSpec } from "./labels";
import { tones } from "./palette";
import {
  MitochondrionShape,
  NuclearEnvelopeShape,
  NucleolusShape,
  NucleusBody,
  RibosomeCluster,
  RoughERShape,
  SmoothERShape,
  GolgiShape,
  VacuoleShape,
  VesicleShape,
  type Oval,
  type RibosomeSpec,
} from "./shapes";

/** Layout of the animal cell, in scene units (640 x 480). Illustrative, not to scale. */
const CELL = { cx: 320, cy: 240, rx: 236, ry: 194 };
const NUC = { cx: 262, cy: 226, r: 72 };
const NUCLEOLUS = { cx: 277, cy: 214, r: 18 };

const MITO: Oval[] = [
  { cx: 448, cy: 306, rx: 31, ry: 15, rotate: -22 },
  { cx: 146, cy: 156, rx: 28, ry: 14, rotate: 30 },
  { cx: 372, cy: 392, rx: 29, ry: 14, rotate: 6 },
  { cx: 516, cy: 238, rx: 26, ry: 13, rotate: 74 },
];
const RIBOSOMES: RibosomeSpec[] = [
  { cx: 176, cy: 96, count: 6, seed: 1 },
  { cx: 340, cy: 92, count: 5, seed: 2 },
  { cx: 120, cy: 316, count: 5, seed: 3 },
  { cx: 262, cy: 404, count: 5, seed: 4 },
  { cx: 488, cy: 150, count: 4, seed: 5 },
];
const SER_TUBES = [
  [{ x: 214, y: 318 }, { x: 190, y: 330 }, { x: 168, y: 318 }, { x: 150, y: 336 }, { x: 128, y: 330 }],
  [{ x: 190, y: 330 }, { x: 196, y: 352 }, { x: 178, y: 372 }, { x: 196, y: 388 }],
  [{ x: 168, y: 318 }, { x: 170, y: 292 }, { x: 150, y: 276 }],
  [{ x: 150, y: 336 }, { x: 138, y: 356 }, { x: 148, y: 376 }],
];
const GOLGI = { cx: 418, cy: 166, width: 84, rotate: -38 };
const VESICLES = [
  { cx: 462, cy: 205, r: 7.5 },
  { cx: 452, cy: 126, r: 6.5 },
  { cx: 478, cy: 175, r: 5.5 },
  { cx: 360, cy: 268, r: 6.5 },
  { cx: 336, cy: 320, r: 5.5 },
  { cx: 548, cy: 160, r: 6 },
  { cx: 232, cy: 372, r: 6.5 },
  { cx: 100, cy: 224, r: 5.5 },
];
const VACUOLES = [
  { cx: 128, cy: 252, r: 17 },
  { cx: 376, cy: 100, r: 15 },
  { cx: 505, cy: 356, r: 14 },
];

export const ANIMAL_CENTERS: Record<string, { x: number; y: number }> = {
  cellMembrane: { x: CELL.cx + CELL.rx, y: CELL.cy },
  cytoplasm: { x: 330, y: 300 },
  nucleus: { x: NUC.cx, y: NUC.cy },
  nuclearEnvelope: { x: NUC.cx, y: NUC.cy - NUC.r },
  nucleolus: { x: NUCLEOLUS.cx, y: NUCLEOLUS.cy },
  mitochondria: { x: MITO[0]!.cx, y: MITO[0]!.cy },
  ribosomes: { x: RIBOSOMES[0]!.cx, y: RIBOSOMES[0]!.cy },
  roughER: { x: 340, y: 292 },
  smoothER: { x: 170, y: 336 },
  golgi: { x: GOLGI.cx, y: GOLGI.cy },
  vesicles: { x: VESICLES[0]!.cx, y: VESICLES[0]!.cy },
  vacuole: { x: VACUOLES[0]!.cx, y: VACUOLES[0]!.cy },
};

export const ANIMAL_LABELS: LabelSpec[] = [
  { id: "nucleus", text: "Nucleus", x: 236, y: 250, tx: 244, ty: 246 },
  { id: "nucleolus", text: "Nucleolus", x: 302, y: 192, tx: 281, ty: 208 },
  { id: "nuclearEnvelope", text: "Nuclear envelope", x: 214, y: 128, tx: 232, ty: 160 },
  { id: "roughER", text: "Rough ER", x: 392, y: 262, tx: 346, ty: 288 },
  { id: "smoothER", text: "Smooth ER", x: 218, y: 396, tx: 176, ty: 336 },
  { id: "golgi", text: "Golgi apparatus", x: 440, y: 108, tx: 424, ty: 150 },
  { id: "mitochondria", text: "Mitochondria", x: 498, y: 332, tx: 455, ty: 310 },
  { id: "ribosomes", text: "Ribosomes", x: 178, y: 72, tx: 176, ty: 94 },
  { id: "vesicles", text: "Vesicles", x: 530, y: 204, tx: 468, ty: 205 },
  { id: "vacuole", text: "Vacuole", x: 96, y: 282, tx: 120, ty: 258 },
  { id: "cellMembrane", text: "Cell membrane", x: 540, y: 98, tx: 520, ty: 112 },
  { id: "cytoplasm", text: "Cytoplasm", x: 304, y: 352, tx: 316, ty: 340 },
];

const MEMBRANE = blobPath(CELL.cx, CELL.cy, 1, { rx: CELL.rx, ry: CELL.ry, amplitude: 0.035, amplitude2: 0.015, phase: 0.8, pointCount: 30 });
const MEMBRANE_INNER = blobPath(CELL.cx, CELL.cy, 1, { rx: CELL.rx - 7, ry: CELL.ry - 7, amplitude: 0.035, amplitude2: 0.015, phase: 0.8, pointCount: 30 });

export function AnimalScene() {
  const m = tones("cellMembrane");
  return (
    <g>
      {/* cytoplasm: the fill of the whole cell */}
      <Part id="cytoplasm" pad={0} ringRadius={0}>
        <path d={MEMBRANE} fill="url(#ce-cyto-animal)" filter="url(#ce-shadow)" />
        <path d={MEMBRANE} fill="url(#ce-speckle)" />
      </Part>

      {/* cell membrane: a bilayer drawn as two rows of beads (phospholipid heads) around the edge */}
      <Part id="cellMembrane" pad={4} ringRadius={0}>
        <path d={MEMBRANE} fill="none" stroke="transparent" strokeWidth={18} pointerEvents="stroke" />
        <path d={MEMBRANE} fill="none" stroke={m.dark} strokeWidth={1.4} opacity={0.8} />
        <path d={MEMBRANE_INNER} fill="none" stroke={m.dark} strokeWidth={1.2} opacity={0.7} />
        <path d={MEMBRANE} fill="none" stroke={m.base} strokeWidth={5} strokeLinecap="round" strokeDasharray="0.1 6.4" />
        <path d={MEMBRANE_INNER} fill="none" stroke={m.light} strokeWidth={4.4} strokeLinecap="round" strokeDasharray="0.1 6.4" strokeDashoffset={3} />
      </Part>

      <Part id="vacuole" pad={4}>
        {VACUOLES.map((v, i) => (
          <VacuoleShape key={i} {...v} />
        ))}
      </Part>

      <Part id="smoothER" pad={6}>
        <SmoothERShape tubes={SER_TUBES} />
      </Part>
      <Part id="roughER" pad={6}>
        <RoughERShape cx={NUC.cx} cy={NUC.cy} radii={[NUC.r + 15, NUC.r + 28, NUC.r + 41, NUC.r + 54]} a0={8} a1={128} />
      </Part>

      <Part id="golgi" pad={6}>
        <GolgiShape {...GOLGI} />
      </Part>

      {MITO.map((o, i) => (
        <Part key={i} id="mitochondria" primary={i === 0} pad={4}>
          <MitochondrionShape {...o} />
        </Part>
      ))}

      {RIBOSOMES.map((spec, i) => (
        <Part key={i} id="ribosomes" primary={i === 0} pad={3}>
          <RibosomeCluster spec={spec} />
        </Part>
      ))}

      <Part id="vesicles" pad={4}>
        {VESICLES.map((v, i) => (
          <VesicleShape key={i} {...v} />
        ))}
      </Part>

      <Part id="nucleus" pad={4} ringRadius={40}>
        <NucleusBody {...NUC} />
      </Part>
      <Part id="nucleolus" pad={3} ringRadius={30}>
        <NucleolusShape {...NUCLEOLUS} />
      </Part>
      <Part id="nuclearEnvelope" pad={5} ringRadius={44}>
        <NuclearEnvelopeShape {...NUC} />
      </Part>
    </g>
  );
}
