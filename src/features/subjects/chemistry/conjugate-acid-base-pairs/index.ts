"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const ConjugateAcidBasePairs = dynamic(
  () => import("./conjugate-acid-base-pairs").then((mod) => mod.ConjugateAcidBasePairs),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
