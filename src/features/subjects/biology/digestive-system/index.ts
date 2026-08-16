"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const DigestiveSystem = dynamic(
  () => import("./digestive-system").then((mod) => mod.DigestiveSystem),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  },
);
