export type LewisReactionSlug = "nh3-bf3" | "h-nh3";

export interface LewisAcidBaseState {
  reactionSlug: LewisReactionSlug;
  /** Index into the shared 5-step sequence (0–4). Same one-piece-of-state pattern as Brønsted–Lowry/Mitosis/Meiosis. */
  stepIndex: number;
  running: boolean;
}
