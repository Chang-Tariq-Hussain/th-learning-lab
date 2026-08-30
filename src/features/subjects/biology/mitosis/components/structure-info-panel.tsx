"use client";

import { Lightbulb, MousePointerClick } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { StructureInfo } from "../data/structure-info";

export interface StructureInfoPanelProps {
  structure: StructureInfo | null;
}

/**
 * Same card shell, empty state, and "Fun fact" treatment as Cell
 * Explorer's `InfoPanel` — deliberately reused rather than redesigned,
 * so clicking a structure here feels like the same interaction
 * students already know from Animal/Plant Cell Explorer. Only
 * difference: this one only ever shows one of four fixed structures
 * (not a full organelle map), so it's a flat swap on `structure.id`
 * rather than anything stage-aware.
 */
export function StructureInfoPanel({ structure }: StructureInfoPanelProps) {
  return (
    <div className="w-full max-w-2xl">
      <AnimatePresence mode="wait">
        {structure ? (
          <motion.div
            key={structure.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3 rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]"
          >
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Selected</p>
              <h3 className="mt-1 font-display text-lg font-medium text-ink dark:text-bone">{structure.name}</h3>
            </div>

            <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{structure.description}</p>

            <div className="flex items-start gap-2 rounded-2xl bg-subject-biology-soft px-4 py-3 text-sm leading-relaxed text-subject-biology dark:bg-subject-biology/15">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
              <span>
                <span className="font-medium">Fun fact: </span>
                {structure.fact}
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-[1.75rem] border border-dashed border-line bg-white/50 p-6 text-center dark:border-line-dark dark:bg-white/[0.03]"
          >
            <MousePointerClick className="h-5 w-5 text-ink-soft/60 dark:text-bone-soft/60" strokeWidth={1.5} />
            <p className="text-sm text-ink-soft dark:text-bone-soft">
              Click a chromosome, the spindle fibers, a centrosome, or the nucleus to learn what it does.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
