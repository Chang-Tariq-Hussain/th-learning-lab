"use client";

import { useRef } from "react";
import { ARP_CHALLENGE_IDS, ArpSimulator, ArpChallengeLab, type ArpChallengeId, type ArpChallengeLabHandle } from "@/features/subjects/information-technology/arp-simulator";
import { TopicExperience, type TopicContent } from "@/features/learning";

const INTERACTIVE_IDS = Object.values(ARP_CHALLENGE_IDS) as ArpChallengeId[];

/**
 * Client wiring `page.tsx` (a server component) delegates to. Each interactive Challenge
 * scenario gets its own live `ArpChallengeLab` (starting from that scenario's broken state)
 * and a ref so "Check my work" inspects the configuration the student actually built.
 * Every other section keeps using the shared `<ArpSimulator />`.
 */
export function ArpTopicExperience({ content }: { content: TopicContent }) {
  const refs = useRef<Partial<Record<ArpChallengeId, ArpChallengeLabHandle | null>>>({});

  const overrides: Record<string, React.ReactNode> = {};
  const verifiers: Record<string, () => boolean> = {};
  for (const id of INTERACTIVE_IDS) {
    overrides[id] = <ArpChallengeLab key={id} challengeId={id} ref={(h) => { refs.current[id] = h; }} />;
    verifiers[id] = () => refs.current[id]?.check() ?? false;
  }

  return <TopicExperience content={content} simulation={<ArpSimulator />} challengeExperimentOverrides={overrides} challengeVerifiers={verifiers} />;
}
