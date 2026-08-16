/**
 * Food Chain & Food Web — data model.
 *
 * One small grassland scene reused across two modes:
 *  - Food Chain: a single energy pathway, Sun → Grass → Grasshopper →
 *    Frog → Snake → Hawk.
 *  - Food Web: the same organisms (plus Rabbit and Bird) connected by
 *    several feeding relationships, so students can see how many food
 *    chains overlap.
 * Decomposers sit outside the chain/web and close the loop back to
 * producers. Everything here is illustrative, not exact biology.
 */

import type {
  ChallengeQuestion,
  Organism,
  OrganismId,
  TrophicLevel,
  WebEdge,
} from "./types";

export const ORGANISMS: Organism[] = [
  {
    id: "sun",
    label: "Sun",
    role: "source",
    roleLabel: "Energy source",
    trophicLevel: null,
    description:
      "The Sun is the original source of energy that powers almost every food chain.",
  },
  {
    id: "grass",
    label: "Grass",
    role: "producer",
    roleLabel: "Producer",
    trophicLevel: 1,
    description: "Grass makes its own food using sunlight.",
    webCaption:
      "Grass captures the Sun's energy and passes it on to the animals that eat it.",
  },
  {
    id: "grasshopper",
    label: "Grasshopper",
    role: "primary",
    roleLabel: "Primary consumer",
    trophicLevel: 2,
    description: "Eats plants and gets energy from them.",
    webCaption:
      "Grasshoppers get energy from grass and pass it on to the animals that eat them.",
  },
  {
    id: "rabbit",
    label: "Rabbit",
    role: "primary",
    roleLabel: "Primary consumer",
    trophicLevel: 2,
    description: "Eats grass and other plants for energy.",
    webCaption:
      "Rabbits obtain energy from plants and can provide energy to predators.",
  },
  {
    id: "frog",
    label: "Frog",
    role: "secondary",
    roleLabel: "Secondary consumer",
    trophicLevel: 3,
    description: "Eats organisms such as insects.",
    webCaption:
      "Frogs get energy by eating insects, then pass energy on to larger predators.",
  },
  {
    id: "bird",
    label: "Bird",
    role: "secondary",
    roleLabel: "Secondary consumer",
    trophicLevel: 3,
    description: "Eats insects such as grasshoppers for energy.",
    webCaption:
      "Birds get energy by eating insects, then pass energy on to larger predators.",
  },
  {
    id: "snake",
    label: "Snake",
    role: "tertiary",
    roleLabel: "Higher-level consumer",
    trophicLevel: 4,
    description: "Obtains energy by eating other animals.",
    webCaption:
      "Snakes get energy from smaller animals and can become food for top predators.",
  },
  {
    id: "hawk",
    label: "Hawk",
    role: "tertiary",
    roleLabel: "Top consumer",
    trophicLevel: 4,
    description: "Can feed on organisms at lower trophic levels.",
    webCaption:
      "Hawks sit at the top of this food web, feeding on several other animals.",
  },
  {
    id: "fungi",
    label: "Fungi",
    role: "decomposer",
    roleLabel: "Decomposer",
    trophicLevel: null,
    description:
      "Decomposers break down dead organisms and return nutrients to the soil.",
  },
];

export function organismById(id: OrganismId): Organism {
  return ORGANISMS.find((o) => o.id === id)!;
}

// --- Food chain -----------------------------------------------------------------------

export const CHAIN_SEQUENCE: OrganismId[] = [
  "sun",
  "grass",
  "grasshopper",
  "frog",
  "snake",
  "hawk",
];

/** Illustrative energy remaining at each step of the chain — not exact values. */
export const ENERGY_LADDER: { id: OrganismId; label: string }[] = [
  { id: "sun", label: "100%" },
  { id: "grass", label: "~10%" },
  { id: "grasshopper", label: "~1%" },
  { id: "frog", label: "~0.1%" },
  { id: "snake", label: "~0.01%" },
  { id: "hawk", label: "~0.001%" },
];

// --- Food web ---------------------------------------------------------------------------

export const WEB_EDGES: WebEdge[] = [
  { from: "grass", to: "grasshopper" },
  { from: "grass", to: "rabbit" },
  { from: "grasshopper", to: "frog" },
  { from: "grasshopper", to: "bird" },
  { from: "rabbit", to: "snake" },
  { from: "frog", to: "snake" },
  { from: "bird", to: "hawk" },
  { from: "snake", to: "hawk" },
];

export function edgesForMode(mode: "chain" | "web"): WebEdge[] {
  if (mode === "web") return WEB_EDGES;
  const edges: WebEdge[] = [];
  for (let i = 0; i < CHAIN_SEQUENCE.length - 1; i++) {
    edges.push({ from: CHAIN_SEQUENCE[i]!, to: CHAIN_SEQUENCE[i + 1]! });
  }
  return edges;
}

/** Organisms directly connected to `id`, one hop up or down the web. */
export function relatedIds(id: OrganismId, mode: "chain" | "web"): OrganismId[] {
  const edges = edgesForMode(mode);
  const related = new Set<OrganismId>();
  for (const e of edges) {
    if (e.from === id) related.add(e.to);
    if (e.to === id) related.add(e.from);
  }
  return Array.from(related);
}

// --- Trophic levels -----------------------------------------------------------------------

export const TROPHIC_LEVEL_LABELS: Record<TrophicLevel, string> = {
  1: "Producers",
  2: "Primary consumers",
  3: "Secondary consumers",
  4: "Tertiary consumers",
};

export function idsForLevel(level: TrophicLevel): OrganismId[] {
  return ORGANISMS.filter((o) => o.trophicLevel === level).map((o) => o.id);
}

// --- Remove Grasshoppers experiment ------------------------------------------------

export const GRASSHOPPER_REMOVED_EFFECTS = [
  { id: "frog" as OrganismId, label: "Frog", note: "Less food available" },
  { id: "bird" as OrganismId, label: "Bird", note: "Less food available" },
  { id: "grass" as OrganismId, label: "Grass", note: "Less grazing pressure" },
];

// --- Decomposers ------------------------------------------------------------------------

export const DECOMPOSER_STEPS = [
  "Dead organic matter",
  "Decomposers",
  "Nutrients",
  "Producers",
];

// --- Mini challenge -------------------------------------------------------------------

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    prompt: "What is the first trophic level?",
    options: [
      { label: "Producers", correct: true },
      { label: "Primary consumers", correct: false },
      { label: "Secondary consumers", correct: false },
    ],
  },
  {
    prompt: "What do primary consumers usually eat?",
    options: [
      { label: "Producers", correct: true },
      { label: "Top predators", correct: false },
      { label: "Decomposers", correct: false },
    ],
  },
  {
    prompt: "What does a food web show?",
    options: [
      { label: "Many connected food chains", correct: true },
      { label: "Only one organism", correct: false },
      { label: "Only decomposers", correct: false },
    ],
  },
  {
    prompt: "Why are decomposers important?",
    options: [
      { label: "They return nutrients to the environment", correct: true },
      { label: "They produce sunlight", correct: false },
      { label: "They are always top predators", correct: false },
    ],
  },
];
