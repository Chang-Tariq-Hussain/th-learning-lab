import type { LewisReactionSlug } from "./types";

/**
 * Lewis Acid–Base Theory — data model.
 *
 * One shared 5-step "before → highlight lone pair → transfer →
 * bond forms → explain" sequence, replayed against two reactions.
 * Same "single stepIndex, timer-driven Start, manual Next Step"
 * pattern used by Brønsted–Lowry — the mechanics never change, only
 * which molecule is playing donor/acceptor does.
 */

export const ACID_COLOR = "#E0663D";
export const BASE_COLOR = "#3D6FE0";
export const ELECTRON_PAIR_COLOR = "#C99A2E";

export interface StepText {
  what: string;
  why: string;
}

export interface ReactionSide {
  formula: string;
  /** Whether this side donates or accepts the electron pair — drives color, the Lewis Acid/Base tag, and which way the electron-pair chip travels. */
  role: "acid" | "base";
}

export interface LewisReaction {
  slug: LewisReactionSlug;
  label: string;
  equation: string;
  left: ReactionSide;
  right: ReactionSide;
  bondCaption: string;
  steps: StepText[];
}

export const REACTIONS: LewisReaction[] = [
  {
    slug: "nh3-bf3",
    label: "NH₃ + BF₃",
    equation: "NH₃ + BF₃ → NH₃→BF₃",
    left: { formula: "NH₃", role: "base" },
    right: { formula: "BF₃", role: "acid" },
    bondCaption: "Coordinate bond formed: NH₃→BF₃",
    steps: [
      {
        what: "NH₃ and BF₃ are shown separately, unreacted.",
        why: "Before anything happens, we just have the two starting molecules side by side.",
      },
      {
        what: "The lone pair of electrons on nitrogen is highlighted.",
        why: "A Lewis base is defined by what it's able to donate — a pair of electrons.",
      },
      {
        what: "The electron pair moves from N across to boron.",
        why: "This electron-pair donation is the entire reaction — nothing else about the atoms changes.",
      },
      {
        what: "N and B are now joined by a new coordinate covalent bond.",
        why: "Both electrons in the new bond came from nitrogen — boron accepted them.",
      },
      {
        what: "NH₃ donated the electron pair, so it acted as the Lewis base. BF₃ accepted it, so it acted as the Lewis acid.",
        why: "Lewis base = electron-pair donor. Lewis acid = electron-pair acceptor. That's the whole Lewis definition.",
      },
    ],
  },
  {
    slug: "h-nh3",
    label: "H⁺ + NH₃",
    equation: "H⁺ + NH₃ → NH₄⁺",
    left: { formula: "H⁺", role: "acid" },
    right: { formula: "NH₃", role: "base" },
    bondCaption: "Coordinate bond formed: NH₃ + H⁺ → NH₄⁺",
    steps: [
      {
        what: "H⁺ and NH₃ are shown separately, unreacted.",
        why: "Same starting point as before — two species, nothing has happened yet.",
      },
      {
        what: "The lone pair of electrons on nitrogen is highlighted.",
        why: "NH₃ still has a lone pair available to donate, just like in the first example.",
      },
      {
        what: "The electron pair moves from N across to H⁺.",
        why: "H⁺ has no electrons of its own to offer, so it needs a pair donated to it.",
      },
      {
        what: "N and H are now joined by a new coordinate covalent bond.",
        why: "NH₃ has become NH₄⁺ — nitrogen now shares its lone pair with the proton.",
      },
      {
        what: "NH₃ donated the electron pair, so it acted as the Lewis base. H⁺ accepted it, so it acted as the Lewis acid.",
        why: "Same definition as before — what matters is who gives the electron pair and who receives it.",
      },
    ],
  },
];

export const LAST_STEP_INDEX = 4;
export const STEP_ADVANCE_MS = 2400;

export function getReaction(slug: LewisReactionSlug): LewisReaction {
  return REACTIONS.find((r) => r.slug === slug) ?? REACTIONS[0]!;
}

export const THEORY_COMPARISON = [
  { name: "Arrhenius", acid: "Increases H⁺ in water", base: "Increases OH⁻ in water" },
  { name: "Brønsted–Lowry", acid: "Proton donor", base: "Proton acceptor" },
  { name: "Lewis", acid: "Electron-pair acceptor", base: "Electron-pair donor" },
] as const;

export interface PracticeQuestion {
  prompt: string;
  question: string;
  options: readonly [string, string];
  correctAnswer: string;
  correctExplanation: string;
  incorrectExplanation: string;
}

/** Small "Which is the Lewis acid/base?" activities — 2 questions, immediate feedback, no scoring. */
export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    prompt: "NH₃ + BF₃",
    question: "Which is the Lewis base?",
    options: ["NH₃", "BF₃"],
    correctAnswer: "NH₃",
    correctExplanation: "NH₃ donates an electron pair, so it's the Lewis base.",
    incorrectExplanation: "Try again. Look for the molecule that donates its electron pair.",
  },
  {
    prompt: "H⁺ + NH₃",
    question: "Which is the Lewis acid?",
    options: ["H⁺", "NH₃"],
    correctAnswer: "H⁺",
    correctExplanation: "H⁺ accepts the electron pair from NH₃, so it's the Lewis acid.",
    incorrectExplanation: "Try again. Look for the species that accepts the electron pair.",
  },
];
