/** Which of the two processes is currently expanded in the toggle detail view. */
export type ProcessKey = "photosynthesis" | "respiration";

export interface ProcessDetail {
  key: ProcessKey;
  label: string;
  inputs: string;
  outputs: string;
  energy: string;
  organelle: string;
  purpose: string;
}
