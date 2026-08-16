"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const PeriodicTrends = dynamic(() => import("./periodic-trends").then((mod) => mod.PeriodicTrends), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});
