"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const TransverseLongitudinalWaves = dynamic(
  () => import("./transverse-longitudinal-waves").then((mod) => mod.TransverseLongitudinalWaves),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
