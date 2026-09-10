import type { LearningPath } from "../types";

/**
 * Physics Batch 2 (Wave Motion Foundations): a third, separate
 * Physics learning path, alongside (not merged into)
 * `physicsFoundationsPath` and `physicsElectromagnetismPath`. Wave
 * Motion has no prerequisite relationship with Mechanics or
 * Electromagnetism — it doesn't depend on motion, forces, energy,
 * magnets, or compasses — so it gets its own short path rather than
 * being appended to either existing sequence, matching the precedent
 * set by `physics-electromagnetism.ts`.
 *
 * All four Wave Motion simulations are now included: Basic Wave
 * Motion and Transverse vs Longitudinal Waves (added first), plus
 * Frequency & Period and Wave Speed — v = fλ (added in a later batch,
 * once those two gained their own registered `TopicContent`),
 * completing this path's intended four-topic sequence.
 *
 * The recommended order is Basic Wave Motion, then Transverse vs
 * Longitudinal Waves, then Frequency & Period, then Wave Speed: learn
 * the crest/trough/amplitude/wavelength vocabulary on a single,
 * familiar transverse wave first; use that vocabulary to understand
 * the more conceptually demanding transverse/longitudinal
 * distinction; build the frequency/period relationship in isolation,
 * with wavelength deliberately held fixed; then bring wavelength back
 * in as a third variable to complete v = fλ. Each topic after the
 * first leaves `prerequisites` implicit (depends on the previous
 * topic), matching the default-chain convention used throughout
 * `physics-foundations.ts`.
 *
 * As with every other learning path, this only shapes the
 * *recommended* order — both simulations remain directly reachable at
 * their existing routes (`/dashboard/physics/basic-wave-motion`,
 * `/dashboard/physics/transverse-longitudinal-waves`) without
 * completing this path first.
 */
export const physicsWaveMotionPath: LearningPath = {
  id: "physics-wave-motion",
  subjectSlug: "physics",
  title: "Wave Motion Foundations",
  description: "A separate branch from core Mechanics: what a wave is, its basic anatomy, and the two fundamental ways particles can oscillate relative to a wave's travel direction.",
  colorToken: "physics",
  topics: [
    {
      subjectSlug: "physics",
      topicSlug: "basic-wave-motion",
      title: "Basic Wave Motion",
      description: "Crest, trough, amplitude, wavelength, and how the wave pattern travels while the medium only oscillates.",
      href: "/dashboard/physics/basic-wave-motion",
      prerequisites: [],
    },
    {
      subjectSlug: "physics",
      topicSlug: "transverse-longitudinal-waves",
      title: "Transverse vs Longitudinal Waves",
      description: "The two fundamental ways particles can oscillate relative to a wave's direction of travel.",
      href: "/dashboard/physics/transverse-longitudinal-waves",
      // No explicit prerequisites — defaults to depending on Basic Wave Motion.
    },
    {
      subjectSlug: "physics",
      topicSlug: "frequency-period",
      title: "Frequency & Period",
      description: "What frequency and period mean, their units, and the inverse relationship T = 1/f.",
      href: "/dashboard/physics/frequency-period",
      // No explicit prerequisites — defaults to depending on Transverse vs Longitudinal Waves.
    },
    {
      subjectSlug: "physics",
      topicSlug: "wave-speed",
      title: "Wave Speed — v = fλ",
      description: "How wave speed, frequency, and wavelength combine, and how they trade off when speed is fixed.",
      href: "/dashboard/physics/wave-speed",
      // No explicit prerequisites — defaults to depending on Frequency & Period.
    },
  ],
};
