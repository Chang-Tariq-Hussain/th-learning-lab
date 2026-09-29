"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/** Code-split, same convention as the other simulations in this subject. Plain 2D SVG/HTML, no three.js. */
export const ArpSimulator = dynamic(() => import("./arp-simulator").then((mod) => mod.ArpSimulator), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});

export { ArpChallengeLab, type ArpChallengeLabHandle } from "./components/challenge-lab";
export { ARP_CHALLENGE_IDS, type ArpChallengeId } from "./challenges";
