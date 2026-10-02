"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/** Code-split, same convention as the other simulations in this subject. Plain 2D SVG/HTML, no three.js. */
export const SwitchMacTableSimulator = dynamic(() => import("./switch-mac-table-simulator").then((mod) => mod.SwitchMacTableSimulator), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});
