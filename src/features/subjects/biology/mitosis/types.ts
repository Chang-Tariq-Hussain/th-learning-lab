export type StageId =
  | "interphase"
  | "prophase"
  | "metaphase"
  | "anaphase"
  | "telophase"
  | "cytokinesis";

export interface MitosisState {
  /** Index into STAGES, 0–5. The only thing this simulation needs to track. */
  stageIndex: number;
  running: boolean;
}
