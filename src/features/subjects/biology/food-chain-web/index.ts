"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const FoodChainWeb = dynamic(
  () => import("./food-chain-web").then((mod) => mod.FoodChainWeb),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  },
);
