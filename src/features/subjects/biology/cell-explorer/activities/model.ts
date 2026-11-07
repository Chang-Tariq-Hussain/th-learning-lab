import { ORGANELLES, organellesFor } from "../data/organelles";
import type { CellKind, OrganelleId } from "../types";

export type Rng = () => number;

export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** Small seeded generator so tests can reproduce a round. */
export function seededRng(seed: number): Rng {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ChoiceOption {
  value: string;
  label: string;
}

export interface Question {
  /** Unique within a round; for these activities it is the structure's id. */
  id: OrganelleId;
  /** The value that counts as correct. */
  answer: string;
  /** Present for multiple-choice questions (Function, Compare quiz). Identify answers by clicking the cell. */
  options?: ChoiceOption[];
}

export type RoundStatus = "asking" | "correct" | "revealed";

export interface RoundState {
  questions: Question[];
  index: number;
  status: RoundStatus;
  /** Wrong answers given for the current question. */
  wrong: string[];
  hints: number;
  /** Questions answered correctly with no wrong answer and no reveal. */
  firstTry: number;
  /** Structures the learner needed help with, for the end-of-round review. */
  missed: OrganelleId[];
  finished: boolean;
}

export type RoundAction =
  | { type: "answer"; value: string }
  | { type: "hint" }
  | { type: "reveal" }
  | { type: "next" }
  | { type: "restart"; questions: Question[] };

export function startRound(questions: Question[]): RoundState {
  return { questions, index: 0, status: "asking", wrong: [], hints: 0, firstTry: 0, missed: [], finished: questions.length === 0 };
}

export const MAX_HINTS = 2;

export function roundReducer(state: RoundState, action: RoundAction): RoundState {
  const q = state.questions[state.index];
  switch (action.type) {
    case "restart":
      return startRound(action.questions);
    case "answer": {
      if (!q || state.status !== "asking") return state;
      if (action.value === q.answer) {
        const clean = state.wrong.length === 0;
        return {
          ...state,
          status: "correct",
          firstTry: state.firstTry + (clean ? 1 : 0),
          missed: clean || state.missed.includes(q.id) ? state.missed : [...state.missed, q.id],
        };
      }
      if (state.wrong.includes(action.value)) return state;
      return { ...state, wrong: [...state.wrong, action.value] };
    }
    case "hint":
      return state.status === "asking" ? { ...state, hints: Math.min(MAX_HINTS, state.hints + 1) } : state;
    case "reveal":
      if (!q || state.status !== "asking") return state;
      return { ...state, status: "revealed", missed: state.missed.includes(q.id) ? state.missed : [...state.missed, q.id] };
    case "next": {
      if (state.status === "asking") return state;
      const last = state.index + 1 >= state.questions.length;
      return last ? { ...state, finished: true } : { ...state, index: state.index + 1, status: "asking", wrong: [], hints: 0 };
    }
  }
}

/* -------------------------------- builders -------------------------------- */

/** Structures that must not appear together as answer options because their functions overlap. */
const OVERLAPPING: ReadonlyArray<readonly [OrganelleId, OrganelleId]> = [["vacuole", "largeVacuole"]];

function overlaps(a: OrganelleId, b: OrganelleId): boolean {
  return OVERLAPPING.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

export const IDENTIFY_ROUND_SIZE = 8;
export const FUNCTION_ROUND_SIZE = 6;
export const SORT_ROUND_SIZE = 8;

/** "Find the ___": one question per structure present in the chosen cell. */
export function buildIdentifyQuestions(kind: CellKind, rng: Rng = Math.random, size = IDENTIFY_ROUND_SIZE): Question[] {
  return shuffle(organellesFor(kind), rng)
    .slice(0, size)
    .map((o) => ({ id: o.id, answer: o.id }));
}

/** "What does the highlighted structure do?": the right function plus three from other structures in the same cell. */
export function buildFunctionQuestions(kind: CellKind, rng: Rng = Math.random, size = FUNCTION_ROUND_SIZE): Question[] {
  const pool = organellesFor(kind);
  return shuffle(pool, rng)
    .slice(0, size)
    .map((target) => {
      const others = shuffle(
        pool.filter((o) => o.id !== target.id && !overlaps(o.id, target.id)),
        rng,
      );
      const picked: typeof pool = [];
      for (const o of others) {
        if (picked.length === 3) break;
        if (picked.some((p) => overlaps(p.id, o.id))) continue;
        picked.push(o);
      }
      const options = shuffle([target, ...picked], rng).map((o) => ({ value: o.id, label: o.function }));
      return { id: target.id, answer: target.id, options };
    });
}

export const SORT_OPTIONS: ChoiceOption[] = [
  { value: "plant", label: "Only in plant cells" },
  { value: "both", label: "In both plant and animal cells" },
];

/** "Where is it found?": every structure except cytoplasm (it is in all cells, which makes it a giveaway). */
export function buildSortQuestions(rng: Rng = Math.random, size = SORT_ROUND_SIZE): Question[] {
  const ids = (Object.keys(ORGANELLES) as OrganelleId[]).filter((id) => id !== "cytoplasm");
  return shuffle(ids, rng)
    .slice(0, size)
    .map((id) => ({ id, answer: ORGANELLES[id].presence === "plant" ? "plant" : "both", options: SORT_OPTIONS }));
}

/** Short teaching note shown after a "where is it found?" answer. */
export const SORT_NOTES: Partial<Record<OrganelleId, string>> = {
  mitochondria: "Plant cells have mitochondria too: they use them to release energy from the sugar their chloroplasts make.",
  nucleus: "Both plant and animal cells are eukaryotic cells, so both have a nucleus.",
  cellMembrane: "Plant cells have a cell membrane as well. It sits just inside the cell wall.",
  vacuole: "Both cell types can have small vacuoles. Only plant cells have the one large central vacuole.",
  largeVacuole: "Animal cells can have small vacuoles, but not a large central one that fills most of the cell.",
  cellWall: "Animal cells have only a flexible cell membrane around them, with no cell wall.",
  chloroplast: "Animal cells cannot photosynthesise, so they have no chloroplasts.",
  plasmodesmata: "They pass through cell walls, and animal cells have none. Animal cells use other links, such as gap junctions.",
  ribosomes: "Every cell, plant or animal, needs ribosomes to build proteins.",
  roughER: "Plant and animal cells both fold and process proteins in the rough ER.",
  smoothER: "Plant and animal cells both have smooth ER.",
  golgi: "Plant and animal cells both use the Golgi apparatus to sort and package cargo.",
  vesicles: "Plant and animal cells both move cargo in vesicles.",
  nucleolus: "Plant and animal nuclei both contain a nucleolus.",
  nuclearEnvelope: "Plant and animal nuclei are both surrounded by a nuclear envelope.",
};
