import type { Species, Strength } from "./types";

/**
 * Strong vs Weak Acids and Bases — data model.
 *
 * The central idea this simulation protects: strong/weak describes
 * the EXTENT of ionization, not concentration. Each example carries
 * a fixed "ionized fraction" used purely to make the particle view
 * look conceptually right (mostly ions vs mostly molecules) — it is
 * not a real equilibrium constant and no calculation is done with it.
 */

export const ACID_COLOR = "#E0663D";
export const BASE_COLOR = "#3D6FE0";

export const TOTAL_PARTICLES = 12;

export interface StrengthExample {
  strength: Strength;
  label: string;
  formula: string;
  /** The ion this species forms when it ionizes/reacts (H⁺ for acids, OH⁻ for bases). */
  keyIon: string;
  /** The partner ion left behind (the conjugate/spectator half of the pair shown in the particle view). */
  partnerIon: string;
  ionizedFraction: number;
  explanation: string;
}

export const ACID_EXAMPLES: Record<Strength, StrengthExample> = {
  strong: {
    strength: "strong",
    label: "Strong Acid",
    formula: "HCl",
    keyIon: "H⁺",
    partnerIon: "Cl⁻",
    ionizedFraction: 0.85,
    explanation: "Most of the acid molecules ionize in water.",
  },
  weak: {
    strength: "weak",
    label: "Weak Acid",
    formula: "CH₃COOH",
    keyIon: "H⁺",
    partnerIon: "CH₃COO⁻",
    ionizedFraction: 0.25,
    explanation: "Only some acid molecules ionize in water.",
  },
};

export const BASE_EXAMPLES: Record<Strength, StrengthExample> = {
  strong: {
    strength: "strong",
    label: "Strong Base",
    formula: "NaOH",
    keyIon: "OH⁻",
    partnerIon: "Na⁺",
    ionizedFraction: 0.85,
    explanation: "Most particles separate to produce OH⁻ in the simplified aqueous model.",
  },
  weak: {
    strength: "weak",
    label: "Weak Base",
    formula: "NH₃",
    keyIon: "OH⁻",
    partnerIon: "NH₄⁺",
    ionizedFraction: 0.25,
    explanation: "Only a smaller fraction reacts with water to produce OH⁻.",
  },
};

export function getExample(species: Species, strength: Strength): StrengthExample {
  return species === "acid" ? ACID_EXAMPLES[strength] : BASE_EXAMPLES[strength];
}

export const CONCENTRATION_WARNING = {
  heading: "Strength ≠ concentration",
  body: "A dilute strong acid can contain less acid than a concentrated weak acid, but the strong acid still has a greater tendency to ionize.",
};

export interface ComparisonQuestion {
  title: string;
  question: string;
  options: readonly [string, string];
  correctAnswer: string;
  correctExplanation: string;
  incorrectExplanation: string;
}

export const COMPARISON_QUESTIONS: ComparisonQuestion[] = [
  {
    title: "HCl vs CH₃COOH",
    question: "Which is the strong acid?",
    options: ["HCl", "CH₃COOH"],
    correctAnswer: "HCl",
    correctExplanation: "HCl ionizes extensively in water, while CH₃COOH only partially ionizes.",
    incorrectExplanation: "Try again. The strong acid is the one that ionizes almost completely.",
  },
  {
    title: "NaOH vs NH₃",
    question: "Which is the strong base?",
    options: ["NaOH", "NH₃"],
    correctAnswer: "NaOH",
    correctExplanation: "NaOH separates almost completely into ions, while NH₃ only partially reacts with water.",
    incorrectExplanation: "Try again. The strong base is the one that separates into ions almost completely.",
  },
];
