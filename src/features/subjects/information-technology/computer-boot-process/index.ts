"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split, same convention as every other simulation. This
 * simulation uses a lightweight 2.5D SVG cross-section (see
 * `components/computer-diagram.tsx`) rather than a full 3D scene —
 * chosen over `@react-three/fiber` for faster load and better mobile
 * performance while still giving the boot sequence a concrete physical
 * anchor, per the batch brief's "use 2.5D instead if it communicates
 * more clearly and performs significantly better" guidance.
 */
export const ComputerBootProcess = dynamic(
  () => import("./computer-boot-process").then((mod) => mod.ComputerBootProcess),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
