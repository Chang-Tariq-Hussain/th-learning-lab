"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimulationLayout } from "@/features/simulation";
import { AngleDial } from "./components/angle-dial";
import { InfoCard } from "./components/info-card";
import { ConfettiBurst } from "./components/confetti-burst";
import { isMilestone, snapToMilestone } from "./angle-model";

export function AngleSpinner() {
  const [angle, setAngle] = useState(45);
  const [confettiKey, setConfettiKey] = useState(0);

  const handleDragEnd = () => {
    setAngle((current) => {
      const snapped = snapToMilestone(current);
      if (isMilestone(snapped)) setConfettiKey((k) => k + 1);
      return snapped;
    });
  };

  const handleReset = () => setAngle(45);

  return (
    <div className="py-4">
      <SimulationLayout
        stageLabel="Angle spinner"
        aspect={1}
        stageCap="22rem"
        stage={
          <div className="relative h-full w-full">
            <ConfettiBurst triggerKey={confettiKey} />
            <AngleDial angle={angle} onChange={setAngle} onDragEnd={handleDragEnd} />
          </div>
        }
        readouts={<InfoCard angle={angle} />}
        actions={
          <Button variant="secondary" size="md" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
            Reset
          </Button>
        }
      />
    </div>
  );
}
