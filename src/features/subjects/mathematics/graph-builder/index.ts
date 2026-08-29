"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const GraphBuilder = dynamic(() => import("./graph-builder").then((mod) => mod.GraphBuilder), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});
