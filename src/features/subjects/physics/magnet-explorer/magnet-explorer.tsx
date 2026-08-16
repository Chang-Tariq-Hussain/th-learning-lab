"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExperimentCards } from "./components/experiment-cards";
import { InfoPanel } from "./components/info-panel";
import { InstructionsPanel } from "./components/instructions-panel";
import { Playground } from "./components/playground";
import type { Experiment } from "./experiments";
import { START_STATE, type MagnetId, type MagnetState } from "./magnet-model";
import { getInteractionStatus, useMagnetSettling } from "./magnet-physics";

function cloneStartState(): Record<MagnetId, MagnetState> {
  return { a: { ...START_STATE.a }, b: { ...START_STATE.b } };
}

export function MagnetExplorer() {
  const [magnets, setMagnets] = useState<Record<MagnetId, MagnetState>>(cloneStartState);
  const [draggingId, setDraggingId] = useState<MagnetId | null>(null);

  useMagnetSettling(magnets, draggingId, setMagnets);

  const status = useMemo(() => getInteractionStatus(magnets.a, magnets.b), [magnets]);

  const handleDragMove = (id: MagnetId, x: number, y: number) => {
    setMagnets((prev) => ({ ...prev, [id]: { ...prev[id], x, y } }));
  };

  const handleRotate = (id: MagnetId, rotation: number) => {
    setMagnets((prev) => ({ ...prev, [id]: { ...prev[id], rotation } }));
  };

  const handleReset = () => {
    setDraggingId(null);
    setMagnets(cloneStartState());
  };

  const handleExperiment = (experiment: Experiment) => {
    setDraggingId(null);
    setMagnets(experiment.apply());
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[18rem_1fr]">
        <InstructionsPanel />

        <div className="h-[420px] sm:h-[460px]">
          <Playground
            magnets={magnets}
            draggingId={draggingId}
            status={status}
            onDragMove={handleDragMove}
            onRotate={handleRotate}
            onDragStart={setDraggingId}
            onDragEnd={() => setDraggingId(null)}
          />
        </div>
      </div>

      <div className="w-full">
        <InfoPanel status={status} />
      </div>

      <ExperimentCards onRun={handleExperiment} />

      <Button variant="secondary" size="lg" onClick={handleReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset
      </Button>
    </div>
  );
}
