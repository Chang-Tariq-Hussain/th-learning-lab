"use client";

import {
  FormulaCard,
  FormulaPanel,
  VariableTable,
  type FormulaVariable,
} from "@/features/simulation";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { CartReadouts } from "../physics";

interface FormulaEntry {
  id: string;
  caption: string;
  formula: string;
  meaning: string;
  variables: FormulaVariable[];
  law: 1 | 2 | 3 | 0;
  currentValue?: (readouts: CartReadouts) => string;
}

const formulas: FormulaEntry[] = [
  {
    id: "inertia",
    caption: "Newton's First Law (Inertia)",
    formula: "\\sum F = 0 \\implies a = 0",
    meaning:
      "When the net force on an object is zero, its velocity doesn't change — an object at rest stays at rest, and an object in motion keeps moving at constant velocity in a straight line. This isn't \"no forces\"; it's forces that balance exactly, like applied force canceled by friction, or weight canceled by the normal force.",
    variables: [
      {
        symbol: "\\sum F",
        meaning: "Net (total) force acting on the object",
        unit: "N",
      },
      { symbol: "a", meaning: "Acceleration", unit: "m/s²" },
    ],
    law: 1,
    currentValue: (r) => `Net force right now: ${r.netForce.toFixed(1)} N`,
  },
  {
    id: "f-ma",
    caption: "Newton's Second Law",
    formula: "F = m a",
    meaning:
      'Net force equals mass times acceleration. For a fixed force, a heavier object accelerates less (a = F/m) — this is the whole reason heavier objects feel "harder to push." It\'s also why doubling the force doubles the acceleration, but doubling the mass halves it.',
    variables: [
      { symbol: "F", meaning: "Net force", unit: "N" },
      { symbol: "m", meaning: "Mass", unit: "kg" },
      { symbol: "a", meaning: "Acceleration", unit: "m/s²" },
    ],
    law: 2,
    currentValue: (r) =>
      `${r.netForce.toFixed(1)} N ÷ ${r.mass.toFixed(1)} kg = ${r.acceleration.toFixed(2)} m/s²`,
  },
  {
    id: "action-reaction",
    caption: "Newton's Third Law",
    formula: "F_{A \\text{ on } B} = -F_{B \\text{ on } A}",
    meaning:
      'Whenever object A exerts a force on object B, B exerts an equal-magnitude, opposite-direction force back on A — simultaneously, not as a delayed "reaction." These two forces act on different objects, so they never cancel each other out (only forces on the same object can cancel).',
    variables: [
      {
        symbol: "F_{A \\text{ on } B}",
        meaning: "Force object A exerts on object B",
        unit: "N",
      },
      {
        symbol: "F_{B \\text{ on } A}",
        meaning: "Force object B exerts on object A",
        unit: "N",
      },
    ],
    law: 3,
  },
  {
    id: "momentum",
    caption: "Momentum",
    formula: "p = m v",
    meaning:
      'A measure of "quantity of motion" — mass times velocity. In a closed system (no external forces), total momentum is conserved: whatever one object gains, another loses exactly as much, which is why two skaters pushing apart fly off with equal and opposite momentum.',
    variables: [
      { symbol: "p", meaning: "Momentum", unit: "kg·m/s" },
      { symbol: "m", meaning: "Mass", unit: "kg" },
      { symbol: "v", meaning: "Velocity", unit: "m/s" },
    ],
    law: 0,
    currentValue: (r) =>
      `${r.mass.toFixed(1)} kg × ${r.velocity.toFixed(2)} m/s = ${r.momentum.toFixed(1)} kg·m/s`,
  },
  {
    id: "impulse",
    caption: "Impulse-Momentum Theorem",
    formula: "J = F \\Delta t = \\Delta p",
    meaning:
      "A force applied over a stretch of time changes momentum by exactly that impulse. A big force for a short time (a kick) and a small force for a long time (a steady push) can produce the same change in momentum — this is why airbags work: they extend Δt to reduce the peak force for the same Δp.",
    variables: [
      { symbol: "J", meaning: "Impulse", unit: "N·s" },
      { symbol: "F", meaning: "Force applied", unit: "N" },
      { symbol: "\\Delta t", meaning: "Duration force is applied", unit: "s" },
      { symbol: "\\Delta p", meaning: "Change in momentum", unit: "kg·m/s" },
    ],
    law: 0,
  },
  {
    id: "friction",
    caption: "Friction (Coulomb model)",
    formula: "f \\le \\mu N",
    meaning:
      "Friction opposes relative motion (or attempted motion) between two surfaces, up to a maximum of μN. Static friction (object at rest) adjusts to exactly cancel a small push, up to that maximum; kinetic friction (object sliding) has a fixed magnitude that opposes the current motion.",
    variables: [
      { symbol: "f", meaning: "Friction force", unit: "N" },
      {
        symbol: "\\mu",
        meaning: "Coefficient of friction (surface-dependent)",
        unit: "dimensionless",
      },
      { symbol: "N", meaning: "Normal force", unit: "N" },
    ],
    law: 1,
    currentValue: (r) => `Right now: ${r.frictionForce.toFixed(1)} N`,
  },
  {
    id: "weight",
    caption: "Weight",
    formula: "W = m g",
    meaning:
      "Weight is the force of gravity on an object's mass — not the same thing as mass itself. On a level surface, the normal force balances weight exactly (Law 1's balanced-forces case), which is why N = W = mg for every cart experiment in Law 1 & 2.",
    variables: [
      { symbol: "W", meaning: "Weight", unit: "N" },
      { symbol: "m", meaning: "Mass", unit: "kg" },
      { symbol: "g", meaning: "Gravitational acceleration", unit: "m/s²" },
    ],
    law: 0,
    currentValue: (r) =>
      `${r.mass.toFixed(1)} kg × g = ${r.weight.toFixed(1)} N`,
  },
];

const LAW_LABEL: Record<FormulaEntry["law"], string> = {
  0: "Concept",
  1: "Law 1",
  2: "Law 2",
  3: "Law 3",
};

export function FormulaSection({ readouts }: { readouts?: CartReadouts }) {
  const [expandedId, setExpandedId] = useState<string | null>("f-ma");

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
                <span className="flex items-center gap-2">
                  <span className="rounded-full bg-pine-600/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-pine-700 dark:bg-pine-300/10 dark:text-pine-200">
                    {LAW_LABEL[entry.law]}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                    {entry.caption}
                  </span>
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
                  {entry.currentValue && readouts ? (
                    <p className="font-mono text-xs text-pine-600 dark:text-pine-300">
                      {entry.currentValue(readouts)}
                    </p>
                  ) : null}
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
