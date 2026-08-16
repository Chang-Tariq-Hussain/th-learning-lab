import type { MeiosisState, StageId } from "./types";

/**
 * Meiosis — One Diploid Cell Becomes Four Haploid Cells. Same "one
 * discrete stageIndex, no continuous playback clock" pattern as
 * Mitosis: nine stages instead of six, and every stage carries a
 * short "what's happening" plus an optional "why it matters" line
 * (the spec asks for a little more explanation here than Mitosis
 * gives). `stageIndex` is still the entire piece of state this
 * simulation owns — every visual is a lookup table keyed off it.
 */
export interface StageInfo {
  id: StageId;
  /** 1-indexed, matches the compact progress strip. */
  number: number;
  label: string;
  /** Which half of meiosis this stage belongs to — drives the MEIOSIS I / MEIOSIS II overview header. */
  phase: "prep" | "I" | "II";
  whatHappening: string;
  whyMatters?: string;
  /** One of the two ideas the spec calls out as most important for students to remember. */
  keyConcept?: string;
}

export const STAGES: StageInfo[] = [
  {
    id: "dna-replication",
    number: 1,
    label: "DNA Replication",
    phase: "prep",
    whatHappening:
      "Before meiosis begins, the cell copies its DNA so that each chromosome now has two identical sister chromatids.",
    whyMatters: "The copied chromosomes will later be separated into new cells.",
  },
  {
    id: "prophase-1",
    number: 2,
    label: "Prophase I",
    phase: "I",
    whatHappening: "Homologous chromosomes pair up, lining up alongside their matching partner.",
    whyMatters: "Paired chromosomes can exchange sections of DNA (crossing over), creating genetic variation.",
  },
  {
    id: "metaphase-1",
    number: 3,
    label: "Metaphase I",
    phase: "I",
    whatHappening: "The paired homologous chromosomes line up together in the middle of the cell.",
  },
  {
    id: "anaphase-1",
    number: 4,
    label: "Anaphase I",
    phase: "I",
    whatHappening: "Homologous chromosomes separate and move toward opposite sides of the cell.",
    whyMatters: "Notice the sister chromatids stay joined — only the homologous pairs come apart.",
    keyConcept: "Homologous chromosomes separate in Meiosis I.",
  },
  {
    id: "telophase-1",
    number: 5,
    label: "Telophase I",
    phase: "I",
    whatHappening: "The cell divides into two cells.",
    whyMatters:
      "Each new cell now has one chromosome from every homologous pair, but each chromosome still consists of two sister chromatids.",
  },
  {
    id: "prophase-2",
    number: 6,
    label: "Prophase II",
    phase: "II",
    whatHappening: "In both cells, the chromosomes reorganize and prepare for a second division.",
  },
  {
    id: "metaphase-2",
    number: 7,
    label: "Metaphase II",
    phase: "II",
    whatHappening: "Chromosomes line up in the middle of each cell.",
  },
  {
    id: "anaphase-2",
    number: 8,
    label: "Anaphase II",
    phase: "II",
    whatHappening: "Sister chromatids finally separate and move to opposite sides of each cell.",
    whyMatters: "This is the step that halves the chromosome number for good.",
    keyConcept: "Sister chromatids separate in Meiosis II.",
  },
  {
    id: "telophase-2",
    number: 9,
    label: "Telophase II",
    phase: "II",
    whatHappening: "Both cells divide again, producing four haploid cells in total.",
    whyMatters: "Each of the four cells now has half the chromosome number of the original cell.",
  },
];

export const LAST_STAGE_INDEX = STAGES.length - 1;

/** How long Start lingers on each stage before auto-advancing to the next. */
export const STAGE_ADVANCE_MS = 2600;

export const INITIAL_MEIOSIS_STATE: MeiosisState = {
  stageIndex: 0,
  running: false,
};

export function currentStage(state: Pick<MeiosisState, "stageIndex">): StageInfo {
  return STAGES[state.stageIndex] ?? STAGES[0]!;
}

export function isFinished(state: Pick<MeiosisState, "stageIndex">): boolean {
  return state.stageIndex >= LAST_STAGE_INDEX;
}
