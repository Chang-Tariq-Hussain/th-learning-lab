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

/** Organs that support digestion but that food does not physically
 *  travel through — distinct from `OrganId`, which is the main
 *  digestive tract the food particle actually moves along. */
export type AccessoryOrganId = "liver" | "gallbladder" | "pancreas";

export interface AccessoryOrganInfo {
  id: AccessoryOrganId;
  label: string;
  function: string;
  explanation: string;
}

export interface ChallengeQuestion {
  prompt: string;
  options: { label: string; correct: boolean }[];
}