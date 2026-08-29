"use client";

import type { Category } from "../data-collection-model";

interface CategoryButtonProps {
  category: Category;
  count: number;
  onAdd: () => void;
}

/** One "collect an observation" control — tapping it is the act of
 *  recording a single data point for this category. Shows the live
 *  running count right on the button so adding data and seeing the
 *  table update never feel disconnected. */
export function CategoryButton({ category, count, onAdd }: CategoryButtonProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="flex flex-col items-center gap-1.5 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-center shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 dark:border-bone/10 dark:bg-white/[0.04]"
      aria-label={`Record one observation for ${category.label}`}
    >
      <span className="text-2xl leading-none" aria-hidden="true">
        {category.emoji}
      </span>
      <span className="text-xs font-medium text-ink dark:text-bone">{category.label}</span>
      <span
        className="rounded-full px-2 py-0.5 font-mono text-[11px] tabular-nums text-white"
        style={{ backgroundColor: category.color }}
      >
        {count}
      </span>
    </button>
  );
}
