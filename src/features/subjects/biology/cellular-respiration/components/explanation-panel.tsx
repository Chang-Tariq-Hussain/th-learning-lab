"use client";

import { Battery, Droplet, Flame, Wind } from "lucide-react";

const FACTS = [
  { icon: Battery, text: "Cells need energy to carry out their activities." },
  { icon: Flame, text: "Glucose stores chemical energy." },
  { icon: Wind, text: "Oxygen helps cells release usable energy from glucose." },
  { icon: Droplet, text: "Carbon dioxide and water are produced." },
];

/** Four short, always-visible statements — same card style as Photosynthesis's explanation panel, kept deliberately brief per the spec. */
export function ExplanationPanel() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">What&apos;s happening</p>
        <h2 className="mt-1 font-display text-xl font-medium text-ink dark:text-bone">Releasing energy from food</h2>
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
