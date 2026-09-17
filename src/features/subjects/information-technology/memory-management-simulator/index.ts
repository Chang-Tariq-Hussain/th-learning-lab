"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split, same convention as every other simulation in this
 * subject. Memory addresses, blocks, and fragmentation are all
 * discrete/conceptual — like Process Management — so this stays a
 * plain 2D/2.5D component rather than a 3D scene.
 */
export const MemoryManagementSimulator = dynamic(
  () => import("./memory-management-simulator").then((mod) => mod.MemoryManagementSimulator),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
