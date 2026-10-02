"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/** Code-split, same convention as the other simulations in this subject. Plain 2D SVG/HTML, no three.js. */
export const RoutingSimulator = dynamic(() => import("./routing-simulator").then((mod) => mod.RoutingSimulator), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});
