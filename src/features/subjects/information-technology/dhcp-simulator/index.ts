"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/** Code-split, same convention as the other simulations in this subject. Plain 2D SVG/HTML, no three.js. */
export const DhcpSimulator = dynamic(() => import("./dhcp-simulator").then((mod) => mod.DhcpSimulator), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});

export { DhcpChallengeLab, type DhcpChallengeLabHandle } from "./components/challenge-lab";
export { DHCP_CHALLENGE_IDS, type DhcpChallengeId } from "./challenges";
