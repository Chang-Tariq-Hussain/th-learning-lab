"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const MeasuresOfDispersion = dynamic(
  () => import("./measures-of-dispersion").then((mod) => mod.MeasuresOfDispersion),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
