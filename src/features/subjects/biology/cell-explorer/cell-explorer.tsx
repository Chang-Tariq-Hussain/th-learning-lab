"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CellIllustration } from "./components/cell-illustration";
import { CellSwitch } from "./components/cell-switch";
import { InfoPanel } from "./components/info-panel";
import { getOrganelleInfo } from "./data/organelle-info";
import type { CellKind } from "./types";

/**
 * TASK 5 SCOPE ONLY -- swaps the name-only lookup Task 4 used for the
 * real `getOrganelleInfo` data lookup, so the info panel now gets a
 * full name/description/fact. Nothing about selection state, the SVG,
 * or the layout changes -- see `data/organelle-info.ts` for the actual
 * content and `info-panel.tsx` for how it's displayed.
 */
export function CellExplorer() {
  const [cellKind, setCellKind] = useState<CellKind>("animal");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleCellChange = (kind: CellKind) => {
    setCellKind(kind);
    setSelectedId(null);
  };

  const handleSelect = (id: string) => {
    setSelectedId((current) => (current === id ? null : id));
  };

  const handleReset = () => {
    setCellKind("animal");
    setSelectedId(null);
  };

  const selectedOrganelle = getOrganelleInfo(selectedId);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-center">
        <CellSwitch value={cellKind} onChange={handleCellChange} />
      </div>

      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="flex justify-center">
          <CellIllustration cellKind={cellKind} selectedId={selectedId} onSelect={handleSelect} />
        </div>
        <InfoPanel organelle={selectedOrganelle} />
      </div>

      <div className="flex justify-center">
        <Button size="lg" variant="ghost" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" strokeWidth={2} />
          Reset
        </Button>
      </div>
    </div>
  );
}
