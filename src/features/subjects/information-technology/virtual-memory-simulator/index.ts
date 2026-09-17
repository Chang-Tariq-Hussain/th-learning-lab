"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split, same convention as every other simulation in this
 * subject. Virtual address spaces, residency, and capacity are all
 * discrete/conceptual — like Memory Management — so this stays a
 * plain 2D/2.5D component rather than a 3D scene.
 */
export const VirtualMemorySimulator = dynamic(
  () => import("./virtual-memory-simulator").then((mod) => mod.VirtualMemorySimulator),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
