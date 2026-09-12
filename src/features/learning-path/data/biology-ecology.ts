import type { LearningPath } from "../types";

/**
 * Ecology & Ecosystems — a new, dedicated Biology learning path for
 * Biology GLE Batch 5, separate from `biology-cell-foundations` and
 * `biology-human-physiology` since ecology (organisms interacting
 * with each other and their environment at the ecosystem level) has
 * no prerequisite relationship with either cell-biology or
 * physiology topics (same precedent as `physics-wave-motion.ts` and
 * `biology-human-physiology.ts`: a new path for a thematically
 * distinct group rather than forcing it onto an unrelated existing
 * path).
 *
 * Two topics, in the sequence the Batch 5 brief recommends: Ecosystem
 * Explorer establishes the biotic/abiotic components and the
 * producer/consumer/decomposer roles; Food Chain & Food Web then
 * follows the exact path energy takes as it moves between those same
 * roles. As with every other path, this is guidance, not a hard
 * gate: both simulations remain directly openable from the Biology
 * topic grid regardless of path position.
 */
export const biologyEcologyPath: LearningPath = {
  id: "biology-ecology",
  subjectSlug: "biology",
  title: "Ecology & Ecosystems",
  description: "How living things depend on each other and their environment, and how energy moves from the Sun through producers, consumers, and decomposers.",
  colorToken: "biology",
  topics: [
    {
      subjectSlug: "biology",
      topicSlug: "ecosystem-explorer",
      title: "Ecosystem Explorer",
      description: "Biotic and abiotic components, producers, consumers, decomposers, and how they depend on each other.",
      href: "/dashboard/biology/ecosystem-explorer",
      prerequisites: [],
    },
    {
      subjectSlug: "biology",
      topicSlug: "food-chain-web",
      title: "Food Chain & Food Web",
      description: "How energy flows through trophic levels, and why a food web is a more realistic model than a single food chain.",
      href: "/dashboard/biology/food-chain-web",
    },
  ],
};
