"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CellKind } from "../types";
import { AnimalCellBody } from "./animal-cell-body";
import { AnimalCellOrganelles } from "./animal-cell-organelles";
import { PlantCellBody } from "./plant-cell-body";
import { PlantCellOrganelles } from "./plant-cell-organelles";

export interface CellIllustrationProps {
  cellKind: CellKind;
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** TASK 7 SCOPE — now wired to both cell kinds; originally animal-only (Task 6), extended to the plant cell's nine organelle ids here. */
  showLabels?: boolean;
  /** TASK 8 SCOPE — the `transform` string from `useZoom`, applied to a `<g>` wrapping the cell content, nested *inside* the existing enter/exit fade so the two animations don't fight each other. Defaults to identity so callers that don't zoom (yet) don't have to think about it. */
  zoomTransform?: string;
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
}: CellIllustrationProps) {
  const isPlant = cellKind === "plant";

  return (
    <svg
      viewBox="0 0 400 400"
      className="h-full w-full max-w-[26rem]"
      role="img"
      aria-label={
        isPlant
          ? "Plant cell with cell wall, cell membrane, cytoplasm, nucleus, nucleolus, ribosomes, rough and smooth endoplasmic reticulum, Golgi apparatus, mitochondria, a large central vacuole, chloroplasts, and plasmodesmata"
          : "Animal cell with nucleus, mitochondria, Golgi apparatus, rough endoplasmic reticulum, and ribosomes"
      }
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
              plain inline transition covers the "smooth zoom" case correctly. */}
          <g transform={zoomTransform} style={{ transition: "transform 320ms cubic-bezier(0.4, 0, 0.2, 1)" }}>
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
