"use client";

import { AnimatePresence, motion } from "framer-motion";
import { OBJECT_COLORS, type ObjectColor } from "../colors";

export interface GroupedCirclesProps {
  color: ObjectColor;
  count: number;
  /** How many circles sit in each equal-sized group (from the current GCD). */
  groupSize: number;
}

/**
 * Renders `count` circles split into equal-sized groups (dashed boxes)
 * of `groupSize` each — the same partition used to explain *why* a
 * ratio simplifies: splitting both colors into the same number of
 * equal groups leaves one group's counts as the simplified ratio.
 * Circles are keyed by their flat index, which stays stable as long as
 * additions/removals happen at the end, so add/remove animates smoothly.
 */
export function GroupedCircles({ color, count, groupSize }: GroupedCirclesProps) {
  const { hex, label } = OBJECT_COLORS[color];
  const safeGroupSize = Math.max(1, groupSize);
  const groupCount = count === 0 ? 0 : Math.ceil(count / safeGroupSize);
  const groups = Array.from({ length: groupCount }, (_, g) => {
    const start = g * safeGroupSize;
    const end = Math.min(start + safeGroupSize, count);
    return Array.from({ length: end - start }, (_, i) => start + i);
  });

  if (count === 0) {
    return (
      <p className="text-sm italic text-ink-soft/60 dark:text-bone-soft/60">
        No {label.toLowerCase()} circles yet — add some below.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2.5" role="img" aria-label={`${count} ${label.toLowerCase()} circles`}>
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
                className="h-7 w-7 shrink-0 rounded-full shadow-sm sm:h-8 sm:w-8"
                style={{ backgroundColor: hex }}
              />
            ))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
