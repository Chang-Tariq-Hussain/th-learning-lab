"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const BasicWaveMotion = dynamic(
  () => import("./basic-wave-motion").then((mod) => mod.BasicWaveMotion),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
