/**
 * Content for Mitosis's click-to-inspect structures — same shape as
 * Cell Explorer's `organelle-info.ts` (name/description/fact), reused
 * on purpose so `StructureInfoPanel` can share that component's look.
 * Only the four structures the scene actually renders and makes
 * clickable: chromosomes, spindle fibers, centrosomes, and the
 * nucleus (both the original and the two that re-form later).
 */
export interface StructureInfo {
  id: string;
  name: string;
  /** One simple sentence — what it is / does. */
  description: string;
  /** One sentence — a memorable, concrete detail. */
  fact: string;
}

export const STRUCTURE_INFO: Record<string, StructureInfo> = {
  chromosome: {
    id: "chromosome",
    name: "Chromosome (Sister Chromatids)",
    description:
      "A duplicated chromosome — two identical sister chromatids joined at the centromere, ready to be pulled apart.",
    fact: "Human cells have 46 chromosomes; this simulation shows a simplified 4 so they're easy to follow.",
  },
  spindle: {
    id: "spindle",
    name: "Spindle Fibers",
    description: "Microtubule strands that attach to chromosomes and pull them toward opposite poles of the cell.",
    fact: "The entire spindle is built, does its job, and is taken apart again in under an hour.",
  },
  centrosome: {
    id: "centrosome",
    name: "Centrosome",
    description: "An organelle that organizes the spindle fibers and marks each pole of the dividing cell.",
    fact: "Centrosomes duplicate just once before mitosis begins, so each pole ends up with exactly one.",
  },
  nucleus: {
    id: "nucleus",
    name: "Nucleus",
    description:
      "Holds the cell's DNA. Its envelope breaks down in prophase, then re-forms around each set of separated chromosomes.",
    fact: "By the end of telophase, two new nuclei have formed — one for each daughter cell.",
  },
};

export function getStructureInfo(id: string | null): StructureInfo | null {
  if (!id) return null;
  return STRUCTURE_INFO[id] ?? null;
}
