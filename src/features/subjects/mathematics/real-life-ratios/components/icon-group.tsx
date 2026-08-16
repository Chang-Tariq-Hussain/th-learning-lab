"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { IconChip } from "./icon-chip";

export interface IconGroupProps {
  hex: string;
  icon?: LucideIcon;
  count: number;
  /** How many chips sit in each dashed group — the base ratio amount, so `count / groupSize` groups are visible. */
  groupSize: number;
  size?: "sm" | "md" | "lg";
  emptyLabel?: string;
}

/**
 * Splits `count` chips into equal dashed-box groups of `groupSize` —
 * the same "repeated copies of the base ratio" idea used elsewhere in
 * the app, so a scaled-up quantity visibly reads as "4 groups of 3"
 * rather than just the number 12.
 */
export function IconGroup({ hex, icon, count, groupSize, size = "md", emptyLabel }: IconGroupProps) {
  const safeGroupSize = Math.max(1, groupSize);
  const groupCount = count === 0 ? 0 : Math.ceil(count / safeGroupSize);
  const groups = Array.from({ length: groupCount }, (_, g) => {
    const start = g * safeGroupSize;
    const end = Math.min(start + safeGroupSize, count);
    return Array.from({ length: end - start }, (_, i) => start + i);
  });

  if (count === 0) {
    return (
      <div className="flex h-12 items-center justify-center rounded-xl border border-dashed border-ink/15 px-4 text-sm italic text-ink-soft/60 dark:border-bone/20 dark:text-bone-soft/60">
        {emptyLabel ?? "—"}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2" role="img" aria-label={`${count}`}>
      {groups.map((indices, g) => (
        <div
          key={g}
          className="flex flex-wrap content-start items-center gap-1.5 rounded-xl border border-dashed border-ink/15 p-1.5 dark:border-bone/20"
        >
          <AnimatePresence initial={false}>
            {indices.map((i) => (
              <motion.span
                key={i}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
              >
                <IconChip hex={hex} icon={icon} size={size} />
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
