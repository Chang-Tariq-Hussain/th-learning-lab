"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/** Code-split, same convention as the other simulations in this subject. Plain 2D SVG/HTML, no three.js. */
export const IpAddressingSimulator = dynamic(() => import("./ip-addressing-simulator").then((mod) => mod.IpAddressingSimulator), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});

export { IpChallengeLab, type IpChallengeLabHandle } from "./components/challenge-lab";
export { IP_CHALLENGE_IDS, type IpChallengeId } from "./challenges";
