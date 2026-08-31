"use client";

import { type PointerEvent as ReactPointerEvent, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CellKind } from "../types";
import { AnimalCellBody } from "./animal-cell-body";
import { AnimalCellOrganelles } from "./animal-cell-organelles";
import { PlantCellBody } from "./plant-cell-body";
import { PlantCellOrganelles } from "./plant-cell-organelles";

const VIEWBOX_SIZE = 400;

export interface CellIllustrationProps {
  cellKind: CellKind;
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** TASK 7 SCOPE — now wired to both cell kinds; originally animal-only (Task 6), extended to the plant cell's nine organelle ids here. */
  showLabels?: boolean;
  /** TASK 8 SCOPE — the `transform` string from `useZoom`, applied to a `<g>` wrapping the cell content, nested *inside* the existing enter/exit fade so the two animations don't fight each other. Defaults to identity so callers that don't zoom (yet) don't have to think about it. */
  zoomTransform?: string;
  /** BUGFIX/ENHANCEMENT — whether the caller is currently zoomed in
   *  past "fit". When true, this component wires up drag-to-pan on the
   *  SVG itself (mouse drag or touch drag, via Pointer Events so both
   *  work the same way) — previously, zooming in just clipped content
   *  at the SVG's edges with no way to look around, unlike the
   *  drag-to-pan behavior every other app's pinch/click-to-zoom offers. */
  isPannable?: boolean;
  /** Called with a drag delta already converted to the shared 400×400
   *  viewBox's own units. Typically `useZoom`'s `panBy`. */
  onPanBy?: (dx: number, dy: number) => void;
}

/**
 * The Animal Cell branch (AnimalCellBody + AnimalCellOrganelles) is
 * completely untouched by this pass. The Plant Cell's placeholder
 * outline is replaced with its own real body (PlantCellBody -- Cell
 * Wall, Cell Membrane, Cytoplasm, Plasmodesmata, all clickable) and
 * organelles (PlantCellOrganelles -- Nucleus, Nucleolus, Ribosomes,
 * Rough ER, Smooth ER, Golgi, Mitochondria, Large Central Vacuole,
 * Chloroplasts). Both cell kinds now share the exact same
 * `selectedId`/`onSelect` plumbing and `OrganelleHotspot` interaction.
 */
export function CellIllustration({
  cellKind,
  selectedId,
  onSelect,
  showLabels = false,
  zoomTransform = "translate(0 0) scale(1)",
  isPannable = false,
  onPanBy,
}: CellIllustrationProps) {
  const isPlant = cellKind === "plant";
  const svgRef = useRef<SVGSVGElement>(null);
  const dragState = useRef<{ pointerId: number; lastX: number; lastY: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!isPannable) return;
    // Only primary button/touch/pen — ignore e.g. a right-click drag.
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = { pointerId: e.pointerId, lastX: e.clientX, lastY: e.clientY };
    setIsDragging(true);
  };

  const handlePointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const drag = dragState.current;
    if (!isPannable || !drag || drag.pointerId !== e.pointerId) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    // Convert the pointer's on-screen pixel movement into the SVG's
    // own 400×400 viewBox units, separately per axis (the rendered
    // element isn't guaranteed to be perfectly square).
    const dx = (e.clientX - drag.lastX) * (VIEWBOX_SIZE / rect.width);
    const dy = (e.clientY - drag.lastY) * (VIEWBOX_SIZE / rect.height);
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    onPanBy?.(dx, dy);
  };

  const endDrag = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (dragState.current?.pointerId === e.pointerId) {
      dragState.current = null;
      setIsDragging(false);
    }
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 400"
      className={`h-full w-full max-w-[26rem] ${isPannable ? "cursor-grab touch-none active:cursor-grabbing" : ""}`}
      role="img"
      aria-label={
        isPlant
          ? "Plant cell with cell wall, cell membrane, cytoplasm, nucleus, nucleolus, ribosomes, rough and smooth endoplasmic reticulum, Golgi apparatus, mitochondria, a large central vacuole, chloroplasts, and plasmodesmata"
          : "Animal cell with nucleus, mitochondria, Golgi apparatus, rough endoplasmic reticulum, and ribosomes"
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
    >
      <AnimatePresence mode="wait">
        <motion.g
          key={cellKind}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          {/* Plain SVG `transform` attribute + CSS transition (not framer-motion) --
              framer-motion's `transform` style key expects CSS transform syntax
              (translateX(10px)), not SVG's own `translate(10 20)` argument format,
              so animating a raw useZoom() transform string through it would be
              fighting two different transform dialects. The `transform` presentation
              attribute is itself CSS-transition-animatable in current browsers, so a
              plain inline transition covers the "smooth zoom" case correctly.

              The transition is switched off entirely while actively dragging
              (`isDragging`) so a pan tracks the pointer 1:1 instead of
              chasing it through a 320ms easing curve every frame — the
              same reason native map/photo apps disable "smooth" easing
              during an active drag and only re-enable it for
              button-triggered moves (zoom in/out, re-centering on a
              newly selected organelle). */}
          <g
            transform={zoomTransform}
            style={{ transition: isDragging ? "none" : "transform 320ms cubic-bezier(0.4, 0, 0.2, 1)" }}
          >
            {isPlant ? (
              <>
                <PlantCellBody selectedId={selectedId} onSelect={onSelect} />
                <PlantCellOrganelles
                  selectedId={selectedId}
                  onSelect={onSelect}
                  showLabels={showLabels}
                />
              </>
            ) : (
              <>
                <AnimalCellBody />
                <AnimalCellOrganelles
                  selectedId={selectedId}
                  onSelect={onSelect}
                  showLabels={showLabels}
                />
              </>
            )}
          </g>
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}
