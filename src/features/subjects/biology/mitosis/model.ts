import type { MitosisState, StageId } from "./types";

/**
 * One parent cell → two daughter cells, told as six discrete stages
 * rather than one continuous playback clock (unlike Photosynthesis /
 * Cellular Respiration). `stageIndex` is the entire state; Start
 * auto-advances it on a timer, Next Stage advances it once by hand,
 * and every visual (cell-scene.tsx) is just a lookup table keyed by
 * stage index, with framer-motion tweening between whichever two
 * stages are adjacent. No molecular mechanics, no per-particle
 * physics — this is deliberately as simple as the spec asks for.
 */
export interface StageInfo {
  id: StageId;
  /** 1-indexed, matches the "1 ─ 2 ─ 3 ─ 4 ─ 5 ─ 6" progress indicator. */
  number: number;
  label: string;
  explanation: string;
}

export const STAGES: StageInfo[] = [
  {
    id: "interphase",
    number: 1,
    label: "Interphase",
    explanation: "The cell grows and prepares for division.",
  },
  {
    id: "prophase",
    number: 2,
    label: "Prophase",
    explanation: "Chromosomes become visible.",
  },
  {
    id: "metaphase",
    number: 3,
    label: "Metaphase",
    explanation: "Chromosomes line up in the middle of the cell.",
  },
  {
    id: "anaphase",
    number: 4,
    label: "Anaphase",
    explanation: "Chromosome copies move to opposite sides.",
  },
  {
    id: "telophase",
    number: 5,
    label: "Telophase",
    explanation: "Two new nuclei form.",
  },
  {
    id: "cytokinesis",
    number: 6,
    label: "Cytokinesis",
    explanation: "The cell divides into two daughter cells.",
  },
];

export const LAST_STAGE_INDEX = STAGES.length - 1;

/** How long Start lingers on each stage before auto-advancing to the next. */
export const STAGE_ADVANCE_MS = 2400;

export const INITIAL_MITOSIS_STATE: MitosisState = {
  stageIndex: 0,
  running: false,
};

export function currentStage(state: Pick<MitosisState, "stageIndex">): StageInfo {
  return STAGES[state.stageIndex] ?? STAGES[0]!;
}

export function isFinished(state: Pick<MitosisState, "stageIndex">): boolean {
  return state.stageIndex >= LAST_STAGE_INDEX;
}
