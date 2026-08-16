"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split so this simulation's (often large, browser-only) code
 * only downloads when a student actually opens it — the topic and
 * subject list pages never pay for it. `ssr: false` skips server
 * rendering for the same reason: nothing here needs to appear in the
 * initial HTML, and it avoids paying server render cost for a canvas/
 * animation-heavy component. The skeleton below is shown the instant
 * navigation starts, so there's no blank page while it loads.
 */
export const NewtonsLaws = dynamic(() => import("./newtons-laws").then((mod) => mod.NewtonsLaws), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});
