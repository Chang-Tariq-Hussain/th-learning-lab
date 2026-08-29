"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split so this simulation's code only downloads when a student
 * actually opens it, matching every other Mathematics topic's
 * `index.ts` convention.
 */
export const DataCollectionLab = dynamic(() => import("./data-collection-lab").then((mod) => mod.DataCollectionLab), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});
