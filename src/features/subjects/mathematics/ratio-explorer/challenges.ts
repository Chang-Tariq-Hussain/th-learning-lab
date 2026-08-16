export interface RatioChallenge {
  id: number;
  a: number;
  b: number;
}

/** Kept small and already-simplest so "Make a ratio of 3 : 2" always has an easy, reachable answer within the 0–20 object limit. */
const TARGETS: { a: number; b: number }[] = [
  { a: 1, b: 1 },
  { a: 2, b: 1 },
  { a: 1, b: 2 },
  { a: 3, b: 1 },
  { a: 1, b: 3 },
  { a: 3, b: 2 },
  { a: 2, b: 3 },
  { a: 4, b: 3 },
  { a: 3, b: 4 },
  { a: 5, b: 2 },
  { a: 2, b: 5 },
  { a: 5, b: 3 },
  { a: 3, b: 5 },
  { a: 5, b: 4 },
  { a: 4, b: 5 },
];

let idCounter = 0;

export function nextChallenge(excludeId?: number): RatioChallenge {
  let target = TARGETS[Math.floor(Math.random() * TARGETS.length)]!;
  let attempts = 0;
  while (excludeId !== undefined && challengeKey(target) === excludeId && attempts < 6) {
    target = TARGETS[Math.floor(Math.random() * TARGETS.length)]!;
    attempts++;
  }
  return { id: ++idCounter, ...target };
}

/** A stable identity for a target (a*100 + b) — used to avoid immediately repeating the same challenge. */
export function challengeKey(challenge: Pick<RatioChallenge, "a" | "b">): number {
  return challenge.a * 100 + challenge.b;
}
