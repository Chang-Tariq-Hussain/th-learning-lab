"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const DerivativeRules = dynamic(
  () => import("./derivative-rules").then((mod) => mod.DerivativeRules),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
