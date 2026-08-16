export type StageId =
  | "dna-replication"
  | "prophase-1"
  | "metaphase-1"
  | "anaphase-1"
  | "telophase-1"
  | "prophase-2"
  | "metaphase-2"
  | "anaphase-2"
  | "telophase-2";

export interface MeiosisState {
  /** Index into STAGES, 0–8. The only thing this simulation needs to track — same one-piece-of-state pattern as Mitosis. */
  stageIndex: number;
  running: boolean;
}
