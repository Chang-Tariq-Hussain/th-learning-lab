import type { AtomState } from "./atom-model";
import { chargeKind, chargeSuffix, massNumber, netCharge } from "./atom-model";
import { getElement } from "./elements";
import { ISOTOPE_DATA_MAX_Z, isotopeName } from "./isotopes";

/** Isotope notation as plain text, e.g. "¹²₆C" is drawn by the UI; this is the accessible form: "carbon-12". */
export function notationText(atom: AtomState): string {
  const e = getElement(atom.protons);
  const c = chargeSuffix(netCharge(atom));
  return `${e.symbol}-${massNumber(atom)}${c ? ` (${c})` : ""}`;
}

export function chargeWord(atom: AtomState): string {
  const kind = chargeKind(netCharge(atom));
  return kind === "positive" ? "cation (positive ion)" : kind === "negative" ? "anion (negative ion)" : "neutral atom";
}

/** One-line formulas that always show the live numbers, so learners see where each property comes from. */
export function formulas(atom: AtomState): { label: string; formula: string }[] {
  const e = getElement(atom.protons);
  return [
    { label: "Atomic number", formula: `Z = number of protons = ${atom.protons}, so the element is ${e.name}` },
    { label: "Mass number", formula: `A = protons + neutrons = ${atom.protons} + ${atom.neutrons} = ${massNumber(atom)}` },
    { label: "Net charge", formula: `protons − electrons = ${atom.protons} − ${atom.electrons} = ${netCharge(atom)}` },
  ];
}

/** Sentences explaining exactly what an edit changed, and what it left alone. */
export function describeChange(before: AtomState, after: AtomState): string[] {
  const out: string[] = [];
  const b = getElement(before.protons);
  const a = getElement(after.protons);
  if (before.protons !== after.protons) {
    out.push(
      b.atomicNumber === a.atomicNumber
        ? "The proton count changed."
        : `Protons went from ${before.protons} to ${after.protons}, so the atomic number changed and the element is now ${a.name} (${a.symbol}) instead of ${b.name}.`,
    );
  }
  if (before.neutrons !== after.neutrons) {
    const same = before.protons === after.protons;
    out.push(
      `Neutrons went from ${before.neutrons} to ${after.neutrons}, so the mass number went from ${massNumber(before)} to ${massNumber(after)}.` +
        (same ? ` The element is still ${a.name}: this is a different isotope (${isotopeName(after)}).` : ""),
    );
  }
  if (before.electrons !== after.electrons) {
    const nc = netCharge(after);
    out.push(
      `Electrons went from ${before.electrons} to ${after.electrons}, so the net charge is now ${nc === 0 ? "0" : chargeSuffix(nc)} (${after.protons} protons − ${after.electrons} electrons).` +
        (before.protons === after.protons ? ` The element and mass number did not change.` : ""),
    );
  }
  if (before.protons !== after.protons && netCharge(before) !== netCharge(after) && before.electrons === after.electrons) {
    out.push(`The electron count did not change, so the charge moved from ${netCharge(before)} to ${netCharge(after)} because the protons changed.`);
  }
  return out;
}

export function isotopeNote(atom: AtomState): string | null {
  if (atom.protons > ISOTOPE_DATA_MAX_Z) return null;
  return isotopeName(atom);
}

export interface Comparison {
  sameElement: boolean;
  sameMass: boolean;
  sameCharge: boolean;
  verdict: string;
}

/** Compares two atoms and says what relationship they have (identical, isotopes, ions, different elements). */
export function compareAtoms(a: AtomState, b: AtomState): Comparison {
  const sameElement = a.protons === b.protons;
  const sameMass = massNumber(a) === massNumber(b);
  const sameCharge = netCharge(a) === netCharge(b);
  const name = getElement(a.protons).name;
  let verdict: string;
  if (!sameElement) {
    verdict = `Different elements: ${name} has ${a.protons} protons and ${getElement(b.protons).name} has ${b.protons}.`;
    if (sameMass) verdict += " They share a mass number, which is called being isobars.";
  } else if (sameMass && sameCharge) {
    verdict = "These two atoms are identical: same protons, neutrons and electrons.";
  } else if (!sameMass && sameCharge) {
    verdict = `Isotopes of ${name}: the same number of protons, but different numbers of neutrons.`;
  } else if (sameMass && !sameCharge) {
    verdict = `Ions of ${name}: the same protons and neutrons, but different numbers of electrons, so different charges.`;
  } else {
    verdict = `Both are ${name}, but they differ in neutrons (different isotopes) and in electrons (different charges).`;
  }
  return { sameElement, sameMass, sameCharge, verdict };
}
