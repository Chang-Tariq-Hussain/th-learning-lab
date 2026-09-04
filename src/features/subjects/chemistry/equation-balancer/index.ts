"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split for the same reason as Reaction Builder's `index.ts` —
 * this simulation only downloads when a student actually opens it.
 */
export const EquationBalancer = dynamic(() => import("./equation-balancer").then((mod) => mod.EquationBalancer), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});
