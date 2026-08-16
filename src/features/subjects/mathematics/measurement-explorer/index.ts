"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const MeasurementExplorer = dynamic(
  () => import("./measurement-explorer").then((mod) => mod.MeasurementExplorer),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
