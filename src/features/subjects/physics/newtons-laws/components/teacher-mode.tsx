"use client";

import { useSimulation, useSimulationSurface } from "@/features/simulation";
import { cn } from "@/lib/utils";
import {
  Maximize,
  Minimize,
  Presentation,
  Sigma,
  Snowflake,
  Sparkles,
} from "lucide-react";

export interface TeacherSettings {
  presentationMode: boolean;
  highlightVectors: boolean;
  formulasOnly: boolean;
}

export interface TeacherControlsProps {
  settings: TeacherSettings;
  onChange: (next: TeacherSettings) => void;
}

const toggleClass = (active: boolean) =>
  cn(
    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
    active
      ? "border-pine-500 bg-pine-600 text-paper dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard"
      : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone",
  );

/**
 * Presentation controls for classroom use. "Freeze" and "Slow motion"
 * drive the framework's own `pause()` / `setSpeed()`; "Fullscreen" drives
 * `useSimulationSurface()`'s own toggle (the same one `FullscreenButton`
 * in the Toolbar uses) — nothing here reimplements playback or
 * fullscreen state, only the presentation-only concerns (hiding chrome,
 * bolder vectors, formulas-only view) are local.
 */
export function TeacherControls({ settings, onChange }: TeacherControlsProps) {
  const { pause, speed, setSpeed, status } = useSimulation();
  const { isFullscreen, toggleFullscreen } = useSimulationSurface();

  const toggle = (key: keyof TeacherSettings) =>
    onChange({ ...settings, [key]: !settings[key] });

  return (
    <div
      role="group"
      aria-label="Teacher mode"
      className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-white/50 px-2 py-1.5 dark:border-line-dark dark:bg-white/[0.03] sm:rounded-full"
    >
      <button
        type="button"
        onClick={() => toggle("presentationMode")}
        aria-pressed={settings.presentationMode}
        className={toggleClass(settings.presentationMode)}
      >
        <Presentation className="h-3.5 w-3.5" strokeWidth={1.75} />
        Presentation
      </button>

      <button
        type="button"
        onClick={() => toggle("highlightVectors")}
        aria-pressed={settings.highlightVectors}
        className={toggleClass(settings.highlightVectors)}
      >
        <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
        Highlight vectors
      </button>

      <button
        type="button"
        onClick={() => toggle("formulasOnly")}
        aria-pressed={settings.formulasOnly}
        className={toggleClass(settings.formulasOnly)}
      >
        <Sigma className="h-3.5 w-3.5" strokeWidth={1.75} />
        Formulas only
      </button>

      <button
        type="button"
        onClick={() => pause()}
        disabled={status !== "playing"}
        className={cn(
          toggleClass(false),
          "disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        <Snowflake className="h-3.5 w-3.5" strokeWidth={1.75} />
        Freeze
      </button>

      <button
        type="button"
        onClick={() => setSpeed(speed === 0.25 ? 1 : 0.25)}
        aria-pressed={speed === 0.25}
        className={toggleClass(speed === 0.25)}
      >
        Slow motion
      </button>

      <button
        type="button"
        onClick={toggleFullscreen}
        aria-pressed={isFullscreen}
        className={toggleClass(isFullscreen)}
      >
        {isFullscreen ? (
          <Minimize className="h-3.5 w-3.5" strokeWidth={1.75} />
        ) : (
          <Maximize className="h-3.5 w-3.5" strokeWidth={1.75} />
        )}
        Fullscreen
      </button>
    </div>
  );
}
