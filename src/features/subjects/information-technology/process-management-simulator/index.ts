"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split, same convention as every other simulation in this
 * subject. States, queues, PCBs, and context switching are all
 * discrete/conceptual, so — like CPU Scheduling — this stays a plain
 * 2D/2.5D component rather than a 3D scene.
 */
export const ProcessManagementSimulator = dynamic(
  () => import("./process-management-simulator").then((mod) => mod.ProcessManagementSimulator),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
