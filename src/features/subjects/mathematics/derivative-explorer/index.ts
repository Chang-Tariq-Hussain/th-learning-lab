"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const DerivativeExplorer = dynamic(
  () => import("./derivative-explorer").then((mod) => mod.DerivativeExplorer),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
