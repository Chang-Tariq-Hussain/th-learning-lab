import { Lightbulb } from "lucide-react";
import type { Mode, Phase } from "../types";

function messageFor(mode: Mode, phase: Phase): string {
  if (mode === "diffusion") {
    if (phase === "idle") return "Particles move from higher concentration toward lower concentration.";
    if (phase === "running") return "Particles are moving...";
    return "More evenly distributed.";
  }
  if (phase === "idle") return "Water moves across a selectively permeable membrane, toward the side with more solute.";
  if (phase === "running") return "Water is moving...";
  return "Osmosis — water has moved across the membrane.";
}

function explanationFor(mode: Mode): string {
  return mode === "diffusion"
    ? "Diffusion is the movement of particles from an area of higher concentration to an area of lower concentration — no pump required, just crowding evening itself out."
    : "Osmosis is the movement of water across a selectively permeable membrane, from an area of low solute concentration toward an area of high solute concentration.";
}

export interface StatusMessageProps {
  mode: Mode;
  phase: Phase;
}

export function StatusMessage({ mode, phase }: StatusMessageProps) {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <p
        aria-live="polite"
        className="text-center text-base font-medium text-ink dark:text-bone"
      >
        {messageFor(mode, phase)}
      </p>
      <div className="flex items-start gap-2 rounded-2xl bg-subject-biology-soft px-4 py-3 text-sm leading-relaxed text-subject-biology dark:bg-subject-biology/15">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
        <span>{explanationFor(mode)}</span>
      </div>
    </div>
  );
}
