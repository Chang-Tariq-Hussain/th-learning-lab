/**
 * Digestive System — data model.
 *
 * One continuous playback clock (same pattern as the other Human
 * Physiology sims) drives a `progress` value from 0 to 1 across the
 * whole journey. Six equal-width windows carve that range into
 * stages; within a stage's window the food particle travels along a
 * short hand-placed waypoint chain for ~65% of the window, then
 * "dwells" at the chain's last point for the rest — long enough to
 * read that stage's caption before the next stage begins. Each
 * stage's chain starts exactly where the previous one ended, so the
 * particle never jumps.
 */

import type {
  ChallengeQuestion,
  NutrientInfo,
  OrganInfo,
  Point,
  Stage,
  StageId,
} from "./types";

export const VIEW_WIDTH = 300;
export const VIEW_HEIGHT = 390;

export const TOTAL_DURATION_S = 15;
export const TRAVEL_FRACTION = 0.65;

export const INITIAL_JOURNEY_STATE = { seconds: 0, running: false };

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function lerpPoint(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/** Position along an equally-weighted polyline chain, for t in [0, 1]. Schematic, not true arc length. */
function chainPoint(points: Point[], t: number): Point {
  if (points.length === 1) return points[0]!;
  const segments = points.length - 1;
  const scaled = clamp01(t) * segments;
  const index = Math.min(segments - 1, Math.floor(scaled));
  const localT = scaled - index;
  return lerpPoint(points[index]!, points[index + 1]!, localT);
}

// --- Stages & geometry -----------------------------------------------------------

export const MOUTH: Point = { x: 150, y: 20 };

export const STAGE_POINTS: Record<StageId, Point[]> = {
  mouth: [MOUTH],
  esophagus: [
    { x: 150, y: 34 },
    { x: 150, y: 95 },
  ],
  stomach: [
    { x: 150, y: 95 },
    { x: 145, y: 112 },
    { x: 110, y: 155 },
  ],
  "small-intestine": [
    { x: 110, y: 155 },
    { x: 110, y: 160 },
    { x: 205, y: 160 },
    { x: 205, y: 190 },
    { x: 110, y: 190 },
    { x: 110, y: 220 },
    { x: 190, y: 220 },
    { x: 190, y: 250 },
  ],
  "large-intestine": [
    { x: 190, y: 250 },
    { x: 245, y: 250 },
    { x: 245, y: 100 },
    { x: 65, y: 100 },
    { x: 65, y: 300 },
    { x: 150, y: 345 },
  ],
  rectum: [
    { x: 150, y: 345 },
    { x: 150, y: 365 },
  ],
};

export const STAGE_ORDER: StageId[] = [
  "mouth",
  "esophagus",
  "stomach",
  "small-intestine",
  "large-intestine",
  "rectum",
];
const WINDOW = 1 / STAGE_ORDER.length;

export const STAGES: Stage[] = [
  {
    id: "mouth",
    label: "Mouth",
    caption:
      "Digestion begins in the mouth — teeth break food into smaller pieces and saliva starts chemical digestion.",
  },
  {
    id: "esophagus",
    label: "Esophagus",
    caption:
      "The esophagus moves food toward the stomach using muscular contractions.",
  },
  {
    id: "stomach",
    label: "Stomach",
    caption: "The stomach churns food and mixes it with digestive juices.",
  },
  {
    id: "small-intestine",
    label: "Small Intestine",
    caption:
      "Most nutrient absorption happens here — digested food becomes nutrients that enter the blood.",
  },
  {
    id: "large-intestine",
    label: "Large Intestine",
    caption:
      "The large intestine absorbs much of the remaining water, and material becomes more solid.",
  },
  {
    id: "rectum",
    label: "Rectum",
    caption:
      "Undigested material and waste are eventually removed from the body.",
  },
];

export function stageById(id: StageId): Stage {
  return STAGES.find((s) => s.id === id)!;
}

/** Which stage a given overall progress value (0–1) falls into. */
export function stageAt(progress: number): StageId {
  const index = Math.min(
    STAGE_ORDER.length - 1,
    Math.floor(clamp01(progress) / WINDOW),
  );
  return STAGE_ORDER[index]!;
}

/** Food particle position for overall progress in [0, 1]. */
export function foodPointAt(progress: number): Point {
  const p = clamp01(progress);
  const index = Math.min(STAGE_ORDER.length - 1, Math.floor(p / WINDOW));
  const stageId = STAGE_ORDER[index]!;
  const localT = (p - index * WINDOW) / WINDOW;
  const travelT = clamp01(localT / TRAVEL_FRACTION);
  return chainPoint(STAGE_POINTS[stageId], travelT);
}

export function journeyComplete(progress: number): boolean {
  return progress >= 1;
}

// --- Decorative small-intestine coil & large-intestine frame (drawn from the same waypoints) ---

export function pointsToPath(points: Point[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

// --- Organ Explorer ------------------------------------------------------------

export const ORGANS: OrganInfo[] = [
  {
    id: "mouth",
    label: "Mouth",
    function: "Breaks food down mechanically and starts digestion.",
    explanation:
      "Teeth chew food into smaller pieces while saliva begins breaking it down chemically.",
  },
  {
    id: "esophagus",
    label: "Esophagus",
    function: "Moves food to the stomach.",
    explanation:
      "Muscular contractions squeeze food downward toward the stomach.",
  },
  {
    id: "stomach",
    label: "Stomach",
    function: "Mixes food with digestive juices.",
    explanation:
      "The stomach churns food into a soft mixture and continues breaking it down.",
  },
  {
    id: "small-intestine",
    label: "Small Intestine",
    function: "Absorbs most nutrients.",
    explanation:
      "Digested food is broken down further and nutrients pass into the blood through the intestinal wall.",
  },
  {
    id: "large-intestine",
    label: "Large Intestine",
    function: "Absorbs remaining water.",
    explanation:
      "Water is absorbed from what's left, and the remaining material becomes more solid waste.",
  },
];

// --- Nutrient types --------------------------------------------------------------

export const NUTRIENTS: NutrientInfo[] = [
  {
    id: "glucose",
    label: "Glucose",
    explanation: "Used by cells as an important source of energy.",
  },
  {
    id: "amino-acids",
    label: "Amino acids",
    explanation: "Used to build proteins.",
  },
  {
    id: "fatty-acids",
    label: "Fatty acids",
    explanation: "Used in energy storage and cell structures.",
  },
];

// --- Villi / absorption animation -------------------------------------------------

export const ABSORPTION_DURATION_MS = 1400;

// --- Mini challenge ------------------------------------------------------------

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    prompt: "Where does most nutrient absorption occur?",
    options: [
      { label: "Stomach", correct: false },
      { label: "Small intestine", correct: true },
      { label: "Large intestine", correct: false },
    ],
  },
  {
    prompt: "What is one main function of the large intestine?",
    options: [
      { label: "Absorb remaining water", correct: true },
      { label: "Pump blood", correct: false },
      { label: "Exchange oxygen", correct: false },
    ],
  },
  {
    prompt: "What do villi help with?",
    options: [
      { label: "Nutrient absorption", correct: true },
      { label: "Breathing", correct: false },
      { label: "Pumping blood", correct: false },
    ],
  },
];
