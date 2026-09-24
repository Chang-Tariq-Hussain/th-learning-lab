"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split, same convention as the other simulations in this subject
 * (see OSI Model Explorer's `index.ts`). Plain 2D — the TCP/IP model is
 * conceptual, so no three.js.
 */
export const TcpIpModelExplorer = dynamic(
  () => import("./tcp-ip-model-explorer").then((mod) => mod.TcpIpModelExplorer),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
