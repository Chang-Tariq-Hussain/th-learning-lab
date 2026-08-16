"use client";

import { ELEMENTS, TRENDS, getScore, type ElementDef, type TrendId } from "../periodic-trends-model";
import { ElementTile } from "./element-tile";

interface PeriodicTableGridProps {
  trend: TrendId;
  selected: string | null;
  compareSelection: string[];
  onSelect: (element: ElementDef) => void;
}

export function PeriodicTableGrid({ trend, selected, compareSelection, onSelect }: PeriodicTableGridProps) {
  const meta = TRENDS[trend];

  return (
    <div className="w-full overflow-x-auto rounded-card border border-line bg-white/40 p-2.5 dark:border-line-dark dark:bg-white/[0.02] sm:p-4">
      <div
        className="mx-auto grid gap-1 sm:gap-1.5"
        style={{
          gridTemplateColumns: "repeat(8, minmax(38px, 88px))",
          gridTemplateRows: "repeat(7, minmax(0, 1fr))",
          width: "min(100%, 704px)",
        }}
      >
        {ELEMENTS.map((element) => (
          <ElementTile
            key={element.symbol}
            element={element}
            score={getScore(trend, element.symbol)}
            trend={meta}
            isSelected={selected === element.symbol}
            isCompareSelected={compareSelection.includes(element.symbol)}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
