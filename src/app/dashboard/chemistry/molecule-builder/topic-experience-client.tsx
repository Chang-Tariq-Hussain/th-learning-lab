"use client";

import { useRef } from "react";
import {
  MoleculeBuilder,
  MoleculeBuildLab,
  type MoleculeBuildLabHandle,
} from "@/features/subjects/chemistry/molecule-builder";
import { TopicExperience, type TopicContent } from "@/features/learning";

/** Must match the scenario id in `chemistry-molecular-geometry.tsx`'s
 *  `challenge.scenarios` — the one Challenge scenario that grades a
 *  real built structure instead of a multiple-choice/numeric answer. */
const BUILD_CHALLENGE_SCENARIO_ID = "chemistry-molecular-geometry-challenge-004";

interface MoleculeBuilderTopicExperienceProps {
  content: TopicContent;
}

/**
 * The client-side wiring `page.tsx` (a server component, so it can't
 * hold a `useRef` itself) delegates to. Connects the "Build It
 * Yourself" Challenge scenario to a real, live `MoleculeBuildLab`
 * instance: the lab is rendered as that one scenario's experiment
 * override (locked to the H₂O target, so the student can't wander to
 * a different molecule than the one being graded), and a ref exposes
 * `checkTarget` so the Challenge's "Check my work" button reads the
 * student's *actual* current structure — Part 7 of the brief's "the
 * simulation evaluates the result," not a self-reported button click.
 *
 * Every other Challenge scenario, and the Explore/Predict sections,
 * keep using the plain shared `<MoleculeBuilder />` instance exactly
 * as before — this only special-cases the one scenario that needs it.
 */
export function MoleculeBuilderTopicExperience({ content }: MoleculeBuilderTopicExperienceProps) {
  const buildChallengeRef = useRef<MoleculeBuildLabHandle>(null);

  return (
    <TopicExperience
      content={content}
      simulation={<MoleculeBuilder />}
      challengeExperimentOverrides={{
        [BUILD_CHALLENGE_SCENARIO_ID]: (
          <MoleculeBuildLab ref={buildChallengeRef} lockedTargetId="h2o" />
        ),
      }}
      challengeVerifiers={{
        [BUILD_CHALLENGE_SCENARIO_ID]: () => buildChallengeRef.current?.checkTarget("h2o") ?? false,
      }}
    />
  );
}
