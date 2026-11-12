import { CX, CY, rotate, type ChromatidState, type SceneScalars } from "./beats";
import { specOf, type ChromatidId, type MitosisPlan, sideOf } from "./plan";

/** Width of a chromatid's stroke for a condensation level (chromatin is thin, condensed chromosomes thick). */
export const widthOf = (cond: number): number => 3 + 11 * cond;

/**
 * Cell outline(s). A (super)ellipse of half-width `a`, half-height `b`; animal cells use exponent 2, plant cells a
 * rounder rectangle. While `fur` grows a furrow pinches the middle; once `sep` > 0 the outline is two lobes that
 * morph into two separate daughter cells.
 */
export function cellPaths(s: SceneScalars, plant: boolean): string[] {
  const p = plant ? 4 : 2;
  const a = s.a;
  const b = s.b;
  const w = a * 0.34;
  const base = (x: number) => b * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(x) / a, p)), 1 / p);
  const pinch = (x: number) => 1 - 0.985 * s.fur * Math.exp(-((x / w) ** 2));
  const f = (n: number) => n.toFixed(1);
  if (s.sep <= 0.001) {
    const N = 120;
    const pts: [number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const x = -a * Math.cos((i / N) * Math.PI);
      pts.push([CX + x, CY - base(x) * pinch(x)]);
    }
    for (let i = N; i >= 0; i--) {
      const x = -a * Math.cos((i / N) * Math.PI);
      pts.push([CX + x, CY + base(x) * pinch(x)]);
    }
    return [pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${f(x)} ${f(y)}`).join(" ") + " Z"];
  }
  const gap = plant ? 4 : 18;
  const out: string[] = [];
  for (const side of [-1, 1]) {
    const pts: string[] = [];
    const N = 70;
    for (let i = 0; i < N * 2; i++) {
      const t = (i / (N * 2)) * Math.PI * 2;
      const u = Math.cos(t);
      const sg = Math.sin(t) >= 0 ? 1 : -1;
      const xc = side * (a / 2) + (a / 2) * u; // position in the undivided cell
      const dumb = base(xc) * pinch(xc);
      const lobe = b * 0.985 * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u), p)), 1 / p);
      const y = sg * (dumb + (lobe - dumb) * s.sep);
      const x = xc + side * gap * s.sep;
      pts.push(`${i === 0 ? "M" : "L"}${f(CX + x)} ${f(CY + y)}`);
    }
    out.push(pts.join(" ") + " Z");
  }
  return out;
}

export interface RodPoint {
  x: number;
  y: number;
}

/**
 * Centre-line of a chromatid in its own frame (origin = centromere, straight rod along local y). `fold` bends it
 * into the V of anaphase (centromere leading, arms trailing toward +y), `splay` bows the arms away from the sister
 * (the ")(" of a duplicated chromosome), and loose chromatin wiggles.
 */
export function chromatidPoints(plan: MitosisPlan, id: ChromatidId, st: ChromatidState): RodPoint[] {
  const spec = specOf(plan, id.k);
  const side = sideOf(plan, id);
  const lp = spec.centromere * spec.length;
  const lq = (1 - spec.centromere) * spec.length;
  const alpha = 0.55;
  const thetaQ = st.fold * alpha;
  const thetaP = Math.PI * (1 - st.fold) - st.fold * alpha;
  const wig = (1 - st.cond) * 10;
  const phase = id.k * 1.9 + id.s * 0.7;
  const arm = (len: number, theta: number, sign: number): RodPoint[] => {
    const N = 14;
    const pts: RodPoint[] = [];
    const dx = Math.sin(theta);
    const dy = Math.cos(theta);
    const px = Math.cos(theta);
    const py = -Math.sin(theta);
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const r = t * len;
      const off = side * st.splay * Math.pow(t, 1.3) + (wig > 0.2 ? wig * Math.sin(r * 0.14 + phase + sign) * Math.sin(Math.PI * t) : 0);
      pts.push({ x: r * dx + off * px, y: r * dy + off * py });
    }
    return pts;
  };
  const p = arm(lp, thetaP, 1).reverse();
  const q = arm(lq, thetaQ, 2);
  return [...p, ...q.slice(1)];
}

export const toGlobal = (p: { x: number; y: number }, st: ChromatidState): [number, number] => {
  const [dx, dy] = rotate(p.x, p.y, st.rot);
  return [st.x + dx, st.y + dy];
};

/** Global position of the kinetochore of a chromatid: on the face that points at its own pole (until anaphase folds it forward). */
export function kinetochorePoint(st: ChromatidState, side: -1 | 1): [number, number] {
  const W = widthOf(st.cond);
  const lx = side * (W / 2 + 2) * (1 - st.fold);
  const ly = -(W / 2 + 2) * st.fold;
  const [dx, dy] = rotate(lx, ly, st.rot);
  return [st.x + dx, st.y + dy];
}

/** Position of a point along the cell's outline for labels (angle in degrees from +x, y down). */
export function outlinePoint(s: SceneScalars, plant: boolean, deg: number): [number, number] {
  const p = plant ? 4 : 2;
  const t = (deg * Math.PI) / 180;
  const c = Math.cos(t);
  const sn = Math.sin(t);
  const r = Math.pow(Math.pow(Math.abs(c), p) + Math.pow(Math.abs(sn), p), -1 / p);
  return [CX + s.a * c * r, CY + s.b * sn * r];
}
