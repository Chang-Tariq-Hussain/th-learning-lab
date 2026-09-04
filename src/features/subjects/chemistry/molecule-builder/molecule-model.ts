import type { BondAtomInfo } from "../bond-builder/bond-model";
import { HYDROGEN } from "../bond-builder/bond-model";

/**
 * Molecule Builder (3D) — every molecule is defined by real 3D atom
 * positions rather than a flat left-to-right chain, so the shapes below
 * are actual VSEPR geometry (a bent H2O really is bent at ~104.5°, a
 * tetrahedral CH4 really has 109.5° angles between every pair of bonds),
 * not just a formula drawn in atom order. Positions are in arbitrary
 * scene units centered on the molecule's "central" atom (or the
 * midpoint, for a symmetric diatomic like H2) so the 3D scene never has
 * to re-derive geometry from the formula.
 */

export type MoleculeId = "h2" | "h2o" | "co2" | "bf3" | "ch4";

export type ElementSymbol = "H" | "O" | "C" | "N" | "B" | "F";

export type VseprGeometry =
  | "linear"
  | "bent"
  | "trigonal-planar"
  | "tetrahedral";

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

export const NITROGEN: BondAtomInfo = {
  symbol: "N",
  name: "Nitrogen",
  protons: 7,
  electrons: 7,
  valenceElectrons: 5,
};

export const BORON: BondAtomInfo = {
  symbol: "B",
  name: "Boron",
  protons: 5,
  electrons: 5,
  valenceElectrons: 3,
};

export const FLUORINE: BondAtomInfo = {
  symbol: "F",
  name: "Fluorine",
  protons: 9,
  electrons: 9,
  valenceElectrons: 7,
};

export { HYDROGEN };

export const ATOM_INFO: Record<ElementSymbol, BondAtomInfo> = {
  H: HYDROGEN,
  O: OXYGEN,
  C: CARBON,
  N: NITROGEN,
  B: BORON,
  F: FLUORINE,
};

/**
 * Rendering-only constants: a base sphere radius (relative, not literal
 * picometers — chosen for legible scenes, not scientific scale) and a
 * per-element color used by the sphere material. Kept close to the
 * existing Bond Builder / Build an Atom palette (H is the same blue,
 * O/C reuse the hues from `MoleculeDefs`) so this feature still reads
 * as part of the same visual family; new elements get their own
 * distinct hues rather than reusing Chlorine's green.
 */
export const ELEMENT_RADIUS: Record<ElementSymbol, number> = {
  H: 0.3,
  O: 0.44,
  C: 0.46,
  N: 0.44,
  B: 0.42,
  F: 0.36,
};

export const ELEMENT_COLOR: Record<ElementSymbol, string> = {
  H: "#6C8CFF",
  O: "#FF6B5E",
  C: "#6B7280",
  N: "#8B7CF6",
  B: "#FFB176",
  F: "#5EEAD4",
};

export interface MoleculeAtomSpec {
  id: string;
  element: ElementSymbol;
  /** Position in scene units. The central atom (or, for H2, either atom) sits at/near the origin. */
  position: readonly [number, number, number];
  /** The atom VSEPR geometry is built around — used for labeling and camera framing, not just cosmetics. */
  role: "central" | "terminal";
}

export interface MoleculeBondSpec {
  /** Stable id for this bond, unique within its molecule — lets the
   *  bond be selected/inspected the same way an atom is (see
   *  `selectedBondId` in `molecule-builder.tsx`), rather than only
   *  being identifiable by its endpoint pair. */
  id: string;
  from: string;
  to: string;
  order: 1 | 2 | 3;
}

export interface MoleculeConfig {
  id: MoleculeId;
  formula: string;
  name: string;
  tabLabel: string;
  atoms: MoleculeAtomSpec[];
  bonds: MoleculeBondSpec[];
  geometry: VseprGeometry;
  geometryName: string;
  /** Approximate bond angle in degrees, shown alongside the geometry name. Omitted for the diatomic H2, which has no angle. */
  bondAngle: number | null;
  electronGroups: number;
  lonePairsOnCentral: number;
  explanation: string;
  geometryExplanation: string;
}

const TETRA_A = 1 / Math.sqrt(3);

export const MOLECULES: Record<MoleculeId, MoleculeConfig> = {
  h2: {
    id: "h2",
    formula: "H₂",
    name: "Hydrogen",
    tabLabel: "H₂",
    atoms: [
      { id: "h1", element: "H", position: [-0.55, 0, 0], role: "terminal" },
      { id: "h2", element: "H", position: [0.55, 0, 0], role: "terminal" },
    ],
    bonds: [{ id: "h1-h2", from: "h1", to: "h2", order: 1 }],
    geometry: "linear",
    geometryName: "Linear",
    bondAngle: null,
    electronGroups: 1,
    lonePairsOnCentral: 0,
    explanation:
      "Two hydrogen atoms share one pair of electrons, forming a single covalent bond.",
    geometryExplanation:
      "With only two atoms, there's no angle to speak of — the molecule is simply a straight line between them.",
  },
  h2o: {
    id: "h2o",
    formula: "H₂O",
    name: "Water",
    tabLabel: "H₂O",
    atoms: [
      { id: "o", element: "O", position: [0, 0, 0], role: "central" },
      {
        id: "h1",
        element: "H",
        position: [
          1.25 * Math.sin((52.25 * Math.PI) / 180),
          -1.25 * Math.cos((52.25 * Math.PI) / 180),
          0,
        ],
        role: "terminal",
      },
      {
        id: "h2",
        element: "H",
        position: [
          -1.25 * Math.sin((52.25 * Math.PI) / 180),
          -1.25 * Math.cos((52.25 * Math.PI) / 180),
          0,
        ],
        role: "terminal",
      },
    ],
    bonds: [
      { id: "o-h1", from: "o", to: "h1", order: 1 },
      { id: "o-h2", from: "o", to: "h2", order: 1 },
    ],
    geometry: "bent",
    geometryName: "Bent",
    bondAngle: 104.5,
    electronGroups: 4,
    lonePairsOnCentral: 2,
    explanation:
      "Oxygen shares one electron pair with each hydrogen atom, forming two single covalent bonds.",
    geometryExplanation:
      "Oxygen has four electron groups around it — two bonds and two lone pairs. All four push apart toward a tetrahedral arrangement, but only the two bonds are visible as the molecule's shape, so it reads as bent rather than straight. The extra push from the lone pairs also squeezes the H–O–H angle down from 109.5° to about 104.5°.",
  },
  co2: {
    id: "co2",
    formula: "CO₂",
    name: "Carbon Dioxide",
    tabLabel: "CO₂",
    atoms: [
      { id: "c", element: "C", position: [0, 0, 0], role: "central" },
      { id: "o1", element: "O", position: [1.4, 0, 0], role: "terminal" },
      { id: "o2", element: "O", position: [-1.4, 0, 0], role: "terminal" },
    ],
    bonds: [
      { id: "c-o1", from: "c", to: "o1", order: 2 },
      { id: "c-o2", from: "c", to: "o2", order: 2 },
    ],
    geometry: "linear",
    geometryName: "Linear",
    bondAngle: 180,
    electronGroups: 2,
    lonePairsOnCentral: 0,
    explanation:
      "Carbon shares two electron pairs with each oxygen atom, forming two double covalent bonds.",
    geometryExplanation:
      "Carbon has only two electron groups (the two double bonds) and no lone pairs, so they push as far apart as possible — directly opposite each other — giving a straight, 180° molecule.",
  },
  bf3: {
    id: "bf3",
    formula: "BF₃",
    name: "Boron Trifluoride",
    tabLabel: "BF₃",
    atoms: [
      { id: "b", element: "B", position: [0, 0, 0], role: "central" },
      { id: "f1", element: "F", position: [1.5, 0, 0], role: "terminal" },
      {
        id: "f2",
        element: "F",
        position: [
          1.5 * Math.cos((120 * Math.PI) / 180),
          1.5 * Math.sin((120 * Math.PI) / 180),
          0,
        ],
        role: "terminal",
      },
      {
        id: "f3",
        element: "F",
        position: [
          1.5 * Math.cos((240 * Math.PI) / 180),
          1.5 * Math.sin((240 * Math.PI) / 180),
          0,
        ],
        role: "terminal",
      },
    ],
    bonds: [
      { id: "b-f1", from: "b", to: "f1", order: 1 },
      { id: "b-f2", from: "b", to: "f2", order: 1 },
      { id: "b-f3", from: "b", to: "f3", order: 1 },
    ],
    geometry: "trigonal-planar",
    geometryName: "Trigonal Planar",
    bondAngle: 120,
    electronGroups: 3,
    lonePairsOnCentral: 0,
    explanation:
      "Boron shares one electron pair with each fluorine atom, forming three single covalent bonds.",
    geometryExplanation:
      "Boron has three electron groups and no lone pairs, so they spread out evenly in a flat plane, as far apart as possible — 120° between every pair — giving a flat, triangular shape.",
  },
  ch4: {
    id: "ch4",
    formula: "CH₄",
    name: "Methane",
    tabLabel: "CH₄",
    atoms: [
      { id: "c", element: "C", position: [0, 0, 0], role: "central" },
      {
        id: "h1",
        element: "H",
        position: [1.3 * TETRA_A, 1.3 * TETRA_A, 1.3 * TETRA_A],
        role: "terminal",
      },
      {
        id: "h2",
        element: "H",
        position: [1.3 * TETRA_A, -1.3 * TETRA_A, -1.3 * TETRA_A],
        role: "terminal",
      },
      {
        id: "h3",
        element: "H",
        position: [-1.3 * TETRA_A, 1.3 * TETRA_A, -1.3 * TETRA_A],
        role: "terminal",
      },
      {
        id: "h4",
        element: "H",
        position: [-1.3 * TETRA_A, -1.3 * TETRA_A, 1.3 * TETRA_A],
        role: "terminal",
      },
    ],
    bonds: [
      { id: "c-h1", from: "c", to: "h1", order: 1 },
      { id: "c-h2", from: "c", to: "h2", order: 1 },
      { id: "c-h3", from: "c", to: "h3", order: 1 },
      { id: "c-h4", from: "c", to: "h4", order: 1 },
    ],
    geometry: "tetrahedral",
    geometryName: "Tetrahedral",
    bondAngle: 109.5,
    electronGroups: 4,
    lonePairsOnCentral: 0,
    explanation:
      "Carbon shares one electron pair with each hydrogen atom, forming four single covalent bonds.",
    geometryExplanation:
      "Carbon has four electron groups and no lone pairs, so they spread out into three dimensions as far apart as possible — a tetrahedron — giving 109.5° between every pair of bonds. This is the one shape here that a flat drawing can't represent honestly; you have to rotate it to see why.",
  },
};

export const MOLECULE_ORDER: MoleculeId[] = ["h2", "h2o", "co2", "bf3", "ch4"];

const ELEMENT_LABEL: Record<ElementSymbol, string> = {
  H: "hydrogen",
  O: "oxygen",
  C: "carbon",
  N: "nitrogen",
  B: "boron",
  F: "fluorine",
};

export function elementLabel(element: ElementSymbol): string {
  return ELEMENT_LABEL[element];
}

/** How many of a given element appear in a molecule — used for the atom-info popup ("2 hydrogen atoms"). */
export function countElement(
  molecule: MoleculeConfig,
  element: ElementSymbol,
): number {
  return molecule.atoms.filter((a) => a.element === element).length;
}

const BOND_ORDER_NAME: Record<1 | 2 | 3, string> = {
  1: "Single",
  2: "Double",
  3: "Triple",
};

const BOND_ORDER_PAIR_WORD: Record<1 | 2 | 3, string> = {
  1: "one shared pair of electrons",
  2: "two shared pairs of electrons",
  3: "three shared pairs of electrons",
};

/** Every bond in every molecule here is covalent (electrons shared,
 *  not transferred) — the ionic case lives in Bond Builder. Kept as a
 *  named constant, rather than inlined, so the bond panel and any
 *  future ionic molecule both read from one source of truth. */
export const MOLECULE_BOND_KIND = "Covalent Bond";

export function bondOrderName(order: 1 | 2 | 3): string {
  return BOND_ORDER_NAME[order];
}

/** Looks up one bond by id within a molecule — the lookup the bond
 *  detail panel and scene highlighting are built on. */
export function findBond(
  molecule: MoleculeConfig,
  bondId: string,
): MoleculeBondSpec | null {
  return molecule.bonds.find((b) => b.id === bondId) ?? null;
}

export interface BondDescription {
  kind: string;
  orderName: string;
  order: 1 | 2 | 3;
  fromLabel: string;
  toLabel: string;
  /** e.g. "Carbon — Oxygen" */
  pairLabel: string;
  explanation: string;
}

/** The element-level core of `describeBond` — takes the two elements
 *  and an order directly rather than a `MoleculeConfig`/`MoleculeBondSpec`
 *  pair, so it's equally usable for a preset molecule's fixed bonds and
 *  for a freshly-created bond in the free-build lab (`build-model.ts`),
 *  which has no `MoleculeConfig` to look atoms up in. */
export function describeBondBetweenElements(
  fromElement: ElementSymbol,
  toElement: ElementSymbol,
  order: 1 | 2 | 3,
): BondDescription {
  const fromLabel = elementLabel(fromElement);
  const toLabel = elementLabel(toElement);
  const fromName = fromLabel.charAt(0).toUpperCase() + fromLabel.slice(1);
  const toName = toLabel.charAt(0).toUpperCase() + toLabel.slice(1);

  return {
    kind: MOLECULE_BOND_KIND,
    orderName: BOND_ORDER_NAME[order],
    order,
    fromLabel: fromName,
    toLabel: toName,
    pairLabel: `${fromName} — ${toName}`,
    explanation: `${fromName} and ${toName} share ${BOND_ORDER_PAIR_WORD[order]}, holding the two atoms together.`,
  };
}

/** Turns a raw `MoleculeBondSpec` into the plain-language description
 *  the bond detail panel shows: which elements it connects, how many
 *  electron pairs are shared, and why that's what "double"/"triple"
 *  means (not just a cosmetic count of cylinders). */
export function describeBond(
  molecule: MoleculeConfig,
  bond: MoleculeBondSpec,
): BondDescription | null {
  const fromAtom = molecule.atoms.find((a) => a.id === bond.from);
  const toAtom = molecule.atoms.find((a) => a.id === bond.to);
  if (!fromAtom || !toAtom) return null;
  return describeBondBetweenElements(fromAtom.element, toAtom.element, bond.order);
}

export const GENERAL_EXPLANATION =
  "A molecule's shape isn't arbitrary — it comes from the electron groups around the central atom pushing as far apart from each other as possible.";
