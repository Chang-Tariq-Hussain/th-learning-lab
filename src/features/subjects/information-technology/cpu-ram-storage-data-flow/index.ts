"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split so this simulation's code only downloads when a student
 * actually opens it, same convention as every other simulation in
 * the app (see e.g. `physics/simple-motion/index.ts`). This
 * simulation is plain SVG/HTML — no 3D engine — but it still follows
 * the shared lazy-load + skeleton pattern for consistency and so the
 * Information Technology topic/subject pages never pay for it.
 */
export const CpuRamStorageDataFlow = dynamic(
  () => import("./cpu-ram-storage-data-flow").then((mod) => mod.CpuRamStorageDataFlow),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
