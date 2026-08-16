"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const CentralTendency = dynamic(
  () => import("./central-tendency").then((mod) => mod.CentralTendency),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
