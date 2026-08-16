"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const CalculusFoundations = dynamic(
  () => import("./calculus-foundations").then((mod) => mod.CalculusFoundations),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
