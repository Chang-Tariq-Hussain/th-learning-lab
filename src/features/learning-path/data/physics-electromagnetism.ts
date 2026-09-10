import type { LearningPath } from "../types";

/**
 * Physics Batch 4: a second, separate Physics learning path,
 * alongside (not merged into) `physicsFoundationsPath`. Magnet
 * Explorer and Compass Explorer have no prerequisite relationship
 * with the Mechanics sequence in `physics-foundations.ts` — they
 * don't depend on motion, forces, or energy — so they get their own
 * short, two-topic path rather than being appended to the end of
 * Mechanics (which `physicsFoundationsPath`'s own doc comment already
 * flagged as the right way to add them once their Golden Learning
 * Experience content existed).
 *
 * The recommended order is Magnet Explorer, then Compass Explorer:
 * understand what a magnet and a magnetic field are first, then use a
 * compass to investigate a field's direction. Compass Explorer's
 * `prerequisites` are left implicit (depends on the previous topic),
 * matching the default-chain convention used throughout
 * `physics-foundations.ts` for a strictly two-topic linear sequence.
 *
 * As with every other learning path, this only shapes the
 * *recommended* order — both simulations remain directly reachable at
 * their existing routes (`/dashboard/physics/magnet-explorer`,
 * `/dashboard/physics/compass-explorer`) without completing this path
 * first (see `@/app/dashboard/physics/[topic]/page.tsx` files, which
 * render the simulation unconditionally).
 */
export const physicsElectromagnetismPath: LearningPath = {
  id: "physics-electromagnetism",
  subjectSlug: "physics",
  title: "Electromagnetism",
  description:
    "A separate branch from core Mechanics: magnets, magnetic fields, and how a compass reveals a field's direction.",
  colorToken: "physics",
  topics: [
    {
      subjectSlug: "physics",
      topicSlug: "magnet-explorer",
      title: "Interactive Magnet Explorer",
      description: "Poles, attraction and repulsion, and magnetic fields.",
      href: "/dashboard/physics/magnet-explorer",
      prerequisites: [],
    },
    {
      subjectSlug: "physics",
      topicSlug: "compass-explorer",
      title: "Interactive Compass Explorer",
      description: "Use a compass to investigate a magnetic field's direction.",
      href: "/dashboard/physics/compass-explorer",
      // No explicit prerequisites — defaults to depending on Magnet Explorer.
    },
  ],
};
