"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split so this simulation's code only downloads when a student
 * actually opens it, same reasoning as every other visualization here.
 */
export const Meiosis = dynamic(() => import("./meiosis").then((mod) => mod.Meiosis), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});
