"use client";

import { cn } from "@/lib/utils";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";

export type TopicMode = "quick" | "master";

const MODE_OPTIONS: { id: TopicMode; label: string; description: string; emoji: string }[] = [
  { id: "quick", label: "Quick Explore", description: "Short notes + simulation", emoji: "\u26a1" },
  { id: "master", label: "Learn & Master", description: "Full guided lesson", emoji: "\ud83c\udf93" },
];

export interface TopicModeSwitchProps {
  mode: TopicMode;
  onChange: (mode: TopicMode) => void;
  colorToken: string;
  className?: string;
}

/**
 * The Quick Explore / Learn & Master switch shown at the top of any
 * topic that has both experiences. Same rounded-pill visual language
 * as `Gravitation`'s `PanelTabs`, tinted per-subject via
 * `resolveSubjectColors` instead of a hardcoded color. Stacks to a
 * full-width vertical list below `sm` so the two options stay easy
 * tap targets on narrow phones, per the two-experience-mode spec —
 * never two tiny side-by-side buttons.
 */
export function TopicModeSwitch({ mode, onChange, colorToken, className }: TopicModeSwitchProps) {
  const colors = resolveSubjectColors(colorToken);

  return (
    <div
      role="tablist"
      aria-label="Choose how to experience this topic"
      className={cn(
        "flex w-full flex-col gap-1 rounded-2xl border border-line bg-white/70 p-1 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:flex-row sm:rounded-full",
        className,
      )}
    >
      {MODE_OPTIONS.map((option) => {
        const isActive = option.id === mode;
        return (
          <button
            key={option.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-4 py-2.5 text-center transition-colors sm:rounded-full",
              isActive
                ? cn(colors.bar, "text-white shadow-sm")
                : "text-ink-soft hover:bg-ink/[0.04] dark:text-bone-soft dark:hover:bg-bone/[0.06]",
            )}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
              {option.emoji} {option.label}
            </span>
            <span
              className={cn(
                "text-[11px]",
                isActive ? "text-white/85" : "text-ink-soft/80 dark:text-bone-soft/80",
              )}
            >
              {option.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
