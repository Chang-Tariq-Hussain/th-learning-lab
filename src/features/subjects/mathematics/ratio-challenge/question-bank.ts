import { pickOne, randInt, shuffle } from "./ratio-utils";
import type {
  ChoiceQuestion,
  Difficulty,
  DragDropQuestion,
  MissingValueQuestion,
  Question,
  QuestionKind,
  SimplifyQuestion,
} from "./types";

/**
 * Coprime a:b pairs, grouped by difficulty. Kept coprime so a random
 * scale factor `k` is the *only* common factor of `p*k : q*k` — every
 * "simplify" question has an unambiguous simplest form, and every
 * "missing value" question has an unambiguous scale relationship.
 */
const BASE_PAIRS: Record<Difficulty, [number, number][]> = {
  1: [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5]],
  2: [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [2, 7], [3, 7]],
  3: [[3, 5], [4, 5], [5, 6], [2, 7], [3, 7], [5, 7], [4, 9], [5, 9], [7, 8], [5, 8]],
};

/** The random scale factor(s) multiplied onto a base pair — the main lever that makes higher difficulties use bigger numbers. */
const SCALE_RANGE: Record<Difficulty, [number, number]> = {
  1: [2, 4],
  2: [2, 6],
  3: [3, 9],
};

function basePairsFor(difficulty: Difficulty): [number, number][] {
  return BASE_PAIRS[difficulty];
}

function scaleRangeFor(difficulty: Difficulty): [number, number] {
  return SCALE_RANGE[difficulty];
}

function randomScale(difficulty: Difficulty): number {
  const [min, max] = scaleRangeFor(difficulty);
  return randInt(min, max);
}

let idCounter = 0;
const nextId = () => ++idCounter;

const KIND_POOL: QuestionKind[] = [
  "missing-value",
  "simplify",
  "equivalent-mc",
  "equivalent-dragdrop",
  "word-problem",
];

// ---------------------------------------------------------------------------
// Simplify
// ---------------------------------------------------------------------------

function genSimplify(difficulty: Difficulty): SimplifyQuestion {
  const [p, q] = pickOne(basePairsFor(difficulty));
  const k = randomScale(difficulty);
  const a = p * k;
  const b = q * k;

  return {
    id: nextId(),
    kind: "simplify",
    difficulty,
    a,
    b,
    prompt: `Simplify the ratio ${a} : ${b} to its lowest terms.`,
    answerA: p,
    answerB: q,
    explanation: `${a} and ${b} share a greatest common factor of ${k}. Dividing both sides by ${k} gives ${p} : ${q}, which has no common factor left to divide out.`,
  };
}

// ---------------------------------------------------------------------------
// Missing value
// ---------------------------------------------------------------------------

function pickMissingSlot(difficulty: Difficulty): "a" | "b" | "c" | "d" {
  if (difficulty === 1) return "d";
  if (difficulty === 2) return pickOne(["c", "d"] as const);
  return pickOne(["a", "b", "c", "d"] as const);
}

function genMissingValue(difficulty: Difficulty): MissingValueQuestion {
  const [p, q] = pickOne(basePairsFor(difficulty));
  const k1 = randomScale(difficulty);
  let k2 = randomScale(difficulty);
  let guard = 0;
  while (k2 === k1 && guard < 8) {
    k2 = randomScale(difficulty);
    guard++;
  }

  const a = p * k1;
  const b = q * k1;
  const c = p * k2;
  const d = q * k2;
  const missing = pickMissingSlot(difficulty);
  const values = { a, b, c, d };
  const answer = values[missing];

  const shown = {
    a: missing === "a" ? "?" : a,
    b: missing === "b" ? "?" : b,
    c: missing === "c" ? "?" : c,
    d: missing === "d" ? "?" : d,
  };

  return {
    id: nextId(),
    kind: "missing-value",
    difficulty,
    a,
    b,
    c,
    d,
    missing,
    answer,
    prompt: `Find the missing value: ${shown.a} : ${shown.b}  =  ${shown.c} : ${shown.d}`,
    explanation: `Both sides describe the same ratio, ${p} : ${q}. Scaling ${p} : ${q} by ${k1} gives ${a} : ${b}, and scaling it by ${k2} gives ${c} : ${d} — so the missing value is ${answer}.`,
  };
}

// ---------------------------------------------------------------------------
// Equivalent ratios — multiple choice
// ---------------------------------------------------------------------------

function genEquivalentMc(difficulty: Difficulty): ChoiceQuestion {
  const [p, q] = pickOne(basePairsFor(difficulty));
  const kShown = randomScale(difficulty);
  const a = p * kShown;
  const b = q * kShown;

  const kAnswer = randomScale(difficulty);
  const correctA = p * kAnswer;
  const correctB = q * kAnswer;
  const correctLabel = `${correctA} : ${correctB}`;

  const distractors = new Set<string>();
  let guard = 0;
  while (distractors.size < 3 && guard < 60) {
    guard++;
    const variant = randInt(0, 2);
    let da = correctA;
    let db = correctB;
    if (variant === 0) {
      da = correctA + pickOne([-2, -1, 1, 2]);
    } else if (variant === 1) {
      db = correctB + pickOne([-2, -1, 1, 2]);
    } else {
      da = correctB;
      db = correctA;
    }
    if (da <= 0 || db <= 0) continue;
    const label = `${da} : ${db}`;
    if (label !== correctLabel) distractors.add(label);
  }

  const choices = shuffle([correctLabel, ...distractors]);
  const correctIndex = choices.indexOf(correctLabel);

  return {
    id: nextId(),
    kind: "equivalent-mc",
    difficulty,
    prompt: `Which ratio is equivalent to ${a} : ${b}?`,
    choices,
    correctIndex,
    explanation: `${a} : ${b} simplifies to ${p} : ${q}. ${correctLabel} also simplifies to ${p} : ${q}, so the two describe the same relationship.`,
  };
}

// ---------------------------------------------------------------------------
// Equivalent ratios — drag and drop
// ---------------------------------------------------------------------------

function genDragDrop(difficulty: Difficulty): DragDropQuestion {
  const [p, q] = pickOne(basePairsFor(difficulty));
  const kTarget = randomScale(difficulty);
  const targetA = p * kTarget;
  const targetB = q * kTarget;

  // Kept modest (2-4) regardless of difficulty so the resulting tile
  // numbers stay legible — the tile *count* is what scales difficulty.
  const scale = randInt(2, 4);
  const answerA = targetA * scale;
  const answerB = targetB * scale;

  const tileCount = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
  const distractors = new Set<number>();
  let guard = 0;
  while (distractors.size < tileCount - 2 && guard < 60) {
    guard++;
    const base = pickOne([answerA, answerB]);
    const val = base + pickOne([-3, -2, -1, 1, 2, 3]);
    if (val > 0 && val !== answerA && val !== answerB) distractors.add(val);
  }

  const tiles = shuffle([answerA, answerB, ...distractors]);

  return {
    id: nextId(),
    kind: "equivalent-dragdrop",
    difficulty,
    targetA,
    targetB,
    scale,
    tiles,
    answerA,
    answerB,
    prompt: `Drag two tiles into the blanks to build a ratio equivalent to ${targetA} : ${targetB}, scaled ×${scale}.`,
    explanation: `${targetA} : ${targetB} scaled by ${scale} is ${targetA} × ${scale} : ${targetB} × ${scale} = ${answerA} : ${answerB}.`,
  };
}

// ---------------------------------------------------------------------------
// Word problems
// ---------------------------------------------------------------------------

interface WordSetup {
  p: number;
  q: number;
  k: number;
  given: number;
  answer: number;
}

function wordSetup(difficulty: Difficulty): WordSetup {
  const [p, q] = pickOne(basePairsFor(difficulty));
  const k = randomScale(difficulty);
  return { p, q, k, given: p * k, answer: q * k };
}

const WORD_TEMPLATES: Array<(s: WordSetup) => { prompt: string; explanation: string; unit: string }> = [
  (s) => ({
    prompt: `A recipe uses flour and sugar in a ratio of ${s.p} : ${s.q}. A baker uses ${s.given} cups of flour — how many cups of sugar are needed?`,
    explanation: `Flour to sugar is ${s.p} : ${s.q}. ${s.given} cups of flour is ${s.k} × ${s.p}, so sugar needed is ${s.k} × ${s.q} = ${s.answer} cups.`,
    unit: "cups",
  }),
  (s) => ({
    prompt: `A shade of green paint mixes blue and yellow in a ratio of ${s.p} : ${s.q}. If ${s.given} liters of blue paint are used, how many liters of yellow paint are needed?`,
    explanation: `Blue to yellow is ${s.p} : ${s.q}. ${s.given} liters of blue is ${s.k} × ${s.p}, so yellow needed is ${s.k} × ${s.q} = ${s.answer} liters.`,
    unit: "liters",
  }),
  (s) => ({
    prompt: `On a map, ${s.p} cm represents ${s.q} km in real life. Two towns are ${s.given} cm apart on the map — how far apart are they in real life?`,
    explanation: `The scale is ${s.p} cm : ${s.q} km. ${s.given} cm is ${s.k} × ${s.p} cm, so the real distance is ${s.k} × ${s.q} = ${s.answer} km.`,
    unit: "km",
  }),
  (s) => ({
    prompt: `In a class, the ratio of boys to girls is ${s.p} : ${s.q}. There are ${s.given} boys — how many girls are there?`,
    explanation: `Boys to girls is ${s.p} : ${s.q}. ${s.given} boys is ${s.k} × ${s.p}, so girls = ${s.k} × ${s.q} = ${s.answer}.`,
    unit: "girls",
  }),
  (s) => ({
    prompt: `A fruit basket has apples to oranges in a ratio of ${s.p} : ${s.q}. There are ${s.given} apples — how many oranges are in the basket?`,
    explanation: `Apples to oranges is ${s.p} : ${s.q}. ${s.given} apples is ${s.k} × ${s.p}, so oranges = ${s.k} × ${s.q} = ${s.answer}.`,
    unit: "oranges",
  }),
];

function genWordProblem(difficulty: Difficulty): ChoiceQuestion {
  const setup = wordSetup(difficulty);
  const template = pickOne(WORD_TEMPLATES)(setup);

  const distractors = new Set<number>();
  let guard = 0;
  while (distractors.size < 3 && guard < 60) {
    guard++;
    const val = setup.answer + pickOne([-4, -3, -2, -1, 1, 2, 3, 4]);
    if (val > 0 && val !== setup.answer) distractors.add(val);
  }

  const options = shuffle([setup.answer, ...distractors]);
  const choices = options.map((n) => `${n} ${template.unit}`);
  const correctIndex = options.indexOf(setup.answer);

  return {
    id: nextId(),
    kind: "word-problem",
    difficulty,
    prompt: template.prompt,
    choices,
    correctIndex,
    explanation: template.explanation,
  };
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

/** Generates one random question at the given difficulty, avoiding an immediate repeat of `excludeKind` when possible. */
export function generateQuestion(difficulty: Difficulty, excludeKind?: QuestionKind): Question {
  let kind = pickOne(KIND_POOL);
  let guard = 0;
  while (kind === excludeKind && guard < 10) {
    kind = pickOne(KIND_POOL);
    guard++;
  }

  switch (kind) {
    case "missing-value":
      return genMissingValue(difficulty);
    case "simplify":
      return genSimplify(difficulty);
    case "equivalent-mc":
      return genEquivalentMc(difficulty);
    case "equivalent-dragdrop":
      return genDragDrop(difficulty);
    case "word-problem":
      return genWordProblem(difficulty);
  }
}
