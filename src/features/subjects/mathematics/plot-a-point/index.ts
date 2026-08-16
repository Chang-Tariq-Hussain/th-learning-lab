"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const PlotAPoint = dynamic(() => import("./plot-a-point").then((mod) => mod.PlotAPoint), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});
