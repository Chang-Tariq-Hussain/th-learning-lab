"use client";

import { useRef } from "react";
import { IP_CHALLENGE_IDS, IpAddressingSimulator, IpChallengeLab, type IpChallengeId, type IpChallengeLabHandle } from "@/features/subjects/information-technology/ip-addressing-simulator";
import { TopicExperience, type TopicContent } from "@/features/learning";

const INTERACTIVE_IDS = Object.values(IP_CHALLENGE_IDS) as IpChallengeId[];

/**
 * Client wiring `page.tsx` (a server component) delegates to. Each interactive Challenge
 * scenario gets its own live `IpChallengeLab` (starting from that scenario's broken state)
 * and a ref so "Check my work" inspects the configuration the student actually built.
 * Every other section keeps using the shared `<IpAddressingSimulator />`.
 */
export function IpAddressingTopicExperience({ content }: { content: TopicContent }) {
  const refs = useRef<Partial<Record<IpChallengeId, IpChallengeLabHandle | null>>>({});

  const overrides: Record<string, React.ReactNode> = {};
  const verifiers: Record<string, () => boolean> = {};
  for (const id of INTERACTIVE_IDS) {
    overrides[id] = <IpChallengeLab key={id} challengeId={id} ref={(h) => { refs.current[id] = h; }} />;
    verifiers[id] = () => refs.current[id]?.check() ?? false;
  }

  return <TopicExperience content={content} simulation={<IpAddressingSimulator />} challengeExperimentOverrides={overrides} challengeVerifiers={verifiers} />;
}
