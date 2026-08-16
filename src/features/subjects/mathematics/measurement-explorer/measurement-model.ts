/**
 * Measurement Explorer — data model & pure conversion helpers.
 *
 * Everything here works in plain numbers and a small `LengthUnit`
 * type — no unit-conversion library. Millimeters are the internal
 * base unit so every conversion is one multiply and one divide.
 */

export type LengthUnit = "mm" | "cm" | "m" | "km";

export const UNIT_TO_MM: Record<LengthUnit, number> = {
  mm: 1,
  cm: 10,
  m: 1000,
  km: 1_000_000,
};

export const UNIT_ORDER: LengthUnit[] = ["mm", "cm", "m", "km"];

export const UNIT_LABEL: Record<LengthUnit, string> = {
  mm: "millimeters (mm)",
  cm: "centimeters (cm)",
  m: "meters (m)",
  km: "kilometers (km)",
};

export function toMM(value: number, unit: LengthUnit): number {
  return value * UNIT_TO_MM[unit];
}

export function fromMM(valueMM: number, unit: LengthUnit): number {
  return valueMM / UNIT_TO_MM[unit];
}

export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
  return fromMM(toMM(value, from), to);
}

/** Trims floating-point noise and unnecessary trailing zeros (6.000001 -> 6, 8.50 -> 8.5). */
export function formatLength(n: number): string {
  const rounded = Math.round(n * 10000) / 10000;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

// --- Level 1 — what is measurement? -------------------------------------------

export interface FamiliarObject {
  id: string;
  name: string;
  icon: "pencil" | "book" | "door" | "table" | "bottle";
}

export const FAMILIAR_OBJECTS: FamiliarObject[] = [
  { id: "pencil", name: "Pencil", icon: "pencil" },
  { id: "book", name: "Book", icon: "book" },
  { id: "desk", name: "Desk", icon: "table" },
  { id: "bottle", name: "Bottle", icon: "bottle" },
  { id: "door", name: "Door", icon: "door" },
];

// --- Level 2 — the ruler ---------------------------------------------------------

export const RULER_INTRO_MAX_CM = 10;
export const RULER_INTRO_OBJECT_CM = 7;

// --- Level 3 — reading the ruler ---------------------------------------------------

export interface ReadingExample {
  id: string;
  maxCm: number;
  lengthCm: number;
}

export const READING_EXAMPLES: ReadingExample[] = [
  { id: "r1", maxCm: 10, lengthCm: 4 },
  { id: "r2", maxCm: 10, lengthCm: 6 },
  { id: "r3", maxCm: 12, lengthCm: 8.5 },
  { id: "r4", maxCm: 15, lengthCm: 12.3 },
];

// --- Level 4 — measuring from a non-zero start ---------------------------------------

export interface NonZeroExample {
  id: string;
  maxCm: number;
  startCm: number;
  lengthCm: number;
}

export const NON_ZERO_EXAMPLES: NonZeroExample[] = [
  { id: "nz1", maxCm: 12, startCm: 2, lengthCm: 7 },
  { id: "nz2", maxCm: 15, startCm: 3, lengthCm: 8 },
  { id: "nz3", maxCm: 15, startCm: 4.5, lengthCm: 6 },
];

// --- Level 6 — units of length ---------------------------------------------------------

export interface UnitExample {
  id: string;
  label: string;
  unit: LengthUnit;
}

export const UNIT_EXAMPLES: UnitExample[] = [
  { id: "coin", label: "Thickness of a coin", unit: "mm" },
  { id: "pencil-unit", label: "Length of a pencil", unit: "cm" },
  { id: "door-unit", label: "Height of a door", unit: "m" },
  { id: "cities", label: "Distance between two cities", unit: "km" },
];

export interface UnitChallengeQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const UNIT_CHALLENGE_QUESTIONS: UnitChallengeQuestion[] = [
  {
    id: "uc-cities",
    prompt: "Distance between Karachi and Lahore",
    options: ["cm", "m", "km", "mm"],
    correctIndex: 2,
    explanation: "City-to-city distances are hundreds of kilometers — km keeps the number manageable.",
  },
  {
    id: "uc-pencil",
    prompt: "Length of a pencil",
    options: ["mm", "cm", "m", "km"],
    correctIndex: 1,
    explanation: "A pencil is around 15–18 cm — a natural fit for centimeters.",
  },
  {
    id: "uc-coin",
    prompt: "Thickness of a coin",
    options: ["mm", "cm", "m", "km"],
    correctIndex: 0,
    explanation: "A coin is only a couple of millimeters thick — cm or larger would round to almost nothing.",
  },
  {
    id: "uc-door",
    prompt: "Height of a door",
    options: ["mm", "cm", "m", "km"],
    correctIndex: 2,
    explanation: "Doors are around 2 meters tall — meters is the natural unit for room-sized objects.",
  },
  {
    id: "uc-classroom",
    prompt: "Width of a classroom",
    options: ["mm", "cm", "m", "km"],
    correctIndex: 2,
    explanation: "Rooms are measured in meters — the same scale as a door's height.",
  },
  {
    id: "uc-fingernail",
    prompt: "Width of a fingernail",
    options: ["mm", "cm", "m", "km"],
    correctIndex: 1,
    explanation: "A fingernail is roughly 1–1.5 cm wide — too big for mm to be the natural choice, too small for m.",
  },
];

// --- Level 7 — unit conversion ---------------------------------------------------------

export const CONVERSION_STARTER_VALUE = 2.5;
export const CONVERSION_STARTER_UNIT: LengthUnit = "m";

// --- Level 8 — estimation ---------------------------------------------------------

export interface EstimationQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const ESTIMATION_QUESTIONS: EstimationQuestion[] = [
  {
    id: "est-pencil",
    prompt: "Estimate the length of a pencil.",
    options: ["5 cm", "20 cm", "2 m"],
    correctIndex: 1,
    explanation: "A typical pencil is about 17 cm long — close to 20 cm.",
  },
  {
    id: "est-book",
    prompt: "Estimate the length of a textbook.",
    options: ["3 cm", "25 cm", "1 m"],
    correctIndex: 1,
    explanation: "A textbook is around 24 cm long.",
  },
  {
    id: "est-desk",
    prompt: "Estimate the length of a school desk.",
    options: ["50 cm", "1.2 m", "5 m"],
    correctIndex: 1,
    explanation: "A school desk is typically about 1.1 m long.",
  },
  {
    id: "est-door",
    prompt: "Estimate the height of a door.",
    options: ["1 m", "2 m", "4 m"],
    correctIndex: 1,
    explanation: "Standard doors are close to 2 m (about 203 cm) tall.",
  },
  {
    id: "est-bottle",
    prompt: "Estimate the height of a water bottle.",
    options: ["5 cm", "23 cm", "80 cm"],
    correctIndex: 1,
    explanation: "A standard water bottle is roughly 23 cm tall.",
  },
];

// --- Level 9 — measurement lab ---------------------------------------------------------

export interface LabObject {
  id: string;
  name: string;
  icon: FamiliarObject["icon"];
  actualCm: number;
  rulerMaxCm: number;
  estimateOptions: number[];
}

export const LAB_OBJECTS: LabObject[] = [
  { id: "lab-pencil", name: "Pencil", icon: "pencil", actualCm: 16, rulerMaxCm: 20, estimateOptions: [10, 16, 25] },
  { id: "lab-book", name: "Book", icon: "book", actualCm: 22, rulerMaxCm: 30, estimateOptions: [15, 22, 35] },
  { id: "lab-bottle", name: "Bottle", icon: "bottle", actualCm: 21, rulerMaxCm: 30, estimateOptions: [12, 21, 30] },
];

// --- Level 10 — practice challenge ---------------------------------------------------------

export interface ClassifyQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const MEASUREMENT_CHALLENGE_QUESTIONS: ClassifyQuestion[] = [
  {
    id: "unit-pencil",
    prompt: "What is the most appropriate unit for a pencil?",
    options: ["mm", "cm", "m", "km"],
    correctIndex: 1,
    explanation: "A pencil is roughly 15–18 cm long — centimeters is the natural fit.",
  },
  {
    id: "mm-in-cm",
    prompt: "How many millimeters are in 1 cm?",
    options: ["1 mm", "10 mm", "100 mm", "1000 mm"],
    correctIndex: 1,
    explanation: "1 cm = 10 mm.",
  },
  {
    id: "cm-in-m",
    prompt: "How many centimeters are in 1 m?",
    options: ["10 cm", "100 cm", "1000 cm", "10000 cm"],
    correctIndex: 1,
    explanation: "1 m = 100 cm.",
  },
  {
    id: "non-zero-length",
    prompt: "An object starts at 3 cm and ends at 11 cm. What is its length?",
    options: ["3 cm", "8 cm", "11 cm", "14 cm"],
    correctIndex: 1,
    explanation: "Length = End − Start = 11 − 3 = 8 cm.",
  },
  {
    id: "cities-unit",
    prompt: "Which is more appropriate for the distance between two cities?",
    options: ["mm", "cm", "m", "km"],
    correctIndex: 3,
    explanation: "City-to-city distances are far too large to express conveniently in mm, cm, or even m.",
  },
  {
    id: "convert-m-cm",
    prompt: "Convert: 2.5 m → cm",
    options: ["0.25 cm", "25 cm", "250 cm", "2500 cm"],
    correctIndex: 2,
    explanation: "1 m = 100 cm, so 2.5 m = 2.5 × 100 = 250 cm.",
  },
];
