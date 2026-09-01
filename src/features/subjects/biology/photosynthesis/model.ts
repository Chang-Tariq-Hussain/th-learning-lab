import type { PhotosynthesisFactors, PhotosynthesisState, StepId } from "./types";

/**
 * One continuous playback clock (same pattern as Simple Motion /
 * Simple Forces) rather than six separate animations — a single
 * `progress` value from 0 to 1 drives every particle's position, so
 * Pause can stop it at any instant and Start resumes from exactly
 * there. Each step below just claims a slice of that 0–1 range.
 */
export const PLAYBACK_DURATION_S = 10;

/** "Optimal" conditions — light and CO2 maxed out, temperature at its
 *  mid-range peak. `factorRate` below returns 1 (100%) exactly here,
 *  which is what keeps every existing caller's animation timing
 *  unchanged: nothing renders factor controls today, so every scene
 *  runs at these defaults. */
export const DEFAULT_FACTORS: PhotosynthesisFactors = {
  light: 100,
  co2: 100,
  temperature: 50,
};

export const INITIAL_PHOTOSYNTHESIS_STATE: PhotosynthesisState = {
  running: false,
  playbackSeconds: 0,
  factors: DEFAULT_FACTORS,
};

/**
 * Combines the three environmental factors into one 0–1 rate
 * multiplier that scales how fast the playback clock advances —
 * "Factors Affecting Photosynthesis" made visible as the whole scene
 * speeding up, slowing down, or nearly stalling, rather than a
 * separate readout disconnected from what the student sees.
 *
 * - Light and CO2 are each a limiting *raw material*: photosynthesis
 *   can't go faster than whichever one is scarcest, so they combine
 *   with a minimum rather than an average (a simplified version of
 *   Liebig's Law of the Minimum) — deliberately teaching "more of
 *   only one factor doesn't help if another is still limiting."
 * - Temperature instead peaks in the middle (around the default 50)
 *   and falls off toward either extreme, so the model doesn't imply
 *   "hotter is always better" — too cold or too hot both slow the
 *   reaction down.
 *
 * Returns a value in [0.05, 1] — never fully zero, so an extreme
 * setting reads as "very slow" rather than a frozen, ambiguous scene.
 */
export function factorRate(factors: PhotosynthesisFactors): number {
  const materialRate = Math.min(factors.light, factors.co2) / 100;
  const distanceFromOptimal = Math.abs(factors.temperature - DEFAULT_FACTORS.temperature) / DEFAULT_FACTORS.temperature;
  const temperatureRate = Math.max(0, 1 - distanceFromOptimal);
  return Math.max(0.05, materialRate * temperatureRate);
}

export function progressFor(state: Pick<PhotosynthesisState, "playbackSeconds">): number {
  return Math.min(1, Math.max(0, state.playbackSeconds / PLAYBACK_DURATION_S));
}

export function hasFinished(state: Pick<PhotosynthesisState, "playbackSeconds">): boolean {
  return state.playbackSeconds >= PLAYBACK_DURATION_S;
}

export function hasStarted(state: Pick<PhotosynthesisState, "playbackSeconds">): boolean {
  return state.playbackSeconds > 0;
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

interface StepWindow {
  id: StepId;
  start: number;
  end: number;
}

/** Six sequential slices of the 0–1 progress range, in the order the spec lists them. */
export const STEP_WINDOWS: StepWindow[] = [
  { id: "light", start: 0, end: 0.15 },
  { id: "water", start: 0.15, end: 0.35 },
  { id: "co2", start: 0.35, end: 0.5 },
  { id: "reaction", start: 0.5, end: 0.65 },
  { id: "glucose", start: 0.65, end: 0.8 },
  { id: "oxygen", start: 0.8, end: 1 },
];

function windowFor(id: StepId): StepWindow {
  return STEP_WINDOWS.find((w) => w.id === id)!;
}

/** 0 to 1 progress *within* a single step's window — the number every particle's position is lerped against. */
export function stepProgress(progress: number, id: StepId): number {
  const { start, end } = windowFor(id);
  return clamp01((progress - start) / (end - start));
}

export function currentStepId(progress: number): StepId {
  const found = STEP_WINDOWS.find((w) => progress < w.end);
  return (found ?? STEP_WINDOWS[STEP_WINDOWS.length - 1])!.id;
}

const STATUS_MESSAGES: Record<StepId, string> = {
  light: "Light energy is reaching the leaves...",
  water: "Water is moving to the leaves...",
  co2: "Carbon dioxide is entering the leaf...",
  reaction: "Photosynthesis is happening...",
  glucose: "Glucose produced",
  oxygen: "Oxygen released",
};

export function statusMessage(state: PhotosynthesisState): string {
  if (!hasStarted(state)) return "Waiting for sunlight...";
  return STATUS_MESSAGES[currentStepId(progressFor(state))];
}
