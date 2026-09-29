"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/** Code-split, same convention as the other simulations in this subject. Plain 2D SVG/HTML, no three.js. */
export const SubnettingLaboratory = dynamic(() => import("./subnetting-laboratory").then((mod) => mod.SubnettingLaboratory), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});

export { SubnetChallengeLab, type SubnetChallengeLabHandle } from "./components/challenge-lab";
export { SUBNET_CHALLENGE_IDS, type SubnetChallengeId } from "./challenges";
