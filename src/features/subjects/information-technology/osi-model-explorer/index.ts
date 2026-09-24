"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split, same convention as every other simulation in this
 * subject (see Network Fundamentals & Topologies's `index.ts`) — the
 * simulator and its model are only fetched when this route is
 * actually visited. The OSI model is conceptual/relational, not
 * physical, so this stays a plain 2D component (no three.js).
 */
export const OsiModelExplorer = dynamic(
  () => import("./osi-model-explorer").then((mod) => mod.OsiModelExplorer),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
