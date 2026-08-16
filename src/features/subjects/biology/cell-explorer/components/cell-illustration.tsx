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
          {isPlant ? (
            <>
              <PlantCellBody selectedId={selectedId} onSelect={onSelect} />
              <PlantCellOrganelles
                selectedId={selectedId}
                onSelect={onSelect}
              />
            </>
          ) : (
            <>
              <AnimalCellBody />
              <AnimalCellOrganelles
                selectedId={selectedId}
                onSelect={onSelect}
              />
            </>
          )}
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}
