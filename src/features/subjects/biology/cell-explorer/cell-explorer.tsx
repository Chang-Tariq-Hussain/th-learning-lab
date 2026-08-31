"use client";

import { useState } from "react";
import { RotateCcw, Tag, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ANIMAL_ORGANELLE_CENTERS } from "./components/animal-cell-organelles";
import { CellIllustration } from "./components/cell-illustration";
import { CellSwitch } from "./components/cell-switch";
import { InfoPanel } from "./components/info-panel";
import { PLANT_ORGANELLE_CENTERS } from "./components/plant-cell-organelles";
import { getOrganelleInfo } from "./data/organelle-info";
import { useZoom } from "./hooks/use-zoom";
import type { CellKind } from "./types";

/**
 * TASK 5 SCOPE ONLY -- swaps the name-only lookup Task 4 used for the
 * real `getOrganelleInfo` data lookup, so the info panel now gets a
 * full name/description/fact. Nothing about selection state, the SVG,
 * or the layout changes -- see `data/organelle-info.ts` for the actual
 * content and `info-panel.tsx` for how it's displayed.
 *
 * TASK 6 SCOPE ADDS: a "Show labels" toggle (`showLabels` state) so
 * students can see every organelle's name at once instead of only on
 * click. Turning cell kinds doesn't reset it, since it's a standing
 * display preference, not part of the selection state that
 * `handleReset` clears.
 *
 * TASK 8 SCOPE ADDS: zoom controls via `useZoom`. `focusPoint` looks
 * up the *currently selected* organelle's center so zooming in
 * re-centers on whatever a student just clicked rather than the
 * cell's middle.
 *
 * TASK 7 SCOPE extends both of the above from animal-only to both
 * cell kinds: `centersById` swaps between `ANIMAL_ORGANELLE_CENTERS`
 * and `PLANT_ORGANELLE_CENTERS` based on `cellKind`, and the zoom
 * buttons are no longer gated behind `isAnimal`. Switching cell kinds
 * still resets zoom either way — a coordinate from one cell's center
 * lookup is meaningless in the other's layout, so carrying a zoom
 * level across the switch would either mis-center or silently do
 * nothing.
 *
 * BUGFIX/ENHANCEMENT — `zoom.isPannable`/`zoom.panBy` are now passed
 * straight through to `CellIllustration`, which owns the actual
 * pointer-drag handling. Previously, zooming in just clipped the cell
 * at the SVG's edges with no way to look around; now it can be dragged
 * like the zoomed view in any other app.
 */
export function CellExplorer() {
  const [cellKind, setCellKind] = useState<CellKind>("animal");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(false);

  const centersById = cellKind === "animal" ? ANIMAL_ORGANELLE_CENTERS : PLANT_ORGANELLE_CENTERS;
  const focusPoint = selectedId ? (centersById[selectedId] ?? null) : null;
  const zoom = useZoom(focusPoint);

  const handleCellChange = (kind: CellKind) => {
    setCellKind(kind);
    setSelectedId(null);
    zoom.reset();
  };

  const handleSelect = (id: string) => {
    setSelectedId((current) => (current === id ? null : id));
  };

  const handleReset = () => {
    setCellKind("animal");
    setSelectedId(null);
    zoom.reset();
  };

  const selectedOrganelle = getOrganelleInfo(selectedId);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-center">
        <CellSwitch value={cellKind} onChange={handleCellChange} />
      </div>

      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="relative flex justify-center">
          <CellIllustration
            cellKind={cellKind}
            selectedId={selectedId}
            onSelect={handleSelect}
            showLabels={showLabels}
            zoomTransform={zoom.transform}
            isPannable={zoom.isPannable}
            onPanBy={zoom.panBy}
          />
          <div className="absolute bottom-2 right-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={zoom.zoomIn}
              disabled={!zoom.canZoomIn}
              aria-label="Zoom in"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-paper/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-ink/[0.04] disabled:pointer-events-none disabled:opacity-40 dark:border-bone/20 dark:bg-chalkboard/80 dark:text-bone dark:hover:bg-bone/[0.06]"
            >
              <ZoomIn className="h-5 w-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={zoom.zoomOut}
              disabled={!zoom.canZoomOut}
              aria-label="Zoom out"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-paper/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-ink/[0.04] disabled:pointer-events-none disabled:opacity-40 dark:border-bone/20 dark:bg-chalkboard/80 dark:text-bone dark:hover:bg-bone/[0.06]"
            >
              <ZoomOut className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
        <InfoPanel organelle={selectedOrganelle} />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" variant="ghost" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" strokeWidth={2} />
          Reset
        </Button>
        <Button
          size="lg"
          variant={showLabels ? "secondary" : "ghost"}
          onClick={() => setShowLabels((current) => !current)}
          aria-pressed={showLabels}
        >
          <Tag className="h-4 w-4" strokeWidth={2} />
          {showLabels ? "Hide labels" : "Show labels"}
        </Button>
      </div>
    </div>
  );
}
