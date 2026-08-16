"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const ArrheniusTheory = dynamic(
  () => import("./arrhenius-theory").then((mod) => mod.ArrheniusTheory),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
