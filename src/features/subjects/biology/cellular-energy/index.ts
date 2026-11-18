"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/** Code-split (ssr: false) like the other labs. */
export const CellularEnergy = dynamic(() => import("./cellular-energy").then((mod) => mod.CellularEnergy), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});
