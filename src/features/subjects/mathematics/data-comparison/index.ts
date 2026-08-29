"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const DataComparisonLab = dynamic(() => import("./data-comparison-lab").then((mod) => mod.DataComparisonLab), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});
