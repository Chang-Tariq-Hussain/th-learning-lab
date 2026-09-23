"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split, same convention as every other simulation in this
 * subject — the simulator and its model are only fetched when this
 * route is actually visited. Networks and topologies are
 * relational/conceptual, not physical, so this stays a plain 2D/2.5D
 * component (no three.js) rather than a 3D scene.
 */
export const NetworkFundamentalsTopologies = dynamic(
  () => import("./network-fundamentals-topologies").then((mod) => mod.NetworkFundamentalsTopologies),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
