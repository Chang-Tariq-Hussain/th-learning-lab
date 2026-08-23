import type { TopicContent } from "./types";
import { physicsSimpleMotionContent } from "./data/physics-simple-motion";
import { physicsVelocityContent } from "./data/physics-velocity";
import { physicsAccelerationContent } from "./data/physics-acceleration";
import { physicsProjectileMotionContent } from "./data/physics-projectile-motion";
import { physicsSimpleForcesContent } from "./data/physics-simple-forces";
import { physicsNewtonsLawsContent } from "./data/physics-newtons-laws";
import { physicsSimpleEnergyContent } from "./data/physics-simple-energy";

/**
 * Every registered topic's learning content. Add a new topic by
 * creating a `TopicContent` in `data/` (see
 * `data/physics-simple-motion.ts` for the pattern) and listing it
 * here — mirrors `features/subjects/data/subjects.ts` and
 * `features/quiz-engine/registry.ts`: one array, read by getters,
 * instead of scattered lookups.
 *
 * Simple Motion is the full reference implementation. Velocity,
 * Acceleration, Newton's Laws, and Projectile Motion are brought up
 * to that same full standard (Learn, Predict, Explore, Explain,
 * Practice, Challenge) — Velocity and Acceleration reuse the Newton's
 * Laws Lab simulation as their Explore experience (see their `data/`
 * files for why that simulation is the right fit); Newton's Laws and
 * Projectile Motion are each that same standard applied to their own
 * home simulation, each with its own dedicated question bank
 * (`physics-newtons-laws` / `physics-projectile-motion` in
 * `@/features/quiz-engine`) rather than a quiz shared across sibling
 * topics. Simple Forces and Simple Energy remain Learn + Explore only
 * for now — enough to make their progress trackable, which is what
 * the `physics-foundations` learning path (`@/features/learning-path`)
 * is built on.
 */
export const topicContentList: TopicContent[] = [
  physicsSimpleMotionContent,
  physicsVelocityContent,
  physicsAccelerationContent,
  physicsProjectileMotionContent,
  physicsSimpleForcesContent,
  physicsNewtonsLawsContent,
  physicsSimpleEnergyContent,
];

export function getTopicContent(subjectSlug: string, topicSlug: string): TopicContent | undefined {
  return topicContentList.find((topic) => topic.subjectSlug === subjectSlug && topic.topicSlug === topicSlug);
}
