"use client";

import { useRef } from "react";
import { DHCP_CHALLENGE_IDS, DhcpSimulator, DhcpChallengeLab, type DhcpChallengeId, type DhcpChallengeLabHandle } from "@/features/subjects/information-technology/dhcp-simulator";
import { TopicExperience, type TopicContent } from "@/features/learning";

const INTERACTIVE_IDS = Object.values(DHCP_CHALLENGE_IDS) as DhcpChallengeId[];

/**
 * Client wiring `page.tsx` (a server component) delegates to. Each interactive Challenge scenario gets its own live
 * `DhcpChallengeLab` (starting from that scenario's broken state) and a ref so "Check my work" inspects the
 * configuration the student actually built. Every other section keeps using the shared `<DhcpSimulator />`.
 */
export function DhcpTopicExperience({ content }: { content: TopicContent }) {
  const refs = useRef<Partial<Record<DhcpChallengeId, DhcpChallengeLabHandle | null>>>({});

  const overrides: Record<string, React.ReactNode> = {};
  const verifiers: Record<string, () => boolean> = {};
  for (const id of INTERACTIVE_IDS) {
    overrides[id] = <DhcpChallengeLab key={id} challengeId={id} ref={(h) => { refs.current[id] = h; }} />;
    verifiers[id] = () => refs.current[id]?.check() ?? false;
  }

  return <TopicExperience content={content} simulation={<DhcpSimulator />} challengeExperimentOverrides={overrides} challengeVerifiers={verifiers} />;
}
