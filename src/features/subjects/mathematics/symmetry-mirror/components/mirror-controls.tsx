"use client";

import { RotateCcw, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MirrorControlsProps {
  onUndo: () => void;
  onReset: () => void;
  canUndo: boolean;
}

export function MirrorControls({ onUndo, onReset, canUndo }: MirrorControlsProps) {
  return (
    <div className="flex gap-3">
      <Button variant="secondary" onClick={onUndo} disabled={!canUndo}>
        <Undo2 className="h-4 w-4" strokeWidth={1.75} />
        Undo
      </Button>
      <Button variant="secondary" onClick={onReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset
      </Button>
    </div>
  );
}
