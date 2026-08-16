export type ReactionSlug = "hcl-water" | "ammonia-water";

export interface BronstedLowryState {
  reactionSlug: ReactionSlug;
  /** Index into the shared 5-step sequence (0–4). Same one-piece-of-state pattern as Mitosis/Meiosis. */
  stepIndex: number;
  running: boolean;
}
