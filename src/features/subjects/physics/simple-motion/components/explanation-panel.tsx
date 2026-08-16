"use client";

import { Gauge, Ruler, TrendingUp } from "lucide-react";

const FACTS = [
  { icon: Gauge, text: "Speed tells us how fast something moves." },
  { icon: Ruler, text: "Distance tells us how far something travels." },
  { icon: TrendingUp, text: "More speed means more distance in the same amount of time." },
];

/**
 * Three short, always-visible statements — same card style as the
 * other Physics visualizations' info panels, but with no live
 * highlighting logic since this lesson has nothing to react to.
 */
export function ExplanationPanel() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">What&apos;s happening</p>
        <h2 className="mt-1 font-display text-xl font-medium text-ink dark:text-bone">The idea of motion</h2>
      </div>

      <ul className="flex flex-col gap-4">
        {FACTS.map((fact, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-subject-physics-soft text-subject-physics dark:bg-subject-physics/15">
              <fact.icon className="h-4 w-4" strokeWidth={2} />
            </span>
            <p className="pt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{fact.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
