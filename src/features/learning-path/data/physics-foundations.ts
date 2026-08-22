import type { LearningPath } from "../types";

/**
 * The reference example: Physics' core mechanics sequence, in the
 * order each idea builds on the last — motion, then velocity and
 * acceleration (the quantities that describe motion changing), then
 * forces, then how Newton's Laws formalize force and motion
 * together, then energy.
 *
 * Velocity and Acceleration reuse the Newton's Laws Lab simulation as
 * their own Explore experience (see
 * `@/features/learning/data/physics-velocity.tsx` and
 * `physics-acceleration.tsx` for why) — they're real, registered
 * topics now, not merely folded into Simple Motion and Newton's Laws
 * as they were before.
 *
 * Projectile Motion is included as an optional challenge topic: it
 * applies motion and forces together, so it depends on *both* Simple
 * Forces and Newton's Laws rather than simply following its neighbor
 * — a case the default "depends on the previous topic" chain can't
 * express, which is exactly why `prerequisites` can be given
 * explicitly.
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
