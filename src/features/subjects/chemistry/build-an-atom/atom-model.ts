export interface AtomState {
  protons: number;
  neutrons: number;
  electrons: number;
}

export const HYDROGEN_ATOM: AtomState = { protons: 1, neutrons: 0, electrons: 1 };

export function massNumber(atom: AtomState): number {
  return atom.protons + atom.neutrons;
}

/** Net charge = protons − electrons, in units of the elementary charge (e). */
export function netCharge(atom: AtomState): number {
  return atom.protons - atom.electrons;
}

export type ChargeKind = "positive" | "negative" | "neutral";

export function chargeKind(charge: number): ChargeKind {
  if (charge > 0) return "positive";
  if (charge < 0) return "negative";
  return "neutral";
}

export function chargeLabel(charge: number): string {
  const kind = chargeKind(charge);
  if (kind === "positive") return `Positive ion (${charge > 1 ? charge + "+" : "+"})`;
  if (kind === "negative") return `Negative ion (${charge < -1 ? Math.abs(charge) + "−" : "−"})`;
  return "Neutral atom";
}
