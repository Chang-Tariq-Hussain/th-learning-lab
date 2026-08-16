"use client";

import { ArrowLeftRight, Scale, Sparkles, Zap } from "lucide-react";

const FACTS = [
  { icon: Zap, text: "A force is a push or a pull." },
  { icon: Scale, text: "Equal forces are balanced." },
  { icon: ArrowLeftRight, text: "Unequal forces are unbalanced." },
  {
    icon: Sparkles,
    text: "An unbalanced force can change an object's motion.",
  },
];

/**
 * Four short, always-visible statements — same card style as Simple
 * Motion's explanation panel, with no live highlighting logic since
 * every fact here is always true, not tied to the current sliders.
 */
export function ExplanationPanel() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          What&apos;s happening
        </p>
        <h2 className="mt-1 font-display text-xl font-medium text-ink dark:text-bone">
          Push and pull
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
