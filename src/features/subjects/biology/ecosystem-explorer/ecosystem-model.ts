/**
 * Ecosystem Explorer — data model.
 *
 * A single small pond/forest scene with ten clickable components. Three
 * lightweight interaction layers sit on top of the same scene, matching
 * the click-to-explore pattern used across the other Biology sims:
 *  - Selecting a component shows its role and a one-line explanation.
 *  - A Biotic / Abiotic toggle highlights components by category.
 *  - An Explore Roles picker highlights components by role.
 * Two small conceptual "experiments" (remove plants, reduce water) dim
 * related parts of the scene rather than running any real simulation.
 */

import type {
  ChallengeQuestion,
  ComponentId,
  EcosystemComponent,
  ExploreRoleId,
} from "./types";

export const COMPONENTS: EcosystemComponent[] = [
  {
    id: "sun",
    label: "Sun",
    category: "abiotic",
    role: "abiotic",
    roleLabel: "Abiotic factor",
    description:
      "Sunlight provides the energy that powers almost every living thing in the ecosystem.",
    relationship: ["Sunlight", "Plants", "Animals"],
  },
  {
    id: "air",
    label: "Air",
    category: "abiotic",
    role: "abiotic",
    roleLabel: "Abiotic factor",
    description:
      "Air supplies the carbon dioxide plants use and the oxygen animals breathe.",
  },
  {
    id: "water",
    label: "Water",
    category: "abiotic",
    role: "abiotic",
    roleLabel: "Abiotic factor",
    description: "Water is an abiotic factor that nearly every organism here depends on.",
  },
  {
    id: "soil",
    label: "Soil",
    category: "abiotic",
    role: "abiotic",
    roleLabel: "Abiotic factor",
    description:
      "Soil holds nutrients and water that plant roots take up to grow.",
    relationship: ["Dead organic matter", "Decomposers", "Soil nutrients"],
  },
  {
    id: "tree",
    label: "Tree",
    category: "biotic",
    role: "producer",
    roleLabel: "Producer",
    description: "Trees make their own food using sunlight, water, and air.",
    relationship: ["Sunlight", "Tree", "Herbivores"],
  },
  {
    id: "grass",
    label: "Grass",
    category: "biotic",
    role: "producer",
    roleLabel: "Producer",
    description: "Grass makes its own food using sunlight, and feeds many small animals.",
    relationship: ["Sunlight", "Grass", "Herbivores"],
  },
  {
    id: "insect",
    label: "Insect",
    category: "biotic",
    role: "consumer",
    roleLabel: "Consumer",
    description: "Insects get energy by feeding on plants.",
    relationship: ["Grass", "Insect", "Birds"],
  },
  {
    id: "rabbit",
    label: "Rabbit",
    category: "biotic",
    role: "consumer",
    roleLabel: "Consumer",
    description: "Rabbits obtain energy by eating plants.",
    relationship: ["Grass", "Rabbit", "Energy for growth"],
  },
  {
    id: "bird",
    label: "Bird",
    category: "biotic",
    role: "consumer",
    roleLabel: "Consumer",
    description: "Birds get energy by eating insects and seeds from plants.",
    relationship: ["Insect", "Bird", "Energy for growth"],
  },
  {
    id: "fungus",
    label: "Fungus",
    category: "biotic",
    role: "decomposer",
    roleLabel: "Decomposer",
    description:
      "Decomposers break down dead organic matter and return nutrients to the soil.",
    relationship: ["Dead organic matter", "Fungus", "Soil nutrients"],
  },
];

export function componentById(id: ComponentId): EcosystemComponent {
  return COMPONENTS.find((c) => c.id === id)!;
}

// --- Explore Roles ------------------------------------------------------------------

export const ROLE_MESSAGES: Record<ExploreRoleId, { label: string; caption: string }> = {
  producer: {
    label: "Producer",
    caption:
      "Producers make their own food and provide energy for other organisms.",
  },
  consumer: {
    label: "Consumer",
    caption: "Consumers get energy by eating other organisms.",
  },
  decomposer: {
    label: "Decomposer",
    caption:
      "Decomposers break down dead material and return nutrients to the environment.",
  },
};

export function idsForRole(role: ExploreRoleId): ComponentId[] {
  return COMPONENTS.filter((c) => c.role === role).map((c) => c.id);
}

export function idsForCategory(category: "biotic" | "abiotic"): ComponentId[] {
  return COMPONENTS.filter((c) => c.category === category).map((c) => c.id);
}

// --- Plant-dependent components, for the balance experiment ------------------------

export const PLANT_IDS: ComponentId[] = ["tree", "grass"];
export const PLANT_DEPENDENT_IDS: ComponentId[] = ["insect", "rabbit", "bird"];

// --- Mini challenge -------------------------------------------------------------------

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    prompt: "What is a producer?",
    options: [
      { label: "An organism that makes its own food", correct: true },
      { label: "An organism that only eats animals", correct: false },
      { label: "An organism that breaks down dead material", correct: false },
    ],
  },
  {
    prompt: "Which is an abiotic factor?",
    options: [
      { label: "Rabbit", correct: false },
      { label: "Plant", correct: false },
      { label: "Water", correct: true },
    ],
  },
  {
    prompt: "What is the role of decomposers?",
    options: [
      { label: "Break down dead organic matter", correct: true },
      { label: "Produce sunlight", correct: false },
      { label: "Eat only plants", correct: false },
    ],
  },
];
