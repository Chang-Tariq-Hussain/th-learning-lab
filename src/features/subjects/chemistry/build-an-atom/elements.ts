export interface ElementInfo {
  atomicNumber: number;
  symbol: string;
  name: string;
}

/**
 * First 20 elements (hydrogen through calcium) — the range explicitly
 * required. Beyond this, `getElement` falls back to a generic label
 * rather than erroring, so a curious student mashing the "+ Proton"
 * button past calcium still sees *something* sensible.
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
];

export function getElement(protonCount: number): ElementInfo {
  if (protonCount <= 0) {
    return { atomicNumber: 0, symbol: "—", name: "No nucleus" };
  }
  const known = ELEMENTS.find((e) => e.atomicNumber === protonCount);
  if (known) return known;
  return { atomicNumber: protonCount, symbol: `E${protonCount}`, name: `Element ${protonCount}` };
}
