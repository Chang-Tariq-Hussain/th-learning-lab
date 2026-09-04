"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Link2, X } from "lucide-react";
import type { MoleculeBondSpec, MoleculeConfig } from "../molecule-model";
import { describeBond } from "../molecule-model";

interface BondDetailPanelProps {
  molecule: MoleculeConfig;
  selectedBond: MoleculeBondSpec | null;
  onClose: () => void;
}

/**
 * Short popup for whichever bond the student clicked in the 3D scene —
 * the compact "bond type / connected atoms / bond order / basic
 * explanation" panel the brief asks for. Mirrors `AtomDetailPanel`
 * exactly (same card, same close button, same "lives outside the
 * canvas" rationale) so bonds and atoms feel like the same kind of
 * inspectable thing rather than two different UI languages.
 */
export function BondDetailPanel({
  molecule,
  selectedBond,
  onClose,
}: BondDetailPanelProps) {
  const info = selectedBond ? describeBond(molecule, selectedBond) : null;

  return (
    <AnimatePresence>
      {info && selectedBond ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="flex items-start gap-3 rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
            <Link2
              className="mt-0.5 h-4 w-4 shrink-0 text-subject-chemistry"
              strokeWidth={1.75}
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="font-display text-base font-medium text-ink dark:text-bone">
                  {info.kind}
                </p>
                <span className="rounded-full border border-subject-chemistry/40 px-2 py-0.5 font-mono text-xs text-subject-chemistry">
                  {info.orderName} bond
                </span>
              </div>
              <p className="font-mono text-sm text-ink-soft dark:text-bone-soft">
                {info.pairLabel}
              </p>
              <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
                {info.explanation}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close bond details"
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
