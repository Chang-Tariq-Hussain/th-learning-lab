/**
 * Perimeter & Area Explorer — data model & pure geometry helpers.
 *
 * Everything here is plain arithmetic on small integer dimensions —
 * no geometry library. Rectangles are the workhorse shape; triangle
 * and one L-shaped composite figure are added for Levels 8 and 11.
 * Volume, surface area, circles, and coordinate geometry are
 * deliberately out of scope.
 */

// --- Rectangle geometry --------------------------------------------------------

export function rectanglePerimeter(length: number, width: number): number {
  return 2 * (length + width);
}

export function rectangleArea(length: number, width: number): number {
  return length * width;
}

/** A point on a rectangle's boundary at cumulative distance `d` (0..perimeter), walking clockwise from the top-left corner. */
export function pointOnRectBoundary(length: number, width: number, d: number): { xPercent: number; yPercent: number } {
  const perimeter = rectanglePerimeter(length, width);
  const clamped = ((d % perimeter) + perimeter) % perimeter;

  if (clamped <= length) {
    return { xPercent: (clamped / length) * 100, yPercent: 0 };
  }
  if (clamped <= length + width) {
    return { xPercent: 100, yPercent: ((clamped - length) / width) * 100 };
  }
  if (clamped <= 2 * length + width) {
    return { xPercent: 100 - ((clamped - length - width) / length) * 100, yPercent: 100 };
  }
  return { xPercent: 0, yPercent: 100 - ((clamped - 2 * length - width) / width) * 100 };
}

// --- Interactive dimension ranges (Sections 4 & 7) -----------------------------

export const LENGTH_MIN = 1;
export const LENGTH_MAX = 12;
export const WIDTH_MIN = 1;
export const WIDTH_MAX = 10;

// --- Level 1 — perimeter vs area -----------------------------------------------

export const INTRO_RECTANGLE = { length: 6, width: 4 };

// --- Level 2 — perimeter by counting --------------------------------------------

export const COUNTING_RECTANGLE = { length: 5, width: 3 };

// --- Level 3 — perimeter formula -------------------------------------------------

export const FORMULA_RECTANGLE = { length: 6, width: 4 };

// --- Level 4 — area with unit squares --------------------------------------------

export const UNIT_SQUARES_RECTANGLE = { length: 4, width: 3 };

// --- Level 5 — area formula --------------------------------------------------------

export const AREA_FORMULA_RECTANGLE = { length: 6, width: 4 };

// --- Level 6 — interactive rectangle (Sections 4 & 7 merged) ----------------------

export const INTERACTIVE_DEFAULT = { length: 8, width: 5 };

// --- Level 7 — square ----------------------------------------------------------------

export const SQUARE_SIDE_DEFAULT = 5;
export const SQUARE_SIDE_MIN = 1;
export const SQUARE_SIDE_MAX = 10;

// --- Level 8 — triangle perimeter ------------------------------------------------------

export const TRIANGLE_DEFAULT = { a: 5, b: 6, c: 7 };
export const TRIANGLE_SIDE_MIN = 2;
export const TRIANGLE_SIDE_MAX = 12;

// --- Level 9 — same perimeter, different area --------------------------------------

export interface RectangleOption {
  length: number;
  width: number;
}

export const SAME_PERIMETER_OPTIONS: RectangleOption[] = [
  { length: 2, width: 8 },
  { length: 3, width: 7 },
  { length: 4, width: 6 },
  { length: 5, width: 5 },
];
export const SAME_PERIMETER_VALUE = 20;
export const SAME_PERIMETER_BEST_INDEX = 3; // 5 x 5, greatest area

// --- Level 10 — same area, different perimeter ---------------------------------------

export const SAME_AREA_OPTIONS: RectangleOption[] = [
  { length: 1, width: 24 },
  { length: 2, width: 12 },
  { length: 3, width: 8 },
  { length: 4, width: 6 },
];
export const SAME_AREA_VALUE = 24;
export const SAME_AREA_BEST_INDEX = 3; // 4 x 6, smallest perimeter

// --- Level 11 — composite L-shape -----------------------------------------------------

/**
 * A simple L-shape built from two rectangles: a 6x4 rectangle with a
 * 3x2 notch cut from the top-right corner. Defined as an explicit
 * outline (clockwise, in grid units) so perimeter is just "walk the
 * outline" and area is "big rectangle minus the notch" — no general
 * polygon math needed.
 */
export const COMPOSITE_OUTLINE: Array<[number, number]> = [
  [0, 0],
  [6, 0],
  [6, 2],
  [3, 2],
  [3, 4],
  [0, 4],
];
export const COMPOSITE_BOUNDING_BOX = { length: 6, width: 4 };
export const COMPOSITE_NOTCH = { length: 3, width: 2 };

export function compositeOutlinePerimeter(outline: Array<[number, number]>): number {
  let total = 0;
  for (let i = 0; i < outline.length; i++) {
    const [x1, y1] = outline[i]!;
    const [x2, y2] = outline[(i + 1) % outline.length]!;
    total += Math.abs(x2 - x1) + Math.abs(y2 - y1);
  }
  return total;
}

export function compositeArea(): number {
  const big = rectangleArea(COMPOSITE_BOUNDING_BOX.length, COMPOSITE_BOUNDING_BOX.width);
  const notch = rectangleArea(COMPOSITE_NOTCH.length, COMPOSITE_NOTCH.width);
  return big - notch;
}

// --- Level 12 — real-world applications (Sections 13, 14 & 15) ------------------------

export type MeasureKind = "perimeter" | "area";

export interface ClassifyScenario {
  id: string;
  prompt: string;
  correct: MeasureKind;
}

export const CLASSIFY_SCENARIOS: ClassifyScenario[] = [
  { id: "fence", prompt: "Fence around a garden", correct: "perimeter" },
  { id: "paint", prompt: "Paint needed for a wall", correct: "area" },
  { id: "border", prompt: "Border around a photo", correct: "perimeter" },
  { id: "carpet", prompt: "Carpet covering a floor", correct: "area" },
  { id: "park", prompt: "Distance around a park", correct: "perimeter" },
  { id: "tiles", prompt: "Tiles covering a bathroom floor", correct: "area" },
];

export interface RealWorldScenario {
  id: string;
  label: string;
  length: number;
  width: number;
  lengthUnit: string;
  needs: MeasureKind;
  needLabel: string; // e.g. "Fence needed", "Grass needed"
}

export const REAL_WORLD_SCENARIOS: RealWorldScenario[] = [
  { id: "garden", label: "Garden", length: 8, width: 5, lengthUnit: "m", needs: "perimeter", needLabel: "Fence needed" },
  { id: "room", label: "Room", length: 5, width: 4, lengthUnit: "m", needs: "area", needLabel: "Flooring needed" },
  { id: "frame", label: "Picture Frame", length: 30, width: 20, lengthUnit: "cm", needs: "perimeter", needLabel: "Trim needed" },
  { id: "pool", label: "Swimming Pool", length: 12, width: 6, lengthUnit: "m", needs: "area", needLabel: "Cover needed" },
];

// --- Level 13 — practice (Section 16) ---------------------------------------------------

export interface ChallengeQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    id: "rect-perimeter",
    prompt: "Rectangle 6 × 4 — find the perimeter.",
    options: ["10 units", "20 units", "24 units", "48 units"],
    correctIndex: 1,
    explanation: "P = 2(6 + 4) = 2 × 10 = 20 units.",
  },
  {
    id: "rect-area",
    prompt: "Rectangle 6 × 4 — find the area.",
    options: ["10 square units", "20 square units", "24 square units", "48 square units"],
    correctIndex: 2,
    explanation: "A = 6 × 4 = 24 square units.",
  },
  {
    id: "square-perimeter",
    prompt: "Square, side = 5 — find the perimeter.",
    options: ["10 units", "15 units", "20 units", "25 units"],
    correctIndex: 2,
    explanation: "P = 4s = 4 × 5 = 20 units.",
  },
  {
    id: "square-area",
    prompt: "Square, side = 5 — find the area.",
    options: ["10 square units", "20 square units", "25 square units", "30 square units"],
    correctIndex: 2,
    explanation: "A = s² = 5² = 25 square units.",
  },
  {
    id: "which-perimeter",
    prompt: "Which measure is the distance around a shape?",
    options: ["Perimeter", "Area", "Both", "Neither"],
    correctIndex: 0,
    explanation: "Perimeter is the distance around the outside boundary.",
  },
  {
    id: "which-area",
    prompt: "Which measure is the space covered by a shape?",
    options: ["Perimeter", "Area", "Both", "Neither"],
    correctIndex: 1,
    explanation: "Area is the surface covered inside the shape.",
  },
  {
    id: "garden-fence",
    prompt: "A garden is 10 m × 4 m. How much fencing is needed?",
    options: ["14 m", "28 m", "40 m", "56 m"],
    correctIndex: 1,
    explanation: "Fencing goes around the garden: P = 2(10 + 4) = 28 m.",
  },
  {
    id: "floor-area",
    prompt: "A floor is 10 m × 4 m. How much floor area is there?",
    options: ["14 m²", "28 m²", "40 m²", "56 m²"],
    correctIndex: 2,
    explanation: "Flooring covers the surface: A = 10 × 4 = 40 m².",
  },
];
