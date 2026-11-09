import type { PairCount } from "./plan";

/**
 * Chromosome / chromatid / DNA bookkeeping for the nine stages, taken at the END of each stage.
 *
 *  - chromosome number = number of centromeres in one cell (a chromosome is counted by its centromere);
 *  - chromatids = copies of DNA double helix attached to those centromeres;
 *  - DNA amount is given in "C" units: 1C = the DNA of one complete haploid set (one chromatid of every pair).
 *
 * The verify script re-derives these numbers from the animation's own geometry, so this table cannot drift from
 * what the learner sees.
 */
export interface StageCounts {
  cells: number;
  /** Chromosomes (centromeres) in each cell. */
  chromosomes: number;
  /** Chromatids in each cell. */
  chromatids: number;
  /** DNA per cell, in C. */
  dnaC: number;
  /** Ploidy label for the cell. */
  ploidy: "2n" | "n";
  /** Chromosome copies a chromosome consists of: 2 (two sister chromatids) or 1. */
  chromatidsPerChromosome: 1 | 2;
  /** True while a cell holds two sets of n chromosomes that are about to be shared out. */
  transient?: boolean;
  note?: string;
}

export function stageCounts(stage: number, pairs: PairCount): StageCounts {
  const p = pairs;
  if (stage <= 2)
    return { cells: 1, chromosomes: 2 * p, chromatids: 4 * p, dnaC: 4, ploidy: "2n", chromatidsPerChromosome: 2 };
  if (stage === 3)
    return {
      cells: 1,
      chromosomes: 2 * p,
      chromatids: 4 * p,
      dnaC: 4,
      ploidy: "2n",
      chromatidsPerChromosome: 2,
      transient: true,
      note: `Still one cell: ${p} chromosomes are gathering at each pole.`,
    };
  if (stage <= 6)
    return { cells: 2, chromosomes: p, chromatids: 2 * p, dnaC: 2, ploidy: "n", chromatidsPerChromosome: 2 };
  if (stage === 7)
    return {
      cells: 2,
      chromosomes: 2 * p,
      chromatids: 2 * p,
      dnaC: 2,
      ploidy: "n",
      chromatidsPerChromosome: 1,
      transient: true,
      note: `Once centromeres split, each separated chromatid counts as a chromosome, so each cell briefly holds ${2 * p} — ${p} heading to each pole.`,
    };
  return { cells: 4, chromosomes: p, chromatids: p, dnaC: 1, ploidy: "n", chromatidsPerChromosome: 1 };
}

export const ploidyLabel = (ploidy: "2n" | "n", pairs: PairCount): string => (ploidy === "2n" ? `2n = ${2 * pairs}` : `n = ${pairs}`);
