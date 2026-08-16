"use client";

import { cn } from "@/lib/utils";
import { TREND_ORDER, TRENDS, type TrendId } from "../periodic-trends-model";

interface TrendSelectorProps {
  trend: TrendId;
  onChange: (id: TrendId) => void;
}

/** Simple trend selector — only one trend active at a time. */
export function TrendSelector({ trend, onChange }: TrendSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Periodic trend to explore"
      className="flex flex-wrap gap-1 rounded-full border border-line p-1 dark:border-line-dark"
    >
      {TREND_ORDER.map((id) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={trend === id}
          onClick={() => onChange(id)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
            trend === id
              ? "bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
              : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone"
          )}
        >
          <span className="sm:hidden">{TRENDS[id].shortLabel}</span>
          <span className="hidden sm:inline">{TRENDS[id].label}</span>
        </button>
      ))}
    </div>
  );
}
