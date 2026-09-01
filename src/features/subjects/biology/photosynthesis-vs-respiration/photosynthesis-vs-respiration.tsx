"use client";

import { useState } from "react";
import { CycleDiagram } from "./components/cycle-diagram";
import { ProcessToggleDetail } from "./components/process-toggle-detail";
import { QuickComparisonTable } from "./components/quick-comparison-table";
import type { ProcessKey } from "./types";

/**
 * Photosynthesis vs Cellular Respiration — the Topic 6 "Explore"
 * experience. Not a new physics-style playback simulation: the brief
 * is explicit that this should be "a lightweight comparison
 * interaction using existing components," not a new framework, so
 * this is three small, static/lightly-interactive pieces stacked
 * together:
 *
 *  1. `QuickComparisonTable` — the brief's exact four-row table,
 *     always visible, for a fast side-by-side glance.
 *  2. `ProcessToggleDetail` — the brief's click-to-reveal toggle
 *     ("[Photosynthesis] [Cellular Respiration]" buttons revealing
 *     Inputs/Outputs/Energy/Organelle/Purpose), for reading one
 *     process in full.
 *  3. `CycleDiagram` — the brief's visual cycle connecting the two
 *     processes through matter, with an explicit note that energy
 *     doesn't cycle the same way matter does.
 *
 * No new playback engine, no per-particle animation — this is
 * read-and-click content, matching what it's teaching (a comparison
 * and a connection, not a process with its own timeline).
 */
export function PhotosynthesisVsRespiration() {
  const [selected, setSelected] = useState<ProcessKey>("photosynthesis");

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <QuickComparisonTable />
        <CycleDiagram />
      </div>

      <div className="w-full max-w-2xl">
        <ProcessToggleDetail selected={selected} onSelect={setSelected} />
      </div>
    </div>
  );
}
