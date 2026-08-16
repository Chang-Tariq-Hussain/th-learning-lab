/**
 * Conjugate Acid–Base Pairs — data model.
 *
 * Every pair here follows the same shape: a protonated ("acid")
 * form and a deprotonated ("conjugate base") form, differing by
 * exactly one H⁺. Picking either member of a pair should surface
 * the other — that's the entire interaction this simulation teaches.
 */

export const ACID_COLOR = "#E0663D";
export const BASE_COLOR = "#3D6FE0";

export interface ConjugatePair {
  slug: string;
  /** The protonated form. */
  acid: string;
  /** The deprotonated form — one proton fewer than `acid`. */
  conjugateBase: string;
  /** "`acid` loses H⁺ to become `conjugateBase`." */
  note: string;
}

export const PAIRS: ConjugatePair[] = [
  {
    slug: "hcl-cl",
    acid: "HCl",
    conjugateBase: "Cl⁻",
    note: "HCl loses H⁺ to become Cl⁻.",
  },
  {
    slug: "h2o-oh",
    acid: "H₂O",
    conjugateBase: "OH⁻",
    note: "H₂O loses H⁺ to become OH⁻.",
  },
  {
    slug: "nh4-nh3",
    acid: "NH₄⁺",
    conjugateBase: "NH₃",
    note: "NH₄⁺ loses H⁺ to become NH₃.",
  },
];

export function getPair(slug: string): ConjugatePair | undefined {
  return PAIRS.find((p) => p.slug === slug);
}

/** Which member of the pair (by formula) a click landed on. */
export function findPairByMember(formula: string): { pair: ConjugatePair; member: "acid" | "base" } | null {
  for (const pair of PAIRS) {
    if (pair.acid === formula) return { pair, member: "acid" };
    if (pair.conjugateBase === formula) return { pair, member: "base" };
  }
  return null;
}

export interface PracticeQuestion {
  slug: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  correctExplanation: string;
}

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    slug: "nh4-to-base",
    prompt: "NH₄⁺ → ?",
    options: ["NH₃", "H₂O", "OH⁻"],
    correctAnswer: "NH₃",
    correctExplanation: "NH₄⁺ loses H⁺ and becomes NH₃.",
  },
  {
    slug: "h2o-to-base",
    prompt: "H₂O → ?",
    options: ["H₃O⁺", "OH⁻", "Cl⁻"],
    correctAnswer: "OH⁻",
    correctExplanation: "H₂O loses H⁺ and becomes its conjugate base, OH⁻.",
  },
];
