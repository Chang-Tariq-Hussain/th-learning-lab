"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const LewisAcidBase = dynamic(
  () => import("./lewis-acid-base").then((mod) => mod.LewisAcidBase),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
