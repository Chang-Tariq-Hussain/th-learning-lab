"use client";

import type { Category } from "../data-collection-model";

interface RawDataListProps {
  categories: Category[];
  observations: string[];
}

/** Shows the dataset exactly as it was collected — an unsorted,
 *  unorganized sequence of chips — so students can see, side by
 *  side with the Frequency Table, what "raw data" looks like before
 *  it's been organized at all. */
export function RawDataList({ categories, observations }: RawDataListProps) {
  const byId = new Map(categories.map((c) => [c.id, c]));

  if (observations.length === 0) {
    return (
      <p className="text-sm italic text-ink-soft dark:text-bone-soft">
        No observations collected yet — tap a category above to record one.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Raw collected observations, in the order recorded">
      {observations.map((id, index) => {
        const category = byId.get(id);
        if (!category) return null;
        return (
          <span
            key={`${id}-${index}`}
            className="inline-flex items-center gap-1 rounded-full border border-ink/10 bg-paper px-2 py-1 text-xs dark:border-bone/10 dark:bg-white/[0.03]"
            title={`Observation ${index + 1}: ${category.label}`}
          >
            <span aria-hidden="true">{category.emoji}</span>
            <span className="sr-only">{category.label}</span>
          </span>
        );
      })}
    </div>
  );
}
