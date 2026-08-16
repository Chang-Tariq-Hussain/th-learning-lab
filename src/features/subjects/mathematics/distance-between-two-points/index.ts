"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const DistanceBetweenTwoPoints = dynamic(
  () => import("./distance-between-two-points").then((mod) => mod.DistanceBetweenTwoPoints),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
