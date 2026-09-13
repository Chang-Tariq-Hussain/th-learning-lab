"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split, same convention as every other simulation (see
 * `information-technology/cpu-ram-storage-data-flow/index.ts`). Plain
 * SVG/HTML — no 3D engine — per the batch brief's guidance that binary
 * and data representation are abstract concepts best served by a
 * polished 2D/2.5D interface rather than a forced 3D environment.
 */
export const BinaryDataRepresentation = dynamic(
  () => import("./binary-data-representation").then((mod) => mod.BinaryDataRepresentation),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
