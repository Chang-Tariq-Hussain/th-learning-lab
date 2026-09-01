import type { LearningPath } from "../types";

/**
 * Biology Foundations — the running Biology learning path, one batch
 * of topics appended at a time (same growth pattern as
 * `physics-foundations.ts`: the `id`/title stay stable and generic so
 * later, thematically different batches can extend the same path
 * rather than spawning a new one per batch).
 *
 * Batch 1 — Cell Biology Foundations. All seven planned topics are
 * now implemented:
 *
 *   1. What Is a Cell?
 *   2. Cell Structure & Organization
 *   3. Cell Organelles
 *   4. Plant vs Animal Cells
 *   5. Cell Membrane
 *   6. Diffusion & Osmosis
 *   7. Active Transport
 *
 * Topics 1–4 reuse the Interactive Cell Explorer simulation
 * (`@/features/subjects/biology/cell-explorer`); Topics 5–7 reuse the
 * Cell Membrane & Transport simulation
 * (`@/features/subjects/biology/membrane-transport`), which grew a
 * third ("active-transport") mode specifically for Topic 7 rather
 * than getting a second, separate simulation — see the doc comments
 * on each topic's `TopicContent` in `@/features/learning/data/` for
 * exactly how.
 *
 * Batch 1's review/mastery challenge is intentionally NOT represented
 * here yet.
 *
 * Batch 2 — Cellular Energy & Life Processes. All six planned topics
 * are now implemented:
 *
 *   1. Introduction to Cellular Energy
 *   2. Photosynthesis
 *   3. Factors Affecting Photosynthesis
 *   4. Cellular Respiration
 *   5. ATP & Energy Release
 *   6. Photosynthesis vs Cellular Respiration
 *
 * Topic 1 reuses the Cellular Respiration simulation purely for its
 * energy-release visual, kept at an introductory level; Topic 4 gives
 * that same simulation its full, dedicated lesson; Topic 5 revisits
 * it again, focused specifically on the Energy bar / ATP step.
 * Topics 2–3 reuse the Photosynthesis simulation, with Topic 3
 * additionally using its new (additive, opt-in) environmental-factor
 * controls. Topic 6 uses a new, deliberately lightweight comparison
 * component rather than either simulation alone — see the doc
 * comments on each `TopicContent` in `@/features/learning/data/` for
 * exactly how each topic works. Batch 2's topic 1 (`cellular-energy`)
 * now correctly chains off `active-transport`, Batch 1's actual final
 * topic, via its default prerequisite.
 *
 * Batch 2's review/mastery challenge is intentionally NOT represented
 * here yet. When Batch 3 is built, keep appending to this same
 * `topics` array — its order is the path's sequence, mirroring how
 * `physics-foundations.ts` and `mathematics-foundations.ts` grow one
 * topic (or one batch) at a time.
 */
export const biologyCellFoundationsPath: LearningPath = {
  id: "biology-cell-foundations",
  subjectSlug: "biology",
  title: "Biology Foundations",
  description: "From what a cell is and how it's built, through to how cells power themselves and how plants capture energy from sunlight.",
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
    {
      subjectSlug: "biology",
      topicSlug: "active-transport",
      title: "Active Transport",
      description: "How a cell pumps particles against their concentration gradient, spending energy to do it.",
      href: "/dashboard/biology/active-transport",
      // Default prerequisite: depends on "Diffusion & Osmosis" immediately before it.
    },
    // --- Batch 2: Cellular Energy & Life Processes ---
    {
      subjectSlug: "biology",
      topicSlug: "cellular-energy",
      title: "Introduction to Cellular Energy",
      description: "Why cells need energy, where it comes from, and what ATP does.",
      href: "/dashboard/biology/cellular-energy",
      // Default prerequisite: depends on "Active Transport" immediately before it.
    },
    {
      subjectSlug: "biology",
      topicSlug: "photosynthesis",
      title: "Photosynthesis",
      description: "How plants use light, water, and carbon dioxide to make glucose and oxygen.",
      href: "/dashboard/biology/photosynthesis",
      // Default prerequisite: depends on "Introduction to Cellular Energy" immediately before it.
    },
    {
      subjectSlug: "biology",
      topicSlug: "photosynthesis-factors",
      title: "Factors Affecting Photosynthesis",
      description: "How light, carbon dioxide, and temperature speed up or slow down photosynthesis.",
      href: "/dashboard/biology/photosynthesis-factors",
      // Default prerequisite: depends on "Photosynthesis" immediately before it.
    },
    {
      subjectSlug: "biology",
      topicSlug: "cellular-respiration",
      title: "Cellular Respiration",
      description: "How cells release energy from glucose and oxygen, producing ATP, carbon dioxide, and water.",
      href: "/dashboard/biology/cellular-respiration",
      // Default prerequisite: depends on "Factors Affecting Photosynthesis" immediately before it.
    },
    {
      subjectSlug: "biology",
      topicSlug: "atp-energy-release",
      title: "ATP & Energy Release",
      description: "ATP as a cell's spendable energy carrier, and how it powers active transport and other cellular work.",
      href: "/dashboard/biology/atp-energy-release",
      // Default prerequisite: depends on "Cellular Respiration" immediately before it.
    },
    {
      subjectSlug: "biology",
      topicSlug: "photosynthesis-vs-respiration",
      title: "Photosynthesis vs Cellular Respiration",
      description: "How the two processes compare, and how their inputs and outputs connect.",
      href: "/dashboard/biology/photosynthesis-vs-respiration",
      // Default prerequisite: depends on "ATP & Energy Release" immediately before it.
    },
  ],
};
