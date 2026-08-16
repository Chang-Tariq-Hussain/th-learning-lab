"use client";

import { Contrast, Type } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
}

interface AccessibilityBarProps {
  settings: AccessibilitySettings;
  onChange: (next: AccessibilitySettings) => void;
}

const buttonClass = (active: boolean) =>
  cn(
    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
    active
      ? "border-pine-500 bg-pine-600 text-paper dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard"
      : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone",
  );

export function AccessibilityBar({
  settings,
  onChange,
}: AccessibilityBarProps) {
  return (
    <div
      role="group"
      aria-label="Accessibility settings"
      className="flex flex-wrap items-center gap-2"
    >
      <button
        type="button"
        aria-pressed={settings.largeText}
        onClick={() =>
          onChange({ ...settings, largeText: !settings.largeText })
        }
        className={buttonClass(settings.largeText)}
      >
        <Type className="h-3.5 w-3.5" strokeWidth={1.75} />
        Large text
      </button>
      <button
        type="button"
        aria-pressed={settings.highContrast}
        onClick={() =>
          onChange({ ...settings, highContrast: !settings.highContrast })
        }
        className={buttonClass(settings.highContrast)}
      >
        <Contrast className="h-3.5 w-3.5" strokeWidth={1.75} />
        High contrast
      </button>
    </div>
  );
}
