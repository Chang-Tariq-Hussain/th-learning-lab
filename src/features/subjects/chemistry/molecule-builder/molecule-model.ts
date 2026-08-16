import type { BondAtomInfo } from "../bond-builder/bond-model";
import { HYDROGEN } from "../bond-builder/bond-model";

export type MoleculeId = "h2" | "h2o" | "co2";

/** 1: atoms separate → 2: atoms move closer → 3: bonds form → 4: final molecule label shown. */
export type BuildStep = 1 | 2 | 3 | 4;

export const OXYGEN: BondAtomInfo = {
  symbol: "O",
  name: "Oxygen",
  protons: 8,
  electrons: 8,
  valenceElectrons: 6,
};

export const CARBON: BondAtomInfo = {
  symbol: "C",
  name: "Carbon",
  protons: 6,
  electrons: 6,
  valenceElectrons: 4,
};

export { HYDROGEN };

export type ElementSymbol = "H" | "O" | "C";

export const ATOM_INFO: Record<ElementSymbol, BondAtomInfo> = {
  H: HYDROGEN,
  O: OXYGEN,
  C: CARBON,
};

export const GRADIENT_ID: Record<ElementSymbol, string> = {
  H: "bond-hydrogen-gradient", // reused as-is from Bond Builder's shared defs
  O: "molecule-oxygen-gradient",
  C: "molecule-carbon-gradient",
};

export interface MoleculeAtomSpec {
  id: string;
  element: ElementSymbol;
  /** Center x once bonded (step ≥ 2). y is always ATOM_Y — every molecule here is drawn as a flat left-to-right chain, matching the "H — O — H" / "O = C = O" style formulas rather than true molecular geometry. */
  closeX: number;
  /** Center x while still separate (step 1). */
  separateX: number;
}

export interface MoleculeBondSpec {
  from: string;
  to: string;
  order: 1 | 2;
}

export interface MoleculeConfig {
  id: MoleculeId;
  formula: string;
  name: string;
  tabLabel: string;
  actionLabel: string;
  atoms: MoleculeAtomSpec[];
  bonds: MoleculeBondSpec[];
  formulaDisplay: string;
  caption: string;
  explanation: string;
}

export const MOLECULES: Record<MoleculeId, MoleculeConfig> = {
  h2: {
    id: "h2",
    formula: "H₂",
    name: "Hydrogen",
    tabLabel: "H₂",
    actionLabel: "Join Atoms",
    atoms: [
      { id: "h1", element: "H", closeX: 280, separateX: 160 },
      { id: "h2", element: "H", closeX: 420, separateX: 540 },
    ],
    bonds: [{ from: "h1", to: "h2", order: 1 }],
    formulaDisplay: "H — H",
    caption: "Hydrogen molecule formed.",
    explanation:
      "A molecule is made when two or more atoms are chemically bonded.",
  },
  h2o: {
    id: "h2o",
    formula: "H₂O",
    name: "Water",
    tabLabel: "H₂O",
    actionLabel: "Build Water",
    atoms: [
      { id: "h1", element: "H", closeX: 210, separateX: 90 },
      { id: "o", element: "O", closeX: 350, separateX: 350 },
      { id: "h2", element: "H", closeX: 490, separateX: 610 },
    ],
    bonds: [
      { from: "h1", to: "o", order: 1 },
      { from: "o", to: "h2", order: 1 },
    ],
    formulaDisplay: "H — O — H",
    caption: "H₂O — Water",
    explanation: "Water contains two Hydrogen atoms and one Oxygen atom.",
  },
  co2: {
    id: "co2",
    formula: "CO₂",
    name: "Carbon Dioxide",
    tabLabel: "CO₂",
    actionLabel: "Build Carbon Dioxide",
    atoms: [
      { id: "o1", element: "O", closeX: 210, separateX: 90 },
      { id: "c", element: "C", closeX: 350, separateX: 350 },
      { id: "o2", element: "O", closeX: 490, separateX: 610 },
    ],
    bonds: [
      { from: "o1", to: "c", order: 2 },
      { from: "c", to: "o2", order: 2 },
    ],
    formulaDisplay: "O = C = O",
    caption: "CO₂ — Carbon Dioxide",
    explanation:
      "Carbon dioxide contains one Carbon atom and two Oxygen atoms.",
  },
};

export const MOLECULE_ORDER: MoleculeId[] = ["h2", "h2o", "co2"];

export const STEP_STATUS: Record<BuildStep, string> = {
  1: "Atoms are separate.",
  2: "Atoms are moving closer…",
  3: "Bonds are forming…",
  4: "Molecule complete!",
};

/** How many of a given element appear in a molecule — used for the short atom-info popup ("1 oxygen atom"). */
export function countElement(
  molecule: MoleculeConfig,
  element: ElementSymbol,
): number {
  return molecule.atoms.filter((a) => a.element === element).length;
}

export const GENERAL_EXPLANATION =
  "Atoms can form different molecules by joining in different combinations.";
