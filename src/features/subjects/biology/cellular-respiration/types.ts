/** The seven visible beats of the animation, in order. Purely for status text — the scene itself is driven by continuous progress, not discrete steps. */
export type StepId = "glucose" | "oxygen" | "moving" | "mitochondrion" | "energy" | "co2" | "water";

export interface RespirationState {
  running: boolean;
  /** Real playback clock in seconds, counting up to PLAYBACK_DURATION_S. */
  playbackSeconds: number;
}
