import type { RespirationState, StepId } from "./types";

/**
 * One continuous playback clock (same pattern as Photosynthesis /
 * Simple Motion / Simple Forces) rather than seven separate
 * animations — a single `progress` value from 0 to 1 drives every
 * particle's position, so Pause can stop it at any instant and Start
 * resumes from exactly there. Each step below just claims a slice of
 * that 0–1 range.
 */
export const PLAYBACK_DURATION_S = 12;

export const INITIAL_RESPIRATION_STATE: RespirationState = {
  running: false,
  playbackSeconds: 0,
};

export function progressFor(state: Pick<RespirationState, "playbackSeconds">): number {
  return Math.min(1, Math.max(0, state.playbackSeconds / PLAYBACK_DURATION_S));
}

export function hasFinished(state: Pick<RespirationState, "playbackSeconds">): boolean {
  return state.playbackSeconds >= PLAYBACK_DURATION_S;
}

export function hasStarted(state: Pick<RespirationState, "playbackSeconds">): boolean {
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

/** Seven sequential slices of the 0–1 progress range, in the order the spec lists them. */
export const STEP_WINDOWS: StepWindow[] = [
  { id: "glucose", start: 0, end: 0.12 },
  { id: "oxygen", start: 0.12, end: 0.24 },
  { id: "moving", start: 0.24, end: 0.42 },
  { id: "mitochondrion", start: 0.42, end: 0.55 },
  { id: "energy", start: 0.55, end: 0.72 },
  { id: "co2", start: 0.72, end: 0.86 },
  { id: "water", start: 0.86, end: 1 },
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
  glucose: "Glucose enters the cell",
  oxygen: "Oxygen is available",
  moving: "Moving to the mitochondrion...",
  mitochondrion: "Cellular respiration",
  energy: "Energy produced",
  co2: "Carbon dioxide",
  water: "Water",
};

export function statusMessage(state: RespirationState): string {
  if (!hasStarted(state)) return "Waiting to begin...";
  return STATUS_MESSAGES[currentStepId(progressFor(state))];
}
