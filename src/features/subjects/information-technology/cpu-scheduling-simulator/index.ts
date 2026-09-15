"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split, same convention as every other simulation in this
 * subject. This is a discrete, state-and-timeline simulation (not a
 * continuous numeric one), so it's a plain 2D/2.5D component rather
 * than a `@/features/simulation` canvas or a 3D scene — CPU
 * scheduling is fundamentally about process/state/queue relationships,
 * which a Gantt chart and simple boxes communicate more clearly than
 * any 3D visualization would.
 */
export const CpuSchedulingSimulator = dynamic(
  () => import("./cpu-scheduling-simulator").then((mod) => mod.CpuSchedulingSimulator),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
