"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

export const ReactionKinetics = dynamic(
  () => import("./reaction-kinetics").then((mod) => mod.ReactionKinetics),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
