"use client";

import type { LucideIcon } from "lucide-react";
import { Heart, Move, Zap } from "lucide-react";
import type { InteractionStatus, InteractionType } from "../magnet-physics";

interface StatusStyle {
  icon: LucideIcon;
  message: string;
  className: string;
}

const STATUS_STYLES: Record<InteractionType, StatusStyle> = {
  attract: {
    icon: Heart,
    message: "Opposite poles attract.",
    className:
      "border-pine-100 bg-pine-50 text-pine-700 dark:border-pine-500/30 dark:bg-pine-500/10 dark:text-pine-100",
  },
  repel: {
    icon: Zap,
    message: "Like poles repel.",
    className:
      "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100",
  },
  none: {
    icon: Move,
    message: "Move the magnets closer to observe magnetic forces.",
    className: "border-line bg-white/60 text-ink-soft dark:border-line-dark dark:bg-white/[0.04] dark:text-bone-soft",
  },
};

const FACTS: Array<{ id: InteractionType | "lines" | "strength"; text: string }> = [
  { id: "attract", text: "Opposite poles (N–S) pull toward each other." },
  { id: "repel", text: "Like poles (N–N or S–S) push apart." },
  { id: "lines", text: "Field lines always travel from North to South outside the magnet." },
  { id: "strength", text: "The magnetic field is strongest near the poles." },
];

export interface InfoPanelProps {
  status: InteractionStatus;
}

/**
 * Combined explanation + live-feedback panel: a status banner reflecting
 * whatever the two magnets are doing right now, plus a short,
 * always-visible list of the core facts — with the one matching the
 * current status quietly highlighted. No numeric readouts; this
 * visualization is about the rule, not measurement.
 */
export function InfoPanel({ status }: InfoPanelProps) {
  const style = STATUS_STYLES[status.type];
  const activeFactId = status.type === "none" ? null : status.type;

  return (
    <div className="flex flex-col gap-4 rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">What&apos;s happening</p>
        <div
          className={`mt-3 flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors duration-300 ${style.className}`}
          role="status"
          aria-live="polite"
        >
          <style.icon className="h-5 w-5 shrink-0" strokeWidth={2} />
          <p className="text-sm font-medium leading-snug">{style.message}</p>
        </div>
      </div>

      <ul className="flex flex-col gap-2.5">
        {FACTS.map((fact) => (
          <li
            key={fact.id}
            className={`rounded-xl px-3 py-2 text-sm leading-relaxed transition-colors duration-300 ${
              fact.id === activeFactId
                ? "bg-subject-physics-soft text-ink dark:bg-subject-physics/15 dark:text-bone"
                : "text-ink-soft dark:text-bone-soft"
            }`}
          >
            {fact.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
