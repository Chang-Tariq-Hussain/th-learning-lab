"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const MidpointOfALineSegment = dynamic(
  () => import("./midpoint-of-a-line-segment").then((mod) => mod.MidpointOfALineSegment),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
