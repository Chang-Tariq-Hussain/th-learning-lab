/**
 * The genetic "plan" for one simulated meiosis. Everything the stage draws and every count the panels show is
 * derived from this single object, so the animation, the explanations and the chromosome counts cannot disagree.
 *
 * Model (deliberately simplified, and labelled as such in the UI):
 *  - the starting cell is 2n = 2 × `pairs` chromosomes: each pair has a maternal (h = 0) and a paternal (h = 1) homolog;
 *  - after replication each chromosome has two sister chromatids (s = 0 / 1);
 *  - every pair carries two marker genes (loci); the maternal homolog has the upper-case alleles, the paternal the lower-case;
 *  - at most one crossover per pair is drawn, always between ONE maternal and ONE paternal chromatid (non-sisters),
 *    and not every pair crosses over: which pairs do, where, and which chromatids are involved all come from the seed.
 */

export type PairCount = 2 | 3 | 4;
export const PAIR_COUNTS: readonly PairCount[] = [2, 3, 4];

export type Bit = 0 | 1;

export interface ChromatidId {
  pair: number;
  homolog: Bit;
  sister: Bit;
}

export const chromatidKey = (c: ChromatidId): string => `${c.pair}-${c.homolog}-${c.sister}`;
export function parseChromatidKey(key: string): ChromatidId {
  const [pair, homolog, sister] = key.split("-").map(Number);
  return { pair: pair!, homolog: homolog as Bit, sister: sister as Bit };
}

export interface PairSpec {
  index: number;
  /** Rod length in scene units. Shorter pairs are visibly different chromosomes. */
  length: number;
  /** Fraction of the rod, from the top, where the centromere sits. */
  centromere: number;
  /** Positions (fractions) of the two marker genes. */
  loci: [number, number];
  genes: [string, string];
}

const LENGTHS: Record<PairCount, number[]> = {
  2: [208, 156],
  3: [156, 124, 98],
  4: [114, 94, 78, 62],
};
const CENTROMERES = [0.36, 0.5, 0.42, 0.56];
const GENES: [string, string][] = [
  ["A", "B"],
  ["D", "E"],
  ["F", "G"],
  ["H", "J"],
];
export const LOCI: [number, number] = [0.14, 0.86];

export interface CrossPlan {
  /** Which maternal / paternal sister chromatid take part (non-sisters by construction). */
  mSister: Bit;
  pSister: Bit;
  /** Position of the crossover along the chromatid (fraction from the top). Never at the centromere. */
  at: number;
}

export interface MeiosisPlan {
  pairs: PairCount;
  seed: number;
  specs: PairSpec[];
  cross: (CrossPlan | null)[];
  /** Homolog that is pulled to the LEFT pole in anaphase I (independent assortment). */
  leftHomolog: Bit[];
  /** [left cell, right cell][pair] → the sister chromatid pulled to the TOP pole in anaphase II. */
  topSister: [Bit[], Bit[]];
}

/** Small deterministic PRNG so a seed always reproduces the same meiosis. */
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

export function makeSpecs(pairs: PairCount): PairSpec[] {
  return Array.from({ length: pairs }, (_, i) => ({
    index: i,
    length: LENGTHS[pairs][i]!,
    centromere: CENTROMERES[i]!,
    loci: LOCI,
    genes: GENES[i]!,
  }));
}

/** Pick a crossover position between the two genes that is clearly away from the centromere. */
export function pickCrossoverPosition(centromere: number, r: number): number {
  const lo = 0.34;
  const hi = 0.7;
  for (let k = 0; k < 8; k++) {
    const at = lo + ((r + k * 0.37) % 1) * (hi - lo);
    if (Math.abs(at - centromere) >= 0.13) return Math.round(at * 100) / 100;
  }
  return 0.62;
}

export function makePlan(pairs: PairCount, seed: number): MeiosisPlan {
  const rnd = mulberry32(seed * 7919 + pairs * 104729);
  const specs = makeSpecs(pairs);
  const bit = (): Bit => (rnd() < 0.5 ? 0 : 1);

  const crosses = specs.map(() => rnd() < 0.7);
  // At least one pair crosses over so the feature can be seen, but never forced onto every pair.
  if (!crosses.some(Boolean)) crosses[Math.floor(rnd() * pairs)] = true;
  if (pairs >= 3 && crosses.every(Boolean)) crosses[pairs - 1] = false;

  const cross = specs.map((s, i): CrossPlan | null =>
    crosses[i] ? { mSister: bit(), pSister: bit(), at: pickCrossoverPosition(s.centromere, rnd()) } : null,
  );
  const leftHomolog = specs.map(() => bit());
  const topSister: [Bit[], Bit[]] = [specs.map(() => bit()), specs.map(() => bit())];
  return { pairs, seed, specs, cross, leftHomolog, topSister };
}

/** Side of the cell (0 = left, 1 = right) that a homolog is pulled to at anaphase I. */
export function sideOf(plan: MeiosisPlan, pair: number, homolog: Bit): 0 | 1 {
  return plan.leftHomolog[pair] === homolog ? 0 : 1;
}

/** Vertical half (0 = top, 1 = bottom) a chromatid ends up in after anaphase II. */
export function vertOf(plan: MeiosisPlan, c: ChromatidId): 0 | 1 {
  const side = sideOf(plan, c.pair, c.homolog);
  return plan.topSister[side][c.pair] === c.sister ? 0 : 1;
}

/** Final cell index: 0 = top-left, 1 = bottom-left, 2 = top-right, 3 = bottom-right. */
export function finalCellOf(plan: MeiosisPlan, c: ChromatidId): number {
  return sideOf(plan, c.pair, c.homolog) * 2 + vertOf(plan, c);
}

export function crossSister(plan: MeiosisPlan, pair: number, homolog: Bit): Bit | null {
  const x = plan.cross[pair];
  if (!x) return null;
  return homolog === 0 ? x.mSister : x.pSister;
}

export function isCrossing(plan: MeiosisPlan, c: ChromatidId): boolean {
  return crossSister(plan, c.pair, c.homolog) === c.sister;
}

/** Which homolog supplies the top / bottom part of this chromatid once crossing over is complete. */
export function chromatidSources(plan: MeiosisPlan, c: ChromatidId): { top: Bit; bottom: Bit; at: number | null } {
  const x = plan.cross[c.pair];
  if (x && isCrossing(plan, c)) return { top: c.homolog, bottom: (1 - c.homolog) as Bit, at: x.at };
  return { top: c.homolog, bottom: c.homolog, at: x ? x.at : null };
}

/** The allele (e.g. "A" or "b") this chromatid carries at locus k (0 or 1) after crossing over. */
export function alleleAt(plan: MeiosisPlan, c: ChromatidId, locus: 0 | 1): string {
  const spec = plan.specs[c.pair]!;
  const src = chromatidSources(plan, c);
  const at = src.at;
  const sourceHomolog = at !== null && spec.loci[locus] > at ? src.bottom : src.top;
  const letter = spec.genes[locus];
  return sourceHomolog === 0 ? letter : letter.toLowerCase();
}

export function allelesOf(plan: MeiosisPlan, c: ChromatidId): [string, string] {
  return [alleleAt(plan, c, 0), alleleAt(plan, c, 1)];
}

/** Left-to-right lane order of the four chromatids of a tetrad (inner lanes 1 and 2 are the crossing non-sisters). */
export function tetradLanes(plan: MeiosisPlan, pair: number): ChromatidId[] {
  const left = plan.leftHomolog[pair]!;
  const right = (1 - left) as Bit;
  const cl = crossSister(plan, pair, left);
  const cr = crossSister(plan, pair, right);
  const innerL: Bit = cl ?? 1;
  const innerR: Bit = cr ?? 0;
  return [
    { pair, homolog: left, sister: (1 - innerL) as Bit },
    { pair, homolog: left, sister: innerL },
    { pair, homolog: right, sister: innerR },
    { pair, homolog: right, sister: (1 - innerR) as Bit },
  ];
}

export function allChromatids(plan: MeiosisPlan): ChromatidId[] {
  const out: ChromatidId[] = [];
  for (let pair = 0; pair < plan.pairs; pair++) {
    for (const homolog of [0, 1] as const) for (const sister of [0, 1] as const) out.push({ pair, homolog, sister });
  }
  return out;
}

export interface FinalCell {
  index: number;
  chromatids: ChromatidId[];
  /** One entry per pair, e.g. "A b". */
  genotype: string[];
}

export function finalCells(plan: MeiosisPlan): FinalCell[] {
  const cells: FinalCell[] = [0, 1, 2, 3].map((index) => ({ index, chromatids: [], genotype: [] }));
  for (const c of allChromatids(plan)) cells[finalCellOf(plan, c)]!.chromatids.push(c);
  for (const cell of cells) {
    cell.chromatids.sort((a, b) => a.pair - b.pair);
    cell.genotype = cell.chromatids.map((c) => allelesOf(plan, c).join(" "));
  }
  return cells;
}

/** True when a final cell's allele combination for a pair differs from both of the parent's (maternal / paternal) combinations. */
export function isRecombinant(plan: MeiosisPlan, c: ChromatidId): boolean {
  const [a, b] = allelesOf(plan, c);
  const spec = plan.specs[c.pair]!;
  const m = spec.genes;
  const maternal = a === m[0] && b === m[1];
  const paternal = a === m[0].toLowerCase() && b === m[1].toLowerCase();
  return !maternal && !paternal;
}
