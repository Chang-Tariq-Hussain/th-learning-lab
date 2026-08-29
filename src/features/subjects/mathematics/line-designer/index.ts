"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const LineDesigner = dynamic(() => import("./line-designer").then((mod) => mod.LineDesigner), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});
