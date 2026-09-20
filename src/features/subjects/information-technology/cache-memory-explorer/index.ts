"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split, same convention as every other simulation in this
 * subject — the lab and its engine are only fetched when this route is
 * actually visited. A cache is a memory-organization idea, so this is
 * a plain 2D component rather than a 3D scene.
 */
export const CacheMemoryExplorer = dynamic(
  () => import("./cache-memory-explorer").then((mod) => mod.CacheMemoryExplorer),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
