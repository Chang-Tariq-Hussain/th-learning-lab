import type { PairCount } from "./plan";

/**
 * Chromosome / chromatid / DNA bookkeeping, taken at the END of each stage.
 *
 *  - chromosome number = number of centromeres in one cell (a chromosome is counted by its centromere);
 *  - chromatids = copies of the DNA double helix attached to those centromeres;
 *  - DNA is given in "C" units: 1C = the DNA of one complete haploid set (n chromatids, one of each kind).
 *    A diploid cell before replication has 2C, after replication 4C.
 *
 * The verify script re-derives these from the animation's own geometry, so the table cannot drift from the picture.
 */
export interface StageCounts {
  cells: number;
  nuclei: number;
  /** Chromosomes (centromeres) in each cell. */
  chromosomes: number;
  /** Chromatids in each cell. */
  chromatids: number;
  /** DNA per cell, in C. */
  dnaC: number;
  /** Chromatids per chromosome: 2 (sister chromatids joined) or 1. */
  chromatidsPerChromosome: 1 | 2;
  /** True while the count is a momentary one (sisters have just separated and are counted as chromosomes). */
  transient?: boolean;
  note?: string;
}

/**
 * Rows of the counting lab: interphase is split in two so that replication is visible: DNA doubles,
 * the chromosome number does not.
 */
export const COUNT_ROWS = [
  { id: "g1", label: "Interphase (G1, before copying)", short: "G1", stage: 0, beat: 0 },
  { id: "g2", label: "Interphase (after DNA replication)", short: "After S", stage: 0, beat: 1 },
  { id: "prophase", label: "Prophase", short: "Prophase", stage: 1, beat: 3 },
  { id: "prometaphase", label: "Prometaphase", short: "Prometa.", stage: 2, beat: 5 },
  { id: "metaphase", label: "Metaphase", short: "Metaphase", stage: 3, beat: 7 },
  { id: "anaphase", label: "Anaphase", short: "Anaphase", stage: 4, beat: 9 },
  { id: "telophase", label: "Telophase", short: "Telophase", stage: 5, beat: 11 },
  { id: "cytokinesis", label: "Cytokinesis (final)", short: "Cytokin.", stage: 6, beat: 14 },
] as const;

/** Counts at one of the rows above. `row` indexes COUNT_ROWS. */
export function rowCounts(row: number, pairs: PairCount): StageCounts {
  const n = 2 * pairs;
  switch (COUNT_ROWS[row]!.id) {
    case "g1":
      return { cells: 1, nuclei: 1, chromosomes: n, chromatids: n, dnaC: 2, chromatidsPerChromosome: 1, note: `${n} chromosomes, each a single chromatid.` };
    case "g2":
    case "prophase":
    case "prometaphase":
    case "metaphase":
      return {
        cells: 1,
        nuclei: 1,
        chromosomes: n,
        chromatids: 2 * n,
        dnaC: 4,
        chromatidsPerChromosome: 2,
        note: COUNT_ROWS[row]!.id === "g2" ? `DNA doubled (2C to 4C) but there are still ${n} chromosomes: each now has two sister chromatids.` : undefined,
      };
    case "anaphase":
      return {
        cells: 1,
        nuclei: 1,
        chromosomes: 2 * n,
        chromatids: 2 * n,
        dnaC: 4,
        chromatidsPerChromosome: 1,
        transient: true,
        note: `Once the centromeres split, each separated chromatid counts as a chromosome: ${2 * n} in the cell, ${n} heading to each pole.`,
      };
    case "telophase":
      return {
        cells: 1,
        nuclei: 2,
        chromosomes: 2 * n,
        chromatids: 2 * n,
        dnaC: 4,
        chromatidsPerChromosome: 1,
        transient: true,
        note: `Still one cell, but with two nuclei of ${n} chromosomes each (${2 * n} in the cell).`,
      };
    default:
      return { cells: 2, nuclei: 1, chromosomes: n, chromatids: n, dnaC: 2, chromatidsPerChromosome: 1, note: `Two daughter cells, each with ${n} chromosomes: the same number as the parent cell.` };
  }
}

/** Counts for a whole stage (its last beat). */
export function stageCounts(stage: number, pairs: PairCount): StageCounts {
  const row = COUNT_ROWS.findIndex((r) => r.stage === stage && r.id !== "g1");
  return rowCounts(row, pairs);
}

/** Counts at an individual animation beat, for the live readout. */
export function beatCounts(beat: number, pairs: PairCount): StageCounts {
  if (beat === 0) return rowCounts(0, pairs);
  const idx = COUNT_ROWS.findIndex((r, i) => i > 0 && beat <= r.beat);
  return rowCounts(idx < 0 ? COUNT_ROWS.length - 1 : idx, pairs);
}

export const ploidyText = (pairs: PairCount): string => `2n = ${2 * pairs}`;
