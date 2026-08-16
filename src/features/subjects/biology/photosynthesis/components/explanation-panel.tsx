"use client";

import { CloudSun, Droplets, Wind } from "lucide-react";

const FACTS = [
  { icon: CloudSun, text: "Plants use light energy to make food." },
  { icon: Wind, text: "Carbon dioxide and water are used during photosynthesis." },
  { icon: Droplets, text: "Oxygen is released." },
];

/** Three short, always-visible statements — same card style as the other Biology/Physics explanation panels, kept deliberately brief per the spec. */
export function ExplanationPanel() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">What&apos;s happening</p>
        <h2 className="mt-1 font-display text-xl font-medium text-ink dark:text-bone">Making food from light</h2>
      </div>

      <ul className="flex flex-col gap-4">
        {FACTS.map((fact, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-subject-biology-soft text-subject-biology dark:bg-subject-biology/15">
              <fact.icon className="h-4 w-4" strokeWidth={2} />
            </span>
            <p className="pt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{fact.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
