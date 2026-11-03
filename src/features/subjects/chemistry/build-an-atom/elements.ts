export interface ElementInfo {
  atomicNumber: number;
  symbol: string;
  name: string;
}

/**
 * Elements 1–36 (hydrogen through krypton), the range this lab can build.
 * The first 20 are the "common elements" shown in the periodic selector and
 * the ones the introductory shell model and isotope data cover. `getElement`
 * still falls back to a generic label for anything outside the table.
 */
export const ELEMENTS: ElementInfo[] = [
  { atomicNumber: 1, symbol: "H", name: "Hydrogen" },
  { atomicNumber: 2, symbol: "He", name: "Helium" },
  { atomicNumber: 3, symbol: "Li", name: "Lithium" },
  { atomicNumber: 4, symbol: "Be", name: "Beryllium" },
  { atomicNumber: 5, symbol: "B", name: "Boron" },
  { atomicNumber: 6, symbol: "C", name: "Carbon" },
  { atomicNumber: 7, symbol: "N", name: "Nitrogen" },
  { atomicNumber: 8, symbol: "O", name: "Oxygen" },
  { atomicNumber: 9, symbol: "F", name: "Fluorine" },
  { atomicNumber: 10, symbol: "Ne", name: "Neon" },
  { atomicNumber: 11, symbol: "Na", name: "Sodium" },
  { atomicNumber: 12, symbol: "Mg", name: "Magnesium" },
  { atomicNumber: 13, symbol: "Al", name: "Aluminium" },
  { atomicNumber: 14, symbol: "Si", name: "Silicon" },
  { atomicNumber: 15, symbol: "P", name: "Phosphorus" },
  { atomicNumber: 16, symbol: "S", name: "Sulfur" },
  { atomicNumber: 17, symbol: "Cl", name: "Chlorine" },
  { atomicNumber: 18, symbol: "Ar", name: "Argon" },
  { atomicNumber: 19, symbol: "K", name: "Potassium" },
  { atomicNumber: 20, symbol: "Ca", name: "Calcium" },
  { atomicNumber: 21, symbol: "Sc", name: "Scandium" },
  { atomicNumber: 22, symbol: "Ti", name: "Titanium" },
  { atomicNumber: 23, symbol: "V", name: "Vanadium" },
  { atomicNumber: 24, symbol: "Cr", name: "Chromium" },
  { atomicNumber: 25, symbol: "Mn", name: "Manganese" },
  { atomicNumber: 26, symbol: "Fe", name: "Iron" },
  { atomicNumber: 27, symbol: "Co", name: "Cobalt" },
  { atomicNumber: 28, symbol: "Ni", name: "Nickel" },
  { atomicNumber: 29, symbol: "Cu", name: "Copper" },
  { atomicNumber: 30, symbol: "Zn", name: "Zinc" },
  { atomicNumber: 31, symbol: "Ga", name: "Gallium" },
  { atomicNumber: 32, symbol: "Ge", name: "Germanium" },
  { atomicNumber: 33, symbol: "As", name: "Arsenic" },
  { atomicNumber: 34, symbol: "Se", name: "Selenium" },
  { atomicNumber: 35, symbol: "Br", name: "Bromine" },
  { atomicNumber: 36, symbol: "Kr", name: "Krypton" },
];

/** Elements shown in the periodic-table-style selector. */
export const COMMON_ELEMENT_COUNT = 20;

export function getElement(protonCount: number): ElementInfo {
  if (protonCount <= 0) {
    return { atomicNumber: 0, symbol: "—", name: "No nucleus" };
  }
  const known = ELEMENTS.find((e) => e.atomicNumber === protonCount);
  if (known) return known;
  return { atomicNumber: protonCount, symbol: `E${protonCount}`, name: `Element ${protonCount}` };
}
