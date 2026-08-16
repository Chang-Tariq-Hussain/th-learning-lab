"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const StrongWeakAcidsBases = dynamic(
  () => import("./strong-weak-acids-bases").then((mod) => mod.StrongWeakAcidsBases),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
