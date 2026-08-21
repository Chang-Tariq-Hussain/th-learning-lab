import type { TopicContent } from "./types";
import { physicsSimpleMotionContent } from "./data/physics-simple-motion";
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
 * Four entries so far: Simple Motion is the full reference
 * implementation; Simple Forces, Newton's Laws, and Simple Energy are
 * Learn + Explore only (see their `data/` files) — enough to make
 * their progress trackable, which is what the `physics-foundations`
 * learning path (`@/features/learning-path`) is built on.
 */
export const topicContentList: TopicContent[] = [
  physicsSimpleMotionContent,
  physicsSimpleForcesContent,
  physicsNewtonsLawsContent,
  physicsSimpleEnergyContent,
];

export function getTopicContent(subjectSlug: string, topicSlug: string): TopicContent | undefined {
  return topicContentList.find((topic) => topic.subjectSlug === subjectSlug && topic.topicSlug === topicSlug);
}
