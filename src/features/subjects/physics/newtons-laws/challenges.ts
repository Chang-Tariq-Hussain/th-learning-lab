import type { Law3Readouts } from "./law3-engine";
import type { CartReadouts } from "./physics";

export interface CartChallenge {
  id: string;
  law: 1 | 2;
  title: string;
  description: string;
  hint: string;
  check: (readouts: CartReadouts) => boolean;
}

export const cartChallenges: CartChallenge[] = [
  {
    id: "move-20m",
    law: 2,
    title: "Move the crate exactly 20 meters",
    description:
      "Apply force, then remove it in time so the crate coasts and stops as close to 20 m as possible.",
    hint: "Distance keeps accumulating as long as the crate moves — apply force briefly, remove it, and let friction (or a well-timed removal) bring it to rest near 20 m.",
    check: (r) => Math.abs(r.distance - 20) <= 1 && Math.abs(r.velocity) < 0.05,
  },
  {
    id: "target-speed",
    law: 2,
    title: "Reach a target speed of 8 m/s",
    description:
      "Pick a mass and force combination that gets the crate to 8 m/s.",
    hint: "Higher applied force or lower mass both increase acceleration — a = F/m, so speed after time t is roughly (F/m − friction/m)·t.",
    check: (r) => Math.abs(r.velocity - 8) <= 0.3,
  },
  {
    id: "stop-within-5m",
    law: 1,
    title: "Stop within 5 meters",
    description:
      "Get the crate moving, remove the applied force, and let it come to rest within 5 m of where you removed the force.",
    hint: "A high-friction surface (rubber mat) stops the crate faster over a shorter distance than ice.",
    check: (r) =>
      Math.abs(r.velocity) < 0.05 && r.distance <= 5 && r.distance > 0.1,
  },
];

export interface Law3Challenge {
  id: string;
  title: string;
  description: string;
  hint: string;
  check: (readouts: Law3Readouts) => boolean;
}

export const law3Challenges: Law3Challenge[] = [
  {
    id: "different-masses",
    title: "Push two boxes with different masses",
    description:
      "On the Skaters scenario, set Mass A and Mass B to different values, then push — see which one ends up moving faster.",
    hint: "Equal and opposite momentum, not equal and opposite velocity: the lighter skater always ends up moving faster than the heavier one.",
    check: (r) =>
      r.kind === "skaters" &&
      Math.abs(r.velocityA) > 0.1 &&
      Math.abs(r.velocityB) > 0.1 &&
      Math.abs(Math.abs(r.velocityA) - Math.abs(r.velocityB)) > 0.2,
  },
];

/** Not a physics check — a self-assessment prompt shown before the student runs the simulation. */
export interface PredictionPrompt {
  id: string;
  question: string;
  reveal: string;
}

export const predictionPrompts: PredictionPrompt[] = [
  {
    id: "predict-mass-double",
    question:
      "If you double the mass with the same applied force, what happens to the acceleration?",
    reveal:
      "It's cut in half — a = F/m, so doubling m halves a for a fixed F. Try it and check the acceleration readout.",
  },
  {
    id: "predict-friction-off",
    question:
      "If friction is switched off mid-slide, what happens to a moving cart?",
    reveal:
      "It keeps moving at whatever velocity it had, forever (Law 1) — no force means no change in velocity, so it neither speeds up nor slows down.",
  },
  {
    id: "predict-skater-lighter",
    question:
      "Two skaters push apart with different masses. Which one ends up moving faster?",
    reveal:
      "The lighter one. Momentum is conserved (equal and opposite), and momentum = mass × velocity, so the smaller mass needs a larger velocity to match the same momentum magnitude.",
  },
];
