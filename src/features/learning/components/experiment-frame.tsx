import type { ReactNode } from "react";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

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
 * The "here's a live simulation to work with" frame used by both
 * `Prediction` and `Challenge` — previously duplicated markup in
 * both. Deliberately *not* a bordered/padded card of its own: it's a
 * plain block (just the label, then the simulation) so the
 * simulation gets exactly the same full width, bounded only by
 * whatever contains this frame, as it gets in Explore. `Prediction`
 * and `Challenge` render this as a sibling of their own scenario
 * card rather than a child inside it — see those components — so the
 * simulation is never actually nested inside another card's padding.
 */
export function ExperimentFrame({ label, colorTextClassName, children, className }: ExperimentFrameProps) {
  return (
    <div className={cn(className)}>
      <p className={cn("mb-3 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide", colorTextClassName)}>
        <FlaskConical className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        {label}
      </p>
      {children}
    </div>
  );
}
