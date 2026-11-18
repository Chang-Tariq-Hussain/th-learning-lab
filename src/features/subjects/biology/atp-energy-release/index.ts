"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/** Code-split (ssr: false) like the other labs: the lab downloads only when a learner opens it. */
export const AtpEnergyRelease = dynamic(() => import("./atp-energy-release").then((mod) => mod.AtpEnergyRelease), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});
