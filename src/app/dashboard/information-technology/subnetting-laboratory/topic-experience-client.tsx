"use client";

import { useRef } from "react";
import { SUBNET_CHALLENGE_IDS, SubnetChallengeLab, SubnettingLaboratory, type SubnetChallengeId, type SubnetChallengeLabHandle } from "@/features/subjects/information-technology/subnetting-laboratory";
import { TopicExperience, type TopicContent } from "@/features/learning";

const INTERACTIVE_IDS = Object.values(SUBNET_CHALLENGE_IDS) as SubnetChallengeId[];

/**
 * Client wiring `page.tsx` (a server component) delegates to. Each interactive Challenge scenario gets its
 * own live `SubnetChallengeLab` (starting from that scenario's own state) and a ref so "Check my work"
 * inspects what the student actually built. Every other section keeps using the shared `<SubnettingLaboratory />`.
 */
export function SubnettingTopicExperience({ content }: { content: TopicContent }) {
  const refs = useRef<Partial<Record<SubnetChallengeId, SubnetChallengeLabHandle | null>>>({});

  const overrides: Record<string, React.ReactNode> = {};
  const verifiers: Record<string, () => boolean> = {};
  for (const id of INTERACTIVE_IDS) {
    overrides[id] = <SubnetChallengeLab key={id} challengeId={id} ref={(h) => { refs.current[id] = h; }} />;
    verifiers[id] = () => refs.current[id]?.check() ?? false;
  }

  return <TopicExperience content={content} simulation={<SubnettingLaboratory />} challengeExperimentOverrides={overrides} challengeVerifiers={verifiers} />;
}
