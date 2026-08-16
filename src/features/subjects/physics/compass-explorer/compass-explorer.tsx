"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAYGROUND_HEIGHT, PLAYGROUND_WIDTH, type MagnetState } from "@/features/subjects/physics/magnet-explorer";
import { ExperimentCards } from "./components/experiment-cards";
import { InfoPanel } from "./components/info-panel";
import { InstructionsPanel } from "./components/instructions-panel";
import { Playground, type DraggableId } from "./components/playground";
import { getFieldAt } from "./compass-field";
import { COMPASS_START, type CompassState } from "./compass-model";
import type { Experiment } from "./experiments";

const MAGNET_START: MagnetState = {
  id: "a",
  x: PLAYGROUND_WIDTH * 0.32,
  y: PLAYGROUND_HEIGHT * 0.42,
  rotation: 0,
};

export function CompassExplorer() {
  const [magnet, setMagnet] = useState<MagnetState>({ ...MAGNET_START });
  const [compass, setCompass] = useState<CompassState>({ ...COMPASS_START });
  const [draggingId, setDraggingId] = useState<DraggableId | null>(null);

  const field = useMemo(() => getFieldAt(magnet, { x: compass.x, y: compass.y }), [magnet, compass]);

  const handleReset = () => {
    setDraggingId(null);
    setMagnet({ ...MAGNET_START });
    setCompass({ ...COMPASS_START });
  };

  const handleExperiment = (experiment: Experiment) => {
    setDraggingId(null);
    const preset = experiment.apply();
    setMagnet(preset.magnet);
    setCompass(preset.compass);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[18rem_1fr]">
        <InstructionsPanel />

        <div className="h-[420px] sm:h-[460px]">
          <Playground
            magnet={magnet}
            compass={compass}
            draggingId={draggingId}
            onMagnetMove={(x, y) => setMagnet((prev) => ({ ...prev, x, y }))}
            onMagnetRotate={(rotation) => setMagnet((prev) => ({ ...prev, rotation }))}
            onCompassMove={(x, y) => setCompass((prev) => ({ ...prev, x, y }))}
            onDragStart={setDraggingId}
            onDragEnd={() => setDraggingId(null)}
          />
        </div>
      </div>

      <div className="w-full">
        <InfoPanel field={field} />
      </div>

      <ExperimentCards onRun={handleExperiment} />

      <Button variant="secondary" size="lg" onClick={handleReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset
      </Button>
    </div>
  );
}
