import { allChromatids, chIndex, sideOf, type ChromatidId, type MitosisPlan } from "./plan";

/**
 * The animation is a list of 15 key "beats". Between neighbouring beats every number in the scene is
 * interpolated, so chromosomes glide, rotate and unfold continuously instead of swapping between pictures.
 * Beats map onto the seven stages (see `BEAT_STAGE`); inside a stage they are the sub-steps used by step mode.
 */
export const VIEW_W = 1000;
export const VIEW_H = 640;
export const CX = VIEW_W / 2;
export const CY = VIEW_H / 2;

export const BEAT_COUNT = 15;
export const BEAT_STAGE = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 6] as const;
export const STAGE_COUNT = 7;
export const STAGE_FIRST_BEAT = [0, 2, 4, 6, 8, 10, 12] as const;
export const STAGE_LAST_BEAT = [1, 3, 5, 7, 9, 11, 14] as const;
export { chIndex };

export interface ChromatidState {
  /** Centromere position (scene units). */
  x: number;
  y: number;
  /** Degrees. 0 = rod vertical. */
  rot: number;
  /** 0 = straight rod, 1 = V with the centromere leading (anaphase). */
  fold: number;
  /** Arms bowed away from the sister chromatid (duplicated chromosome). */
  splay: number;
  op: number;
  /** 0 = loose chromatin, 1 = fully condensed. */
  cond: number;
  /** Kinetochore visibility. */
  kin: number;
  /** Spindle fiber from this chromatid's pole: 0 none .. 1 fully attached. */
  fib: number;
}

export interface SceneScalars {
  /** Cell half-width / half-height. */
  a: number;
  b: number;
  /** Cleavage furrow depth 0..1 and separation of the two daughters 0..1. */
  fur: number;
  sep: number;
  /** Parent nucleus: opacity, radii, and how broken-up its envelope is (0 intact .. 1 fragments). */
  nuc: number;
  nrx: number;
  nry: number;
  frag: number;
  /** Daughter nuclei: opacity, centre offset from the middle, radii. */
  nucQ: number;
  nqx: number;
  nqrx: number;
  nqry: number;
  /** Centrosomes / spindle poles (left, right) and their opacities. */
  cLx: number;
  cLy: number;
  cRx: number;
  cRy: number;
  cL: number;
  cR: number;
  /** Polar spindle fibers. */
  sp: number;
  /** Metaphase plate guide. */
  plate: number;
  /** Contractile ring (animal) or cell plate growth (plant), 0..1. */
  ring: number;
  /** 0..1 emphasis on the replication step. */
  rep: number;
}

export interface SceneState {
  s: SceneScalars;
  ch: ChromatidState[];
}

/* ------------------------------------------------------------------ helpers */

const rad = (d: number) => (d * Math.PI) / 180;
export function rotate(x: number, y: number, deg: number): [number, number] {
  const r = rad(deg);
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [x * c - y * s, x * s + y * c];
}
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const W = (cond: number) => 3 + 11 * cond;

/** Position of a chromosome inside the nucleus (relative to the cell centre) and a rotation. */
function nucSlot(k: number, n: number): [number, number, number] {
  const ang = ((k + 0.5) / n) * Math.PI * 2 + (k % 2 ? 0.5 : 0);
  const r = 0.5 + 0.22 * ((k * 5) % 3) / 2;
  return [Math.cos(ang) * 150 * r * 1.0, Math.sin(ang) * 125 * r * 1.0, ((k * 53) % 100) - 50];
}
const spacing = (n: number) => Math.min(87, 350 / n);
const plateY = (plan: MitosisPlan, k: number) => (plan.slot[k]! - (plan.n - 1) / 2) * spacing(plan.n);
const stagger = (plan: MitosisPlan, k: number) => (plan.n >= 4 ? (plan.slot[k]! % 2 ? 16 : -16) : 0);

interface PairOpts {
  x: number;
  y: number;
  rot: number;
  cond: number;
  rep: number;
  splay?: number;
  kin?: number;
  fib?: [number, number];
}

/** Both sister chromatids of one chromosome, side by side (joined at the centromere). */
function chromosome(plan: MitosisPlan, k: number, o: PairOpts): [ChromatidState, ChromatidState] {
  const delta = o.rep > 0 ? W(o.cond) / 2 + 1.4 : 0;
  const mk = (s: 0 | 1): ChromatidState => {
    const side = sideOf(plan, { k, s });
    const [dx, dy] = rotate(side * delta * o.rep, 0, o.rot);
    return {
      x: o.x + dx,
      y: o.y + dy,
      rot: o.rot,
      fold: 0,
      splay: o.splay ?? 0,
      op: s === 0 ? 1 : clamp01(o.rep * 1.4),
      cond: o.cond,
      kin: o.kin ?? 0,
      fib: o.fib ? o.fib[sideOf(plan, { k, s }) === -1 ? 0 : 1] : 0,
    };
  };
  return [mk(0), mk(1)];
}

interface SingleOpts {
  x: number;
  y: number;
  rot: number;
  fold: number;
  cond: number;
  kin: number;
  fib: number;
}
function single(o: SingleOpts): ChromatidState {
  return { x: o.x, y: o.y, rot: o.rot, fold: o.fold, splay: 0, op: 1, cond: o.cond, kin: o.kin, fib: o.fib };
}

const BASE: SceneScalars = {
  a: 250, b: 230, fur: 0, sep: 0, nuc: 0, nrx: 150, nry: 125, frag: 0, nucQ: 0, nqx: 210, nqrx: 105, nqry: 125,
  cLx: CX - 218, cLy: CY, cRx: CX + 218, cRy: CY, cL: 1, cR: 1, sp: 0, plate: 0, ring: 0, rep: 0,
};
const sc = (o: Partial<SceneScalars>): SceneScalars => ({ ...BASE, ...o });

/* ------------------------------------------------------------------ the beats */

export function buildBeats(plan: MitosisPlan): SceneState[] {
  const n = plan.n;
  const ids = allChromatids(plan);
  const beats: SceneState[] = [];
  const plant = plan.plant;
  const cen = plant ? 0 : 1; // centrosome opacity multiplier (plant cells have no centrioles)

  /** Build one beat from scalars and per-chromosome layout functions. */
  const make = (s: SceneScalars, layout: (k: number) => [ChromatidState, ChromatidState]): SceneState => {
    const ch: ChromatidState[] = new Array(n * 2);
    for (let k = 0; k < n; k++) {
      const [c0, c1] = layout(k);
      ch[k * 2] = c0;
      ch[k * 2 + 1] = c1;
    }
    return { s, ch };
  };

  // 0-1: interphase
  beats.push(
    make(sc({ a: 212, b: 205, nuc: 1, cLx: CX - 70, cLy: CY - 140, cRx: CX - 70, cRy: CY - 140, cL: cen, cR: 0 }), (k) => {
      const [nx, ny, nr] = nucSlot(k, n);
      return chromosome(plan, k, { x: CX + nx, y: CY + ny, rot: nr, cond: 0, rep: 0 });
    }),
  );
  beats.push(
    make(sc({ a: 240, b: 228, nuc: 1, cLx: CX - 90, cLy: CY - 146, cRx: CX - 50, cRy: CY - 150, cL: cen, cR: cen, rep: 1 }), (k) => {
      const [nx, ny, nr] = nucSlot(k, n);
      return chromosome(plan, k, { x: CX + nx, y: CY + ny, rot: nr, cond: 0, rep: 1 });
    }),
  );
  // 2-3: prophase
  beats.push(
    make(sc({ a: 244, b: 230, nuc: 1, cLx: CX - 140, cLy: CY - 138, cRx: CX + 140, cRy: CY - 138, cL: cen, cR: cen, sp: 0.35 }), (k) => {
      const [nx, ny, nr] = nucSlot(k, n);
      return chromosome(plan, k, { x: CX + nx, y: CY + ny, rot: nr, cond: 0.55, rep: 1, kin: 0 });
    }),
  );
  beats.push(
    make(sc({ a: 246, b: 230, nuc: 1, frag: 0.3, cLx: CX - 190, cLy: CY - 70, cRx: CX + 190, cRy: CY - 70, cL: cen, cR: cen, sp: 0.8 }), (k) => {
      const [nx, ny, nr] = nucSlot(k, n);
      return chromosome(plan, k, { x: CX + nx * 1.1, y: CY + ny * 1.1, rot: nr, cond: 1, rep: 1, splay: 4, kin: 0.9 });
    }),
  );
  // 4-5: prometaphase
  beats.push(
    make(sc({ nuc: 0.5, frag: 1, cLx: CX - 218, cLy: CY, cRx: CX + 218, cRy: CY, cL: cen, cR: cen, sp: 1, plate: 0.2 }), (k) => {
      const [nx, ny, nr] = nucSlot(k, n);
      const early = plan.slot[k]! % 2 === 0;
      return chromosome(plan, k, { x: CX + nx * 1.3, y: CY + ny * 1.5, rot: nr * 1.6, cond: 1, rep: 1, splay: 4, kin: 1, fib: early ? [0.55, 0] : [0, 0] });
    }),
  );
  beats.push(
    make(sc({ nuc: 0, frag: 1, cLx: CX - 218, cLy: CY, cRx: CX + 218, cRy: CY, cL: cen, cR: cen, sp: 1, plate: 0.35 }), (k) => {
      const [nx, ny, nr] = nucSlot(k, n);
      return chromosome(plan, k, { x: CX + nx * 0.3 + stagger(plan, k) * 0.6, y: CY + plateY(plan, k) * 0.7 + ny * 0.3, rot: nr * 0.4, cond: 1, rep: 1, splay: 5, kin: 1, fib: [1, 1] });
    }),
  );
  // 6-7: metaphase
  const meta = (k: number) => chromosome(plan, k, { x: CX + stagger(plan, k), y: CY + plateY(plan, k), rot: 0, cond: 1, rep: 1, splay: 6, kin: 1, fib: [1, 1] });
  beats.push(make(sc({ cLx: CX - 218, cRx: CX + 218, sp: 1, plate: 0.9 }), meta));
  beats.push(make(sc({ cLx: CX - 218, cRx: CX + 218, sp: 1, plate: 1 }), meta));

  // 8-9: anaphase. Chromatids are individual chromosomes now.
  const sepPos = (k: number, s: 0 | 1, gx: number, ySquash: number, xs: number, fold: number, rotAbs: number, cond: number, kin: number, fib: number): ChromatidState => {
    const side = sideOf(plan, { k, s } as ChromatidId);
    return single({ x: CX + side * gx + stagger(plan, k) * xs, y: CY + plateY(plan, k) * ySquash, rot: side * rotAbs, fold, cond, kin, fib });
  };
  const eachSister = (f: (k: number, s: 0 | 1) => ChromatidState) => (k: number): [ChromatidState, ChromatidState] => [f(k, 0), f(k, 1)];
  beats.push(
    make(sc({ a: 262, b: 229, cLx: CX - 230, cRx: CX + 230, sp: 1, plate: 0.25 }), eachSister((k, s) => sepPos(k, s, 24, 1, 1, 0.5, 45, 1, 1, 1))),
  );
  beats.push(
    make(sc({ a: 305, b: 226, cLx: CX - 273, cRx: CX + 273, sp: 0.8 }), eachSister((k, s) => sepPos(k, s, 232, 0.85, 0.7, 1, 90, 1, 1, 1))),
  );
  // 10-11: telophase
  beats.push(
    make(sc({ a: 350, b: 222, nucQ: 0.5, nqx: 215, nqrx: 95, nqry: 120, cLx: CX - 318, cRx: CX + 318, sp: 0.25 }), eachSister((k, s) => sepPos(k, s, 215, 0.75, 0.8, 0.8, 80, 0.75, 0.6, 0.3))),
  );
  const nucInside = (k: number, s: 0 | 1, gx: number, cond: number, kin: number): ChromatidState => {
    const side = sideOf(plan, { k, s });
    const [nx, ny, nr] = nucSlot(k, n);
    return single({ x: CX + side * gx + nx * 0.3, y: CY + ny * 0.62, rot: nr * 0.7 + (s ? 20 : -20), fold: 0.3, cond, kin, fib: 0 });
  };
  beats.push(
    make(sc({ a: 400, b: 218, nucQ: 1, nqx: 210, nqrx: 108, nqry: 128, cLx: CX - 210, cLy: CY - 150, cRx: CX + 210, cRy: CY - 150, sp: 0 }), eachSister((k, s) => nucInside(k, s, 210, 0.35, 0.15))),
  );
  // 12-14: cytokinesis
  const ringAt = plant ? [0.35, 0.8, 1] : [0.5, 1, 1];
  beats.push(
    make(sc({ a: 420, b: 215, fur: plant ? 0 : 0.45, ring: ringAt[0]!, nucQ: 1, nqx: 210, nqrx: 108, nqry: 128, cLx: CX - 210, cLy: CY - 150, cRx: CX + 210, cRy: CY - 150 }), eachSister((k, s) => nucInside(k, s, 210, 0.25, 0))),
  );
  beats.push(
    make(sc({ a: 420, b: 215, fur: plant ? 0 : 1, ring: ringAt[1]!, nucQ: 1, nqx: 210, nqrx: 108, nqry: 128, cLx: CX - 210, cLy: CY - 150, cRx: CX + 210, cRy: CY - 150 }), eachSister((k, s) => nucInside(k, s, 210, 0.2, 0))),
  );
  beats.push(
    make(sc({ a: 420, b: 215, fur: plant ? 0 : 1, sep: 1, ring: ringAt[2]!, nucQ: 1, nqx: plant ? 214 : 228, nqrx: 108, nqry: 128, cLx: CX - (plant ? 214 : 228), cLy: CY - 150, cRx: CX + (plant ? 214 : 228), cRy: CY - 150 }), eachSister((k, s) => nucInside(k, s, plant ? 214 : 228, 0.15, 0))),
  );

  void ids;
  return beats;
}

/* ------------------------------------------------------------------ interpolation */

const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function lerpState(a: SceneState, b: SceneState, t: number): SceneState {
  const s = {} as SceneScalars;
  for (const key of Object.keys(a.s) as (keyof SceneScalars)[]) s[key] = lerp(a.s[key], b.s[key], t);
  const ch = a.ch.map((c, i) => {
    const d = b.ch[i]!;
    return {
      x: lerp(c.x, d.x, t), y: lerp(c.y, d.y, t), rot: lerp(c.rot, d.rot, t), fold: lerp(c.fold, d.fold, t), splay: lerp(c.splay, d.splay, t),
      op: lerp(c.op, d.op, t), cond: lerp(c.cond, d.cond, t), kin: lerp(c.kin, d.kin, t), fib: lerp(c.fib, d.fib, t),
    };
  });
  return { s, ch };
}

export function sceneAt(beats: SceneState[], pos: number, eased = true): SceneState {
  const clamped = Math.min(beats.length - 1, Math.max(0, pos));
  const i = Math.min(beats.length - 2, Math.floor(clamped));
  const t = clamped - i;
  if (t <= 1e-4) return beats[i]!;
  if (t >= 1 - 1e-4) return beats[i + 1]!;
  return lerpState(beats[i]!, beats[i + 1]!, eased ? ease(t) : t);
}
