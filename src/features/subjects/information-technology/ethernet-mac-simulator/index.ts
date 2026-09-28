"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split, same convention as the other simulations in this subject
 * (see TCP/IP Model Explorer's `index.ts`). Plain 2D SVG/HTML — no three.js.
 */
export const EthernetMacSimulator = dynamic(
  () => import("./ethernet-mac-simulator").then((mod) => mod.EthernetMacSimulator),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  },
);
