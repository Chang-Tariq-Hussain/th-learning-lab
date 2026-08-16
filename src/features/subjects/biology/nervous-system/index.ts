"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const NervousSystem = dynamic(
  () => import("./nervous-system").then((mod) => mod.NervousSystem),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  },
);
