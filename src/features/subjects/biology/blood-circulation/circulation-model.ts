/**
 * Blood Circulation — data model.
 *
 * The whole circuit — body → heart → lungs → heart → body — is one
 * continuous closed loop made of four quadratic-bezier segments (A–D).
 * A single looping clock (same rAF pattern as Photosynthesis, but
 * wrapping instead of finishing) drives a phase in [0, 1); N particles
 * sit at evenly spaced phase offsets around that loop, so they read as
 * a flowing stream rather than N independent animations. Each
 * particle's color is just "which segment is it currently on" — no
 * separate oxygen-state simulation needed.
 */

export const VIEW_WIDTH = 340;
export const VIEW_HEIGHT = 400;

export const LOOP_DURATION_S = 6;
export const PARTICLE_COUNT = 12;

export type SegmentId = "A" | "B" | "C" | "D";
export type ShapeId = "body" | "heart" | "lungs";
export type OxygenState = "poor" | "rich";

interface Point {
  x: number;
  y: number;
}

interface Segment {
  id: SegmentId;
  from: Point;
  control: Point;
  to: Point;
  oxygen: OxygenState;
}

// Shared anchor points so adjoining segments meet exactly.
const BODY_LEFT: Point = { x: 140, y: 332 };
const BODY_RIGHT: Point = { x: 200, y: 332 };
const HEART_RIGHT: Point = { x: 150, y: 178 };
const HEART_LEFT: Point = { x: 190, y: 178 };
const LUNGS_LEFT: Point = { x: 128, y: 96 };
const LUNGS_RIGHT: Point = { x: 212, y: 96 };

export const SEGMENTS: Segment[] = [
  { id: "A", from: BODY_LEFT, control: { x: 98, y: 250 }, to: HEART_RIGHT, oxygen: "poor" },
  { id: "B", from: HEART_RIGHT, control: { x: 108, y: 140 }, to: LUNGS_LEFT, oxygen: "poor" },
  { id: "C", from: LUNGS_RIGHT, control: { x: 232, y: 140 }, to: HEART_LEFT, oxygen: "rich" },
  { id: "D", from: HEART_LEFT, control: { x: 242, y: 250 }, to: BODY_RIGHT, oxygen: "rich" },
];

export const SHAPE_CENTERS: Record<ShapeId, Point> = {
  lungs: { x: 170, y: 78 },
  heart: { x: 170, y: 205 },
  body: { x: 170, y: 366 },
};

function pointOnSegment(segment: Segment, u: number): Point {
  const inv = 1 - u;
  return {
    x: inv * inv * segment.from.x + 2 * inv * u * segment.control.x + u * u * segment.to.x,
    y: inv * inv * segment.from.y + 2 * inv * u * segment.control.y + u * u * segment.to.y,
  };
}

const SEGMENT_ORDER: SegmentId[] = ["A", "B", "C", "D"];
const WINDOW = 1 / SEGMENT_ORDER.length;

export function segmentPath(segment: Segment): string {
  return `M ${segment.from.x} ${segment.from.y} Q ${segment.control.x} ${segment.control.y} ${segment.to.x} ${segment.to.y}`;
}

export function segmentById(id: SegmentId): Segment {
  return SEGMENTS.find((s) => s.id === id)!;
}

/** Position + which segment a particle is on, for a global loop phase t in [0, 1). */
export function pointOnLoop(t: number): { point: Point; segment: Segment } {
  const wrapped = ((t % 1) + 1) % 1;
  const index = Math.min(SEGMENT_ORDER.length - 1, Math.floor(wrapped / WINDOW));
  const segmentId = SEGMENT_ORDER[index]!;
  const segment = segmentById(segmentId);
  const u = (wrapped - index * WINDOW) / WINDOW;
  return { point: pointOnSegment(segment, u), segment };
}

export const OXYGEN_COLOR: Record<OxygenState, string> = {
  poor: "fill-sky-500 stroke-sky-700 dark:fill-sky-400 dark:stroke-sky-600",
  rich: "fill-rose-500 stroke-rose-700 dark:fill-rose-400 dark:stroke-rose-600",
};

// --- Focus (highlighting) ----------------------------------------------------

export interface Focus {
  segments: SegmentId[];
  shapes: ShapeId[];
  caption: string;
}

// --- Trace Blood mode ---------------------------------------------------------

export interface TraceStep extends Focus {
  title: string;
}

export const TRACE_STEPS: TraceStep[] = [
  {
    title: "Body → Heart",
    segments: ["A"],
    shapes: ["body", "heart"],
    caption: "Oxygen-poor blood returns from the body to the heart.",
  },
  {
    title: "Heart → Lungs",
    segments: ["B"],
    shapes: ["heart", "lungs"],
    caption: "The heart sends oxygen-poor blood to the lungs.",
  },
  {
    title: "Lungs → Heart",
    segments: ["C"],
    shapes: ["lungs", "heart"],
    caption: "Blood picks up oxygen in the lungs.",
  },
  {
    title: "Heart → Body",
    segments: ["D"],
    shapes: ["heart", "body"],
    caption: "Oxygen-rich blood is pumped to the body.",
  },
];

export const TRACE_COMPLETE_MESSAGE = "One complete circulation.";

// --- Pulmonary vs systemic ----------------------------------------------------

export type CircuitId = "pulmonary" | "systemic";

export const CIRCUITS: Record<CircuitId, Focus & { label: string }> = {
  pulmonary: {
    label: "Pulmonary",
    segments: ["B", "C"],
    shapes: ["heart", "lungs"],
    caption: "Pulmonary circulation carries blood between the heart and lungs.",
  },
  systemic: {
    label: "Systemic",
    segments: ["D", "A"],
    shapes: ["heart", "body"],
    caption: "Systemic circulation carries blood between the heart and body.",
  },
};

// --- Heart chambers ------------------------------------------------------------

export type ChamberId = "right-atrium" | "right-ventricle" | "left-atrium" | "left-ventricle";

export const CHAMBERS: { id: ChamberId; label: string; explanation: string }[] = [
  { id: "right-atrium", label: "Right Atrium", explanation: "Receives oxygen-poor blood returning from the body." },
  { id: "right-ventricle", label: "Right Ventricle", explanation: "Pumps oxygen-poor blood toward the lungs." },
  { id: "left-atrium", label: "Left Atrium", explanation: "Receives oxygen-rich blood from the lungs." },
  { id: "left-ventricle", label: "Left Ventricle", explanation: "Pumps oxygen-rich blood to the body." },
];

// --- Follow the Blood (learning route) -----------------------------------------

export interface RouteStage extends Focus {
  id: string;
  label: string;
}

export const ROUTE_STAGES: RouteStage[] = [
  { id: "body-1", label: "Body", segments: [], shapes: ["body"], caption: "Blood delivers oxygen and nutrients to body tissues." },
  { id: "vena-cava", label: "Vena cava", segments: ["A"], shapes: [], caption: "The vena cava carries oxygen-poor blood back to the heart." },
  { id: "right-atrium", label: "Right atrium", segments: [], shapes: ["heart"], caption: "The right atrium receives oxygen-poor blood from the body." },
  { id: "right-ventricle", label: "Right ventricle", segments: [], shapes: ["heart"], caption: "The right ventricle pumps blood toward the lungs." },
  { id: "pulmonary-artery", label: "Pulmonary artery", segments: ["B"], shapes: [], caption: "The pulmonary artery carries oxygen-poor blood to the lungs." },
  { id: "lungs", label: "Lungs", segments: [], shapes: ["lungs"], caption: "In the lungs, blood releases carbon dioxide and picks up oxygen." },
  { id: "pulmonary-veins", label: "Pulmonary veins", segments: ["C"], shapes: [], caption: "The pulmonary veins carry oxygen-rich blood back to the heart." },
  { id: "left-atrium", label: "Left atrium", segments: [], shapes: ["heart"], caption: "The left atrium receives oxygen-rich blood from the lungs." },
  { id: "left-ventricle", label: "Left ventricle", segments: [], shapes: ["heart"], caption: "The left ventricle pumps oxygen-rich blood out to the body." },
  { id: "aorta", label: "Aorta", segments: ["D"], shapes: [], caption: "The aorta carries oxygen-rich blood out to the body." },
  { id: "body-2", label: "Body", segments: [], shapes: ["body"], caption: "Oxygen-rich blood reaches the body's tissues, and the cycle begins again." },
];

// --- Mini challenge -------------------------------------------------------------

export interface ChallengeQuestion {
  prompt: string;
  options: { label: string; correct: boolean }[];
}

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    prompt: "Where does oxygen-poor blood go after leaving the right ventricle?",
    options: [
      { label: "Lungs", correct: true },
      { label: "Brain", correct: false },
      { label: "Left ventricle", correct: false },
    ],
  },
  {
    prompt: "Which side of the heart pumps oxygen-rich blood to the body?",
    options: [
      { label: "Right side", correct: false },
      { label: "Left side", correct: true },
    ],
  },
  {
    prompt: "Where does blood pick up oxygen?",
    options: [
      { label: "Lungs", correct: true },
      { label: "Kidneys", correct: false },
      { label: "Stomach", correct: false },
    ],
  },
];
