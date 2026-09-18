"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split, same convention as every other simulation in this
 * subject — the simulator and its model are only fetched when this
 * route is actually visited. The instruction cycle is a discrete,
 * conceptual process, so this stays a plain 2D component rather than
 * a 3D scene (see the main component's doc comment).
 */
export const CpuArchitectureInstructionCycle = dynamic(
  () => import("./cpu-architecture-instruction-cycle").then((mod) => mod.CpuArchitectureInstructionCycle),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
