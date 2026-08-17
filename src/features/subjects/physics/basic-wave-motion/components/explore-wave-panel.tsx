"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  EXPLORE_EXPLANATION,
  EXPLORE_ITEMS,
  EXPLORE_LABEL,
  type ExploreItem,
} from "../wave-model";

interface ExploreWavePanelProps {
  selected: ExploreItem | null;
  onSelect: (item: ExploreItem | null) => void;
}

export function ExploreWavePanel({
  selected,
  onSelect,
}: ExploreWavePanelProps) {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
        Explore the wave
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {EXPLORE_ITEMS.map((item) => {
          const isSelected = selected === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => onSelect(isSelected ? null : item)}
              aria-pressed={isSelected}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                isSelected
                  ? "border-transparent bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
                  : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone",
              )}
            >
              {EXPLORE_LABEL[item]}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selected ? (
          <motion.p
            key={selected}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-bone-soft"
          >
            {EXPLORE_EXPLANATION[selected]}
          </motion.p>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-ink-soft/70 dark:text-bone-soft/70">
            Pick a feature above to highlight it on the wave — playback pauses
            so it&apos;s easy to see.
          </p>
        )}
      </AnimatePresence>
    </div>
  );
}
