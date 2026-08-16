"use client";

import type { LucideIcon } from "lucide-react";
import { Compass as CompassIcon, Magnet as MagnetIcon, MoveRight, RotateCw } from "lucide-react";
import type { Experiment, ExperimentId } from "../experiments";
import { EXPERIMENTS } from "../experiments";

const ICONS: Record<ExperimentId, LucideIcon> = {
  "bring-close": MoveRight,
  "rotate-magnet": RotateCw,
  "near-north": MagnetIcon,
  "near-south": CompassIcon,
};

export interface ExperimentCardsProps {
  onRun: (experiment: Experiment) => void;
}

/**
 * Four one-tap presets that jump the magnet and compass into a useful
 * starting arrangement. Mirrors the Magnet Explorer's own experiment
 * cards: this component only ever decides *where to start* — the field
 * calculation and needle animation react on their own from there.
 */
export function ExperimentCards({ onRun }: ExperimentCardsProps) {
  return (
    <div className="w-full">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">Quick experiments</p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {EXPERIMENTS.map((experiment) => {
          const Icon = ICONS[experiment.id];
          return (
            <button
              key={experiment.id}
              type="button"
              onClick={() => onRun(experiment)}
              className="flex flex-col items-start gap-2 rounded-2xl border border-line bg-white/70 p-4 text-left shadow-card transition-colors duration-200 hover:border-subject-physics/40 hover:bg-subject-physics-soft dark:border-line-dark dark:bg-white/[0.04] dark:hover:bg-subject-physics/10"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-subject-physics-soft text-subject-physics dark:bg-subject-physics/15">
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="text-sm font-medium text-ink dark:text-bone">{experiment.title}</span>
              <span className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{experiment.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
