"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split so this simulation's code only downloads when a student
 * actually opens it, same reasoning as every other visualization here.
 */
export const DnaStructure = dynamic(() => import("./dna-structure").then((mod) => mod.DnaStructure), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});
