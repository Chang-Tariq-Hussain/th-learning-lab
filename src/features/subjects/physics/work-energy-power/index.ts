"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/** Code-split for the same reason as every other simulation in this
 *  subject — see `simple-energy/index.ts` for the full rationale. */
export const WorkEnergyPower = dynamic(() => import("./work-energy-power").then((mod) => mod.WorkEnergyPower), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});
