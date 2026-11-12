/**
 * The cell the lab follows: how many chromosomes it has, how long each one is, where its centromere is, which
 * sister chromatid is pulled to which pole, and where each chromosome sits on the metaphase plate. One plan drives
 * the animation, the counts and the activities, so they can never disagree.
 */
export type PairCount = 2 | 3 | 4;
export const PAIR_COUNTS: readonly PairCount[] = [2, 3, 4];

export interface PairSpec {
  /** Chromatid length in scene units. */
  length: number;
  /** Centromere position along the chromatid, 0..1. */
  centromere: number;
}

const SPECS: Record<PairCount, PairSpec[]> = {
  2: [
    { length: 104, centromere: 0.5 },
    { length: 80, centromere: 0.34 },
  ],
  3: [
    { length: 88, centromere: 0.5 },
    { length: 72, centromere: 0.36 },
    { length: 58, centromere: 0.44 },
  ],
  4: [
    { length: 72, centromere: 0.5 },
    { length: 60, centromere: 0.34 },
    { length: 52, centromere: 0.42 },
    { length: 44, centromere: 0.3 },
  ],
};

export interface ChromatidId {
  /** Chromosome index 0..2p-1. Chromosomes 2i and 2i+1 are the maternal and paternal homologs of pair i. */
  k: number;
  /** Sister chromatid 0 or 1. */
  s: 0 | 1;
}

export interface MitosisPlan {
  pairs: PairCount;
  /** Number of chromosomes in the starting cell (2n). */
  n: number;
  plant: boolean;
  specs: PairSpec[];
  /** Which sister chromatid is pulled to the LEFT pole, per chromosome. */
  leftSister: (0 | 1)[];
  /** Position of each chromosome along the metaphase plate (0 = top). */
  slot: number[];
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makePlan(pairs: PairCount, plant = false, seed = 7): MitosisPlan {
  const n = pairs * 2;
  const rnd = mulberry32(seed * 977 + pairs);
  const leftSister = Array.from({ length: n }, () => (rnd() < 0.5 ? 0 : 1) as 0 | 1);
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  const slot = new Array<number>(n);
  order.forEach((k, i) => (slot[k] = i));
  return { pairs, n, plant, specs: SPECS[pairs], leftSister, slot };
}

export const pairOf = (k: number): number => k >> 1;
export const homologOf = (k: number): 0 | 1 => (k & 1) as 0 | 1;
export const specOf = (plan: MitosisPlan, k: number): PairSpec => plan.specs[pairOf(k)]!;
export const chromatidKey = (id: ChromatidId): string => `${id.k}-${id.s}`;
export const chromosomeTag = (k: number): string => `${pairOf(k) + 1}${homologOf(k) === 0 ? "M" : "P"}`;
export const chIndex = (id: ChromatidId): number => id.k * 2 + id.s;

export function allChromatids(plan: MitosisPlan): ChromatidId[] {
  const out: ChromatidId[] = [];
  for (let k = 0; k < plan.n; k++) for (const s of [0, 1] as const) out.push({ k, s });
  return out;
}

/** -1 if this chromatid is pulled to the left pole (and its kinetochore faces left), +1 for the right. */
export function sideOf(plan: MitosisPlan, id: ChromatidId): -1 | 1 {
  return plan.leftSister[id.k] === id.s ? -1 : 1;
}

/** Which daughter cell (0 = left, 1 = right) receives this chromatid. */
export const daughterOf = (plan: MitosisPlan, id: ChromatidId): 0 | 1 => (sideOf(plan, id) === -1 ? 0 : 1);
