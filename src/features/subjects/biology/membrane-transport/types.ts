/**
 * Three independent mini-activities living under one membrane visual —
 * Diffusion, Osmosis, and Active Transport. `Mode` picks which one is
 * active, `Phase` tracks that mode's own tiny state machine (idle ->
 * running -> done). Switching modes or hitting Reset always drops
 * back to "idle".
 */
export type Mode = "diffusion" | "osmosis" | "active-transport";

export type Phase = "idle" | "running" | "done";

/** A single moving dot inside the stage, positioned in percent so the SVG/CSS layer never needs pixel math. */
export interface Particle {
  id: string;
  xPercent: number;
  yPercent: number;
}
