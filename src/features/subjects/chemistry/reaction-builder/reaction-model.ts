import type { BondAtomInfo } from "../bond-builder/bond-model";
import { HYDROGEN, SODIUM, CHLORINE } from "../bond-builder/bond-model";
import { OXYGEN } from "../molecule-builder/molecule-model";

export { HYDROGEN, OXYGEN, SODIUM, CHLORINE };

/** Elements used across every reaction in this feature. */
export type ElementSymbol = "H" | "O" | "Na" | "Cl";

export const ATOM_INFO: Record<ElementSymbol, BondAtomInfo> = {
  H: HYDROGEN,
  O: OXYGEN,
  Na: SODIUM,
  Cl: CHLORINE,
};

/**
 * Gradient ids all point at `<defs>` already declared by Bond Builder's
 * `BondDefs` or Molecule Builder's `MoleculeDefs` (both reused as-is by
 * `ReactionStage`) — no new gradients were added for this feature.
 */
export const GRADIENT_ID: Record<ElementSymbol, string> = {
  H: "bond-hydrogen-gradient",
  O: "molecule-oxygen-gradient",
  Na: "bond-sodium-gradient",
  Cl: "bond-chlorine-gradient",
};

/**
 * Six fixed stages, deliberately coarse — this is a conceptual model of
 * "reactants → rearrangement → products", not a physically accurate
 * reaction mechanism (see the note surfaced in the explanation panel).
 */
export type ReactionStep = 1 | 2 | 3 | 4 | 5 | 6;

export const REACTION_STEP_ORDER: ReactionStep[] = [1, 2, 3, 4, 5, 6];

export interface ReactionAtomSpec {
  id: string;
  element: ElementSymbol;
  /** Center position for every step, hand-placed so each stage reads clearly rather than being physically simulated. */
  positions: Record<ReactionStep, { x: number; y: number }>;
}

export interface ReactionBondSpec {
  from: string;
  to: string;
  /** Steps during which this particular bond line is drawn. */
  visibleSteps: ReactionStep[];
}

/** One row of the reactants/products diagram, e.g. "2" + "H₂". */
export interface ReactionMoleculeSummary {
  count: number;
  formula: string;
}

export type ReactionId = "water-formation" | "hydrogen-chloride" | "table-salt";

export interface ReactionConfig {
  id: ReactionId;
  /** Short, friendly name used on the reaction tab. */
  name: string;
  equation: string;
  reactantsFormula: string;
  reactantsLabel: string;
  productsFormula: string;
  productsLabel: string;
  /** Feeds the always-visible reactants/products diagram. */
  reactantsMolecules: ReactionMoleculeSummary[];
  productsMolecules: ReactionMoleculeSummary[];
  atoms: ReactionAtomSpec[];
  bonds: ReactionBondSpec[];
}

const REACTANT_BOND_STEPS: ReactionStep[] = [1, 2];
const PRODUCT_BOND_STEPS: ReactionStep[] = [5, 6];

/**
 * 2H₂ + O₂ → 2H₂O
 *
 * Atom bookkeeping: each water molecule is built from one H taken from
 * each original H₂ pair plus one O from the original O₂ pair, so the
 * animation actually shows atoms mixing into new combinations rather
 * than the two H₂ molecules just relabeling themselves as water.
 */
const WATER_FORMATION: ReactionConfig = {
  id: "water-formation",
  name: "Water",
  equation: "2H₂ + O₂ → 2H₂O",
  reactantsFormula: "2H₂ + O₂",
  reactantsLabel: "Reactants",
  productsFormula: "2H₂O",
  productsLabel: "Products",
  reactantsMolecules: [
    { count: 2, formula: "H₂" },
    { count: 1, formula: "O₂" },
  ],
  productsMolecules: [{ count: 2, formula: "H₂O" }],
  atoms: [
    {
      id: "h1a",
      element: "H",
      positions: {
        1: { x: 110, y: 70 },
        2: { x: 380, y: 120 },
        3: { x: 355, y: 90 },
        4: { x: 370, y: 140 },
        5: { x: 370, y: 140 },
        6: { x: 650, y: 140 },
      },
    },
    {
      id: "h1b",
      element: "H",
      positions: {
        1: { x: 250, y: 70 },
        2: { x: 520, y: 120 },
        3: { x: 545, y: 150 },
        4: { x: 370, y: 280 },
        5: { x: 370, y: 280 },
        6: { x: 650, y: 280 },
      },
    },
    {
      id: "o1a",
      element: "O",
      positions: {
        1: { x: 110, y: 200 },
        2: { x: 380, y: 200 },
        3: { x: 400, y: 205 },
        4: { x: 450, y: 140 },
        5: { x: 450, y: 140 },
        6: { x: 730, y: 140 },
      },
    },
    {
      id: "o1b",
      element: "O",
      positions: {
        1: { x: 250, y: 200 },
        2: { x: 520, y: 200 },
        3: { x: 500, y: 250 },
        4: { x: 450, y: 280 },
        5: { x: 450, y: 280 },
        6: { x: 730, y: 280 },
      },
    },
    {
      id: "h2a",
      element: "H",
      positions: {
        1: { x: 110, y: 330 },
        2: { x: 380, y: 280 },
        3: { x: 360, y: 315 },
        4: { x: 530, y: 140 },
        5: { x: 530, y: 140 },
        6: { x: 810, y: 140 },
      },
    },
    {
      id: "h2b",
      element: "H",
      positions: {
        1: { x: 250, y: 330 },
        2: { x: 520, y: 280 },
        3: { x: 540, y: 270 },
        4: { x: 530, y: 280 },
        5: { x: 530, y: 280 },
        6: { x: 810, y: 280 },
      },
    },
  ],
  bonds: [
    // Reactant bonds: two H–H pairs and one O–O pair, visible while the
    // molecules are still intact (steps 1–2).
    { from: "h1a", to: "h1b", visibleSteps: REACTANT_BOND_STEPS },
    { from: "o1a", to: "o1b", visibleSteps: REACTANT_BOND_STEPS },
    { from: "h2a", to: "h2b", visibleSteps: REACTANT_BOND_STEPS },
    // Product bonds: each water molecule's two new O–H bonds, visible
    // once they form (steps 5–6).
    { from: "h1a", to: "o1a", visibleSteps: PRODUCT_BOND_STEPS },
    { from: "o1a", to: "h2a", visibleSteps: PRODUCT_BOND_STEPS },
    { from: "h1b", to: "o1b", visibleSteps: PRODUCT_BOND_STEPS },
    { from: "o1b", to: "h2b", visibleSteps: PRODUCT_BOND_STEPS },
  ],
};

/**
 * H₂ + Cl₂ → 2HCl
 *
 * The simplest example: one H–H bond and one Cl–Cl bond break, and two
 * new H–Cl bonds form — one atom from each original pair per product
 * molecule, same "mixing" idea as the water reaction above.
 */
const HYDROGEN_CHLORIDE: ReactionConfig = {
  id: "hydrogen-chloride",
  name: "Hydrogen Chloride",
  equation: "H₂ + Cl₂ → 2HCl",
  reactantsFormula: "H₂ + Cl₂",
  reactantsLabel: "Reactants",
  productsFormula: "2HCl",
  productsLabel: "Products",
  reactantsMolecules: [
    { count: 1, formula: "H₂" },
    { count: 1, formula: "Cl₂" },
  ],
  productsMolecules: [{ count: 2, formula: "HCl" }],
  atoms: [
    {
      id: "h1",
      element: "H",
      positions: {
        1: { x: 110, y: 140 },
        2: { x: 380, y: 160 },
        3: { x: 360, y: 140 },
        4: { x: 400, y: 160 },
        5: { x: 400, y: 160 },
        6: { x: 650, y: 160 },
      },
    },
    {
      id: "h2",
      element: "H",
      positions: {
        1: { x: 250, y: 140 },
        2: { x: 520, y: 160 },
        3: { x: 540, y: 180 },
        4: { x: 400, y: 280 },
        5: { x: 400, y: 280 },
        6: { x: 650, y: 280 },
      },
    },
    {
      id: "cl1",
      element: "Cl",
      positions: {
        1: { x: 110, y: 280 },
        2: { x: 380, y: 260 },
        3: { x: 400, y: 260 },
        4: { x: 480, y: 160 },
        5: { x: 480, y: 160 },
        6: { x: 730, y: 160 },
      },
    },
    {
      id: "cl2",
      element: "Cl",
      positions: {
        1: { x: 250, y: 280 },
        2: { x: 520, y: 260 },
        3: { x: 500, y: 300 },
        4: { x: 480, y: 280 },
        5: { x: 480, y: 280 },
        6: { x: 730, y: 280 },
      },
    },
  ],
  bonds: [
    { from: "h1", to: "h2", visibleSteps: REACTANT_BOND_STEPS },
    { from: "cl1", to: "cl2", visibleSteps: REACTANT_BOND_STEPS },
    { from: "h1", to: "cl1", visibleSteps: PRODUCT_BOND_STEPS },
    { from: "h2", to: "cl2", visibleSteps: PRODUCT_BOND_STEPS },
  ],
};

/**
 * 2Na + Cl₂ → 2NaCl
 *
 * Table salt: the two Sodium atoms start out unbonded (metallic sodium
 * is shown here simply as loose atoms, not a molecule), while the
 * Chlorine pair starts bonded. Only the Cl–Cl bond needs to break
 * before two new Na–Cl bonds form.
 */
const TABLE_SALT: ReactionConfig = {
  id: "table-salt",
  name: "Table Salt",
  equation: "2Na + Cl₂ → 2NaCl",
  reactantsFormula: "2Na + Cl₂",
  reactantsLabel: "Reactants",
  productsFormula: "2NaCl",
  productsLabel: "Products",
  reactantsMolecules: [
    { count: 2, formula: "Na" },
    { count: 1, formula: "Cl₂" },
  ],
  productsMolecules: [{ count: 2, formula: "NaCl" }],
  atoms: [
    {
      id: "na1",
      element: "Na",
      positions: {
        1: { x: 110, y: 140 },
        2: { x: 380, y: 160 },
        3: { x: 360, y: 140 },
        4: { x: 400, y: 160 },
        5: { x: 400, y: 160 },
        6: { x: 650, y: 160 },
      },
    },
    {
      id: "na2",
      element: "Na",
      positions: {
        1: { x: 250, y: 140 },
        2: { x: 520, y: 160 },
        3: { x: 540, y: 180 },
        4: { x: 400, y: 280 },
        5: { x: 400, y: 280 },
        6: { x: 650, y: 280 },
      },
    },
    {
      id: "cl1",
      element: "Cl",
      positions: {
        1: { x: 110, y: 280 },
        2: { x: 380, y: 260 },
        3: { x: 400, y: 260 },
        4: { x: 480, y: 160 },
        5: { x: 480, y: 160 },
        6: { x: 730, y: 160 },
      },
    },
    {
      id: "cl2",
      element: "Cl",
      positions: {
        1: { x: 250, y: 280 },
        2: { x: 520, y: 260 },
        3: { x: 500, y: 300 },
        4: { x: 480, y: 280 },
        5: { x: 480, y: 280 },
        6: { x: 730, y: 280 },
      },
    },
  ],
  bonds: [
    // No Na–Na reactant bond — the two Sodium atoms start out loose.
    { from: "cl1", to: "cl2", visibleSteps: REACTANT_BOND_STEPS },
    { from: "na1", to: "cl1", visibleSteps: PRODUCT_BOND_STEPS },
    { from: "na2", to: "cl2", visibleSteps: PRODUCT_BOND_STEPS },
  ],
};

export const REACTIONS: Record<ReactionId, ReactionConfig> = {
  "water-formation": WATER_FORMATION,
  "hydrogen-chloride": HYDROGEN_CHLORIDE,
  "table-salt": TABLE_SALT,
};

export const REACTION_ORDER: ReactionId[] = [
  "water-formation",
  "hydrogen-chloride",
  "table-salt",
];

const STEP_LABEL_MIDDLE: Record<Exclude<ReactionStep, 1 | 6>, string> = {
  2: "Molecules move together…",
  3: "Bonds are breaking…",
  4: "Atoms are rearranging…",
  5: "New bonds are forming…",
};

/** Step label text, built from the reaction's own formulas at the two end steps so it stays correct for every reaction. */
export function getStepLabel(
  reaction: ReactionConfig,
  step: ReactionStep,
): string {
  if (step === 1) return `Reactants: ${reaction.reactantsFormula}`;
  if (step === 6) return `Products: ${reaction.productsFormula}`;
  return STEP_LABEL_MIDDLE[step];
}

export const REACTION_STEP_EXPLANATION: Record<ReactionStep, string> = {
  1: "Reactants are the substances we start with.",
  2: "The reaction begins as molecules move toward each other.",
  3: "Chemical bonds can break during a reaction.",
  4: "Atoms can rearrange into new combinations.",
  5: "New bonds form between the rearranged atoms.",
  6: "Products are the new substances formed.",
};

export const REACTION_GENERAL_NOTE =
  "The number of each type of atom stays the same — atoms are rearranged, not created or destroyed.";

export const REACTION_SCIENCE_NOTE =
  "This is a simplified educational model. It shows reactants turning into products through atom rearrangement — not the exact molecular mechanism of the reaction.";

/** How many atoms of a given element this reaction involves — the same total before and after, since it's the same set of atoms throughout. */
export function countElement(
  reaction: ReactionConfig,
  element: ElementSymbol,
): number {
  return reaction.atoms.filter((a) => a.element === element).length;
}

/** Every element actually used in this reaction, in a stable H/O/Na/Cl order — drives the atom counter so it never shows a stray "0" row for an unused element. */
export function usedElements(reaction: ReactionConfig): ElementSymbol[] {
  const order: ElementSymbol[] = ["H", "O", "Na", "Cl"];
  return order.filter((el) => countElement(reaction, el) > 0);
}
