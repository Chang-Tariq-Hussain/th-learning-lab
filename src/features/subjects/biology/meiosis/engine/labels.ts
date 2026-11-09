import { CX, CY, rotate, type SceneState } from "./beats";
import { centromereOf } from "./shapes";
import { HOMOLOG_TAG } from "./palette";
import { type MeiosisPlan } from "./plan";
import { chIndex } from "./beats";
import type { StructureId } from "../data/stages";

export interface LabelSpec {
  id: string;
  text: string;
  /** Point the leader line touches. */
  ax: number;
  ay: number;
  structure?: StructureId;
}

/** Upper-left point of the leftmost top cell outline, for the membrane label. */
function membraneAnchor(sc: SceneState["s"]): [number, number] {
  let cx = CX;
  let rx = sc.r1 + sc.a1;
  if (sc.a1 >= sc.r1 - 0.5) {
    cx = CX - sc.a1;
    rx = sc.r1;
  }
  let cy = CY;
  let ry = sc.ry1;
  if (sc.a2 >= 0.5) {
    cy = CY - sc.a2;
    ry = sc.r2;
  }
  return [cx - 0.7071 * rx, cy - 0.7071 * ry];
}

/** Which structure labels to show at a beat, and where they point. Kept to a handful so the stage stays readable. */
export function buildLabels(plan: MeiosisPlan, st: SceneState, beat: number): LabelSpec[] {
  const out: LabelSpec[] = [];
  const sc = st.s;
  const spec0 = plan.specs[0]!;
  const lanes0 = [0, 1].flatMap((h) => [0, 1].map((s) => st.ch[chIndex({ pair: 0, homolog: h as 0 | 1, sister: s as 0 | 1 })]!));

  out.push({ id: "membrane", text: "Cell membrane", structure: "membrane", ...(([x, y]) => ({ ax: x, ay: y }))(membraneAnchor(sc)) });
  if (beat <= 5) out.push({ id: "nucleus", text: "Nucleus", structure: "nucleus", ax: CX - 0.7071 * sc.nrx, ay: CY - 0.7071 * sc.nry });
  if (beat === 15) out.push({ id: "nucleus", text: "Nucleus re-forms", structure: "nucleus", ax: CX - 226 - 70, ay: CY - 142 - 55 });
  if (beat <= 10 && beat >= 1) out.push({ id: "centrosome", text: "Centrosome", structure: "centrosome", ax: sc.cLx, ay: sc.cLy });
  if (beat >= 11 && beat <= 14) out.push({ id: "centrosome", text: "Centrosome", structure: "centrosome", ax: sc.c2[0]!, ay: sc.c2[1]! });

  if (beat === 7 || beat === 8 || beat === 9) out.push({ id: "spindle", text: "Spindle fibers", structure: "spindle", ax: CX - (beat === 7 ? 190 : beat === 8 ? 330 : 360), ay: CY - (beat === 7 ? 0 : 0) + (beat === 7 ? 0 : 0) });
  if (beat === 12 || beat === 13) out.push({ id: "spindle", text: "Spindle fibers", structure: "spindle", ax: CX - 226, ay: CY - (beat === 12 ? 160 : 190) });
  if (beat === 7) out.push({ id: "plate", text: "Metaphase plate", structure: "plate", ax: CX, ay: CY - sc.ry1 + 22 });
  if (beat === 12) out.push({ id: "plate", text: "Metaphase plate", structure: "plate", ax: CX - 226 + 150, ay: CY });

  if (beat >= 3 && beat <= 7) {
    const [a, , , d] = [lanes0[0]!, 0, 0, lanes0[3]!];
    void a;
    void d;
    const top = rodTop(plan, st, 0);
    out.push({ id: "tetrad", text: "Tetrad (4 chromatids)", structure: "tetrad", ax: top[0], ay: top[1] });
  }
  if (beat >= 4 && beat <= 6) {
    const x = plan.cross.findIndex((c) => c);
    if (x >= 0) {
      const c = plan.cross[x]!;
      const spec = plan.specs[x]!;
      const m = st.ch[chIndex({ pair: x, homolog: plan.leftHomolog[x]!, sister: (plan.leftHomolog[x] === 0 ? c.mSister : c.pSister) })]!;
      const [dx, dy] = rotate(0, (c.at - spec.centromere) * spec.length, m.rot);
      out.push({ id: "chiasma", text: beat === 4 ? "Chiasma (crossing point)" : "Crossover site", structure: "chiasma", ax: m.x + dx + (beat === 6 ? 12 : 0), ay: m.y + dy });
    }
  }
  if (beat === 1 || beat === 2 || beat === 11 || beat === 12) {
    const c0 = st.ch[chIndex({ pair: 0, homolog: plan.leftHomolog[0]!, sister: 0 })]!;
    const c1 = st.ch[chIndex({ pair: 0, homolog: plan.leftHomolog[0]!, sister: 1 })]!;
    out.push({ id: "sisters", text: "Sister chromatids", ax: (c0.x + c1.x) / 2, ay: (c0.y + c1.y) / 2 + (beat >= 11 ? 0 : -spec0.length * 0.25) });
  }
  if (beat === 8 || beat === 13) {
    const c = st.ch[chIndex({ pair: 0, homolog: plan.leftHomolog[0]!, sister: 0 })]!;
    const [x, y] = centromereOf(c);
    out.push({ id: "centromere", text: "Centromere", structure: "centromere", ax: x, ay: y });
  }
  if (beat === 9) out.push({ id: "furrow", text: "Cleavage furrow", structure: "furrow", ax: CX, ay: CY - sc.ry1 * 0.87 });
  if (beat === 14) out.push({ id: "furrow", text: "Cleavage furrows", structure: "furrow", ax: CX - 226 - 150, ay: CY });
  return out;
}

/** Top end of the first tetrad's rods (for the tetrad label). */
function rodTop(plan: MeiosisPlan, st: SceneState, pair: number): [number, number] {
  const spec = plan.specs[pair]!;
  const xs = [0, 1].flatMap((h) => [0, 1].map((s) => st.ch[chIndex({ pair, homolog: h as 0 | 1, sister: s as 0 | 1 })]!));
  const mx = xs.reduce((a, c) => a + c.x, 0) / 4;
  const my = xs.reduce((a, c) => a + c.y, 0) / 4;
  return [mx, my - spec.centromere * spec.length - 2];
}

/** Short pill text for a chromosome, e.g. "1M" (pair 1, maternal). */
export const chromosomeTag = (pair: number, homolog: 0 | 1): string => `${pair + 1}${HOMOLOG_TAG[homolog]}`;
