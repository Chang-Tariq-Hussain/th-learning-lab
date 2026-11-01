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
    <>
      <Button
        size="md"
        variant="secondary"
        onClick={onDecrease}
        disabled={!canDecrease}
      >
        <Minus className="h-4 w-4" strokeWidth={2} />
        Slice −
      </Button>
      <Button size="md" onClick={onIncrease} disabled={!canIncrease}>
        <Plus className="h-4 w-4" strokeWidth={2} />
        Slice +
      </Button>
      <Button size="md" variant="ghost" onClick={onReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={2} />
        Reset
      </Button>
    </>
  );
}
