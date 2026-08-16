import type { PhotosynthesisState, StepId } from "./types";

/**
 * One continuous playback clock (same pattern as Simple Motion /
 * Simple Forces) rather than six separate animations — a single
 * `progress` value from 0 to 1 drives every particle's position, so
 * Pause can stop it at any instant and Start resumes from exactly
 * there. Each step below just claims a slice of that 0–1 range.
 */
export const PLAYBACK_DURATION_S = 10;

export const INITIAL_PHOTOSYNTHESIS_STATE: PhotosynthesisState = {
  running: false,
  playbackSeconds: 0,
};

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
