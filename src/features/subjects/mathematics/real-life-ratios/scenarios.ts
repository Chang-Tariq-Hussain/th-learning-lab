import {
  Droplet,
  MapPin,
  PaintBucket,
  Route,
  TreeDeciduous,
  TreePine,
  User,
  Wheat,
  type LucideIcon,
} from "lucide-react";

/** One of the two illustrated quantities a scenario compares (e.g. "Red paint" vs "Blue paint"). */
export interface UnitDef {
  label: string;
  /** Singular noun used in the generated prompt, e.g. "can", "student", "mile". */
  noun: string;
  hex: string;
  /** Omitted for marbles, which render as a plain glossy ball instead of an icon-in-a-chip. */
  icon?: LucideIcon;
}

export interface ScenarioDef {
  id: string;
  title: string;
  /** What one "group" of the ratio is called, e.g. "batch", "class", "jar" — used in the key-ratio caption. */
  groupNoun: string;
  unitA: UnitDef;
  unitB: UnitDef;
}

export const SCENARIOS: ScenarioDef[] = [
  {
    id: "paint",
    title: "Paint Mixing",
    groupNoun: "batch",
    unitA: { label: "Red paint", noun: "can", hex: "#D2504A", icon: PaintBucket },
    unitB: { label: "Blue paint", noun: "can", hex: "#3D5AFE", icon: PaintBucket },
  },
  {
    id: "recipe",
    title: "Recipe Ingredients",
    groupNoun: "batch",
    unitA: { label: "Flour", noun: "cup", hex: "#C99A3E", icon: Wheat },
    unitB: { label: "Milk", noun: "cup", hex: "#4FA6D8", icon: Droplet },
  },
  {
    id: "students",
    title: "Boys vs Girls",
    groupNoun: "group",
    unitA: { label: "Boys", noun: "boy", hex: "#3D5AFE", icon: User },
    unitB: { label: "Girls", noun: "girl", hex: "#E0679A", icon: User },
  },
  {
    id: "marbles",
    title: "Marbles",
    groupNoun: "jar",
    unitA: { label: "Red marbles", noun: "marble", hex: "#D2504A" },
    unitB: { label: "Blue marbles", noun: "marble", hex: "#3D5AFE" },
  },
  {
    id: "trees",
    title: "Trees",
    groupNoun: "row",
    unitA: { label: "Pine trees", noun: "tree", hex: "#2E9E5B", icon: TreePine },
    unitB: { label: "Oak trees", noun: "tree", hex: "#C97B3E", icon: TreeDeciduous },
  },
  {
    id: "map",
    title: "Map Scale",
    groupNoun: "step",
    unitA: { label: "Map inches", noun: "inch", hex: "#7C4FE0", icon: MapPin },
    unitB: { label: "Real miles", noun: "mile", hex: "#F2A65A", icon: Route },
  },
];

export type AskFor = "a" | "b";

export interface Challenge {
  id: number;
  scenario: ScenarioDef;
  /** The simplest form of the ratio, e.g. 2 : 3. */
  ratioA: number;
  ratioB: number;
  /** How many times the base ratio is scaled up for this round. */
  scale: number;
  /** Which side the student must solve for; the other side is shown as the "given". */
  askFor: AskFor;
}

/** Small, mostly-coprime ratio pairs — easy to picture as repeated equal groups. */
const RATIO_PAIRS: { a: number; b: number }[] = [
  { a: 1, b: 2 },
  { a: 2, b: 1 },
  { a: 1, b: 3 },
  { a: 3, b: 1 },
  { a: 2, b: 3 },
  { a: 3, b: 2 },
  { a: 1, b: 4 },
  { a: 4, b: 1 },
  { a: 3, b: 4 },
  { a: 4, b: 3 },
  { a: 2, b: 5 },
  { a: 5, b: 2 },
];

const MAX_ICONS_PER_SIDE = 20;

let idCounter = 0;

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

export function nextChallenge(excludeScenarioId?: string): Challenge {
  let scenario = pick(SCENARIOS);
  let attempts = 0;
  while (excludeScenarioId !== undefined && scenario.id === excludeScenarioId && attempts < 6) {
    scenario = pick(SCENARIOS);
    attempts++;
  }

  const { a, b } = pick(RATIO_PAIRS);
  const maxScale = Math.max(2, Math.floor(MAX_ICONS_PER_SIDE / Math.max(a, b)));
  const scale = 2 + Math.floor(Math.random() * (Math.min(maxScale, 6) - 1));
  const askFor: AskFor = Math.random() < 0.5 ? "a" : "b";

  return { id: ++idCounter, scenario, ratioA: a, ratioB: b, scale, askFor };
}

export function givenValue(challenge: Challenge): number {
  const { ratioA, ratioB, scale, askFor } = challenge;
  return (askFor === "a" ? ratioB : ratioA) * scale;
}

export function answerValue(challenge: Challenge): number {
  const { ratioA, ratioB, scale, askFor } = challenge;
  return (askFor === "a" ? ratioA : ratioB) * scale;
}

export function givenUnit(challenge: Challenge): UnitDef {
  return challenge.askFor === "a" ? challenge.scenario.unitB : challenge.scenario.unitA;
}

export function askUnit(challenge: Challenge): UnitDef {
  return challenge.askFor === "a" ? challenge.scenario.unitA : challenge.scenario.unitB;
}

/** groupSize for illustrating the given/asked side as repeated copies of the base ratio. */
export function givenGroupSize(challenge: Challenge): number {
  return challenge.askFor === "a" ? challenge.ratioB : challenge.ratioA;
}

export function askGroupSize(challenge: Challenge): number {
  return challenge.askFor === "a" ? challenge.ratioA : challenge.ratioB;
}
