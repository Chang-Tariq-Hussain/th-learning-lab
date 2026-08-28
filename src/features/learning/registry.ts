import type { TopicContent } from "./types";
import { physicsSimpleMotionContent } from "./data/physics-simple-motion";
import { physicsVelocityContent } from "./data/physics-velocity";
import { physicsAccelerationContent } from "./data/physics-acceleration";
import { physicsProjectileMotionContent } from "./data/physics-projectile-motion";
import { physicsSimpleForcesContent } from "./data/physics-simple-forces";
import { physicsNewtonsLawsContent } from "./data/physics-newtons-laws";
import { physicsSimpleEnergyContent } from "./data/physics-simple-energy";
import { physicsWorkEnergyPowerContent } from "./data/physics-work-energy-power";
import { physicsMomentumContent } from "./data/physics-momentum";
import { physicsCircularMotionContent } from "./data/physics-circular-motion";
import { physicsGravitationContent } from "./data/physics-gravitation";
import { mathematicsNumberLineContent } from "./data/mathematics-number-line";
import { mathematicsEvenOddContent } from "./data/mathematics-even-odd";
import { mathematicsFactorsMultiplesContent } from "./data/mathematics-factors-multiples";
import { mathematicsFractionsContent } from "./data/mathematics-fractions";
import { mathematicsFractionOperationsContent } from "./data/mathematics-fraction-operations";
import { mathematicsRatioContent } from "./data/mathematics-ratio";
import { mathematicsRatioComparisonContent } from "./data/mathematics-ratio-comparison";
import { mathematicsProportionContent } from "./data/mathematics-proportion";
import { mathematicsCrossMultiplicationContent } from "./data/mathematics-cross-multiplication";
import { mathematicsRealLifeRatiosContent } from "./data/mathematics-real-life-ratios";
import { mathematicsMeasurementContent } from "./data/mathematics-measurement";
import { mathematicsPerimeterAreaContent } from "./data/mathematics-perimeter-area";

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
 * is built on. Work, Energy & Power is that same full standard again,
 * applied to its own dedicated `WorkEnergyPower` lab and its own
 * question bank (`physics-work-energy-power` in `@/features/quiz-engine`).
 * Momentum is that same full standard once more, reusing Newton's
 * Laws' existing "Law 3" rig as its own `Momentum` lab (see that
 * component's doc comment) rather than a new physics engine, with its
 * own dedicated question bank (`physics-momentum`).
 *
 * Mathematics Batch 1 (Number Sense & Fractions) follows the same
 * pattern, but per the Mathematics design principle it's framed as
 * visualize → manipulate → discover a pattern → reason → solve,
 * rather than physics' observe → understand → apply. Number Line and
 * Fractions reuse the pre-existing `NumberLine` and `FractionPizza`
 * simulations as-is. Even & Odd Numbers and Factors & Multiples had
 * no existing simulation, so minimal new ones were built — the Even
 * & Odd Explorer and Factor Finder (see their own doc comments in
 * `@/features/subjects/mathematics/`) — reusing the existing
 * challenge-banner/confetti/chime conventions from `number-line`
 * rather than inventing new ones. Fraction Operations is likewise a
 * new minimal simulation, the Fraction Operations Lab, with a
 * dedicated visual per operation (common-denominator bars for
 * add/subtract, an area-model grid for multiply, a grouped-chunk bar
 * for divide). Each of these five topics has its own 30-question
 * bank in `@/features/quiz-engine/data/mathematics-*-quiz.ts`.
 *
 * Mathematics Batch 2 (Ratio, Proportion & Measurement) follows the
 * same pattern and design principle, reusing the pre-existing Ratio
 * Explorer, Ratio Comparison, Proportion Builder, Cross Multiplication
 * Explorer, Real-Life Ratios, Measurement Explorer, and Perimeter &
 * Area Explorer simulations as-is — no new simulations were built for
 * this batch. Each topic has its own 30-question bank, except
 * Measurement, which reuses the pre-existing `mathematics-measurement`
 * bank rather than duplicating it.
 */
export const topicContentList: TopicContent[] = [
  physicsSimpleMotionContent,
  physicsVelocityContent,
  physicsAccelerationContent,
  physicsProjectileMotionContent,
  physicsSimpleForcesContent,
  physicsNewtonsLawsContent,
  physicsSimpleEnergyContent,
  physicsWorkEnergyPowerContent,
  physicsMomentumContent,
  physicsCircularMotionContent,
  physicsGravitationContent,
  mathematicsNumberLineContent,
  mathematicsEvenOddContent,
  mathematicsFactorsMultiplesContent,
  mathematicsFractionsContent,
  mathematicsFractionOperationsContent,
  mathematicsRatioContent,
  mathematicsRatioComparisonContent,
  mathematicsProportionContent,
  mathematicsCrossMultiplicationContent,
  mathematicsRealLifeRatiosContent,
  mathematicsMeasurementContent,
  mathematicsPerimeterAreaContent,
];

export function getTopicContent(subjectSlug: string, topicSlug: string): TopicContent | undefined {
  return topicContentList.find((topic) => topic.subjectSlug === subjectSlug && topic.topicSlug === topicSlug);
}
