import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";
import dynamic from "next/dynamic";
import { createElement } from "react";

export const GraphBuilder = dynamic(
  () => import("./graph-builder").then((mod) => mod.GraphBuilder),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  },
);
