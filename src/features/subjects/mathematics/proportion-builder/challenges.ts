export type MissingSlot = "c" | "d";

/**
 * A proportion a : b = c : d, generated so c = a*k and d = b*k for some
 * whole-number scale k — that's what guarantees the two sides really
 * are equal, and it's also exactly what the "repeated copies" visual
 * shows once the student finds the missing value. One of c/d is left
 * out; the other is shown as a fixed, given number.
 */
export interface ProportionChallenge {
  id: number;
  a: number;
  b: number;
  k: number;
  missing: MissingSlot;
}

const QUANTITY_RANGE = [1, 2, 3, 4];
const SCALE_RANGE = [2, 3];

let idCounter = 0;

function randomFrom<T>(values: readonly T[]): T {
  return values[Math.floor(Math.random() * values.length)]!;
}

function generate(): Omit<ProportionChallenge, "id"> {
  const a = randomFrom(QUANTITY_RANGE);
  let b = randomFrom(QUANTITY_RANGE);
  // Keep a ≠ b so the bar split is visually distinct rather than a plain 50/50 line.
  while (b === a) b = randomFrom(QUANTITY_RANGE);
  const k = randomFrom(SCALE_RANGE);
  const missing = randomFrom<MissingSlot>(["c", "d"]);
  return { a, b, k, missing };
}

export function nextChallenge(excludeId?: number): ProportionChallenge {
  let candidate = generate();
  let attempts = 0;
  while (excludeId !== undefined && challengeKey(candidate) === excludeId && attempts < 8) {
    candidate = generate();
    attempts++;
  }
  return { id: ++idCounter, ...candidate };
}

/** A stable identity for a challenge — used to avoid immediately repeating the same one. */
export function challengeKey(challenge: Pick<ProportionChallenge, "a" | "b" | "k" | "missing">): number {
  return challenge.a * 1000 + challenge.b * 100 + challenge.k * 10 + (challenge.missing === "c" ? 1 : 2);
}

export function cValue(challenge: Pick<ProportionChallenge, "a" | "k">): number {
  return challenge.a * challenge.k;
}

export function dValue(challenge: Pick<ProportionChallenge, "b" | "k">): number {
  return challenge.b * challenge.k;
}

/** The value the student needs to find. */
export function correctValue(challenge: ProportionChallenge): number {
  return challenge.missing === "c" ? cValue(challenge) : dValue(challenge);
}

/** A slider starting point guaranteed not to already equal the correct value. */
export function startingGuess(challenge: ProportionChallenge): number {
  const target = correctValue(challenge);
  return target !== 1 ? 1 : 2;
}
