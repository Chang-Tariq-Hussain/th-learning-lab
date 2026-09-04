import type { LearningPath } from "../types";

/**
 * Chemistry's full existing curriculum, organized into a sensible
 * learning progression: atomic structure and periodic trends first
 * (the "what atoms are, and how they're organized" foundation),
 * then bonding (why/how atoms combine into molecules), then
 * reactions (how molecules rearrange) and reaction rates (how fast
 * that rearranging happens), then acids & bases (a bonding- and
 * reaction-dependent special case, appropriately last). Mirrors
 * `physics-foundations.ts`'s and `mathematics-foundations.ts`'s
 * pattern: one flat, ordered `topics` array — there is no separate
 * "Unit" data structure in this architecture (see the batch comments
 * below for the six curriculum groupings a Chemistry audit proposed;
 * they're organizational labels in this comment, not a type the
 * engine or UI need).
 *
 * Every topic below is a real, working simulation page. Three
 * (Build an Atom, Periodic Trends, Molecule Builder) have a full
 * registered `TopicContent` (Learn through Mastery) in
 * `@/features/learning/registry.ts`, so the engine tracks real
 * mastery for them. The other nine are included on purpose, same as
 * Mathematics' non-Batch-1 topics — the path should represent the
 * *complete* curriculum, not just the topics with a full Golden
 * Learning Experience yet. The engine degrades gracefully for these
 * (`isPathTopicDone` falls back to "some progress recorded", and
 * unlocking only ever needs `isStarted`; see `../engine.ts`).
 * Authoring full `TopicContent` for the remaining nine is tracked as
 * follow-up work, not a blocker for the path existing.
 *
 * Batch 1 — Foundations of Chemistry: Build an Atom, then Periodic
 * Trends (which assumes atomic number/protons/electrons).
 *
 * Batch 2 — Chemical Bonding & Molecules: Bond Builder (why/how atoms
 * bond — ionic vs. covalent, valence electrons) before Molecule
 * Builder (real 3D multi-atom molecules and VSEPR geometry, which
 * assumes the bonding vocabulary Bond Builder introduces).
 *
 * Batch 3 — Chemical Reactions: Reaction Builder (how atoms
 * rearrange without being created/destroyed) before Reaction
 * Kinetics (how fast that rearranging happens) — rate only makes
 * sense once the learner has a reaction to point it at.
 *
 * Batch 4 — Acids & Bases: six existing simulations, ordered from
 * the everyday/observational (Acids & Bases — The Basics) through
 * the three defining theories in the order they were historically
 * developed and conceptually build on each other (Arrhenius, which
 * is water-specific → Brønsted–Lowry, which generalizes it to proton
 * transfer → Lewis, which generalizes further to electron-pair
 * transfer and depends on the bonding vocabulary from Batch 2), with
 * Conjugate Acid–Base Pairs placed right after Brønsted–Lowry (the
 * theory it's a direct extension of) and Strong vs Weak last, since
 * "strength" as a concept presupposes already knowing what an acid
 * or base *is*.
 */
export const chemistryFoundationsPath: LearningPath = {
  id: "chemistry-foundations",
  subjectSlug: "chemistry",
  title: "Chemistry Foundations",
  description:
    "From atoms to bonds to reactions: how matter is built, how it combines, and how it changes.",
  colorToken: "chemistry",
  topics: [
    // Batch 1 — Foundations of Chemistry
    {
      subjectSlug: "chemistry",
      topicSlug: "build-an-atom",
      title: "Build an Atom",
      description: "Protons, neutrons, and electrons — and what makes an element an element.",
      href: "/dashboard/chemistry/build-an-atom",
      prerequisites: [],
    },
    {
      subjectSlug: "chemistry",
      topicSlug: "periodic-trends",
      title: "Periodic Trends",
      description: "Atomic radius, ionization energy, electronegativity, and metallic character across the table.",
      href: "/dashboard/chemistry/periodic-trends",
      // No explicit prerequisites — defaults to depending on Build an Atom.
    },

    // Batch 2 — Chemical Bonding & Molecules
    {
      subjectSlug: "chemistry",
      topicSlug: "bond-builder",
      title: "Bond Builder",
      description: "Why atoms bond: electron transfer for ionic bonds, electron sharing for covalent bonds.",
      href: "/dashboard/chemistry/bond-builder",
      // No explicit prerequisites — defaults to depending on Periodic Trends.
    },
    {
      subjectSlug: "chemistry",
      topicSlug: "molecule-builder",
      title: "Molecule Builder",
      description: "Real 3D molecules, how their atoms are bonded, and the VSEPR shapes those bonds create.",
      href: "/dashboard/chemistry/molecule-builder",
      // No explicit prerequisites — defaults to depending on Bond Builder.
    },

    // Batch 3 — Chemical Reactions
    {
      subjectSlug: "chemistry",
      topicSlug: "reaction-builder",
      title: "Chemical Reaction Builder",
      description: "How atoms rearrange in a reaction without being created or destroyed.",
      href: "/dashboard/chemistry/reaction-builder",
      // No explicit prerequisites — defaults to depending on Molecule Builder.
    },
    {
      subjectSlug: "chemistry",
      topicSlug: "reaction-kinetics",
      title: "Reaction Kinetics",
      description: "How concentration, temperature, surface area, and catalysts change reaction rate.",
      href: "/dashboard/chemistry/reaction-kinetics",
      // No explicit prerequisites — defaults to depending on Chemical Reaction Builder.
    },

    // Batch 4 — Acids & Bases
    {
      subjectSlug: "chemistry",
      topicSlug: "acids-bases-basics",
      title: "Acids & Bases — The Basics",
      description: "Everyday substances on the pH scale, and what acidic, neutral, and basic actually mean.",
      href: "/dashboard/chemistry/acids-bases-basics",
      // No explicit prerequisites — defaults to depending on Reaction Kinetics.
    },
    {
      subjectSlug: "chemistry",
      topicSlug: "arrhenius-theory",
      title: "Arrhenius Theory",
      description: "The earliest acid-base theory: acids and bases defined by what they release in water.",
      href: "/dashboard/chemistry/arrhenius-theory",
      // No explicit prerequisites — defaults to depending on Acids & Bases — The Basics.
    },
    {
      subjectSlug: "chemistry",
      topicSlug: "bronsted-lowry",
      title: "Brønsted–Lowry Theory",
      description: "A broader theory: acids and bases defined by the proton they donate or accept.",
      href: "/dashboard/chemistry/bronsted-lowry",
      // No explicit prerequisites — defaults to depending on Arrhenius Theory.
    },
    {
      subjectSlug: "chemistry",
      topicSlug: "conjugate-acid-base-pairs",
      title: "Conjugate Acid–Base Pairs",
      description: "Every Brønsted–Lowry acid and base has a partner differing by exactly one proton.",
      href: "/dashboard/chemistry/conjugate-acid-base-pairs",
      // No explicit prerequisites — defaults to depending on Brønsted–Lowry Theory,
      // the theory this topic directly extends.
    },
    {
      subjectSlug: "chemistry",
      topicSlug: "lewis-acid-base",
      title: "Lewis Acid–Base Theory",
      description: "The broadest theory yet: acids and bases defined by the electron pair they accept or donate.",
      href: "/dashboard/chemistry/lewis-acid-base",
      // Depends on both the acid-base theory sequence and the bonding
      // vocabulary (electron pairs, coordinate bonds) from Batch 2 —
      // doesn't simply follow its immediate neighbor, so this is given
      // explicitly rather than relying on the default linear chain.
      prerequisites: [
        { subjectSlug: "chemistry", topicSlug: "conjugate-acid-base-pairs" },
        { subjectSlug: "chemistry", topicSlug: "bond-builder" },
      ],
    },
    {
      subjectSlug: "chemistry",
      topicSlug: "strong-weak-acids-bases",
      title: "Strong vs Weak Acids and Bases",
      description: "How completely an acid or base ionizes in water — and why that isn't the same as concentration.",
      href: "/dashboard/chemistry/strong-weak-acids-bases",
      // No explicit prerequisites — defaults to depending on Lewis Acid–Base Theory,
      // the last topic in the core acid-base sequence.
    },
  ],
};
