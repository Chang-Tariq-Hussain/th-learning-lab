"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Compass } from "lucide-react";
import type { MoleculeConfig } from "../molecule-model";
import { GENERAL_EXPLANATION } from "../molecule-model";

interface GeometryPanelProps {
  molecule: MoleculeConfig;
}

/**
 * The 3D canvas shows the shape; this panel says what it is in words —
 * geometry name, bond angle, and why — so the lesson doesn't live only
 * inside the WebGL scene. Always visible (not gated behind a click),
 * per the same "important information isn't 3D-only" principle as the
 * atom labels.
 */
export function GeometryPanel({ molecule }: GeometryPanelProps) {
  return (
    <div className="rounded-card border border-subject-chemistry/30 bg-subject-chemistry-soft p-4 dark:border-subject-chemistry/20 dark:bg-subject-chemistry/10">
      <AnimatePresence mode="wait">
        <motion.div
          key={molecule.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Compass
              className="h-4 w-4 text-subject-chemistry"
              strokeWidth={1.75}
            />
            <p className="font-display text-base font-medium text-ink dark:text-bone">
              {molecule.geometryName} geometry
            </p>
            {molecule.bondAngle !== null ? (
              <span className="rounded-full border border-subject-chemistry/40 px-2 py-0.5 font-mono text-xs text-subject-chemistry">
                ~{molecule.bondAngle}°
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            {molecule.explanation} {molecule.geometryExplanation}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-ink-soft/80 dark:text-bone-soft/80">
            {GENERAL_EXPLANATION}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
