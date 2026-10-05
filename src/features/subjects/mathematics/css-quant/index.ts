"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/** Code-split, same convention as the other simulations. Plain 2D SVG/HTML, no extra dependencies. */
export const CssQuantTrainer = dynamic(() => import("./css-quant-trainer").then((mod) => mod.CssQuantTrainer), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});
