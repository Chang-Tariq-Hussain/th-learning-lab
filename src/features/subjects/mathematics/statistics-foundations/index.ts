"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const StatisticsFoundations = dynamic(
  () => import("./statistics-foundations").then((mod) => mod.StatisticsFoundations),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
