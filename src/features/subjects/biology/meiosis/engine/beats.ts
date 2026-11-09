import {
  allChromatids,
  crossSister,
  type Bit,
  type ChromatidId,
  type MeiosisPlan,
  type PairCount,
  tetradLanes,
  isCrossing,
  sideOf,
  vertOf,
} from "./plan";

/**
 * The animation is a list of 16 key "beats". Between two neighbouring beats every number in the scene is
 * interpolated, so chromosomes glide, bend and rotate continuously instead of swapping between pictures.
 * Beats map onto the nine textbook stages (see `BEAT_STAGE`); inside a stage they are the sub-steps used by
 * step-by-step mode.
 */
export const VIEW_W = 1000;
export const VIEW_H = 640;
export const CX = VIEW_W / 2;
export const CY = VIEW_H / 2;
/** Centre-to-centre distance of two sister chromatids that are side by side. */
export const SIS = 22;
/** Lane spacing inside a tetrad. */
export const LANE = 24;

export const BEAT_COUNT = 16;
export const BEAT_STAGE = [0, 0, 1, 1, 1, 1, 1, 2, 3, 4, 4, 5, 6, 7, 8, 8] as const;
export const STAGE_COUNT = 9;
export const STAGE_FIRST_BEAT = [0, 2, 7, 8, 9, 11, 12, 13, 14] as const;
export const STAGE_LAST_BEAT = [1, 6, 7, 8, 10, 11, 12, 13, 15] as const;

export interface ChromatidState {
  /** Centromere position (scene units). */
  x: number;
  y: number;
  /** Degrees. 0 = rod vertical. */
  rot: number;
  /** Sideways displacement of the centromere (local x): the "V" of a chromatid being pulled by its centromere. */
  lead: number;
  op: number;
  /** 0 = loose chromatin, 1 = fully condensed. */
  cond: number;
  /** Crossing-over geometry: how far the tail beyond the crossover point is shifted sideways (the chiasma X). */
  chi: number;
  /** 0..1: how much of the tail beyond the crossover has been exchanged with the non-sister chromatid. */
  swap: number;
}

export interface SceneScalars {
  /** Division I: lobe offset, lobe half-width, half-height. */
  a1: number;
  r1: number;
  ry1: number;
  /** Division II: vertical lobe offset and half-height. */
  a2: number;
  r2: number;
  nuc: number;
  nrx: number;
  nry: number;
  nucQ: number;
  /** Meiosis I centrosomes (left / right). */
  cLx: number;
  cLy: number;
  cRx: number;
  cRy: number;
  cI: number;
  /** Meiosis II centrosomes: left-top, left-bottom, right-top, right-bottom (x, y each). */
  c2: number[];
  cII: number;
  sp1: number;
  fib1: number;
  sp2: number;
  fib2: number;
  plate1: number;
  plate2: number;
  /** 0..1 emphasis on the replication step (interphase). */
  rep: number;
}

export interface SceneState {
  s: SceneScalars;
  ch: ChromatidState[];
}

export const chIndex = (c: ChromatidId): number => (c.pair * 2 + c.homolog) * 2 + c.sister;

/* ------------------------------------------------------------------ layout tables */

const NUC_SLOTS: Record<PairCount, [number, number, number][]> = {
  2: [[-190, -55, -14], [150, -85, 12], [-95, 78, 9], [185, 52, -10]],
  3: [[-205, -50, -14], [165, -80, 12], [-110, 85, 9], [190, 60, -10], [-20, -95, 16], [15, 92, -16]],
  4: [[-215, -42, -14], [170, -75, 12], [-120, 90, 9], [200, 62, -10], [-40, -100, 16], [40, 95, -16], [-30, 8, 22], [95, 8, -18]],
};

const PAIR_CENTERS: Record<PairCount, [number, number][]> = {
  2: [[-120, -4], [120, 8]],
  3: [[-190, 0], [0, 10], [190, -6]],
  4: [[-225, -4], [-75, 12], [75, -10], [225, 6]],
};

const PRO2: Record<PairCount, [number, number, number][]> = {
  2: [[-70, -55, 38], [64, 62, 26]],
  3: [[-88, -70, 32], [72, -52, 28], [-8, 74, 66]],
  4: [[-100, -80, 32], [92, -70, 26], [-82, 72, 62], [84, 78, 68]],
};

const MARGIN_GAP = 18;

/* ------------------------------------------------------------------ helpers */

function blank(): ChromatidState {
  return { x: CX, y: CY, rot: 0, lead: 0, op: 1, cond: 1, chi: 0, swap: 0 };
}

const rad = (d: number) => (d * Math.PI) / 180;
/** Local (x, y) → global offset for a rod rotated by `deg`. */
export function rotate(x: number, y: number, deg: number): [number, number] {
  const r = rad(deg);
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [x * c - y * s, x * s + y * c];
}

/** Sisters in left-to-right (local x) order for a homolog, consistent with the tetrad lanes. */
function sisterOrder(plan: MeiosisPlan, pair: number, homolog: Bit): [Bit, Bit] {
  const lanes = tetradLanes(plan, pair);
  const mine = lanes.filter((l) => l.homolog === homolog);
  return [mine[0]!.sister, mine[1]!.sister];
}

interface PlaceOpts {
  x: number;
  y: number;
  rot?: number;
  gap?: number;
  cond: number;
  op?: [number, number];
  lead?: [number, number];
  chi?: [number, number];
  swap?: [number, number];
}

/** Place both sisters of one chromosome around the point (x, y), ordered by local x. */
function placeChromosome(state: ChromatidState[], plan: MeiosisPlan, pair: number, homolog: Bit, o: PlaceOpts): void {
  const [first, second] = sisterOrder(plan, pair, homolog);
  const rot = o.rot ?? 0;
  const gap = o.gap ?? SIS;
  [first, second].forEach((sister, k) => {
    const [dx, dy] = rotate((k === 0 ? -gap : gap) / 2, 0, rot);
    const st = state[chIndex({ pair, homolog, sister })]!;
    st.x = o.x + dx;
    st.y = o.y + dy;
    st.rot = rot;
    st.cond = o.cond;
    st.op = o.op ? o.op[k]! : 1;
    st.lead = o.lead ? o.lead[k]! : 0;
    st.chi = o.chi ? o.chi[k]! : 0;
    st.swap = o.swap ? o.swap[k]! : 0;
  });
}

/** Vertical stack of tetrads (or chromosomes) on the metaphase plate. Returns centromere y for each pair. */
function plateStack(plan: MeiosisPlan, cy = CY): number[] {
  const total = plan.specs.reduce((sum, s) => sum + s.length, 0) + MARGIN_GAP * (plan.pairs - 1);
  let top = cy - total / 2;
  return plan.specs.map((s) => {
    const y = top + s.centromere * s.length;
    top += s.length + MARGIN_GAP;
    return y;
  });
}

/** Horizontal row of chromosomes lying along the plate; returns centromere x per pair for a rod rotated by ±90. */
function plateRow(plan: MeiosisPlan, cx: number, signs: number[]): number[] {
  const gap = 14;
  const total = plan.specs.reduce((sum, s) => sum + s.length, 0) + gap * (plan.pairs - 1);
  let left = cx - total / 2;
  return plan.specs.map((s, i) => {
    const cL = s.centromere * s.length;
    const rest = (1 - s.centromere) * s.length;
    // rot +90: local +y → global -x, so the long side lies to the left of the centromere.
    const leftExt = signs[i]! > 0 ? rest : cL;
    const x = left + leftExt;
    left += s.length + gap;
    return x;
  });
}

function crossingFlags(plan: MeiosisPlan, c: ChromatidId): boolean {
  return isCrossing(plan, c);
}

/** Per-pair rot sign for meiosis II: +90 puts the first (left) sister at the top, -90 puts the second there. */
export function meiosisTwoSigns(plan: MeiosisPlan, side: 0 | 1): number[] {
  return plan.specs.map((_, i) => {
    // the left cell holds the homolog pulled left in anaphase I, the right cell holds its partner
    const h = (side === 0 ? plan.leftHomolog[i]! : ((1 - plan.leftHomolog[i]!) as Bit)) as Bit;
    const [first] = sisterOrder(plan, i, h);
    return plan.topSister[side][i] === first ? 1 : -1;
  });
}

/* ------------------------------------------------------------------ the beats */

const SCALARS_BASE: SceneScalars = {
  a1: 0, r1: 425, ry1: 285, a2: 0, r2: 285,
  nuc: 1, nrx: 300, nry: 200, nucQ: 0,
  cLx: CX - 26, cLy: 62, cRx: CX + 26, cRy: 62, cI: 1,
  c2: [274, 215, 274, 425, 726, 215, 726, 425], cII: 0,
  sp1: 0, fib1: 0, sp2: 0, fib2: 0, plate1: 0, plate2: 0, rep: 0,
};

export function buildBeats(plan: MeiosisPlan): SceneState[] {
  const p = plan.pairs;
  const ids = allChromatids(plan);
  const newCh = () => ids.map(() => blank());
  const beats: SceneState[] = [];
  const mk = (s: Partial<SceneScalars>, ch: ChromatidState[]): SceneState => ({
    s: { ...SCALARS_BASE, c2: [...SCALARS_BASE.c2], ...s },
    ch,
  });
  const homologsOf = (pair: number): [Bit, Bit] => [plan.leftHomolog[pair]!, (1 - plan.leftHomolog[pair]!) as Bit];
  const stack = plateStack(plan);

  /* ---- 0 Interphase (G1): unreplicated, loose chromatin inside the nucleus */
  {
    const ch = newCh();
    for (let pair = 0; pair < p; pair++)
      for (const homolog of [0, 1] as const) {
        const [dx, dy, rot] = NUC_SLOTS[p][pair * 2 + homolog]!;
        placeChromosome(ch, plan, pair, homolog, { x: CX + dx, y: CY + dy, rot, gap: 0, cond: 0.22, op: [1, 0] });
      }
    beats.push(mk({}, ch));
  }
  /* ---- 1 Interphase (S/G2): DNA copied → two sister chromatids per chromosome */
  {
    const ch = newCh();
    for (let pair = 0; pair < p; pair++)
      for (const homolog of [0, 1] as const) {
        const [dx, dy, rot] = NUC_SLOTS[p][pair * 2 + homolog]!;
        placeChromosome(ch, plan, pair, homolog, { x: CX + dx, y: CY + dy, rot, gap: SIS, cond: 0.4 });
      }
    beats.push(mk({ cLx: CX - 30, cRx: CX + 30, rep: 1 }, ch));
  }
  /* ---- 2 Prophase I (early): chromosomes condense and homologs find each other */
  {
    const ch = newCh();
    for (let pair = 0; pair < p; pair++) {
      const [pcx, pcy] = PAIR_CENTERS[p][pair]!;
      const [hl, hr] = homologsOf(pair);
      const wob = pair % 2 ? -1 : 1;
      placeChromosome(ch, plan, pair, hl, { x: CX + pcx - 62, y: CY + pcy - 14 * wob, rot: -9 * wob, cond: 0.82 });
      placeChromosome(ch, plan, pair, hr, { x: CX + pcx + 62, y: CY + pcy + 14 * wob, rot: 8 * wob, cond: 0.82 });
    }
    beats.push(mk({ cLx: CX - 140, cLy: 84, cRx: CX + 140, cRy: 84 }, ch));
  }
  /* ---- 3 Prophase I: synapsis, tetrads form */
  const tetrad = (cond: number, chiAmount: number, swapAmount: number, mix: number, scalars: Partial<SceneScalars>): SceneState => {
    const ch = newCh();
    for (let pair = 0; pair < p; pair++) {
      const [pcx, pcy] = PAIR_CENTERS[p][pair]!;
      const stackY = stack[pair]! + 0; // centromere y on the plate
      const x = CX + (pcx) * (1 - mix);
      const y = (CY + pcy) * (1 - mix) + stackY * mix;
      const lanes = tetradLanes(plan, pair);
      lanes.forEach((lane, k) => {
        const st = ch[chIndex(lane)]!;
        const spec = plan.specs[pair]!;
        void spec;
        st.x = x + (k - 1.5) * LANE;
        st.y = y;
        st.rot = 0;
        st.cond = cond;
        st.chi = 0;
        st.swap = 0;
        if (crossingFlags(plan, lane)) {
          st.chi = chiAmount * (k === 1 ? 1 : -1) * LANE;
          st.swap = swapAmount;
        } else if (plan.cross[pair]) {
          // the pair's other chromatids carry no exchange
        }
      });
    }
    return mk(scalars, ch);
  };
  beats.push(tetrad(1, 0, 0, 0, { cLx: CX - 270, cLy: 150, cRx: CX + 270, cRy: 150 }));
  /* ---- 4 Prophase I: crossing over — non-sister chromatids lie across each other at matching points */
  beats.push(tetrad(1, 1, 0, 0, { cLx: CX - 345, cLy: 210, cRx: CX + 345, cRy: 210 }));
  /* ---- 5 Prophase I: segments swapped between the two non-sister chromatids */
  beats.push(tetrad(1, 1, 1, 0, { cLx: CX - 385, cLy: 268, cRx: CX + 385, cRy: 268 }));
  /* ---- 6 Prophase I (late): exchange complete, nuclear envelope breaks down, tetrads move toward the equator, spindle forms */
  beats.push(tetrad(1, 0, 1, 0.45, { nuc: 0.2, cLx: CX - 405, cLy: CY, cRx: CX + 405, cRy: CY, sp1: 0.7, fib1: 0.35 }));

  /* ---- 7 Metaphase I: tetrads on the plate, homologs facing opposite poles */
  const metaI = (offsetLeft: number, scalars: Partial<SceneScalars>, lead: number, cond = 1): SceneState => {
    const ch = newCh();
    for (let pair = 0; pair < p; pair++) {
      const lanes = tetradLanes(plan, pair);
      const [hl, hr] = homologsOf(pair);
      const y = stack[pair]!;
      // left homolog = lanes 0,1; right homolog = lanes 2,3. offsetLeft pulls them apart symmetrically.
      lanes.forEach((lane, k) => {
        const st = ch[chIndex(lane)]!;
        const leftSide = k < 2;
        const baseX = CX + (k - 1.5) * LANE;
        st.x = baseX + (leftSide ? -offsetLeft : offsetLeft);
        st.y = y;
        st.rot = 0;
        st.cond = cond;
        st.lead = leftSide ? -lead : lead;
        st.swap = crossingFlags(plan, lane) ? 1 : 0;
      });
      void hl;
      void hr;
    }
    return mk(scalars, ch);
  };
  beats.push(metaI(0, { nuc: 0, cLx: CX - 405, cLy: CY, cRx: CX + 405, cRy: CY, sp1: 1, fib1: 1, plate1: 1 }, 0));
  /* ---- 8 Anaphase I: homologs (each still two sister chromatids) are pulled apart */
  beats.push(
    metaI(150, { nuc: 0, r1: 445, ry1: 268, cLx: CX - 425, cRx: CX + 425, cLy: CY, cRy: CY, sp1: 1, fib1: 1 }, 20),
  );
  /* ---- 9 Telophase I (early): the cell begins to pinch in two */
  const afterI = (offsetLeft: number, scalars: Partial<SceneScalars>, lead: number): SceneState => metaI(offsetLeft, scalars, lead);
  beats.push(afterI(236, { nuc: 0, a1: 180, r1: 265, ry1: 262, cLx: CX - 425, cRx: CX + 425, cLy: CY, cRy: CY, sp1: 0.5, fib1: 0.55 }, 10));
  /* ---- 10 Telophase I / cytokinesis: two cells, chromosomes still duplicated */
  beats.push(afterI(222, { nuc: 0, a1: 226, r1: 219, ry1: 260, cLx: CX - 425, cRx: CX + 425, cLy: CY, cRy: CY, sp1: 0, fib1: 0, cI: 1 }, 0));

  /* ---- 11 Prophase II: new spindles form in each cell; no DNA replication */
  {
    const ch = newCh();
    for (let side = 0 as 0 | 1; side < 2; side = (side + 1) as 0 | 1) {
      const signs = meiosisTwoSigns(plan, side);
      for (let pair = 0; pair < p; pair++) {
        const h = (side === 0 ? plan.leftHomolog[pair]! : ((1 - plan.leftHomolog[pair]!) as Bit)) as Bit;
        const [dx, dy, rot] = PRO2[p][pair]!;
        const cx = CX + (side === 0 ? -226 : 226);
        const mirror = side === 0 ? 1 : -1;
        placeChromosome(ch, plan, pair, h, { x: cx + dx * mirror, y: CY + dy, rot: rot * signs[pair]!, cond: 0.95 });
      }
    }
    beats.push(
      mk(
        { a1: 226, r1: 219, ry1: 260, nuc: 0, cI: 0, cII: 1, c2: [274, 215, 274, 425, 726, 215, 726, 425], sp2: 0.6, fib2: 0.3, sp1: 0 },
        ch,
      ),
    );
  }
  /* ---- 12 Metaphase II / 13 Anaphase II / 14 Telophase II (early): chromosomes line up, centromeres split, sisters move apart */
  const meta2 = (D: number, lead: number, scalars: Partial<SceneScalars>): SceneState => {
    const ch = newCh();
    for (let side = 0 as 0 | 1; side < 2; side = (side + 1) as 0 | 1) {
      const signs = meiosisTwoSigns(plan, side);
      const cx = CX + (side === 0 ? -226 : 226);
      const xs = plateRow(plan, cx, signs);
      for (let pair = 0; pair < p; pair++) {
        const h = (side === 0 ? plan.leftHomolog[pair]! : ((1 - plan.leftHomolog[pair]!) as Bit)) as Bit;
        const sg = signs[pair]!;
        const [first, second] = sisterOrder(plan, pair, h);
        // first sister is at the TOP when sg = +1 (rot +90), else the second one is
        const topSister = sg > 0 ? first : second;
        const botSister = sg > 0 ? second : first;
        const mag = D === 0 ? SIS / 2 : D;
        const top = ch[chIndex({ pair, homolog: h, sister: topSister })]!;
        const bot = ch[chIndex({ pair, homolog: h, sister: botSister })]!;
        for (const [st, dir] of [[top, -1], [bot, 1]] as const) {
          st.x = xs[pair]!;
          st.y = CY + dir * mag;
          st.rot = 90 * sg;
          st.cond = 1;
          st.lead = sg * dir * lead;
        }
      }
    }
    return mk(scalars, ch);
  };
  beats.push(
    meta2(0, 0, {
      a1: 226, r1: 219, ry1: 260, r2: 260, nuc: 0, cI: 0, cII: 1,
      c2: [274, 85, 274, 555, 726, 85, 726, 555], sp2: 1, fib2: 1, plate2: 1,
    }),
  );
  beats.push(
    meta2(96, 20, {
      a1: 226, r1: 219, ry1: 275, r2: 275, nuc: 0, cI: 0, cII: 1,
      c2: [274, 66, 274, 574, 726, 66, 726, 574], sp2: 1, fib2: 1,
    }),
  );
  beats.push(
    meta2(122, 12, {
      a1: 226, r1: 219, ry1: 275, a2: 112, r2: 163, nuc: 0, cI: 0, cII: 1,
      c2: [274, 66, 274, 574, 726, 66, 726, 574], sp2: 0.5, fib2: 0.6,
    }),
  );

  /* ---- 15 Telophase II / cytokinesis: four haploid cells, single chromatids (now chromosomes), nuclei re-form */
  {
    const ch = newCh();
    // chromatids grouped by their final cell
    const groups: ChromatidId[][] = [[], [], [], []];
    for (const c of ids) groups[sideOf(plan, c.pair, c.homolog) * 2 + vertOf(plan, c)]!.push(c);
    groups.forEach((g, gi) => {
      g.sort((a, b) => a.pair - b.pair);
      const side = gi >> 1;
      const vert = gi & 1;
      const cx = CX + (side === 0 ? -226 : 226);
      const cy = CY + (vert === 0 ? -142 : 142);
      const signs = meiosisTwoSigns(plan, side as 0 | 1);
      g.forEach((c, k) => {
        const spec = plan.specs[c.pair]!;
        const sg = signs[c.pair]!;
        const st = ch[chIndex(c)]!;
        const cL = spec.centromere * spec.length;
        const rest = (1 - spec.centromere) * spec.length;
        // centre the rod on the cell: rot +90 spans [x - rest, x + cL], rot -90 spans [x - cL, x + rest]
        st.x = cx - (sg > 0 ? (cL - rest) / 2 : (rest - cL) / 2) + (k % 2 ? 10 : -10);
        st.y = cy + (k - (g.length - 1) / 2) * 27;
        st.rot = 90 * sg + (k % 2 ? 4 : -4);
        st.cond = 0.82;
        st.lead = 0;
      });
    });
    beats.push(
      mk(
        { a1: 226, r1: 219, ry1: 275, a2: 142, r2: 133, nuc: 0, nucQ: 1, cI: 0, cII: 0, c2: [274, 66, 274, 574, 726, 66, 726, 574], sp2: 0, fib2: 0 },
        ch,
      ),
    );
  }
  void crossSister;
  return beats;
}

/* ------------------------------------------------------------------ interpolation */

export const ease = (t: number): number => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function lerpScalars(a: SceneScalars, b: SceneScalars, t: number): SceneScalars {
  const out = {} as Record<string, number | number[]>;
  for (const k of Object.keys(a) as (keyof SceneScalars)[]) {
    const av = a[k];
    const bv = b[k];
    out[k] = Array.isArray(av) ? av.map((v, i) => lerp(v, (bv as number[])[i]!, t)) : lerp(av as number, bv as number, t);
  }
  return out as unknown as SceneScalars;
}

export function lerpState(a: SceneState, b: SceneState, t: number): SceneState {
  return {
    s: lerpScalars(a.s, b.s, t),
    ch: a.ch.map((ca, i) => {
      const cb = b.ch[i]!;
      return {
        x: lerp(ca.x, cb.x, t),
        y: lerp(ca.y, cb.y, t),
        rot: lerp(ca.rot, cb.rot, t),
        lead: lerp(ca.lead, cb.lead, t),
        op: lerp(ca.op, cb.op, t),
        cond: lerp(ca.cond, cb.cond, t),
        chi: lerp(ca.chi, cb.chi, t),
        swap: lerp(ca.swap, cb.swap, t),
      };
    }),
  };
}

/** Scene at a fractional beat position. Easing is applied per segment so motion starts and stops gently. */
export function sceneAt(beats: SceneState[], pos: number, eased = true): SceneState {
  const clamped = Math.min(beats.length - 1, Math.max(0, pos));
  const i = Math.min(beats.length - 2, Math.floor(clamped));
  const t = clamped - i;
  if (t <= 1e-4) return beats[i]!;
  if (t >= 1 - 1e-4) return beats[i + 1]!;
  return lerpState(beats[i]!, beats[i + 1]!, eased ? ease(t) : t);
}
