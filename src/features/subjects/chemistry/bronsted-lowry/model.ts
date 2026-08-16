import type { ReactionSlug } from "./types";

/**
 * Brønsted–Lowry Theory — data model.
 *
 * One shared 5-step "before → highlight → transfer → after → explain"
 * sequence, replayed against two reactions. The mechanics (a proton
 * moving from a donor to an acceptor) never change — only which
 * molecule is playing donor/acceptor does, which is exactly the
 * point the second example makes (water can be either).
 */

export const ACID_COLOR = "#E0663D";
export const BASE_COLOR = "#3D6FE0";
export const PROTON_COLOR = "#C99A2E";

export interface StepText {
  what: string;
  why: string;
}

export interface ReactionSide {
  formula: string;
  /** Whether this side donates or accepts the proton — drives color, the Acid/Base tag, and which way the H⁺ chip travels. */
  role: "acid" | "base";
  /** What this side becomes once the proton has moved. */
  product: string;
}

export interface Reaction {
  slug: ReactionSlug;
  label: string;
  equation: string;
  arrow: "→" | "⇌";
  left: ReactionSide;
  right: ReactionSide;
  steps: StepText[];
}

export const REACTIONS: Reaction[] = [
  {
    slug: "hcl-water",
    label: "HCl + H₂O",
    equation: "HCl + H₂O → H₃O⁺ + Cl⁻",
    arrow: "→",
    left: { formula: "HCl", role: "acid", product: "Cl⁻" },
    right: { formula: "H₂O", role: "base", product: "H₃O⁺" },
    steps: [
      {
        what: "HCl and water are both present, unreacted.",
        why: "Before anything happens, we just have the two starting molecules side by side.",
      },
      {
        what: "HCl carries a proton (H⁺) that it's about to give away.",
        why: "A Brønsted–Lowry acid is defined by what it's able to donate — its proton.",
      },
      {
        what: "The H⁺ moves from HCl across to the water molecule.",
        why: "This proton transfer is the entire reaction — nothing else about the atoms changes.",
      },
      {
        what: "HCl has become Cl⁻, and H₂O has become H₃O⁺.",
        why: "Losing H⁺ leaves Cl⁻ behind; gaining H⁺ turns H₂O into H₃O⁺.",
      },
      {
        what: "HCl donated the proton, so it acted as the acid. H₂O accepted it, so it acted as the base.",
        why: "Acid = proton donor. Base = proton acceptor. That's the whole Brønsted–Lowry definition.",
      },
    ],
  },
  {
    slug: "ammonia-water",
    label: "NH₃ + H₂O",
    equation: "NH₃ + H₂O ⇌ NH₄⁺ + OH⁻",
    arrow: "⇌",
    left: { formula: "NH₃", role: "base", product: "NH₄⁺" },
    right: { formula: "H₂O", role: "acid", product: "OH⁻" },
    steps: [
      {
        what: "Ammonia and water are both present, unreacted.",
        why: "Same starting point as before — two molecules, nothing has happened yet.",
      },
      {
        what: "This time, water carries the proton it's about to give away.",
        why: "Water can act as an acid here — the same molecule that was a base in the last example.",
      },
      {
        what: "The H⁺ moves from H₂O across to the ammonia molecule.",
        why: "Same mechanism as before, just running in the other direction between different molecules.",
      },
      {
        what: "H₂O has become OH⁻, and NH₃ has become NH₄⁺.",
        why: "Losing H⁺ leaves OH⁻ behind; gaining H⁺ turns NH₃ into NH₄⁺.",
      },
      {
        what: "H₂O donated the proton, so it acted as the acid. NH₃ accepted it, so it acted as the base.",
        why: "Water isn't always a base — here it's the acid. What matters is which way the proton moves.",
      },
    ],
  },
];

export const LAST_STEP_INDEX = 4;
export const STEP_ADVANCE_MS = 2400;

export function getReaction(slug: ReactionSlug): Reaction {
  return REACTIONS.find((r) => r.slug === slug) ?? REACTIONS[0]!;
}

export const ARRHENIUS_CONNECTION = {
  arrhenius: "Arrhenius theory focuses on H⁺ and OH⁻ produced in water.",
  bronstedLowry: "Brønsted–Lowry theory focuses on proton transfer.",
};

/** The small "Who donates the proton?" challenge, using the ammonia/water reaction. */
export const CHALLENGE = {
  prompt: "NH₃ + H₂O",
  question: "Who donates the proton?",
  options: ["NH₃", "H₂O"] as const,
  correctAnswer: "H₂O",
  correctExplanation: "H₂O donates H⁺, so it acts as the Brønsted–Lowry acid.",
  incorrectExplanation: "Try again. Look for the molecule that gives away H⁺.",
};
