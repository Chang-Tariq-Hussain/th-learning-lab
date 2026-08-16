"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const PerimeterAreaExplorer = dynamic(
  () => import("./perimeter-area-explorer").then((mod) => mod.PerimeterAreaExplorer),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
