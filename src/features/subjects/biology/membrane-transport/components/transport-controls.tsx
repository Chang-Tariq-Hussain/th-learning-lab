"use client";

import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Mode, Phase } from "../types";

export interface TransportControlsProps {
  mode: Mode;
  phase: Phase;
  onStart: () => void;
  onReset: () => void;
}

const START_LABEL: Record<Mode, string> = {
  diffusion: "Start Diffusion",
  osmosis: "Start Osmosis",
  "active-transport": "Start Pump",
};

/** Exactly the controls the spec calls for — one Start button (label matches the active mode) and Reset. No extra panel. */
export function TransportControls({ mode, phase, onStart, onReset }: TransportControlsProps) {
  const startLabel = START_LABEL[mode];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="primary" size="lg" onClick={onStart} disabled={phase !== "idle"}>
        <Play className="h-4 w-4" strokeWidth={1.75} />
        {startLabel}
      </Button>
      <Button variant="ghost" size="lg" onClick={onReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset
      </Button>
    </div>
  );
}
