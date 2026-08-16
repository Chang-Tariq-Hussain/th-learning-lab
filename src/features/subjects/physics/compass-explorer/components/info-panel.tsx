"use client";

import type { LucideIcon } from "lucide-react";
import { Move, Sparkles } from "lucide-react";
import type { FieldReading } from "../compass-field";

interface StatusStyle {
  icon: LucideIcon;
  message: string;
  className: string;
}

const WEAK_FIELD_THRESHOLD = 0.08;
const STRONG_FIELD_THRESHOLD = 0.55;

function getStatusStyle(field: FieldReading): StatusStyle {
  if (field.strength < WEAK_FIELD_THRESHOLD) {
    return {
      icon: Move,
      message: "Move the magnet closer to see the needle respond.",
      className: "border-line bg-white/60 text-ink-soft dark:border-line-dark dark:bg-white/[0.04] dark:text-bone-soft",
    };
  }
  return {
    icon: Sparkles,
    message: "The needle has aligned with the magnet's field.",
    className:
      "border-pine-100 bg-pine-50 text-pine-700 dark:border-pine-500/30 dark:bg-pine-500/10 dark:text-pine-100",
  };
}

const FACTS: Array<{ id: "tiny-magnet" | "aligns" | "red-south" | "changes"; text: string }> = [
  { id: "tiny-magnet", text: "A compass is a tiny magnet, free to spin." },
  { id: "aligns", text: "Its needle aligns with the local magnetic field lines." },
  { id: "red-south", text: "The red end points toward a nearby magnet's South pole." },
  { id: "changes", text: "Move or rotate the magnet, and the compass changes direction with it." },
];

export interface InfoPanelProps {
  field: FieldReading;
}

/**
 * Combined explanation + live-feedback panel, same pattern as the
 * Magnet Explorer's own info panel: a status banner for what's
 * happening right now, plus a short always-visible fact list with the
 * currently relevant one quietly highlighted.
 */
export function InfoPanel({ field }: InfoPanelProps) {
  const style = getStatusStyle(field);
  const activeFactId =
    field.strength < WEAK_FIELD_THRESHOLD ? null : field.strength > STRONG_FIELD_THRESHOLD ? "red-south" : "aligns";

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
