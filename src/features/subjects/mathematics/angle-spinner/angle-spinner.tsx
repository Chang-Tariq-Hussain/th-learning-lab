"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="relative w-full max-w-[320px]">
        <ConfettiBurst triggerKey={confettiKey} />
        <AngleDial angle={angle} onChange={setAngle} onDragEnd={handleDragEnd} />
      </div>

      <InfoCard angle={angle} />

      <Button variant="secondary" onClick={handleReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset
      </Button>
    </div>
  );
}
