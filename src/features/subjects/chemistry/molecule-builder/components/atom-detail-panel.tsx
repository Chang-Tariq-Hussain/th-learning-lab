"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { MoleculeAtomSpec, MoleculeConfig } from "../molecule-model";
import { ATOM_INFO, countElement, elementLabel } from "../molecule-model";

interface AtomDetailPanelProps {
  molecule: MoleculeConfig;
  selectedAtom: MoleculeAtomSpec | null;
  onClose: () => void;
}

/**
 * Short popup for whichever atom the student clicked in the 3D scene:
 * element name/symbol, how many of that element are in this molecule,
 * and whether it's the central atom (the one the shape is built
 * around) or a terminal one. Lives outside the canvas — same rationale
 * as `GeometryPanel` — so atom details survive even if 3D interaction
 * is limited on a given device.
 */
export function AtomDetailPanel({
  molecule,
  selectedAtom,
  onClose,
}: AtomDetailPanelProps) {
  const info = selectedAtom ? ATOM_INFO[selectedAtom.element] : null;
  const count = selectedAtom
    ? countElement(molecule, selectedAtom.element)
    : 0;

  return (
    <AnimatePresence>
      {info && selectedAtom ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="flex items-start gap-3 rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
            <div className="flex-1">
              <p className="font-display text-base font-medium text-ink dark:text-bone">
                {info.name}
              </p>
              <p className="font-mono text-sm text-ink-soft dark:text-bone-soft">
                {info.symbol}
              </p>
              <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
                {count} {elementLabel(selectedAtom.element)} atom
                {count === 1 ? "" : "s"} in this molecule
                {selectedAtom.role === "central"
                  ? " — this is the central atom the shape is built around."
                  : "."}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close atom details"
              className="rounded-full p-1 text-ink-soft hover:bg-ink/5 hover:text-ink dark:text-bone-soft dark:hover:bg-bone/10 dark:hover:text-bone"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
