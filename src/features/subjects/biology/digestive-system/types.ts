export type StageId = "mouth" | "esophagus" | "stomach" | "small-intestine" | "large-intestine" | "rectum";

export interface JourneyState {
  /** Seconds into the overall journey clock, 0 to TOTAL_DURATION_S. */
  seconds: number;
  running: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface Stage {
  id: StageId;
  label: string;
  caption: string;
}

export type OrganId = "mouth" | "esophagus" | "stomach" | "small-intestine" | "large-intestine";

export interface OrganInfo {
  id: OrganId;
  label: string;
  function: string;
  explanation: string;
}

export type NutrientId = "glucose" | "amino-acids" | "fatty-acids";

export interface NutrientInfo {
  id: NutrientId;
  label: string;
  explanation: string;
}

export interface ChallengeQuestion {
  prompt: string;
  options: { label: string; correct: boolean }[];
}