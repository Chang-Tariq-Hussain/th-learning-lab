import { getElement } from "./elements";
import type { AtomState } from "./atom-model";
import { massNumber } from "./atom-model";

/**
 * Isotopes of elements 1–20 that occur in nature. `radioactive` marks the ones
 * that are not stable. Beyond calcium this lab carries no isotope data, so it
 * says so instead of guessing.
 */
const KNOWN: Record<number, { stable: number[]; radioactive?: number[] }> = {
  1: { stable: [1, 2], radioactive: [3] },
  2: { stable: [3, 4] },
  3: { stable: [6, 7] },
  4: { stable: [9] },
  5: { stable: [10, 11] },
  6: { stable: [12, 13], radioactive: [14] },
  7: { stable: [14, 15] },
  8: { stable: [16, 17, 18] },
  9: { stable: [19] },
  10: { stable: [20, 21, 22] },
  11: { stable: [23] },
  12: { stable: [24, 25, 26] },
  13: { stable: [27] },
  14: { stable: [28, 29, 30] },
  15: { stable: [31] },
  16: { stable: [32, 33, 34, 36] },
  17: { stable: [35, 37] },
  18: { stable: [36, 38, 40] },
  19: { stable: [39, 41], radioactive: [40] },
  20: { stable: [40, 42, 43, 44, 46], radioactive: [48] },
};

export type IsotopeStatus = "stable" | "radioactive" | "not-natural" | "unknown";

export const ISOTOPE_DATA_MAX_Z = 20;

export function isotopeStatus(protons: number, mass: number): IsotopeStatus {
  const row = KNOWN[protons];
  if (!row) return "unknown";
  if (row.radioactive?.includes(mass)) return "radioactive";
  if (row.stable.includes(mass)) return "stable";
  return "not-natural";
}

export const ISOTOPE_STATUS_TEXT: Record<IsotopeStatus, string> = {
  stable: "A stable, naturally occurring isotope.",
  radioactive: "A radioactive isotope that occurs naturally (usually in tiny amounts).",
  "not-natural": "Not one of this element's naturally occurring isotopes; it would be unstable or only made in a laboratory.",
  unknown: "This lab has no isotope data for elements above calcium (20).",
};

export function isotopeName(atom: Pick<AtomState, "protons" | "neutrons">): string {
  return `${getElement(atom.protons).name}-${massNumber(atom as AtomState)}`;
}

export function isotopeShortName(atom: Pick<AtomState, "protons" | "neutrons">): string {
  return `${getElement(atom.protons).symbol}-${massNumber(atom as AtomState)}`;
}

/** Common isotope names used by the isotope experiment. */
export function stableMassNumbers(protons: number): number[] {
  return KNOWN[protons]?.stable ?? [];
}

/** Mass number of each element's most abundant naturally occurring isotope (elements 1–20). */
const MOST_COMMON_MASS: Record<number, number> = {
  1: 1, 2: 4, 3: 7, 4: 9, 5: 11, 6: 12, 7: 14, 8: 16, 9: 19, 10: 20,
  11: 23, 12: 24, 13: 27, 14: 28, 15: 31, 16: 32, 17: 35, 18: 40, 19: 39, 20: 40,
};

/** Neutron count of the most common isotope, or a neutron count equal to the proton count when no data exists. */
export function commonNeutrons(protons: number): number {
  const mass = MOST_COMMON_MASS[protons];
  return mass === undefined ? protons : mass - protons;
}
