import type { LevelMeta } from "./types";

/**
 * Reaction Kinetics — Understanding Reaction Rates
 *
 * A qualitative, particle-based visualization of collision theory.
 * Nothing here is a real rate law or numerical kinetics model — it is
 * deliberately conceptual, matching the rest of the app's approach to
 * "strength" and "trend" simulations elsewhere in Chemistry.
 */

export const COLOR_A = "#2E9E5B"; // subject-chemistry green
export const COLOR_B = "#3D6FE0"; // blue, matches the existing acid/base palette
export const COLOR_PRODUCT = "#E0A63D"; // warm amber — visually distinct "something new formed"
export const COLOR_FAIL = "#B24A3D";

export const DEFAULT_CHAMBER_WIDTH = 300;
export const DEFAULT_CHAMBER_HEIGHT = 190;
export const PARTICLE_RADIUS = 9;

/** Maps 20°C–100°C to a particle-speed multiplier (higher temp → faster particles). */
export function temperatureToSpeedScale(tempC: number): number {
  const clamped = Math.min(100, Math.max(20, tempC));
  return 0.55 + ((clamped - 20) / 80) * 1.55;
}

/** Maps 20°C–100°C to the base probability that a collision is "successful" (energetic + well-oriented enough). */
export function temperatureToSuccessProbability(tempC: number): number {
  const clamped = Math.min(100, Math.max(20, tempC));
  return 0.12 + ((clamped - 20) / 80) * 0.6;
}

export const CATALYST_BONUS = 0.28;

export const LEVELS: LevelMeta[] = [
  { id: "rate", index: 1, title: "What Is Reaction Rate?", kicker: "Level 1" },
  { id: "collisions", index: 2, title: "Particle Collisions", kicker: "Level 2" },
  { id: "successful", index: 3, title: "Successful Collisions", kicker: "Level 3" },
  { id: "concentration", index: 4, title: "Concentration", kicker: "Level 4" },
  { id: "temperature", index: 5, title: "Temperature", kicker: "Level 5" },
  { id: "surface-area", index: 6, title: "Surface Area", kicker: "Level 6" },
  { id: "progress", index: 7, title: "Reaction Progress", kicker: "Level 7" },
  { id: "compare", index: 8, title: "Compare Reaction Rates", kicker: "Level 8" },
  { id: "catalyst", index: 9, title: "Catalyst Introduction", kicker: "Level 9" },
  { id: "experiment", index: 10, title: "Run Your Own Reaction", kicker: "Level 10" },
  { id: "challenge", index: 11, title: "Reaction Rate Challenge", kicker: "Level 11" },
];

export interface PredictionQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const PREDICTION_QUESTIONS: Record<"concentration" | "temperature" | "surfaceArea", PredictionQuestion> = {
  concentration: {
    id: "predict-concentration",
    prompt: "If we increase the reactant concentration, what do you think happens to the reaction rate?",
    options: ["Rate decreases", "Rate stays the same", "Rate increases"],
    correctIndex: 2,
    explanation: "More particles in the same space means more frequent collisions, so the reaction rate generally increases.",
  },
  temperature: {
    id: "predict-temperature",
    prompt: "If we raise the temperature, what do you think happens to the reaction rate?",
    options: ["Rate decreases", "Rate stays the same", "Rate increases"],
    correctIndex: 2,
    explanation:
      "Particles move faster at higher temperatures, so collisions happen more often and more of them carry enough energy to react.",
  },
  surfaceArea: {
    id: "predict-surface-area",
    prompt: "If we crush a solid reactant into a powder, what do you think happens to the reaction rate?",
    options: ["Rate decreases", "Rate stays the same", "Rate increases"],
    correctIndex: 2,
    explanation: "Powdering the solid exposes far more surface, giving other particles more places to collide with it.",
  },
};

export interface FactorSummary {
  id: "concentration" | "temperature" | "surfaceArea";
  label: string;
  whatChanges: string;
  collisionEffect: string;
  rateEffect: string;
}

export const FACTOR_SUMMARIES: FactorSummary[] = [
  {
    id: "concentration",
    label: "Concentration",
    whatChanges: "The number of reactant particles in a given volume.",
    collisionEffect: "Collision frequency increases — particles simply bump into each other more often.",
    rateEffect: "Reaction rate generally increases.",
  },
  {
    id: "temperature",
    label: "Temperature",
    whatChanges: "The average kinetic energy (speed) of the particles.",
    collisionEffect: "Collisions become more frequent, and a larger fraction carry enough energy to react.",
    rateEffect: "Reaction rate generally increases.",
  },
  {
    id: "surfaceArea",
    label: "Surface Area",
    whatChanges: "How much of a solid reactant is actually exposed to the other reactant.",
    collisionEffect: "More exposed particles means more opportunities for collisions to occur.",
    rateEffect: "Reaction rate generally increases.",
  },
];

export interface ChallengeQuestion {
  id: string;
  question: string;
  answer: string;
}

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    id: "q1",
    question: "What usually happens to reaction rate when reactant concentration increases?",
    answer: "Reaction rate generally increases.",
  },
  {
    id: "q2",
    question: "Why does increasing concentration usually increase reaction rate?",
    answer: "There are more particles in the same space, so collisions between them happen more frequently.",
  },
  {
    id: "q3",
    question: "What happens when temperature increases?",
    answer: "Particles move faster, so collisions are more frequent, and more of those collisions carry enough energy to react.",
  },
  {
    id: "q4",
    question: "Why can powdered solids react faster than large chunks of the same substance?",
    answer: "Powdering the solid exposes a much greater surface area, giving more opportunities for collisions.",
  },
  {
    id: "q5",
    question: "What does a catalyst do?",
    answer: "It provides an alternative reaction pathway with lower activation energy, without being consumed overall.",
  },
];

export function formatRateLabel(productsPerSecond: number): string {
  if (productsPerSecond < 0.35) return "Slow";
  if (productsPerSecond < 0.9) return "Moderate";
  return "Fast";
}
