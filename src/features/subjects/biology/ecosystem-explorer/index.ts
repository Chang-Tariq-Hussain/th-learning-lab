"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const EcosystemExplorer = dynamic(
  () => import("./ecosystem-explorer").then((mod) => mod.EcosystemExplorer),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  },
);
