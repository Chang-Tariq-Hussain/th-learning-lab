"use client";

import { useState } from "react";
import { RotateCcw, Sparkles, Triangle as TriangleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimulationLayout, SimulationReadouts } from "@/features/simulation";
import { TriangleCanvas } from "./components/triangle-canvas";
import { InfoPanel } from "./components/info-panel";
import { PresetPicker } from "./components/preset-picker";
import { AngleSumDemo } from "./components/angle-sum-demo";
import { PythagoreanPanel } from "./components/pythagorean-panel";
import {
  TRIANGLE_PRESETS,
  angles,
  area,
  formatLength,
  perimeter,
  rightAngleVertex,
  sideLengths,
  type TriangleVertices,
} from "./model";

const DEFAULT_PRESET_KEY = "scalene";

export function TriangleExplorer() {
  const [vertices, setVertices] = useState<TriangleVertices>(TRIANGLE_PRESETS[DEFAULT_PRESET_KEY]!.vertices);
  const [activePreset, setActivePreset] = useState<string | null>(DEFAULT_PRESET_KEY);
  const [showAngleSum, setShowAngleSum] = useState(false);
  const [angleSumPlayKey, setAngleSumPlayKey] = useState(1);
  const [showPythagorean, setShowPythagorean] = useState(false);
  const [pythagoreanPlayKey, setPythagoreanPlayKey] = useState(1);

  const handleVertexChange = (next: TriangleVertices) => {
    setVertices(next);
    setActivePreset(null);
  };

  const handleLoadPreset = (presetKey: string | null, next: TriangleVertices) => {
    setVertices(next);
    setActivePreset(presetKey);
  };

  const handleReset = () => {
    handleLoadPreset(DEFAULT_PRESET_KEY, TRIANGLE_PRESETS[DEFAULT_PRESET_KEY]!.vertices);
    setShowAngleSum(false);
    setShowPythagorean(false);
  };

  const handleToggleAngleSum = () => {
    setShowAngleSum((v) => !v);
    setAngleSumPlayKey((k) => k + 1);
  };

  const handleToggleGoal = () => {
    setShowPythagorean((v) => !v);
    setPythagoreanPlayKey((k) => k + 1);
  };

  const sides = sideLengths(vertices);
  const angleValues = angles(vertices);
  const rightVertex = rightAngleVertex(angleValues);

  return (
    <div className="flex flex-col gap-5 py-4">
      <PresetPicker activePreset={activePreset} onLoad={handleLoadPreset} />

      <SimulationLayout
        stageLabel="Triangle with draggable vertices"
        aspect={1}
        stageCap="26rem"
        stage={<TriangleCanvas vertices={vertices} onChange={handleVertexChange} draggable />}
        readouts={
          <SimulationReadouts
            label="Triangle measurements"
            items={[
              { id: "perimeter", label: "Perimeter", value: formatLength(perimeter(vertices)) },
              { id: "area", label: "Area", value: formatLength(area(vertices)) },
            ]}
          />
        }
        actions={
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="secondary" size="md" onClick={handleToggleAngleSum}>
              <TriangleIcon className="h-4 w-4" strokeWidth={1.75} />
              {showAngleSum ? "Hide" : "Show"} Angle Sum
            </Button>
            <Button variant="secondary" size="md" onClick={handleToggleGoal}>
              <Sparkles className="h-4 w-4" strokeWidth={1.75} />
              {showPythagorean ? "Hide" : "Show"} Pythagorean
            </Button>
            <Button variant="ghost" size="md" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
              Reset
            </Button>
          </div>
        }
        controls={
          <div className="flex min-w-0 flex-col gap-4">
            <p className="text-center text-sm text-ink-soft dark:text-bone-soft">
              Drag any vertex (or use the arrow keys once it&apos;s focused) — the sides, angles, perimeter, and area all update live.
            </p>
            <InfoPanel sides={sides} angleValues={angleValues} perimeter={perimeter(vertices)} area={area(vertices)} />
          </div>
        }
        explanation={
          <div className="flex flex-col gap-4">
            {showAngleSum ? (
              <div className="flex flex-col items-center gap-2">
                <AngleSumDemo angleValues={angleValues} playKey={angleSumPlayKey} />
                <Button variant="ghost" size="md" onClick={() => setAngleSumPlayKey((k) => k + 1)}>
                  Replay
                </Button>
              </div>
            ) : null}
            {showPythagorean ? (
              <div className="flex flex-col items-center gap-2">
                <PythagoreanPanel rightVertex={rightVertex} sides={sides} playKey={pythagoreanPlayKey} />
                {rightVertex ? (
                  <Button variant="ghost" size="md" onClick={() => setPythagoreanPlayKey((k) => k + 1)}>
                    Replay
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        }
      />
    </div>
  );
}
