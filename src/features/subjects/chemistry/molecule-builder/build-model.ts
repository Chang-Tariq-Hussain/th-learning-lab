import {
  ATOM_INFO,
  ELEMENT_COLOR,
  ELEMENT_RADIUS,
  MOLECULES,
  MOLECULE_ORDER,
  describeBondBetweenElements,
  elementLabel,
  type BondDescription,
  type ElementSymbol,
  type MoleculeId,
} from "./molecule-model";

export { ATOM_INFO, ELEMENT_COLOR, ELEMENT_RADIUS, elementLabel };
export type { ElementSymbol };

/**
 * Free-build data model for Molecule Builder's "Build Your Own" mode
 * — a separate, simpler shape from `MoleculeConfig`'s hand-authored
 * presets (`molecule-model.ts`), since here atoms are added one at a
 * time by the learner rather than laid out in advance. Positions are
 * freeform scene coordinates (updated live while dragging), not fixed
 * VSEPR geometry — this mode is about *whether atoms are bonded and
 * how*, not about reproducing an exact preset shape (that's what
 * Explore mode, and the target-matching check below, are for).
 */

export interface BuildAtomInstance {
  id: string;
  element: ElementSymbol;
  position: [number, number, number];
}

export interface BuildBondInstance {
  id: string;
  from: string;
  to: string;
  order: 1 | 2 | 3;
}

/** The elements offered in the build palette — every element already
 *  used across the app's preset molecules (`molecule-model.ts`), so
 *  nothing the learner builds here is scientifically inconsistent
 *  with what Explore mode already shows. */
export const PALETTE_ELEMENTS: ElementSymbol[] = ["H", "C", "N", "O", "F", "B"];

/**
 * Simplified "how many bonds can this element form" ceiling. This is
 * the same single-bonds-worth-of-valence-electrons model the rest of
 * the app already uses (Bond Builder counts valence electrons the
 * same way; Build an Atom doesn't model lone pairs at all) — not a
 * full octet/lone-pair account. Every value here matches how that
 * element actually behaves in `MOLECULES`: oxygen always forms 2
 * bonds total (whether 2 single or itself in other contexts),
 * carbon 4, nitrogen 3, boron 3, hydrogen and fluorine 1 — so this
 * constraint can never contradict a preset molecule, only guide a
 * freely-built one. Per Part 15 of the brief, this is a deliberate
 * educational simplification, not real quantum chemistry.
 */
export const MAX_BONDS: Record<ElementSymbol, number> = {
  H: 1,
  C: 4,
  N: 3,
  O: 2,
  F: 1,
  B: 3,
};

let idCounter = 0;
export function generateAtomId(): string {
  idCounter += 1;
  return `build-atom-${idCounter}`;
}
export function generateBondId(): string {
  idCounter += 1;
  return `build-bond-${idCounter}`;
}

/** Where a newly-added atom starts out, spread across a small
 *  spherical spiral (a golden-angle lattice, same idea used for even
 *  point distribution on a sphere) so new atoms don't spawn stacked
 *  on top of each other — a reasonable starting layout the learner
 *  can then drag into place, rather than a meaningful geometry. */
export function nextSpawnPosition(existingCount: number): [number, number, number] {
  if (existingCount === 0) return [0, 0, 0];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const shell = Math.floor(existingCount / 8);
  const indexInShell = existingCount % 8;
  const radius = 1.5 + shell * 1.1;
  const y = (indexInShell / 7) * 2 - 1;
  const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = existingCount * goldenAngle;
  return [radius * ringRadius * Math.cos(theta), radius * y, radius * ringRadius * Math.sin(theta)];
}

export function usedValence(atomId: string, bonds: BuildBondInstance[]): number {
  return bonds
    .filter((b) => b.from === atomId || b.to === atomId)
    .reduce((sum, b) => sum + b.order, 0);
}

export function remainingValence(atom: BuildAtomInstance, bonds: BuildBondInstance[]): number {
  return Math.max(0, MAX_BONDS[atom.element] - usedValence(atom.id, bonds));
}

export function findBuildBondBetween(
  a: string,
  b: string,
  bonds: BuildBondInstance[],
): BuildBondInstance | null {
  return (
    bonds.find((bond) => (bond.from === a && bond.to === b) || (bond.from === b && bond.to === a)) ?? null
  );
}

export interface BondCheck {
  ok: boolean;
  reason?: string;
}

/** Whether a bond of `order` could be created (or, when `excludeBondId`
 *  is given, changed to) between two atoms right now — the check
 *  behind the "Create Bond" / "Change order" buttons being enabled,
 *  and re-run defensively before actually mutating state. */
export function canFormBond(
  fromAtom: BuildAtomInstance,
  toAtom: BuildAtomInstance,
  order: 1 | 2 | 3,
  bonds: BuildBondInstance[],
  excludeBondId?: string,
): BondCheck {
  if (fromAtom.id === toAtom.id) {
    return { ok: false, reason: "An atom can't bond to itself." };
  }
  const relevantBonds = excludeBondId ? bonds.filter((b) => b.id !== excludeBondId) : bonds;
  const existing = findBuildBondBetween(fromAtom.id, toAtom.id, relevantBonds);
  if (existing) {
    return { ok: false, reason: "These atoms are already bonded — select the bond to change or break it instead." };
  }
  if (remainingValence(fromAtom, relevantBonds) < order) {
    const name = elementLabel(fromAtom.element);
    return { ok: false, reason: `${name.charAt(0).toUpperCase() + name.slice(1)} doesn't have enough bonding capacity left for that.` };
  }
  if (remainingValence(toAtom, relevantBonds) < order) {
    const name = elementLabel(toAtom.element);
    return { ok: false, reason: `${name.charAt(0).toUpperCase() + name.slice(1)} doesn't have enough bonding capacity left for that.` };
  }
  return { ok: true };
}

/** Describes a bond already in the build for the detail panel — the
 *  free-build counterpart of `molecule-model.ts`'s `describeBond`,
 *  built on the same shared `describeBondBetweenElements` core. */
export function describeBuildBond(
  atoms: BuildAtomInstance[],
  bond: BuildBondInstance,
): BondDescription | null {
  const fromAtom = atoms.find((a) => a.id === bond.from);
  const toAtom = atoms.find((a) => a.id === bond.to);
  if (!fromAtom || !toAtom) return null;
  return describeBondBetweenElements(fromAtom.element, toAtom.element, bond.order);
}

export interface BuildTarget {
  moleculeId: MoleculeId;
  formula: string;
  name: string;
}

/** The build challenge targets — every preset molecule Explore mode
 *  already has, reused rather than duplicated (Part 10 of the brief:
 *  prefer reuse over a second data set). */
export const BUILD_TARGETS: BuildTarget[] = MOLECULE_ORDER.map((id) => ({
  moleculeId: id,
  formula: MOLECULES[id].formula,
  name: MOLECULES[id].name,
}));

/** A bond's element-pair + order, independent of which specific atom
 *  ids are involved on either side — two structurally identical
 *  molecules share this signature even when built/labeled
 *  differently. The pair is sorted so A-B and B-A count the same. */
function bondSignature(elA: ElementSymbol, elB: ElementSymbol, order: 1 | 2 | 3): string {
  const pair = [elA, elB].sort().join("-");
  return `${pair}:${order}`;
}

export interface TargetCheckResult {
  matches: boolean;
  message: string;
}

/**
 * Checks a built structure against a target preset molecule.
 * Deliberately structural — element counts plus a sorted list of
 * bond signatures — rather than an id-for-id match, since the
 * learner's atom/bond ids are never the same as the preset's. Every
 * molecule in `MOLECULES` is a small star or diatomic shape, so
 * comparing element counts and bond signatures is enough to catch
 * both "wrong atoms" and "right atoms, wrong connectivity"; this is
 * an educational check appropriate to this curriculum, not a general
 * graph-isomorphism solver (see Part 15 of the brief).
 */
export function checkAgainstTarget(
  atoms: BuildAtomInstance[],
  bonds: BuildBondInstance[],
  targetId: MoleculeId,
): TargetCheckResult {
  const target = MOLECULES[targetId];

  // Only atoms that are actually part of the bonded structure count
  // toward the comparison — a stray, unbonded atom sitting off to the
  // side isn't part of the finished molecule. Exception: a target
  // with no bonds at all (none currently exist, but this keeps the
  // function honest) falls back to comparing every atom present.
  const bondedAtomIds = new Set<string>();
  bonds.forEach((b) => {
    bondedAtomIds.add(b.from);
    bondedAtomIds.add(b.to);
  });
  const involvedAtoms = target.bonds.length === 0 ? atoms : atoms.filter((a) => bondedAtomIds.has(a.id));

  const countByElement = (list: { element: ElementSymbol }[]): Partial<Record<ElementSymbol, number>> => {
    const counts: Partial<Record<ElementSymbol, number>> = {};
    list.forEach((item) => {
      counts[item.element] = (counts[item.element] ?? 0) + 1;
    });
    return counts;
  };

  const builtCounts = countByElement(involvedAtoms);
  const targetCounts = countByElement(target.atoms);
  const everyElement = new Set([...Object.keys(builtCounts), ...Object.keys(targetCounts)]);
  const elementsMatch = Array.from(everyElement).every(
    (el) => (builtCounts[el as ElementSymbol] ?? 0) === (targetCounts[el as ElementSymbol] ?? 0),
  );

  const atomById = new Map(atoms.map((a) => [a.id, a]));
  const builtSignatures = bonds
    .map((b) => {
      const from = atomById.get(b.from);
      const to = atomById.get(b.to);
      return from && to ? bondSignature(from.element, to.element, b.order) : null;
    })
    .filter((s): s is string => s !== null)
    .sort();

  const presetAtomById = new Map(target.atoms.map((a) => [a.id, a]));
  const targetSignatures = target.bonds
    .map((b) => {
      const from = presetAtomById.get(b.from);
      const to = presetAtomById.get(b.to);
      return from && to ? bondSignature(from.element, to.element, b.order) : null;
    })
    .filter((s): s is string => s !== null)
    .sort();

  const bondsMatch =
    builtSignatures.length === targetSignatures.length &&
    builtSignatures.every((sig, index) => sig === targetSignatures[index]);

  if (elementsMatch && bondsMatch) {
    return { matches: true, message: `That's ${target.formula} (${target.name}) — nicely built.` };
  }
  if (!elementsMatch) {
    return {
      matches: false,
      message: `Not quite ${target.formula} yet — check which elements, and how many of each, you've used.`,
    };
  }
  return {
    matches: false,
    message: `You have the right atoms for ${target.formula}, but the bonds don't match yet — check what's connected to what, and each bond's order.`,
  };
}
