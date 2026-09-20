"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split, same convention as every other simulation in this
 * subject — the lab and its model are only fetched when this route is
 * actually visited. I/O and interrupts are about signals and
 * processes, not physical layout, so this stays a plain 2D/2.5D SVG
 * component rather than a 3D scene.
 */
export const IoInterruptsExplorer = dynamic(
  () => import("./io-interrupts-explorer").then((mod) => mod.IoInterruptsExplorer),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
