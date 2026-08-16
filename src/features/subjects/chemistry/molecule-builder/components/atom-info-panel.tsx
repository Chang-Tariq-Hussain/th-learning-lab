"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { MoleculeAtomSpec, MoleculeConfig } from "../molecule-model";
import { ATOM_INFO, countElement } from "../molecule-model";

interface AtomInfoPanelProps {
  molecule: MoleculeConfig;
  selectedAtom: MoleculeAtomSpec | null;
  onClose: () => void;
}

const ELEMENT_LABEL: Record<string, string> = {
  H: "hydrogen",
  O: "oxygen",
  C: "carbon",
};

/** Short popup shown when a student taps an atom: element name, symbol, and how many of that element are in this molecule. Mirrors Build an Atom's `ParticleDetail` card. */
export function AtomInfoPanel({
  molecule,
  selectedAtom,
  onClose,
}: AtomInfoPanelProps) {
  const info = selectedAtom ? ATOM_INFO[selectedAtom.element] : null;
  const count = selectedAtom ? countElement(molecule, selectedAtom.element) : 0;

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
          <div className="flex items-start gap-3 rounded-card border border-subject-chemistry/30 bg-subject-chemistry-soft p-4 dark:border-subject-chemistry/20 dark:bg-subject-chemistry/10">
            <div className="flex-1">
              <p className="font-display text-base font-medium text-ink dark:text-bone">
                {info.name}
              </p>
              <p className="font-mono text-sm text-ink-soft dark:text-bone-soft">
                {info.symbol}
              </p>
              <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
                {count} {ELEMENT_LABEL[selectedAtom.element]} atom
                {count === 1 ? "" : "s"}
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
