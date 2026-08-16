"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SliceControlsProps {
  onIncrease: () => void;
  onDecrease: () => void;
  onReset: () => void;
  canIncrease: boolean;
  canDecrease: boolean;
}

export function SliceControls({
  onIncrease,
  onDecrease,
  onReset,
  canIncrease,
  canDecrease,
}: SliceControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        size="lg"
        variant="secondary"
        onClick={onDecrease}
        disabled={!canDecrease}
      >
        <Minus className="h-4 w-4" strokeWidth={2} />
        Slice −
      </Button>
      <Button size="lg" onClick={onIncrease} disabled={!canIncrease}>
        <Plus className="h-4 w-4" strokeWidth={2} />
        Slice +
      </Button>
      <Button size="lg" variant="ghost" onClick={onReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={2} />
        Reset
      </Button>
    </div>
  );
}
