"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const CoordinatePlaneExplorer = dynamic(
  () => import("./coordinate-plane-explorer").then((mod) => mod.CoordinatePlaneExplorer),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
