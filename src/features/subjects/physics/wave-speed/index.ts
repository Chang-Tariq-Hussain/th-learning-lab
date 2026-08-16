"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const WaveSpeed = dynamic(() => import("./wave-speed").then((mod) => mod.WaveSpeed), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});
