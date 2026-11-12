import { CX, CY, chIndex, type SceneState } from "./beats";
import { kinetochorePoint, outlinePoint } from "./shapes";
import { sideOf, type MitosisPlan } from "./plan";

export interface Label {
  id: string;
  text: string;
  /** Anchor point the leader line ends at (scene units). */
  ax: number;
  ay: number;
}

/** Callout labels that make sense at this beat. Placement in the margins is done by the stage. */
export function buildLabels(plan: MitosisPlan, st: SceneState, beat: number): Label[] {
  const s = st.s;
  const out: Label[] = [];
  const plant = plan.plant;
  const bySlot = (slot: number) => plan.slot.findIndex((v) => v === Math.min(slot, plan.n - 1));
  const c = (k: number, sis: 0 | 1) => st.ch[chIndex({ k, s: sis })]!;

  if (beat <= 14 && beat !== 14) {
    const [x, y] = outlinePoint(s, plant, 215);
    out.push({ id: "membrane", text: plant ? "Cell membrane and wall" : "Cell membrane", ax: x, ay: y });
  }
  if (beat <= 1) {
    const k = 0;
    const a = c(k, 0);
    out.push({ id: "chromatin", text: beat === 0 ? "Chromosome: 1 chromatid (thin chromatin)" : "Chromosome: 2 sister chromatids", ax: a.x, ay: a.y });
  }
  if (beat <= 4) out.push({ id: "nucleus", text: beat === 4 ? "Nuclear envelope breaking up" : "Nucleus", ax: CX + s.nrx * 0.78, ay: CY + s.nry * 0.62 });
  if (!plant && s.cR > 0.5 && beat >= 1 && beat <= 11) out.push({ id: "centrosome", text: "Centrosome", ax: s.cRx, ay: s.cRy });
  if (plant && beat >= 4 && beat <= 9) out.push({ id: "pole", text: "Spindle pole (no centrioles)", ax: s.cRx, ay: s.cRy });
  if (beat >= 4 && beat <= 9) {
    const bulge = -3 * 0.2 * s.b * 0.55;
    const t = 0.72;
    const cy = CY + bulge * 2;
    const x = (1 - t) ** 2 * s.cLx + 2 * t * (1 - t) * CX + t * t * s.cRx;
    const y = (1 - t) ** 2 * s.cLy + 2 * t * (1 - t) * cy + t * t * s.cRy;
    out.push({ id: "spindle", text: "Spindle fibers", ax: x, ay: y });
  }
  if (beat >= 3 && beat <= 7) {
    const k = bySlot(0);
    const a = c(k, 0);
    out.push({ id: "sisters", text: "Sister chromatids (one chromosome)", ax: a.x, ay: a.y - (beat >= 6 ? 30 : 0) });
  }
  if (beat >= 6 && beat <= 7) {
    const k = bySlot(2);
    const sis = plan.leftSister[k]!;
    const kin = kinetochorePoint(c(k, sis), sideOf(plan, { k, s: sis }));
    out.push({ id: "kinetochore", text: "Kinetochore", ax: kin[0], ay: kin[1] });
    const k2 = bySlot(Math.max(0, plan.n - 2));
    const cc = c(k2, 0);
    out.push({ id: "centromere", text: "Centromere", ax: (cc.x + c(k2, 1).x) / 2, ay: cc.y });
    out.push({ id: "plate", text: "Metaphase plate", ax: CX, ay: CY + s.b - 18 });
  }
  if (beat >= 8 && beat <= 9) {
    const k = bySlot(0);
    const a = c(k, plan.leftSister[k]!);
    out.push({ id: "chromosome", text: "Separated chromatid = a chromosome", ax: a.x, ay: a.y });
  }
  if (beat >= 10 && beat <= 14) out.push({ id: "dnucleus", text: beat === 10 ? "Nuclear envelope re-forming" : "Daughter nucleus", ax: CX + s.nqx + s.nqrx * 0.7, ay: CY + s.nqry * 0.5 });
  if (beat >= 12 && beat <= 13) {
    if (plant) out.push({ id: "furrow", text: "Cell plate growing", ax: CX, ay: CY - s.b * 0.5 * s.ring });
    else out.push({ id: "furrow", text: "Cleavage furrow", ax: CX, ay: CY - s.b * (1 - 0.985 * s.fur) });
  }
  if (beat === 14) {
    out.push({ id: "d1", text: "Daughter cell 1", ax: CX - s.nqx, ay: CY + s.b * 0.8 });
    out.push({ id: "d2", text: "Daughter cell 2", ax: CX + s.nqx, ay: CY + s.b * 0.8 });
  }
  return out;
}
