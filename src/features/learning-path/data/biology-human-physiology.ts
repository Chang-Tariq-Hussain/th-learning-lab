import type { LearningPath } from "../types";

/**
 * Human Physiology — a new, dedicated Biology learning path for
 * Biology GLE Batch 4, separate from `biology-cell-foundations` since
 * physiology topics (organ systems working together) have no
 * prerequisite relationship with the existing cell-biology topics
 * (mirrors the precedent set by `physics-wave-motion.ts`, a new path
 * for a thematically distinct group rather than forcing it onto an
 * unrelated existing path).
 *
 * Four topics now, in the sensible order the Batch 4 brief calls out:
 * Blood Circulation -> Respiratory System -> Digestive System ->
 * Nervous System. Blood Circulation comes first because it introduces
 * the general oxygenated/deoxygenated blood concept that Respiratory
 * System's gas exchange section builds on. Digestive System follows,
 * since absorbed nutrients need circulation to reach the rest of the
 * body (see the `digestion-circulation-nutrient-transport`
 * cross-subject connection). Nervous System comes last, since its
 * regulation of digestion (see `nervous-system-digestion-regulation`)
 * reads better once the process it's regulating is already familiar.
 * As with every other path, this is guidance, not a hard gate: all
 * four simulations remain directly openable from the Biology topic
 * grid regardless of path position.
 */
export const biologyHumanPhysiologyPath: LearningPath = {
  id: "biology-human-physiology",
  subjectSlug: "biology",
  title: "Human Physiology",
  description: "How the heart, lungs, digestive system, and nervous system work together to move oxygen and nutrients through the body and coordinate its responses.",
  colorToken: "biology",
  topics: [
    {
      subjectSlug: "biology",
      topicSlug: "blood-circulation",
      title: "Blood Circulation",
      description: "The heart's four chambers, the blood-flow pathway, and pulmonary vs. systemic circulation.",
      href: "/dashboard/biology/blood-circulation",
      prerequisites: [],
    },
    {
      subjectSlug: "biology",
      topicSlug: "respiratory-system",
      title: "Respiratory System",
      description: "The air pathway, breathing mechanics, and gas exchange in the alveoli.",
      href: "/dashboard/biology/respiratory-system",
    },
    {
      subjectSlug: "biology",
      topicSlug: "digestive-system",
      title: "Digestive System",
      description: "The journey of food through the digestive tract, and how nutrients are absorbed.",
      href: "/dashboard/biology/digestive-system",
    },
    {
      subjectSlug: "biology",
      topicSlug: "nervous-system",
      title: "Nervous System",
      description: "Neuron structure, signal transmission, synaptic communication, and CNS vs. PNS.",
      href: "/dashboard/biology/nervous-system",
    },
  ],
};
