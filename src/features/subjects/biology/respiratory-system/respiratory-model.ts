/**
 * Respiratory System — Breathing & Gas Exchange — data model.
 *
 * Breathing uses one continuous playback clock (same pattern as
 * Blood Circulation / Photosynthesis / Cellular Respiration): a
 * `seconds` value counts up during inhale and down during exhale
 * across a fixed BREATH_DURATION_S window. `breathPhase` (0 = fully
 * exhaled, 1 = fully inhaled) is just seconds / duration, and every
 * visual — lung size, air particle position — is derived from that
 * one number, so Pause can freeze it anywhere and Reset returns to 0.
 */

import type { AirStage, BreathDirection, BreathingState, ChallengeQuestion, Journey } from "./types";

export const VIEW_WIDTH = 300;
export const VIEW_HEIGHT = 340;

export const BREATH_DURATION_S = 2;

export const INITIAL_BREATHING_STATE: BreathingState = {
  seconds: 0,
  direction: "in",
  auto: false,
  running: false,
};

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

export function breathPhase(state: Pick<BreathingState, "seconds">): number {
  return clamp01(state.seconds / BREATH_DURATION_S);
}

/**
 * Advance the breathing clock by `dt` seconds. Manual Inhale/Exhale
 * stop (running: false) once they reach their end; Auto Breathing
 * flips direction and keeps going.
 */
export function stepBreathing(state: BreathingState, dt: number): BreathingState {
  if (!state.running) return state;

  const sign = state.direction === "in" ? 1 : -1;
  let seconds = state.seconds + sign * dt;
  let direction: BreathDirection = state.direction;
  let running = true;

  if (seconds >= BREATH_DURATION_S) {
    seconds = BREATH_DURATION_S;
    if (state.auto) direction = "out";
    else running = false;
  } else if (seconds <= 0) {
    seconds = 0;
    if (state.auto) direction = "in";
    else running = false;
  }

  return { ...state, seconds, direction, running };
}

// --- Air Pathway ("Follow the Air") --------------------------------------------

export const AIR_STAGES: AirStage[] = [
  { id: "mouth", label: "Nose / Mouth", caption: "Air enters the body through the nose or mouth.", highlight: "mouth" },
  { id: "trachea", label: "Trachea", caption: "Carries air toward the lungs.", highlight: "trachea" },
  { id: "bronchi", label: "Bronchi", caption: "Two main branches carry air into the lungs.", highlight: "bronchi" },
  { id: "bronchioles", label: "Bronchioles", caption: "Smaller branches spread air deeper into each lung.", highlight: "bronchi" },
  { id: "alveoli", label: "Alveoli", caption: "Tiny air sacs where gas exchange occurs.", highlight: "alveoli" },
];

// --- Lung scene geometry ---------------------------------------------------------

export interface Point {
  x: number;
  y: number;
}

export const MOUTH: Point = { x: 150, y: 26 };
export const CARINA: Point = { x: 150, y: 118 };
export const LUNG_CENTER = {
  left: { x: 100, y: 190 } as Point,
  right: { x: 200, y: 190 } as Point,
};
export const ALVEOLI_POINT = {
  left: { x: 100, y: 244 } as Point,
  right: { x: 200, y: 244 } as Point,
};

/** Position along the mouth → carina → alveoli path for a given side, at t in [0, 1]. */
export function airPathPoint(t: number, side: "left" | "right"): Point {
  const split = 0.35;
  if (t <= split) {
    const u = t / split;
    return { x: lerp(MOUTH.x, CARINA.x, u), y: lerp(MOUTH.y, CARINA.y, u) };
  }
  const u = (t - split) / (1 - split);
  const end = ALVEOLI_POINT[side];
  return { x: lerp(CARINA.x, end.x, u), y: lerp(CARINA.y, end.y, u) };
}

export const LUNG_BASE_RX = 46;
export const LUNG_BASE_RY = 68;
export const LUNG_EXPANSION = 0.16;

export function lungRadii(phase: number): { rx: number; ry: number } {
  const scale = 1 + LUNG_EXPANSION * phase;
  return { rx: LUNG_BASE_RX * scale, ry: LUNG_BASE_RY * scale };
}

// --- Gas exchange (alveoli close-up) ---------------------------------------------

export const GAS_EXCHANGE_DURATION_MS = 1400;

// --- O2 / CO2 journeys -------------------------------------------------------------

export const JOURNEYS: Record<"o2" | "co2", Journey> = {
  o2: {
    id: "o2",
    label: "Follow O₂",
    summary: "Oxygen enters the blood in the lungs and is carried to body cells.",
    steps: [
      { label: "Alveolus", caption: "Oxygen enters the alveolus with a breath in." },
      { label: "Blood", caption: "Oxygen crosses into the blood in a nearby capillary." },
      { label: "Body tissues", caption: "Blood carries oxygen to cells all over the body." },
    ],
  },
  co2: {
    id: "co2",
    label: "Follow CO₂",
    summary: "Carbon dioxide produced by cells is carried back to the lungs and exhaled.",
    steps: [
      { label: "Body tissues", caption: "Cells produce carbon dioxide as a waste product." },
      { label: "Blood", caption: "Carbon dioxide moves into the blood to be carried away." },
      { label: "Lungs", caption: "Blood carries carbon dioxide back to the lungs." },
      { label: "Alveoli", caption: "Carbon dioxide moves from the blood into the alveoli." },
      { label: "Exhaled air", caption: "Carbon dioxide leaves the body on the next breath out." },
    ],
  },
};

// --- Mini challenge ------------------------------------------------------------

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    prompt: "Where does gas exchange occur?",
    options: [
      { label: "Alveoli", correct: true },
      { label: "Trachea", correct: false },
      { label: "Nose", correct: false },
    ],
  },
  {
    prompt: "Which gas moves from the alveoli into the blood?",
    options: [
      { label: "Oxygen", correct: true },
      { label: "Carbon dioxide", correct: false },
    ],
  },
  {
    prompt: "Which gas moves from the blood into the alveoli?",
    options: [
      { label: "Oxygen", correct: false },
      { label: "Carbon dioxide", correct: true },
    ],
  },
];
