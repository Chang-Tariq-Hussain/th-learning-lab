"use client";

import { cn } from "@/lib/utils";
import { GROUP_GRID_COLUMN, scoreToBackground, type ElementDef, type TrendMeta } from "../periodic-trends-model";

interface ElementTileProps {
  element: ElementDef;
  score: number | null;
  trend: TrendMeta;
  isSelected: boolean;
  isCompareSelected: boolean;
  onClick: (element: ElementDef) => void;
}

export function ElementTile({ element, score, trend, isSelected, isCompareSelected, onClick }: ElementTileProps) {
  const background = scoreToBackground(trend.color, score, element.isPredicted);

  return (
    <button
      type="button"
      onClick={() => onClick(element)}
      aria-pressed={isSelected}
      className={cn(
        "flex aspect-square w-full flex-col items-start justify-between rounded-[6px] border p-1 text-left transition-transform hover:z-10 hover:scale-[1.06] focus-visible:z-10 focus-visible:scale-[1.06] focus-visible:outline-none sm:rounded-lg sm:p-1.5",
        element.isPredicted ? "border-dashed border-ink/25 dark:border-bone/25" : "border-ink/10 dark:border-bone/15",
        isSelected && "ring-2 ring-ink dark:ring-bone",
        isCompareSelected && !isSelected && "ring-2 ring-offset-1 ring-offset-paper dark:ring-offset-chalkboard"
      )}
      style={{
        gridColumn: GROUP_GRID_COLUMN[element.group],
        gridRow: element.period,
        background,
        ...(isCompareSelected && !isSelected ? { boxShadow: `0 0 0 2px ${trend.color}` } : {}),
      }}
    >
      <span className="font-mono text-[7px] leading-none text-ink/60 dark:text-bone/60 sm:text-[9px]">
        {element.atomicNumber}
      </span>
      <span className="font-display text-[11px] font-semibold leading-none text-ink dark:text-bone sm:text-sm md:text-base">
        {element.symbol}
      </span>
      <span className="hidden truncate text-[9px] leading-none text-ink/60 dark:text-bone/60 lg:block">
        {element.name}
      </span>
    </button>
  );
}
