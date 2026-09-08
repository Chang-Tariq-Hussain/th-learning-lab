"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split so this simulation's code only downloads when a student
 * actually opens it — mirrors `angle-spinner`'s convention. `ssr:
 * false` skips server rendering since the canvas is entirely
 * pointer-driven and animation-heavy; the skeleton renders instantly
 * while the chunk loads.
 */
export const TriangleExplorer = dynamic(() => import("./triangle-explorer").then((mod) => mod.TriangleExplorer), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});
