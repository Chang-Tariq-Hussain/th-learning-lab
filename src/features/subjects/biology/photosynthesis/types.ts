/** The six visible beats of the animation, in order. Purely for status text — the scene itself is driven by continuous progress, not discrete steps. */
export type StepId = "light" | "water" | "co2" | "reaction" | "glucose" | "oxygen";

export interface PhotosynthesisState {
  running: boolean;
  /** Real playback clock in seconds, counting up to PLAYBACK_DURATION_S. */
  playbackSeconds: number;
}
