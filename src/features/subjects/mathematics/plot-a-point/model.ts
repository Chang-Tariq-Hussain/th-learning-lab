/**
 * Plot a Point — data model.
 *
 * Reuses the coordinate math (grid bounds, pixel<->world conversion,
 * quadrant lookup) from the Coordinate Plane Explorer's
 * `coordinate-model.ts` rather than redefining it. This file only adds
 * what's specific to this activity: the question bank, difficulty
 * levels, and the feedback text generated from a student's guess.
 */

import { quadrantOf, QUADRANT_INFO, type Quadrant } from "../coordinate-plane-explorer/coordinate-model";

export type Level = 1 | 2 | 3;

export interface Question {
  x: number;
  y: number;
  /** Whether to reveal the quadrant name before the student attempts this one. */
  hint?: boolean;
}

export const LEVELS: Level[] = [1, 2, 3];

export const LEVEL_LABEL: Record<Level, string> = {
  1: "Level 1 — Beginner",
  2: "Level 2 — Intermediate",
  3: "Level 3 — Challenge",
};

export const LEVEL_QUESTIONS: Record<Level, Question[]> = {
  1: [
    { x: 2, y: 3 },
    { x: 4, y: 2 },
    { x: 5, y: 1 },
    { x: 3, y: 5 },
  ],
  2: [
    { x: -3, y: 4, hint: true },
    { x: 4, y: -3, hint: true },
    { x: -2, y: -5 },
    { x: -5, y: 2 },
  ],
  3: [
    { x: -5, y: 4, hint: true },
    { x: 6, y: -3 },
    { x: -4, y: -5 },
    { x: 7, y: 2 },
  ],
};

export const FINAL_CHALLENGE: Question = { x: -6, y: -4 };

/** Total number of ordinary questions across all three levels (used for the progress readout). */
export const TOTAL_QUESTIONS = LEVELS.reduce((sum, lvl) => sum + LEVEL_QUESTIONS[lvl].length, 0) + 1;

export { quadrantOf, QUADRANT_INFO };
export type { Quadrant };

/**
 * Builds a short, specific feedback message for an incorrect guess.
 * Mirrors the examples in the spec: praise whichever coordinate is
 * right, name the direction to move for the other, and call out a
 * wrong-side-of-the-axis mistake by name instead of just a distance.
 */
export function buildFeedback(target: { x: number; y: number }, guess: { x: number; y: number }): string {
  const xCorrect = guess.x === target.x;
  const yCorrect = guess.y === target.y;

  if (xCorrect && yCorrect) return "";

  if (xCorrect) {
    const diff = target.y - guess.y;
    const dir = diff > 0 ? "up" : "down";
    const n = Math.abs(diff);
    return `Your x-coordinate is correct. Move ${n} unit${n === 1 ? "" : "s"} ${dir}.`;
  }

  if (yCorrect) {
    const signMismatch = guess.x !== 0 && target.x !== 0 && Math.sign(guess.x) !== Math.sign(target.x);
    if (signMismatch) {
      return "Your y-coordinate is correct, but your x-coordinate is on the wrong side of the y-axis.";
    }
    const diff = target.x - guess.x;
    const dir = diff > 0 ? "right" : "left";
    const n = Math.abs(diff);
    return `Your y-coordinate is correct. Move ${n} unit${n === 1 ? "" : "s"} ${dir}.`;
  }

  return "Not quite. Try again.";
}
