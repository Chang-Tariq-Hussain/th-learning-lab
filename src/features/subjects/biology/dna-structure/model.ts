import type { Base, DnaState } from "./types";

/**
 * One combined widget covers both things the spec asks for: clicking
 * any already-revealed base shows its complementary pairing, and the
 * still-blank positions double as the "Complete the DNA strand"
 * activity. No quiz engine, no scoring — `DnaState` is just the given
 * sequence, the student's answers so far, and which position is
 * currently in focus.
 */

export const BASES: Base[] = ["A", "T", "C", "G"];

export const COMPLEMENT: Record<Base, Base> = { A: "T", T: "A", C: "G", G: "C" };

export const BASE_NAMES: Record<Base, string> = {
  A: "Adenine",
  T: "Thymine",
  C: "Cytosine",
  G: "Guanine",
};

export const BASE_COLORS: Record<Base, string> = {
  A: "#3B82F6",
  T: "#F97316",
  C: "#EC4899",
  G: "#10B981",
};

export const MIN_SEQUENCE_LENGTH = 4;
export const MAX_SEQUENCE_LENGTH = 8;

export function randomBase(): Base {
  return BASES[Math.floor(Math.random() * BASES.length)]!;
}

export function randomSequence(): Base[] {
  const length = MIN_SEQUENCE_LENGTH + Math.floor(Math.random() * (MAX_SEQUENCE_LENGTH - MIN_SEQUENCE_LENGTH + 1));
  return Array.from({ length }, randomBase);
}

export function firstBlankIndex(filled: (Base | null)[]): number | null {
  const idx = filled.findIndex((base) => base === null);
  return idx === -1 ? null : idx;
}

export function isSequenceComplete(filled: (Base | null)[]): boolean {
  return filled.every((base) => base !== null);
}

export function createInitialState(): DnaState {
  const sequence = randomSequence();
  return {
    sequence,
    filled: sequence.map(() => null),
    selectedIndex: 0,
    feedback: null,
  };
}
