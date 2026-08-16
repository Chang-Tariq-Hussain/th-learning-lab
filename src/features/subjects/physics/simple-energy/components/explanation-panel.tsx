"use client";

import { ArrowDownUp, Mountain, Sparkles } from "lucide-react";

const FACTS = [
  { icon: Sparkles, text: "Energy can change from one form to another." },
  { icon: Mountain, text: "At the top, the ball has more potential energy." },
  {
    icon: ArrowDownUp,
    text: "As the ball moves downward, potential energy changes into kinetic energy.",
  },
];

/**
 * Three short, always-visible statements — same card style as Simple
 * Motion's and Simple Forces' explanation panels.
 */
export function ExplanationPanel() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          What&apos;s happening
        </p>
        <h2 className="mt-1 font-display text-xl font-medium text-ink dark:text-bone">
          Energy on a hill
        </h2>
      </div>

      <ul className="flex flex-col gap-4">
        {FACTS.map((fact, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-subject-physics-soft text-subject-physics dark:bg-subject-physics/15">
              <fact.icon className="h-4 w-4" strokeWidth={2} />
            </span>
            <p className="pt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
              {fact.text}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
