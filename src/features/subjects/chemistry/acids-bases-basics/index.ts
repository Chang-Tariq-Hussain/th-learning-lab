"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const AcidsBasesBasics = dynamic(
  () => import("./acids-bases-basics").then((mod) => mod.AcidsBasesBasics),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
