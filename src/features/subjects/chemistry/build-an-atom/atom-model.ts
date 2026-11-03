export interface AtomState {
  protons: number;
  neutrons: number;
  electrons: number;
}

export const HYDROGEN_ATOM: AtomState = { protons: 1, neutrons: 0, electrons: 1 };

/**
 * Hard limits that keep every state valid and the scene cheap to draw.
 * An atom always has a nucleus, so it needs at least one proton; neutrons and
 * electrons may reach zero (a hydrogen-1 nucleus has no neutrons, and a cation
 * can lose every electron). 36 protons (krypton) is the last element this lab
 * names; 60 neutrons covers every isotope of the elements it names.
 */
export const LIMITS = {
  protons: { min: 1, max: 36 },
  neutrons: { min: 0, max: 60 },
  electrons: { min: 0, max: 40 },
} as const;

export type ParticleKey = keyof typeof LIMITS;

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

/** Forces any counts (including NaN, negatives or fractions) into a valid atom. Every state change goes through this. */
export function clampAtom(atom: AtomState): AtomState {
  return {
    protons: clamp(atom.protons, LIMITS.protons.min, LIMITS.protons.max),
    neutrons: clamp(atom.neutrons, LIMITS.neutrons.min, LIMITS.neutrons.max),
    electrons: clamp(atom.electrons, LIMITS.electrons.min, LIMITS.electrons.max),
  };
}

export function sameAtom(a: AtomState, b: AtomState): boolean {
  return a.protons === b.protons && a.neutrons === b.neutrons && a.electrons === b.electrons;
}

/** Adds `delta` to one particle count; returns the same object when the change would leave the allowed range. */
export function changeParticle(atom: AtomState, particle: ParticleKey, delta: number): AtomState {
  const limit = LIMITS[particle];
  const next = atom[particle] + delta;
  if (next < limit.min || next > limit.max) return atom;
  return { ...atom, [particle]: next };
}

export function canChange(atom: AtomState, particle: ParticleKey, delta: 1 | -1): boolean {
  const limit = LIMITS[particle];
  const next = atom[particle] + delta;
  return next >= limit.min && next <= limit.max;
}

/** Mass number A = protons + neutrons. */
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

/** "+", "2+", "−", "3−" (true minus sign), or "" for a neutral atom. */
export function chargeSuffix(charge: number): string {
  if (charge === 0) return "";
  const size = Math.abs(charge);
  return `${size > 1 ? size : ""}${charge > 0 ? "+" : "−"}`;
}

export function chargeLabel(charge: number): string {
  const kind = chargeKind(charge);
  if (kind === "positive") return `Positive ion — cation (${chargeSuffix(charge)})`;
  if (kind === "negative") return `Negative ion — anion (${chargeSuffix(charge)})`;
  return "Neutral atom";
}
