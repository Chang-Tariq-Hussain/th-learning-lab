"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split the same way every other simulation/interactive in this
 * subject is, even though this one is lighter weight than most — one
 * consistent loading convention across Biology rather than a special
 * case for this topic.
 */
export const PhotosynthesisVsRespiration = dynamic(
  () => import("./photosynthesis-vs-respiration").then((mod) => mod.PhotosynthesisVsRespiration),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  },
);
