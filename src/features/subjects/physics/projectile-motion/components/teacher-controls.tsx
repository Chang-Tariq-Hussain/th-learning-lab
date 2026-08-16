"use client";

import { Presentation, Snowflake, Sparkles, Wand2 } from "lucide-react";
import { useSimulation } from "@/features/simulation";
import { cn } from "@/lib/utils";

export interface DisplaySettings {
  presentationMode: boolean;
  laserPointer: boolean;
  highlightVectors: boolean;
}

interface TeacherControlsProps {
  settings: DisplaySettings;
  onChange: (next: DisplaySettings) => void;
}

const toggleButtonClass = (active: boolean) =>
  cn(
    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
    active
      ? "border-pine-500 bg-pine-600 text-paper dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard"
      : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone",
  );

/**
 * A thin control surface for classroom use. "Freeze" and "Slow motion"
 * reuse the framework's own playback state (`pause()` / `setSpeed()`)
 * rather than introducing a second, parallel notion of paused/slow —
 * only the presentation-only concerns (hiding controls, a laser-pointer
 * cursor, highlighted vectors) are local to this simulation.
 */
export function TeacherControls({ settings, onChange }: TeacherControlsProps) {
  const { pause, speed, setSpeed, status } = useSimulation();

  const toggle = (key: keyof DisplaySettings) =>
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
        className={toggleButtonClass(settings.presentationMode)}
      >
        <Presentation className="h-3.5 w-3.5" strokeWidth={1.75} />
        Presentation
      </button>

      <button
        type="button"
        onClick={() => toggle("highlightVectors")}
        aria-pressed={settings.highlightVectors}
        className={toggleButtonClass(settings.highlightVectors)}
      >
        <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
        Highlight vectors
      </button>

      <button
        type="button"
        onClick={() => toggle("laserPointer")}
        aria-pressed={settings.laserPointer}
        className={toggleButtonClass(settings.laserPointer)}
      >
        <Wand2 className="h-3.5 w-3.5" strokeWidth={1.75} />
        Laser pointer
      </button>

      <button
        type="button"
        onClick={() => pause()}
        disabled={status !== "playing"}
        className={cn(
          toggleButtonClass(false),
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
        className={toggleButtonClass(speed === 0.25)}
      >
        Slow motion
      </button>
    </div>
  );
}
