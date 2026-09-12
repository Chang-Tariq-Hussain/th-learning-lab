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
 * Two topics so far, in the sensible order the brief calls out:
 * Blood Circulation, then Respiratory System — Blood Circulation
 * comes first because it introduces the general
 * oxygenated/deoxygenated blood concept that Respiratory System's gas
 * exchange section builds on. As with every other path, this is
 * guidance, not a hard gate: both simulations remain directly openable
 * from the Biology topic grid regardless of path position.
 */
export const biologyHumanPhysiologyPath: LearningPath = {
  id: "biology-human-physiology",
  subjectSlug: "biology",
  title: "Human Physiology",
  description: "How the heart and lungs work together to move oxygen through the body.",
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
  ],
};
