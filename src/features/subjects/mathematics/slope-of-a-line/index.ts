"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const SlopeOfALine = dynamic(
  () => import("./slope-of-a-line").then((mod) => mod.SlopeOfALine),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
