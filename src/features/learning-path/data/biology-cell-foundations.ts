import type { LearningPath } from "../types";

/**
 * Biology: Cell Biology Foundations — "Batch 1" of the Biology
 * learning path.
 *
 * Only the first three topics are implemented so far:
 *
 *   1. What Is a Cell?
 *   2. Cell Structure & Organization
 *   3. Cell Organelles
 *
 * All three reuse the existing Interactive Cell Explorer simulation
 * (`@/features/subjects/biology/cell-explorer`) rather than a new one
 * — see the doc comments on each topic's `TopicContent` in
 * `@/features/learning/data/` for exactly how.
 *
 * Batch 2 (Plant vs Animal Cells, Cell Membrane, Diffusion & Osmosis,
 * Active Transport, etc.) is intentionally NOT represented here yet.
 * When it's built, append its topics to this same `topics` array —
 * the array's order is the path's sequence, so Batch 2's first topic
 * will naturally chain off `cell-organelles` as its default
 * prerequisite. This mirrors how `physics-foundations.ts` and
 * `mathematics-foundations.ts` grow one topic at a time.
 */
export const biologyCellFoundationsPath: LearningPath = {
  id: "biology-cell-foundations",
  subjectSlug: "biology",
  title: "Biology: Cell Biology Foundations",
  description: "Start with what a cell is, then explore how it's built and what each of its organelles does.",
  colorToken: "biology",
  topics: [
    {
      subjectSlug: "biology",
      topicSlug: "what-is-a-cell",
      title: "What Is a Cell?",
      description: "The basic unit of life, and unicellular vs multicellular organisms.",
      href: "/dashboard/biology/what-is-a-cell",
      prerequisites: [],
    },
    {
      subjectSlug: "biology",
      topicSlug: "cell-structure-organization",
      title: "Cell Structure & Organization",
      description: "The boundary, cytoplasm, and genetic material every cell is built from.",
      href: "/dashboard/biology/cell-structure-organization",
      // Default prerequisite: depends on "What Is a Cell?" immediately before it.
    },
    {
      subjectSlug: "biology",
      topicSlug: "cell-organelles",
      title: "Cell Organelles",
      description: "What the nucleus, mitochondria, ribosomes, and other organelles actually do.",
      href: "/dashboard/biology/cell-organelles",
      // Default prerequisite: depends on "Cell Structure & Organization" immediately before it.
    },
  ],
};
