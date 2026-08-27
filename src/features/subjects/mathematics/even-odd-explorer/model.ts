import { isEven } from "./colors";

export type Operation = "add" | "subtract";

export interface Challenge {
  id: number;
  prompt: string;
  targetParity: "even" | "odd";
}

let idCounter = 0;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Picks a random target parity, retrying a few times to avoid
 *  repeating `excludeParity` back to back (e.g. the parity just
 *  solved). */
export function nextChallenge(excludeParity?: "even" | "odd"): Challenge {
  let target: "even" | "odd" = Math.random() < 0.5 ? "even" : "odd";
  let attempts = 0;
  while (target === excludeParity && attempts < 4) {
    target = Math.random() < 0.5 ? "even" : "odd";
    attempts++;
  }
  return {
    id: ++idCounter,
    targetParity: target,
    prompt: target === "even" ? "Build an EVEN result" : "Build an ODD result",
  };
}

export function computeResult(a: number, b: number, operation: Operation): number {
  return operation === "add" ? a + b : a - b;
}

export function resultParity(result: number): "even" | "odd" {
  return isEven(result) ? "even" : "odd";
}

export const OPERAND_MIN = 1;
export const OPERAND_MAX = 20;

export function clampOperand(n: number): number {
  return Math.min(OPERAND_MAX, Math.max(OPERAND_MIN, n));
}

/** A small starting operand, used as each `useState` lazy initializer
 *  so the random pick happens once per mount (client-side only),
 *  matching the pattern in `number-line.tsx`'s own lazy `useState`. */
export function randomStartingOperand(): number {
  return randomInt(OPERAND_MIN, 9);
}
