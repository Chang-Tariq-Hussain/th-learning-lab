"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const RespiratorySystem = dynamic(
  () => import("./respiratory-system").then((mod) => mod.RespiratorySystem),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
