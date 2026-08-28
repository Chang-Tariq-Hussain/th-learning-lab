import type { ReactNode } from "react";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimulationDensityProvider } from "@/features/simulation";

export interface ExperimentFrameProps {
  /** The instruction line above the embedded simulation, e.g. "Run
   *  the experiment to check your prediction" or "Use the simulation
   *  to work this out". */
  label: string;
  /** Subject-colored text class for the label, from `resolveSubjectColors`. */
  colorTextClassName: string;
  /** The topic's live simulation. */
  children: ReactNode;
  className?: string;
}

/**
 * The "here's a live simulation to work with" frame — previously
 * duplicated, identically, inside both `Prediction` and `Challenge`.
 * Beyond deduplication, this is also where nested-simulation spacing
 * gets fixed once for both call sites: this frame's own padding is
 * intentionally light (rather than matching a full comfortable card),
 * and it wraps `children` in `SimulationDensityProvider density=
 * "compact"` so the simulation's own root wrapper
 * (`SimulationContainer`) trims its padding to match, instead of two
 * full-padding cards stacking on top of each other on mobile — the
 * exact nesting depth described as "Predict/Challenge → nested card →
 * Simulation Container → Simulation". Explore renders the same
 * simulation directly (no frame, "default" density), which is why its
 * large/dedicated presentation is untouched by this.
 */
export function ExperimentFrame({ label, colorTextClassName, children, className }: ExperimentFrameProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-dashed border-line bg-white/40 p-2 dark:border-line-dark dark:bg-white/[0.02] sm:p-4",
        className,
      )}
    >
      <p className={cn("mb-3 flex items-center gap-1.5 px-1 font-mono text-[11px] uppercase tracking-wide", colorTextClassName)}>
        <FlaskConical className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        {label}
      </p>
      <SimulationDensityProvider density="compact">{children}</SimulationDensityProvider>
    </div>
  );
}
