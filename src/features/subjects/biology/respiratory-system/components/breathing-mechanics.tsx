import { Fragment } from "react";
import { cn } from "@/lib/utils";
import type { BreathDirection } from "../types";

interface BreathingMechanicsProps {
  direction: BreathDirection;
  running: boolean;
}

interface Row {
  id: string;
  label: string;
  inhale: string;
  exhale: string;
}

const ROWS: Row[] = [
  { id: "diaphragm", label: "Diaphragm", inhale: "Contracts, moves down", exhale: "Relaxes, moves up" },
  { id: "volume", label: "Chest volume", inhale: "Increases", exhale: "Decreases" },
  { id: "pressure", label: "Pressure in lungs", inhale: "Decreases", exhale: "Increases" },
  { id: "airflow", label: "Air", inhale: "Moves in", exhale: "Moves out" },
];

/**
 * The four-step chain the brief calls out as a major objective:
 * diaphragm movement -> chest volume -> pressure -> airflow. Shown as
 * a static reference table (both columns always visible, so the
 * cause-and-effect chain reads as one relationship) with whichever
 * column matches the simulation's current direction highlighted —
 * driven by the same `direction` the lung scene already tracks, so
 * this never becomes a second source of truth.
 */
export function BreathingMechanics({ direction, running }: BreathingMechanicsProps) {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Breathing Mechanics</p>
      <p className="mt-2 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        The lungs never actively pump themselves — the diaphragm does the work, and everything else follows from the
        chest volume it creates.
      </p>

      <div className="mt-3 grid grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-2 text-xs">
        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft" />
        <span
          className={cn(
            "font-mono text-[10px] uppercase tracking-wide",
            running && direction === "in" ? "text-subject-biology" : "text-ink-soft dark:text-bone-soft"
          )}
        >
          Inhale
        </span>
        <span
          className={cn(
            "font-mono text-[10px] uppercase tracking-wide",
            running && direction === "out" ? "text-subject-biology" : "text-ink-soft dark:text-bone-soft"
          )}
        >
          Exhale
        </span>

        {ROWS.map((row) => (
          <Fragment key={row.id}>
            <span className="font-medium text-ink dark:text-bone">
              {row.label}
            </span>
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5",
                running && direction === "in"
                  ? "bg-subject-biology/10 font-medium text-subject-biology"
                  : "text-ink-soft dark:text-bone-soft"
              )}
            >
              {row.inhale}
            </span>
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5",
                running && direction === "out"
                  ? "bg-subject-biology/10 font-medium text-subject-biology"
                  : "text-ink-soft dark:text-bone-soft"
              )}
            >
              {row.exhale}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
