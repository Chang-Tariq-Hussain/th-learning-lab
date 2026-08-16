"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const ChainRuleExplorer = dynamic(
  () => import("./chain-rule-explorer").then((mod) => mod.ChainRuleExplorer),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
