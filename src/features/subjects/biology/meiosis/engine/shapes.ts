import { CX, CY, rotate, type ChromatidState, type SceneScalars } from "./beats";
import { LOCI, type PairSpec } from "./plan";

/** Two overlapping lobes whose neck narrows as `a` grows. At `a >= ra` they are two separate ellipses. */
export function lobePaths(cx: number, cy: number, a: number, ra: number, perp: number, axis: "x" | "y"): string[] {
  const place = (u: number, v: number): [number, number] => (axis === "x" ? [cx + u, cy + v] : [cx + v, cy + u]);
  const ellipse = (u0: number): string => {
    const pts: string[] = [];
    const N = 56;
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const [x, y] = place(u0 + ra * Math.cos(t), perp * Math.sin(t));
      pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(" ") + " Z";
  };
  if (a >= ra - 0.5) return [ellipse(-a), ellipse(a)];
  const R = a + ra;
  const N = 90;
  const half = (u: number): number => {
    const hl = Math.sqrt(Math.max(0, 1 - ((u + a) / ra) ** 2));
    const hr = Math.sqrt(Math.max(0, 1 - ((u - a) / ra) ** 2));
    return perp * Math.max(hl, hr);
  };
  const us: number[] = [];
  const hs: number[] = [];
  for (let i = 0; i <= N; i++) {
    us.push(-R * Math.cos((i / N) * Math.PI));
    hs.push(half(us[i]!));
  }
  // light smoothing rounds the sharp notch of the furrow without changing a plain ellipse
  const sm = hs.map((h, i) => {
    if (i < 2 || i > N - 2) return h;
    return (hs[i - 2]! + hs[i - 1]! + h + hs[i + 1]! + hs[i + 2]!) / 5;
  });
  const top: [number, number][] = [];
  const bottom: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    top.push(place(us[i]!, -sm[i]!));
    bottom.push(place(us[i]!, sm[i]!));
  }
  const pts = [...top, ...bottom.reverse()];
  return [pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ") + " Z"];
}

/** All cell outlines for a scene (1, 2 or 4 cells, or any in-between pinching shape). */
export function cellPaths(s: SceneScalars): string[] {
  if (s.a2 >= 0.5) {
    const out: string[] = [];
    for (const side of [-1, 1]) out.push(...lobePaths(CX + side * s.a1, CY, s.a2, s.r2, s.r1, "y"));
    return out;
  }
  if (s.a1 >= s.r1 - 0.5) {
    return [-1, 1].flatMap((side) => lobePaths(CX + side * s.a1, CY, 0, s.r1, s.ry1, "x"));
  }
  return lobePaths(CX, CY, s.a1, s.r1, s.ry1, "x");
}

/** Cell centres in the current scene (for counting and for placing nuclei). */
export function cellCentres(s: SceneScalars): { x: number; y: number; rx: number; ry: number }[] {
  if (s.a2 >= 0.5) {
    const out: { x: number; y: number; rx: number; ry: number }[] = [];
    for (const side of [-1, 1]) for (const v of [-1, 1]) out.push({ x: CX + side * s.a1, y: CY + v * s.a2, rx: s.r1, ry: s.r2 });
    return out;
  }
  if (s.a1 >= s.r1 - 0.5) return [-1, 1].map((side) => ({ x: CX + side * s.a1, y: CY, rx: s.r1, ry: s.ry1 }));
  return [{ x: CX, y: CY, rx: s.a1 + s.r1, ry: s.ry1 }];
}

const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

export interface RodPoint {
  x: number;
  y: number;
  s: number;
}

/**
 * Centre-line of a chromatid in its own frame (origin = centromere, rod along local y). `lead` bends the rod into a
 * V with the centromere leading; `chi` slides the tail beyond the crossover sideways (the chiasma X); loose
 * chromatin wiggles.
 */
export function rodPoints(spec: PairSpec, st: ChromatidState, crossAt: number | null, seedPhase: number): RodPoint[] {
  const N = 22;
  const L = spec.length;
  const c = spec.centromere;
  const wig = (1 - st.cond) * 9;
  const pts: RodPoint[] = [];
  const ss: number[] = [];
  for (let i = 0; i <= N; i++) ss.push(i / N);
  // make sure the crossover point itself is a vertex so the colour change is exactly there
  if (crossAt !== null) {
    ss.push(crossAt);
    ss.sort((a, b) => a - b);
  }
  for (const s of ss) {
    const y = (s - c) * L;
    const ext = y < 0 ? c * L : (1 - c) * L;
    let x = ext > 0 ? st.lead * (1 - (y / ext) ** 2) : st.lead;
    if (wig > 0.2) x += wig * Math.sin(s * 9 + seedPhase) * Math.sin(Math.PI * s);
    if (crossAt !== null && Math.abs(st.chi) > 0.01) x += st.chi * smooth((s - (crossAt - 0.08)) / 0.16);
    pts.push({ x, y, s });
  }
  return pts;
}

export const toGlobal = (p: { x: number; y: number }, st: ChromatidState): [number, number] => {
  const [dx, dy] = rotate(p.x, p.y, st.rot);
  return [st.x + dx, st.y + dy];
};

/** Global position of a chromatid's centromere. */
export function centromereOf(st: ChromatidState): [number, number] {
  const [dx, dy] = rotate(st.lead, 0, st.rot);
  return [st.x + dx, st.y + dy];
}

export function pathOf(points: { x: number; y: number }[], dxLocal = 0): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${(p.x + dxLocal).toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
}

export { LOCI };
