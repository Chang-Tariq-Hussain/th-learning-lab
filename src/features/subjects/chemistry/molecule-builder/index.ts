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
export const MoleculeBuilder = dynamic(() => import("./molecule-builder").then((mod) => mod.MoleculeBuilder), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});

/**
 * The free-build lab on its own, code-split the same way — used both
 * inside `MoleculeBuilder`'s "Build your own" tab and, standalone,
 * as a GLE Challenge scenario's per-scenario experiment override
 * (see `src/app/dashboard/chemistry/molecule-builder/challenge-experiments.tsx`),
 * where it's locked to one target and wired to a `checkTarget` ref
 * so the Challenge scenario can grade the student's real structure.
 */
export const MoleculeBuildLab = dynamic(
  () => import("./components/molecule-build-lab").then((mod) => mod.MoleculeBuildLab),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  },
);

export type { MoleculeBuildLabHandle } from "./components/molecule-build-lab";
