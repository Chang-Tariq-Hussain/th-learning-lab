"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split, same convention as every other simulation in this
 * subject — the simulator, its model, and the 3D scene are only
 * fetched when this route is actually visited.
 */
export const ComputerComponentsExplorer = dynamic(
  () => import("./computer-components-explorer").then((mod) => mod.ComputerComponentsExplorer),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
