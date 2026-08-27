import type { LearningPath } from "../types";

/**
 * Physics' core mechanics sequence, in the order each idea builds on
 * the last — motion, then velocity and acceleration (the quantities
 * that describe motion changing), then forces, then how Newton's
 * Laws formalize force and motion together, then energy, then the
 * "advanced motion" trio (Momentum, Circular Motion, Gravitation)
 * that builds on Newton's Laws.
 *
 * Velocity and Acceleration reuse the Newton's Laws Lab simulation as
 * their own Explore experience (see
 * `@/features/learning/data/physics-velocity.tsx` and
 * `physics-acceleration.tsx` for why) — they're real, registered
 * topics, not merely folded into Simple Motion and Newton's Laws.
 * Momentum similarly reuses Newton's Laws' "Law 3" rig rather than a
 * new physics engine (see `physics-momentum.tsx`).
 *
 * Every topic below has a full registered `TopicContent` (Learn
 * through Mastery) — this path currently covers the complete
 * Golden Learning Experience curriculum for Physics. Electromagnetism
 * (Magnet/Compass Explorer) and Wave Motion aren't included: neither
 * has a Golden Learning Experience authored yet (see
 * `@/features/learning/registry.ts`), so — same as Mathematics topics
 * without full content yet — they'd need to fall back to the "any
 * step recorded" unlocking signal rather than a real mastery-tracked
 * one. They weren't part of the curriculum this pass was scoped to
 * (Batches 1-3: Motion through Gravitation); adding them is a
 * follow-up, not a rename/remap of what's here.
 *
 * Projectile Motion is included as an optional challenge topic: it
 * applies motion and forces together, so it depends on *both* Simple
 * Forces and Newton's Laws rather than simply following its neighbor
 * — a case the default "depends on the previous topic" chain can't
 * express, which is exactly why `prerequisites` can be given
 * explicitly. Placed last so it's offered as a capstone after the
 * full core sequence.
 */
export const physicsFoundationsPath: LearningPath = {
  id: "physics-foundations",
  subjectSlug: "physics",
  title: "Physics Foundations",
  description:
    "The core mechanics sequence, one idea building on the last: motion, velocity, acceleration, forces, Newton's Laws, then energy.",
  colorToken: "physics",
  topics: [
    {
      subjectSlug: "physics",
      topicSlug: "simple-motion",
      title: "Motion",
      description: "Speed, distance, and time.",
      href: "/dashboard/physics/simple-motion",
      prerequisites: [],
    },
    {
      subjectSlug: "physics",
      topicSlug: "velocity",
      title: "Velocity",
      description: "What keeps velocity constant, and what changes it.",
      href: "/dashboard/physics/velocity",
      // No explicit prerequisites — defaults to depending on Motion.
    },
    {
      subjectSlug: "physics",
      topicSlug: "acceleration",
      title: "Acceleration",
      description: "How fast velocity itself is changing, and F = ma.",
      href: "/dashboard/physics/acceleration",
      // No explicit prerequisites — defaults to depending on Velocity.
    },
    {
      subjectSlug: "physics",
      topicSlug: "simple-forces",
      title: "Forces",
      description: "Balanced and unbalanced forces.",
      href: "/dashboard/physics/simple-forces",
      // No explicit prerequisites — defaults to depending on Acceleration,
      // the previous core topic.
    },
    {
      subjectSlug: "physics",
      topicSlug: "newtons-laws",
      title: "Newton's Laws",
      description: "Inertia, F = ma, and action-reaction.",
      href: "/dashboard/physics/newtons-laws",
    },
    {
      subjectSlug: "physics",
      topicSlug: "simple-energy",
      title: "Energy",
      description: "Potential and kinetic energy, and how one becomes the other.",
      href: "/dashboard/physics/simple-energy",
    },
    {
      subjectSlug: "physics",
      topicSlug: "work-energy-power",
      title: "Work, Energy & Power",
      description: "How force applied over a distance does work, and how fast that work gets done.",
      href: "/dashboard/physics/work-energy-power",
      // No explicit prerequisites — defaults to depending on Energy.
    },
    {
      subjectSlug: "physics",
      topicSlug: "momentum",
      title: "Momentum",
      description: "Mass in motion, and how it's conserved in collisions.",
      href: "/dashboard/physics/momentum",
      // No explicit prerequisites — defaults to depending on Work, Energy & Power.
    },
    {
      subjectSlug: "physics",
      topicSlug: "circular-motion",
      title: "Circular Motion",
      description: "Centripetal force and acceleration for motion along a curve.",
      href: "/dashboard/physics/circular-motion",
      // No explicit prerequisites — defaults to depending on Momentum.
    },
    {
      subjectSlug: "physics",
      topicSlug: "gravitation",
      title: "Gravitation",
      description: "Newton's Law of Universal Gravitation and orbital motion.",
      href: "/dashboard/physics/gravitation",
      // No explicit prerequisites — defaults to depending on Circular Motion.
    },
    {
      subjectSlug: "physics",
      topicSlug: "projectile-motion",
      title: "Projectile Motion",
      description: "A challenge topic: apply motion and forces together to a launched object.",
      href: "/dashboard/physics/projectile-motion",
      isChallenge: true,
      prerequisites: [
        { subjectSlug: "physics", topicSlug: "simple-forces" },
        { subjectSlug: "physics", topicSlug: "newtons-laws" },
      ],
    },
  ],
};
