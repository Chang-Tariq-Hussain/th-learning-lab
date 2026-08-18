"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split like every simulation and the Quiz Engine's own dynamic
 * export — the Practice Mode chunk (config screen + question bank +
 * the Quiz Engine it renders) only loads when a student actually
 * opens `/dashboard/practice`.
 */
export const PracticeMode = dynamic(() => import("./practice-session").then((mod) => mod.PracticeSession), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});

export type { PracticeConfig, PracticeSubjectOption, PracticeTopicOption } from "./types";
