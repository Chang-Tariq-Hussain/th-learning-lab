"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split, same convention as every other simulation in this
 * subject. A file tree, storage blocks, and step-through operations
 * are all discrete/conceptual — no 3D scene needed here either.
 */
export const FileSystemExplorer = dynamic(
  () => import("./file-system-explorer").then((mod) => mod.FileSystemExplorer),
  {
    ssr: false,
    loading: () => createElement(SimulationSkeleton),
  }
);
