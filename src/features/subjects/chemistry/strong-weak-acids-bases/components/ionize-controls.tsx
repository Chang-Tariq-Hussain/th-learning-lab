"use client";

import { RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IonizeControlsProps {
  ionized: boolean;
  onIonize: () => void;
  onReset: () => void;
}

export function IonizeControls({ ionized, onIonize, onReset }: IonizeControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="primary" size="md" onClick={onIonize} disabled={ionized}>
        <Zap className="h-4 w-4" strokeWidth={1.75} />
        Ionize
      </Button>
      <Button variant="ghost" size="md" onClick={onReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset
      </Button>
    </div>
  );
}
