"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split, same convention as every other simulation in this
 * subject — the lab and its model are only fetched when this route is
 * actually visited. Number systems and data units are numeric/abstract,
 * not spatial, so this stays a plain 2D SVG/HTML component rather than
 * a 3D scene.
 */
export const NumberSystemsDataUnits = dynamic(
  () => import("./number-systems-data-units").then((mod) => mod.NumberSystemsDataUnits),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
