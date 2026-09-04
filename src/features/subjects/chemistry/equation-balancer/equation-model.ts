/**
 * Data model for the Equation Balancer. Deliberately independent of
 * any particular UI framework — a term is just "a formula and how
 * many atoms of each element are in one molecule of it"; the
 * component layer is responsible for coefficient state, atom-count
 * math, and rendering.
 *
 * Reuses the same four elements Reaction Builder already teaches
 * (H, O, Na, Cl) for its first three equations, then adds two more
 * pairs Bond Builder already introduced (Mg, N) so this doesn't
 * introduce any element the student hasn't already met in Chemistry
 * Batch 1/2/3 — no periodic-table elements are invented just for
 * this feature.
 */

export type ElementSymbol = "H" | "O" | "Na" | "Cl" | "Mg" | "N";

export const ELEMENT_NAME: Record<ElementSymbol, string> = {
  H: "Hydrogen",
  O: "Oxygen",
  Na: "Sodium",
  Cl: "Chlorine",
  Mg: "Magnesium",
  N: "Nitrogen",
};

/** How many atoms of each element are in a single molecule of this formula. */
export interface FormulaComposition {
  element: ElementSymbol;
  atomsPerMolecule: number;
}

export type TermSide = "reactant" | "product";

export interface EquationTerm {
  id: string;
  /** Display formula with unicode subscripts, e.g. "H₂O". Never
   *  changes — only the coefficient in front of it changes, which is
   *  the whole point being taught (coefficients, not subscripts). */
  formula: string;
  side: TermSide;
  composition: FormulaComposition[];
  /** The smallest whole-number coefficient that balances this
   *  equation — used to check the student's answer and to reveal a
   *  fully worked solution if they run out of attempts. */
  correctCoefficient: number;
}

export interface EquationConfig {
  id: string;
  /** Short label for the equation-picker tab. */
  name: string;
  /** One line describing the real reaction, shown above the terms. */
  description: string;
  terms: EquationTerm[];
  /** Progressive hints, revealed one at a time on request. */
  hints: string[];
}

const MAX_COEFFICIENT = 6;

/** 2H₂ + O₂ → 2H₂O — the same water-formation reaction Reaction Builder visualizes in 3D, balanced here in 2D. */
const WATER_FORMATION: EquationConfig = {
  id: "water-formation",
  name: "Water",
  description: "Hydrogen gas burns in oxygen to form water.",
  terms: [
    {
      id: "h2",
      formula: "H₂",
      side: "reactant",
      composition: [{ element: "H", atomsPerMolecule: 2 }],
      correctCoefficient: 2,
    },
    {
      id: "o2",
      formula: "O₂",
      side: "reactant",
      composition: [{ element: "O", atomsPerMolecule: 2 }],
      correctCoefficient: 1,
    },
    {
      id: "h2o",
      formula: "H₂O",
      side: "product",
      composition: [
        { element: "H", atomsPerMolecule: 2 },
        { element: "O", atomsPerMolecule: 1 },
      ],
      correctCoefficient: 2,
    },
  ],
  hints: [
    "Start with the element that appears in the fewest formulas — here, count oxygen atoms first.",
    "One O₂ molecule has 2 oxygen atoms. How many H₂O molecules would you need to also have 2 oxygen atoms on the product side?",
    "Once oxygen balances, check hydrogen last — it often falls into place once every other element is balanced.",
  ],
};

/** H₂ + Cl₂ → 2HCl — every coefficient here is small, good as a first/simplest equation. */
const HYDROGEN_CHLORIDE: EquationConfig = {
  id: "hydrogen-chloride",
  name: "Hydrogen Chloride",
  description: "Hydrogen gas reacts with chlorine gas to form hydrogen chloride.",
  terms: [
    {
      id: "h2",
      formula: "H₂",
      side: "reactant",
      composition: [{ element: "H", atomsPerMolecule: 2 }],
      correctCoefficient: 1,
    },
    {
      id: "cl2",
      formula: "Cl₂",
      side: "reactant",
      composition: [{ element: "Cl", atomsPerMolecule: 2 }],
      correctCoefficient: 1,
    },
    {
      id: "hcl",
      formula: "HCl",
      side: "product",
      composition: [
        { element: "H", atomsPerMolecule: 1 },
        { element: "Cl", atomsPerMolecule: 1 },
      ],
      correctCoefficient: 2,
    },
  ],
  hints: [
    "Both reactants already start as 2-atom molecules — how many single HCl molecules would use up both?",
    "There are 2 hydrogen atoms and 2 chlorine atoms on the left. HCl has 1 of each — how many HCl molecules match that?",
  ],
};

/** 2Na + Cl₂ → 2NaCl — sodium starts as loose atoms (coefficient only, no subscript to confuse it with). */
const TABLE_SALT: EquationConfig = {
  id: "table-salt",
  name: "Table Salt",
  description: "Solid sodium reacts with chlorine gas to form table salt.",
  terms: [
    {
      id: "na",
      formula: "Na",
      side: "reactant",
      composition: [{ element: "Na", atomsPerMolecule: 1 }],
      correctCoefficient: 2,
    },
    {
      id: "cl2",
      formula: "Cl₂",
      side: "reactant",
      composition: [{ element: "Cl", atomsPerMolecule: 2 }],
      correctCoefficient: 1,
    },
    {
      id: "nacl",
      formula: "NaCl",
      side: "product",
      composition: [
        { element: "Na", atomsPerMolecule: 1 },
        { element: "Cl", atomsPerMolecule: 1 },
      ],
      correctCoefficient: 2,
    },
  ],
  hints: [
    "Cl₂ brings 2 chlorine atoms every time — how many NaCl molecules would you need to use both of them?",
    "Once you've fixed NaCl's coefficient for chlorine, sodium has to match it exactly — NaCl only has 1 Na each.",
  ],
};

/** 2Mg + O₂ → 2MgO — reuses the Mg+O pair from Bond Builder's ionic mode. */
const MAGNESIUM_OXIDE: EquationConfig = {
  id: "magnesium-oxide",
  name: "Magnesium Oxide",
  description: "Magnesium metal burns in oxygen to form magnesium oxide.",
  terms: [
    {
      id: "mg",
      formula: "Mg",
      side: "reactant",
      composition: [{ element: "Mg", atomsPerMolecule: 1 }],
      correctCoefficient: 2,
    },
    {
      id: "o2",
      formula: "O₂",
      side: "reactant",
      composition: [{ element: "O", atomsPerMolecule: 2 }],
      correctCoefficient: 1,
    },
    {
      id: "mgo",
      formula: "MgO",
      side: "product",
      composition: [
        { element: "Mg", atomsPerMolecule: 1 },
        { element: "O", atomsPerMolecule: 1 },
      ],
      correctCoefficient: 2,
    },
  ],
  hints: [
    "O₂ supplies 2 oxygen atoms — how many MgO molecules would use both?",
    "MgO has exactly 1 magnesium per molecule, so magnesium's coefficient has to match oxygen's once oxygen is settled.",
  ],
};

/** N₂ + 3H₂ → 2NH₃ — the classic three-term equation with a coefficient greater than 2, using Bond Builder's N₂ pair. */
const AMMONIA_SYNTHESIS: EquationConfig = {
  id: "ammonia-synthesis",
  name: "Ammonia",
  description: "Nitrogen gas and hydrogen gas combine to form ammonia — the industrial Haber process.",
  terms: [
    {
      id: "n2",
      formula: "N₂",
      side: "reactant",
      composition: [{ element: "N", atomsPerMolecule: 2 }],
      correctCoefficient: 1,
    },
    {
      id: "h2",
      formula: "H₂",
      side: "reactant",
      composition: [{ element: "H", atomsPerMolecule: 2 }],
      correctCoefficient: 3,
    },
    {
      id: "nh3",
      formula: "NH₃",
      side: "product",
      composition: [
        { element: "N", atomsPerMolecule: 1 },
        { element: "H", atomsPerMolecule: 3 },
      ],
      correctCoefficient: 2,
    },
  ],
  hints: [
    "Balance nitrogen first: N₂ has 2 nitrogen atoms, and NH₃ has only 1 — how many NH₃ molecules match N₂'s 2 atoms?",
    "With NH₃'s coefficient set, count how many hydrogen atoms that gives you on the product side — that total is what H₂ has to supply.",
    "H₂ supplies 2 hydrogen atoms per molecule. Divide the hydrogen total you need by 2 to get H₂'s coefficient.",
  ],
};

/** 2H₂O₂ → 2H₂O + O₂ — a decomposition equation (one reactant, two products), so balancing isn't always "combine two things into one". */
const HYDROGEN_PEROXIDE_DECOMPOSITION: EquationConfig = {
  id: "hydrogen-peroxide-decomposition",
  name: "Peroxide Breakdown",
  description: "Hydrogen peroxide slowly decomposes into water and oxygen gas.",
  terms: [
    {
      id: "h2o2",
      formula: "H₂O₂",
      side: "reactant",
      composition: [
        { element: "H", atomsPerMolecule: 2 },
        { element: "O", atomsPerMolecule: 2 },
      ],
      correctCoefficient: 2,
    },
    {
      id: "h2o",
      formula: "H₂O",
      side: "product",
      composition: [
        { element: "H", atomsPerMolecule: 2 },
        { element: "O", atomsPerMolecule: 1 },
      ],
      correctCoefficient: 2,
    },
    {
      id: "o2",
      formula: "O₂",
      side: "product",
      composition: [{ element: "O", atomsPerMolecule: 2 }],
      correctCoefficient: 1,
    },
  ],
  hints: [
    "This is a decomposition — one reactant breaks into two products. Balance hydrogen first: H₂O₂ and H₂O both have 2 H atoms each, so their coefficients have to match.",
    "Once H₂O₂ and H₂O share the same coefficient, count total oxygen atoms on the left and see how much is left over for O₂ on the right.",
  ],
};

export const EQUATIONS: Record<string, EquationConfig> = {
  "water-formation": WATER_FORMATION,
  "hydrogen-chloride": HYDROGEN_CHLORIDE,
  "table-salt": TABLE_SALT,
  "magnesium-oxide": MAGNESIUM_OXIDE,
  "ammonia-synthesis": AMMONIA_SYNTHESIS,
  "hydrogen-peroxide-decomposition": HYDROGEN_PEROXIDE_DECOMPOSITION,
};

export const EQUATION_ORDER: string[] = [
  "water-formation",
  "hydrogen-chloride",
  "table-salt",
  "magnesium-oxide",
  "ammonia-synthesis",
  "hydrogen-peroxide-decomposition",
];

export { MAX_COEFFICIENT };

/** Every element used by this equation, in a stable order — drives the atom-count table so it never shows a stray row for an unused element. */
export function usedElements(equation: EquationConfig): ElementSymbol[] {
  const order: ElementSymbol[] = ["H", "O", "Na", "Cl", "Mg", "N"];
  const present = new Set<ElementSymbol>();
  for (const term of equation.terms) {
    for (const c of term.composition) present.add(c.element);
  }
  return order.filter((el) => present.has(el));
}

/** Total atoms of `element` on `side`, given the current coefficients (keyed by term id). */
export function countAtoms(
  equation: EquationConfig,
  element: ElementSymbol,
  side: TermSide,
  coefficients: Record<string, number>,
): number {
  return equation.terms
    .filter((t) => t.side === side)
    .reduce((total, term) => {
      const coeff = coefficients[term.id] ?? 1;
      const perMolecule = term.composition.find((c) => c.element === element)?.atomsPerMolecule ?? 0;
      return total + coeff * perMolecule;
    }, 0);
}

/** Whether every element's reactant/product totals match under the current coefficients. */
export function isBalanced(equation: EquationConfig, coefficients: Record<string, number>): boolean {
  return usedElements(equation).every(
    (el) => countAtoms(equation, el, "reactant", coefficients) === countAtoms(equation, el, "product", coefficients),
  );
}

/** Whether the student's coefficients exactly match the (unique, smallest whole-number) intended solution. */
export function isSolved(equation: EquationConfig, coefficients: Record<string, number>): boolean {
  return equation.terms.every((t) => (coefficients[t.id] ?? 1) === t.correctCoefficient);
}

export function initialCoefficients(equation: EquationConfig): Record<string, number> {
  return Object.fromEntries(equation.terms.map((t) => [t.id, 1]));
}

export function correctCoefficients(equation: EquationConfig): Record<string, number> {
  return Object.fromEntries(equation.terms.map((t) => [t.id, t.correctCoefficient]));
}
