/**
 * Acids & Bases — The Basics — data model.
 *
 * All pH values here are approximate, educational figures for
 * everyday substances (the kind printed in an intro chemistry
 * textbook), not laboratory measurements. The goal is for students to
 * build intuition for the acid/neutral/base scale before any
 * logarithmic math or acid/base theory shows up in a later
 * visualization.
 */

export type Classification = "acidic" | "neutral" | "basic";

export interface Substance {
  slug: string;
  name: string;
  approxPH: number;
  classification: Classification;
  /** One short, concrete sentence a beginner can act on. */
  blurb: string;
}

export const SUBSTANCES: Substance[] = [
  {
    slug: "lemon-juice",
    name: "Lemon juice",
    approxPH: 2,
    classification: "acidic",
    blurb: "Lemon juice contains citric acid, which increases the H⁺ concentration in water.",
  },
  {
    slug: "vinegar",
    name: "Vinegar",
    approxPH: 3,
    classification: "acidic",
    blurb: "Vinegar contains acetic acid — a common, everyday acid found in most kitchens.",
  },
  {
    slug: "pure-water",
    name: "Pure water",
    approxPH: 7,
    classification: "neutral",
    blurb: "Pure water is the textbook example of neutral — H⁺ and OH⁻ are present in equal amounts.",
  },
  {
    slug: "baking-soda",
    name: "Baking soda solution",
    approxPH: 9,
    classification: "basic",
    blurb: "Baking soda (sodium bicarbonate) dissolved in water accepts H⁺ ions, making the solution basic.",
  },
  {
    slug: "soap",
    name: "Soap solution",
    approxPH: 10,
    classification: "basic",
    blurb: "Most soaps are mildly basic — that basicity is part of what helps them lift away oils.",
  },
];

export function getSubstance(slug: string): Substance | undefined {
  return SUBSTANCES.find((s) => s.slug === slug);
}

export function classificationLabel(c: Classification): string {
  return c === "acidic" ? "Acidic" : c === "basic" ? "Basic" : "Neutral";
}

export const CLASSIFICATION_COLOR: Record<Classification, string> = {
  acidic: "#E0663D",
  neutral: "#5A9E6F",
  basic: "#3D6FE0",
};

export function classificationForPH(ph: number): Classification {
  if (ph < 6.5) return "acidic";
  if (ph > 7.5) return "basic";
  return "neutral";
}

/** 0–14 pH → 0–100% position along the horizontal scale. */
export function phToPercent(ph: number): number {
  return (Math.max(0, Math.min(14, ph)) / 14) * 100;
}

const ACID_EXPLANATION =
  "An acid is a substance that can increase the concentration of hydrogen ions (H⁺) in aqueous solution.";
const BASE_EXPLANATION =
  "A base is a substance that can accept H⁺ or, in aqueous solution, can increase OH⁻ concentration.";
const NEUTRAL_EXPLANATION = "H⁺ and OH⁻ are present in equal concentrations in pure water at 25 °C.";

export const CLASSIFICATION_EXPLANATION: Record<Classification, string> = {
  acidic: ACID_EXPLANATION,
  basic: BASE_EXPLANATION,
  neutral: NEUTRAL_EXPLANATION,
};

export const CLASSIFICATION_ION_NOTE: Record<Classification, string> = {
  acidic: "Acid → more H⁺",
  basic: "Base → less H⁺ / more OH⁻",
  neutral: "H⁺ ≈ OH⁻",
};

/** How many ion particles to show in the simple particle view — more extreme pH reads as "more" of that ion, capped for legibility. */
export function particleCount(substance: Substance): number {
  if (substance.classification === "neutral") return 2;
  const distanceFromNeutral = Math.abs(substance.approxPH - 7);
  return Math.max(2, Math.min(6, Math.round(distanceFromNeutral)));
}

export function comparePrompt(a: Substance, b: Substance): string {
  if (a.approxPH === b.approxPH) return `${a.name} and ${b.name} have about the same pH.`;
  const moreAcidic = a.approxPH < b.approxPH ? a : b;
  return `${moreAcidic.name} is more acidic — it sits further to the left on the scale.`;
}
