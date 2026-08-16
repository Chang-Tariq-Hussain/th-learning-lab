export type BreathDirection = "in" | "out";

export interface BreathingState {
  /** Seconds into the current half-breath, 0 (rest) to BREATH_DURATION_S (full). */
  seconds: number;
  direction: BreathDirection;
  /** Auto Breathing loops direction automatically; manual Inhale/Exhale stop at the end. */
  auto: boolean;
  running: boolean;
}

export type AirStageId = "mouth" | "trachea" | "bronchi" | "bronchioles" | "alveoli";

export interface AirStage {
  id: AirStageId;
  label: string;
  caption: string;
  /** Which part of the lung-scene SVG lights up for this stage. */
  highlight: "mouth" | "trachea" | "bronchi" | "alveoli";
}

export type GasId = "o2" | "co2";

export interface JourneyStep {
  label: string;
  caption?: string;
}

export interface Journey {
  id: GasId;
  label: string;
  summary: string;
  steps: JourneyStep[];
}

export interface ChallengeQuestion {
  prompt: string;
  options: { label: string; correct: boolean }[];
}
