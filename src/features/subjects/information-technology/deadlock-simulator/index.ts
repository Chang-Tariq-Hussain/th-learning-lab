"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split, same convention as every other simulation in this
 * subject — the simulator and its model are only fetched when this
 * route is actually visited. Deadlocks and resource graphs are
 * relational/conceptual, not physical, so this stays a plain 2D/2.5D
 * component rather than a 3D scene.
 */
export const DeadlockSimulator = dynamic(
  () => import("./deadlock-simulator").then((mod) => mod.DeadlockSimulator),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
