"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const ApplicationsOfDerivatives = dynamic(
  () => import("./applications-of-derivatives").then((mod) => mod.ApplicationsOfDerivatives),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
