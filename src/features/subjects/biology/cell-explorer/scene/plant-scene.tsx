import { blobPath } from "../utils/organic-path";
import { Part } from "./part";
import type { LabelSpec } from "./labels";
import { tones } from "./palette";
import {
  ChloroplastShape,
  GolgiShape,
  MitochondrionShape,
  NuclearEnvelopeShape,
  NucleolusShape,
  NucleusBody,
  PlasmodesmaShape,
  RibosomeCluster,
  RoughERShape,
  SmoothERShape,
  VacuoleShape,
  VesicleShape,
  roundRectPath,
  type Oval,
  type RibosomeSpec,
} from "./shapes";

/** Layout of the plant cell, in scene units (640 x 480). Illustrative, not to scale. */
const WALL_OUT = roundRectPath(48, 34, 544, 412, 44);
const WALL_IN = roundRectPath(66, 52, 508, 376, 30);
const WALL_MID = roundRectPath(57, 43, 526, 394, 37);
const MEMBRANE = roundRectPath(69, 55, 502, 370, 28);
const MEMBRANE_IN = roundRectPath(74, 60, 492, 360, 24);

const NUC = { cx: 140, cy: 132, r: 42 };
const NUCLEOLUS = { cx: 148, cy: 125, r: 11 };
const BIG_VACUOLE = { cx: 396, cy: 246, rx: 146, ry: 130 };

const CHLOROPLASTS: Oval[] = [
  { cx: 290, cy: 84, rx: 26, ry: 13, rotate: -4 },
  { cx: 400, cy: 82, rx: 26, ry: 13, rotate: 3 },
  { cx: 500, cy: 88, rx: 25, ry: 13, rotate: -6 },
  { cx: 556, cy: 186, rx: 24, ry: 11, rotate: 84 },
  { cx: 556, cy: 310, rx: 24, ry: 11, rotate: 96 },
  { cx: 480, cy: 404, rx: 26, ry: 13, rotate: 3 },
  { cx: 370, cy: 405, rx: 26, ry: 13, rotate: -3 },
];
const MITO: Oval[] = [
  { cx: 196, cy: 292, rx: 25, ry: 12, rotate: 28 },
  { cx: 262, cy: 404, rx: 25, ry: 12, rotate: -6 },
];
const RIBOSOMES: RibosomeSpec[] = [
  { cx: 214, cy: 90, count: 4, seed: 11 },
  { cx: 96, cy: 222, count: 4, seed: 12 },
  { cx: 96, cy: 300, count: 3, seed: 13 },
  { cx: 548, cy: 124, count: 3, seed: 14 },
];
const SER_TUBES = [
  [{ x: 196, y: 246 }, { x: 176, y: 258 }, { x: 154, y: 246 }, { x: 132, y: 260 }],
  [{ x: 176, y: 258 }, { x: 182, y: 276 }, { x: 166, y: 288 }],
  [{ x: 154, y: 246 }, { x: 150, y: 232 }],
];
const GOLGI = { cx: 128, cy: 352, width: 62, rotate: -8 };
const VESICLES = [
  { cx: 176, cy: 332, r: 5.5 },
  { cx: 192, cy: 356, r: 5 },
  { cx: 80, cy: 318, r: 5 },
  { cx: 232, cy: 140, r: 5 },
  { cx: 214, cy: 330, r: 4.5 },
];
const VACUOLES = [
  { cx: 92, cy: 396, r: 12 },
  { cx: 236, cy: 106, r: 9 },
];
const PLASMODESMATA = [
  { x: 57, y: 190, rotate: 0 },
  { x: 57, y: 330, rotate: 0 },
  { x: 583, y: 130, rotate: 0 },
  { x: 583, y: 250, rotate: 0 },
  { x: 220, y: 43, rotate: 90 },
  { x: 430, y: 437, rotate: 90 },
];

export const PLANT_CENTERS: Record<string, { x: number; y: number }> = {
  cellWall: { x: 57, y: 240 },
  plasmodesmata: { x: PLASMODESMATA[0]!.x, y: PLASMODESMATA[0]!.y },
  cellMembrane: { x: 70, y: 240 },
  cytoplasm: { x: 120, y: 190 },
  nucleus: { x: NUC.cx, y: NUC.cy },
  nuclearEnvelope: { x: NUC.cx, y: NUC.cy - NUC.r },
  nucleolus: { x: NUCLEOLUS.cx, y: NUCLEOLUS.cy },
  mitochondria: { x: MITO[0]!.cx, y: MITO[0]!.cy },
  ribosomes: { x: RIBOSOMES[1]!.cx, y: RIBOSOMES[1]!.cy },
  roughER: { x: 160, y: 192 },
  smoothER: { x: 160, y: 254 },
  golgi: { x: GOLGI.cx, y: GOLGI.cy },
  vesicles: { x: VESICLES[0]!.cx, y: VESICLES[0]!.cy },
  vacuole: { x: VACUOLES[0]!.cx, y: VACUOLES[0]!.cy },
  largeVacuole: { x: BIG_VACUOLE.cx, y: BIG_VACUOLE.cy },
  chloroplast: { x: CHLOROPLASTS[0]!.cx, y: CHLOROPLASTS[0]!.cy },
};

export const PLANT_LABELS: LabelSpec[] = [
  { id: "cellWall", text: "Cell wall", x: 100, y: 22, tx: 112, ty: 43 },
  { id: "cellMembrane", text: "Cell membrane", x: 500, y: 24, tx: 480, ty: 56 },
  { id: "largeVacuole", text: "Large central vacuole", x: 396, y: 246 },
  { id: "chloroplast", text: "Chloroplast", x: 340, y: 130, tx: 296, ty: 90 },
  { id: "nucleus", text: "Nucleus", x: 96, y: 104, tx: 116, ty: 124 },
  { id: "nucleolus", text: "Nucleolus", x: 208, y: 124, tx: 152, ty: 126 },
  { id: "roughER", text: "Rough ER", x: 100, y: 214, tx: 134, ty: 190 },
  { id: "smoothER", text: "Smooth ER", x: 218, y: 218, tx: 170, ty: 252 },
  { id: "golgi", text: "Golgi apparatus", x: 118, y: 322, tx: 120, ty: 346 },
  { id: "mitochondria", text: "Mitochondria", x: 226, y: 324, tx: 198, ty: 296 },
  { id: "ribosomes", text: "Ribosomes", x: 132, y: 80, tx: 210, ty: 92 },
  { id: "vesicles", text: "Vesicles", x: 232, y: 372, tx: 194, ty: 357 },
  { id: "vacuole", text: "Vacuole", x: 128, y: 410, tx: 100, ty: 398 },
  { id: "plasmodesmata", text: "Plasmodesmata", x: 530, y: 250, tx: 580, ty: 250 },
];

const VAC_PATH = blobPath(BIG_VACUOLE.cx, BIG_VACUOLE.cy, 1, { rx: BIG_VACUOLE.rx, ry: BIG_VACUOLE.ry, amplitude: 0.03, amplitude2: 0.012, phase: 1.4, pointCount: 28 });

export function PlantScene() {
  const w = tones("cellWall");
  const m = tones("cellMembrane");
  const vac = tones("largeVacuole");
  return (
    <g>
      <g filter="url(#ce-shadow)">
        <path d={WALL_OUT} fill="url(#ce-wall)" />
      </g>

      <Part id="cytoplasm" pad={0} ringRadius={0}>
        <path d={MEMBRANE} fill="url(#ce-cyto-plant)" />
        <path d={MEMBRANE} fill="url(#ce-speckle)" />
      </Part>

      <Part id="cellWall" pad={4} ringRadius={0}>
        <path d={`${WALL_OUT} ${WALL_IN}`} fillRule="evenodd" fill="url(#ce-wall)" stroke={w.dark} strokeWidth={1.6} />
        <path d={WALL_MID} fill="none" stroke={w.dark} strokeWidth={0.9} opacity={0.45} strokeDasharray="14 5" />
        <path d={WALL_IN} fill="none" stroke={w.dark} strokeWidth={1.4} />
      </Part>

      <Part id="cellMembrane" pad={3} ringRadius={0}>
        <path d={MEMBRANE} fill="none" stroke="transparent" strokeWidth={12} pointerEvents="stroke" />
        <path d={MEMBRANE} fill="none" stroke={m.dark} strokeWidth={1.2} opacity={0.8} />
        <path d={MEMBRANE_IN} fill="none" stroke={m.dark} strokeWidth={1} opacity={0.7} />
        <path d={MEMBRANE} fill="none" stroke={m.base} strokeWidth={4} strokeLinecap="round" strokeDasharray="0.1 5.6" />
        <path d={MEMBRANE_IN} fill="none" stroke={m.light} strokeWidth={3.4} strokeLinecap="round" strokeDasharray="0.1 5.6" strokeDashoffset={2.8} />
      </Part>

      <Part id="largeVacuole" pad={4} ringRadius={60}>
        <path d={VAC_PATH} fill="url(#ce-vacuole-big)" stroke={vac.dark} strokeWidth={2.2} />
        <path d={VAC_PATH} fill="none" stroke="#FFFFFF" strokeWidth={1.2} opacity={0.6} transform={`translate(${BIG_VACUOLE.cx} ${BIG_VACUOLE.cy}) scale(0.965) translate(${-BIG_VACUOLE.cx} ${-BIG_VACUOLE.cy})`} />
        <ellipse cx={BIG_VACUOLE.cx - 70} cy={BIG_VACUOLE.cy - 70} rx={62} ry={26} fill="#FFFFFF" opacity={0.35} transform={`rotate(-18 ${BIG_VACUOLE.cx - 70} ${BIG_VACUOLE.cy - 70})`} />
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
        <RoughERShape cx={NUC.cx} cy={NUC.cy} radii={[NUC.r + 12, NUC.r + 23, NUC.r + 34]} a0={20} a1={160} />
      </Part>

      <Part id="golgi" pad={6}>
        <GolgiShape {...GOLGI} />
      </Part>

      {CHLOROPLASTS.map((o, i) => (
        <Part key={i} id="chloroplast" primary={i === 0} pad={4}>
          <ChloroplastShape {...o} />
        </Part>
      ))}
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

      <Part id="plasmodesmata" pad={4} ringRadius={6}>
        {PLASMODESMATA.map((p, i) => (
          <PlasmodesmaShape key={i} {...p} />
        ))}
      </Part>

      <Part id="nucleus" pad={4} ringRadius={40}>
        <NucleusBody {...NUC} />
      </Part>
      <Part id="nucleolus" pad={3} ringRadius={20}>
        <NucleolusShape {...NUCLEOLUS} />
      </Part>
      <Part id="nuclearEnvelope" pad={5} ringRadius={44}>
        <NuclearEnvelopeShape {...NUC} />
      </Part>
    </g>
  );
}
