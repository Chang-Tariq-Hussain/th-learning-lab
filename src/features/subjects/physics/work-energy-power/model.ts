/**
 * Tiny, self-contained model for the Work, Energy & Power
 * visualization — same spirit as Simple Energy and Simple Motion (no
 * shared `engine/`, just plain functions), but with real numbers on
 * every readout since this topic's Practice/Challenge sections ask
 * students to actually compute with them.
 *
 * Three independent panels share this one model file:
 *  - Work:  W = F d cos(theta)
 *  - Energy: KE = 1/2 m v^2, PE = m g h
 *  - Power: P = W / t
 */

/** Standard gravity used throughout this lab (and Projectile Motion's default preset). */
export const GRAVITY = 9.8;

// --- Work panel ranges -------------------------------------------------
export const FORCE_MIN = 0;
export const FORCE_MAX = 100;
export const FORCE_STEP = 5;
export const DEFAULT_FORCE = 20;

export const DISPLACEMENT_MIN = 0;
export const DISPLACEMENT_MAX = 20;
export const DISPLACEMENT_STEP = 1;
export const DEFAULT_DISPLACEMENT = 5;

export const ANGLE_MIN = 0;
export const ANGLE_MAX = 180;
export const ANGLE_STEP = 15;
export const DEFAULT_ANGLE = 0;

// --- Energy panel ranges -------------------------------------------------
export const MASS_MIN = 1;
export const MASS_MAX = 50;
export const MASS_STEP = 1;
export const DEFAULT_MASS = 10;

export const VELOCITY_MIN = 0;
export const VELOCITY_MAX = 20;
export const VELOCITY_STEP = 1;
export const DEFAULT_VELOCITY = 5;

export const HEIGHT_MIN = 0;
export const HEIGHT_MAX = 20;
export const HEIGHT_STEP = 1;
export const DEFAULT_HEIGHT = 5;

// --- Power panel ranges -------------------------------------------------
export const WORK_MIN = 100;
export const WORK_MAX = 2000;
export const WORK_STEP = 100;
export const DEFAULT_WORK = 1000;

export const TIME_MIN = 1;
export const TIME_MAX = 20;
export const TIME_STEP = 1;
export const DEFAULT_TIME_A = 10;
export const DEFAULT_TIME_B = 5;

/** Degrees to radians, purely local so this file has no outside dependency. */
function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** W = F d cos(theta). Rounds away floating point noise (e.g. cos(90°) landing on -1e-16) to 0. */
export function computeWork(forceN: number, displacementM: number, angleDeg: number): number {
  const raw = forceN * displacementM * Math.cos(toRadians(angleDeg));
  return Math.abs(raw) < 1e-9 ? 0 : raw;
}

export type WorkSign = "positive" | "negative" | "zero";

/** Whether the work done is positive, negative, or exactly zero — the
 *  distinction this topic's Learn/Predict sections build the whole
 *  "work" concept around, not just the numeric value. */
export function workSign(workJ: number): WorkSign {
  if (Math.abs(workJ) < 1e-9) return "zero";
  return workJ > 0 ? "positive" : "negative";
}

/** KE = 1/2 m v^2 */
export function computeKineticEnergy(massKg: number, velocityMs: number): number {
  return 0.5 * massKg * velocityMs * velocityMs;
}

/** PE = m g h, using this lab's fixed GRAVITY. */
export function computeGravitationalPE(massKg: number, heightM: number): number {
  return massKg * GRAVITY * heightM;
}

/** P = W / t. Callers are responsible for keeping t > 0 (the Power
 *  panel's slider range never allows 0). */
export function computePower(workJ: number, timeS: number): number {
  if (timeS <= 0) return 0;
  return workJ / timeS;
}

/** Rounds to a sensible number of significant places for a readout —
 *  whole numbers for anything >= 100, one decimal below that. */
export function formatEnergyValue(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 100 || abs === 0) return value.toFixed(0);
  return value.toFixed(1);
}
