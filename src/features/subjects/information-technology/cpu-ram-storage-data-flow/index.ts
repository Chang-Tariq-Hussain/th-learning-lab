"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split so this simulation's code only downloads when a student
 * actually opens it, same convention as every other simulation in
 * the app (see e.g. `physics/simple-motion/index.ts`). Every mode is
 * plain SVG/HTML; Overview mode's optional 3D physical-layout view is
 * itself a second, inner dynamic import (see `components/system-3d.tsx`)
 * so three.js/@react-three only download if a student actually opens
 * that view, not just this simulation.
 */
export const CpuRamStorageDataFlow = dynamic(
  () => import("./cpu-ram-storage-data-flow").then((mod) => mod.CpuRamStorageDataFlow),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
