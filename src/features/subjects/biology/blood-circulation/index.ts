"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const BloodCirculation = dynamic(
  () => import("./blood-circulation").then((mod) => mod.BloodCirculation),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
