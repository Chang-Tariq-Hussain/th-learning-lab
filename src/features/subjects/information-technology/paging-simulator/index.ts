"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split, same convention as every other simulation in this
 * subject — the simulator and its model are only fetched when this
 * route is actually visited. Pages, frames, and page tables are all
 * discrete/conceptual, so this stays a plain 2D/2.5D component rather
 * than a 3D scene.
 */
export const PagingSimulator = dynamic(
  () => import("./paging-simulator").then((mod) => mod.PagingSimulator),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
