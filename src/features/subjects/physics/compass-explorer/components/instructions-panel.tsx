"use client";

import { Compass as CompassIcon, Hand, Magnet as MagnetIcon } from "lucide-react";

const STEPS = [
  { icon: MagnetIcon, text: "Drag the magnet, or drag the small circle at its tip to rotate it." },
  { icon: Hand, text: "Drag the compass anywhere in the playground." },
  { icon: CompassIcon, text: "Watch the needle turn to follow the magnet's field as either one moves." },
];

export function InstructionsPanel() {
  return (
    <div className="flex h-full flex-col gap-5 rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">How to play</p>
        <h2 className="mt-1 font-display text-xl font-medium text-ink dark:text-bone">Follow the field</h2>
      </div>

      <ol className="flex flex-col gap-4">
        {STEPS.map((step, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-subject-physics-soft text-subject-physics dark:bg-subject-physics/15">
              <step.icon className="h-4 w-4" strokeWidth={2} />
            </span>
            <p className="pt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
