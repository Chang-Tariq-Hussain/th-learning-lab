"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const FrequencyPeriod = dynamic(
  () => import("./frequency-period").then((mod) => mod.FrequencyPeriod),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
