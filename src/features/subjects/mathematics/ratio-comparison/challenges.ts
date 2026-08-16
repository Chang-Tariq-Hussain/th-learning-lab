export interface RatioTarget {
  id: number;
  a: number;
  b: number;
}

/**
 * Kept in simplest form with every component at most 4 — Ratio Box A
 * gets scaled by ×1–3 (see `nextChallenge`), so the largest possible
 * value is 12, matching the sliders' range exactly.
 */
const TARGETS: { a: number; b: number }[] = [
  { a: 1, b: 1 },
  { a: 2, b: 1 },
  { a: 1, b: 2 },
  { a: 3, b: 1 },
  { a: 1, b: 3 },
  { a: 4, b: 1 },
  { a: 1, b: 4 },
  { a: 3, b: 2 },
  { a: 2, b: 3 },
  { a: 4, b: 3 },
  { a: 3, b: 4 },
];

let idCounter = 0;

export function nextChallenge(excludeId?: number): RatioTarget {
  let target = TARGETS[Math.floor(Math.random() * TARGETS.length)]!;
  let attempts = 0;
  while (excludeId !== undefined && challengeKey(target) === excludeId && attempts < 6) {
    target = TARGETS[Math.floor(Math.random() * TARGETS.length)]!;
    attempts++;
  }
  return { id: ++idCounter, ...target };
}

/** A stable identity for a target (a*100 + b) — used to avoid immediately repeating the same challenge. */
export function challengeKey(challenge: Pick<RatioTarget, "a" | "b">): number {
  return challenge.a * 100 + challenge.b;
}

/** A random 1–3× scale-up so Ratio Box A doesn't always show the target in its smallest form. */
export function randomScale(): number {
  return 1 + Math.floor(Math.random() * 3);
}
