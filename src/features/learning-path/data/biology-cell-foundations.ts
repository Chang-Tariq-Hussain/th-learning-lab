import type { LearningPath } from "../types";

/**
 * Biology: Cell Biology Foundations — "Batch 1" of the Biology
 * learning path.
 *
 * Six of the planned seven topics are implemented so far:
 *
 *   1. What Is a Cell?
 *   2. Cell Structure & Organization
 *   3. Cell Organelles
 *   4. Plant vs Animal Cells
 *   5. Cell Membrane
 *   6. Diffusion & Osmosis
 *
 * Topics 1–4 reuse the Interactive Cell Explorer simulation
 * (`@/features/subjects/biology/cell-explorer`); Topics 5–6 reuse the
 * Cell Membrane & Transport simulation
 * (`@/features/subjects/biology/membrane-transport`) — see the doc
 * comments on each topic's `TopicContent` in
 * `@/features/learning/data/` for exactly how.
 *
 * Topic 7 (Active Transport) and Batch 1's review/mastery challenge
 * are intentionally NOT represented here yet. When they're built,
 * append Topic 7 to this same `topics` array (it will naturally chain
 * off `diffusion-osmosis` as its default prerequisite), and Batch 2
 * after that — the array's order is the path's sequence, mirroring
 * how `physics-foundations.ts` and `mathematics-foundations.ts` grow
 * one topic at a time.
 */
export const biologyCellFoundationsPath: LearningPath = {
  id: "biology-cell-foundations",
  subjectSlug: "biology",
  title: "Biology: Cell Biology Foundations",
  description: "Start with what a cell is, then explore how it's built, what each organelle does, and how substances move across its membrane.",
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
    {
      subjectSlug: "biology",
      topicSlug: "plant-vs-animal-cells",
      title: "Plant vs Animal Cells",
      description: "What plant and animal cells share, and what makes plant cells different.",
      href: "/dashboard/biology/plant-vs-animal-cells",
      // Default prerequisite: depends on "Cell Organelles" immediately before it.
    },
    {
      subjectSlug: "biology",
      topicSlug: "cell-membrane",
      title: "Cell Membrane",
      description: "Selective permeability, and why a cell controls what crosses its boundary.",
      href: "/dashboard/biology/cell-membrane",
      // Default prerequisite: depends on "Plant vs Animal Cells" immediately before it.
    },
    {
      subjectSlug: "biology",
      topicSlug: "diffusion-osmosis",
      title: "Diffusion & Osmosis",
      description: "How particles and water move across the membrane on their own, without energy.",
      href: "/dashboard/biology/diffusion-osmosis",
      // Default prerequisite: depends on "Cell Membrane" immediately before it.
    },
  ],
};
