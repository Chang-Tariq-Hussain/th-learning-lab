"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  FormulaPanel,
  FormulaCard,
  VariableTable,
  type FormulaVariable,
} from "@/features/simulation";
import { cn } from "@/lib/utils";
import type { LaunchParams, Trajectory } from "../physics";
import { idealMaxHeight, idealRange, idealTimeOfFlight } from "../physics";

interface FormulaEntry {
  id: string;
  caption: string;
  formula: string;
  meaning: string;
  variables: FormulaVariable[];
  /** Live numeric value computed from current parameters, shown once expanded. */
  currentValue: (params: LaunchParams, trajectory: Trajectory) => string;
}

const formulas: FormulaEntry[] = [
  {
    id: "x",
    caption: "Horizontal position",
    formula: "x = v \\cos(\\theta)\\, t",
    meaning:
      "Horizontal velocity never changes without air resistance, so horizontal position grows linearly with time — this is the independence of horizontal and vertical motion.",
    variables: [
      {
        symbol: "x",
        meaning: "Horizontal distance from launch point",
        unit: "m",
      },
      { symbol: "v", meaning: "Launch speed", unit: "m/s" },
      {
        symbol: "\\theta",
        meaning: "Launch angle above horizontal",
        unit: "degrees",
      },
      { symbol: "t", meaning: "Time since launch", unit: "s" },
    ],
    currentValue: (p, t) =>
      `${(p.speed * Math.cos((p.angleDeg * Math.PI) / 180) * t.timeOfFlight).toFixed(1)} m at landing`,
  },
  {
    id: "y",
    caption: "Vertical position",
    formula: "y = v \\sin(\\theta)\\, t - \\tfrac{1}{2} g t^2",
    meaning:
      "Vertical position combines the initial upward velocity with gravity's constant downward pull — the same shape as any object thrown straight up, just with a smaller effective initial speed (v sinθ).",
    variables: [
      { symbol: "y", meaning: "Height above launch point", unit: "m" },
      { symbol: "v", meaning: "Launch speed", unit: "m/s" },
      {
        symbol: "\\theta",
        meaning: "Launch angle above horizontal",
        unit: "degrees",
      },
      { symbol: "g", meaning: "Gravitational acceleration", unit: "m/s²" },
      { symbol: "t", meaning: "Time since launch", unit: "s" },
    ],
    currentValue: (p, t) => `Peaks at ${t.maxHeight.toFixed(1)} m`,
  },
  {
    id: "height",
    caption: "Maximum height",
    formula: "H = \\dfrac{v^2 \\sin^2(\\theta)}{2g}",
    meaning:
      "The projectile stops rising when vertical velocity hits zero. This formula is just the vertical position equation evaluated at that moment.",
    variables: [
      { symbol: "H", meaning: "Maximum height reached", unit: "m" },
      { symbol: "v", meaning: "Launch speed", unit: "m/s" },
      {
        symbol: "\\theta",
        meaning: "Launch angle above horizontal",
        unit: "degrees",
      },
      { symbol: "g", meaning: "Gravitational acceleration", unit: "m/s²" },
    ],
    currentValue: (p) => `${idealMaxHeight(p).toFixed(1)} m (ideal, no drag)`,
  },
  {
    id: "flight-time",
    caption: "Time of flight",
    formula: "T = \\dfrac{2v \\sin(\\theta)}{g}",
    meaning:
      "By symmetry, the time to fall back to launch height is exactly twice the time it took to reach maximum height.",
    variables: [
      { symbol: "T", meaning: "Total time in the air", unit: "s" },
      { symbol: "v", meaning: "Launch speed", unit: "m/s" },
      {
        symbol: "\\theta",
        meaning: "Launch angle above horizontal",
        unit: "degrees",
      },
      { symbol: "g", meaning: "Gravitational acceleration", unit: "m/s²" },
    ],
    currentValue: (p) =>
      `${idealTimeOfFlight(p).toFixed(2)} s (ideal, no drag)`,
  },
  {
    id: "range",
    caption: "Range",
    formula: "R = \\dfrac{v^2 \\sin(2\\theta)}{g}",
    meaning:
      "Range is horizontal velocity times time of flight, simplified using the double-angle identity. It's maximized at θ = 45° for a fixed speed and gravity.",
    variables: [
      { symbol: "R", meaning: "Horizontal distance at landing", unit: "m" },
      { symbol: "v", meaning: "Launch speed", unit: "m/s" },
      {
        symbol: "\\theta",
        meaning: "Launch angle above horizontal",
        unit: "degrees",
      },
      { symbol: "g", meaning: "Gravitational acceleration", unit: "m/s²" },
    ],
    currentValue: (p) => `${idealRange(p).toFixed(1)} m (ideal, no drag)`,
  },
];

interface FormulaSectionProps {
  params: LaunchParams;
  trajectory: Trajectory;
}

export function FormulaSection({ params, trajectory }: FormulaSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>("range");

  return (
    <FormulaPanel title="Formulas — click to explain">
      <div className="flex flex-col gap-3">
        {formulas.map((entry) => {
          const isOpen = expandedId === entry.id;
          return (
            <div
              key={entry.id}
              className="overflow-hidden rounded-lg border border-line dark:border-line-dark"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : entry.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-ink/[0.03] dark:hover:bg-bone/[0.05]"
              >
                <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                  {entry.caption}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-ink-soft transition-transform dark:text-bone-soft",
                    isOpen && "rotate-180",
                  )}
                  strokeWidth={1.75}
                />
              </button>

              <div className="px-3 pb-3">
                <FormulaCard
                  formula={entry.formula}
                  className="border-none bg-transparent px-0 py-2"
                />
              </div>

              {isOpen ? (
                <div className="flex flex-col gap-3 border-t border-line px-3 py-3 dark:border-line-dark">
                  <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
                    {entry.meaning}
                  </p>
                  <p className="font-mono text-xs text-pine-600 dark:text-pine-300">
                    Currently: {entry.currentValue(params, trajectory)}
                  </p>
                  <div className="overflow-x-auto">
                    <VariableTable variables={entry.variables} />
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </FormulaPanel>
  );
}
