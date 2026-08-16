"use client";

import { Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MAX_OBJECTS, OBJECT_COLORS, type ObjectColor } from "../colors";

export interface ObjectControlsProps {
  blueCount: number;
  redCount: number;
  onAdd: (color: ObjectColor) => void;
  onRemove: (color: ObjectColor) => void;
}

export function ObjectControls({ blueCount, redCount, onAdd, onRemove }: ObjectControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <ColorControl color="blue" count={blueCount} onAdd={() => onAdd("blue")} onRemove={() => onRemove("blue")} />
      <ColorControl color="red" count={redCount} onAdd={() => onAdd("red")} onRemove={() => onRemove("red")} />
    </div>
  );
}

function ColorControl({
  color,
  count,
  onAdd,
  onRemove,
}: {
  color: ObjectColor;
  count: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const { hex, label } = OBJECT_COLORS[color];

  return (
    <div className="rounded-[1.5rem] border border-line bg-white/70 p-5 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: hex }} />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft dark:text-bone-soft">
          {label} circles
        </span>
      </div>

      <motion.p
        key={count}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="mb-4 text-3xl font-semibold text-ink dark:text-bone"
      >
        {count}
      </motion.p>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={onRemove}
          disabled={count === 0}
          aria-label={`Remove a ${label.toLowerCase()} circle`}
        >
          <Minus className="h-4 w-4" strokeWidth={2} />
        </Button>
        <Button
          size="sm"
          onClick={onAdd}
          disabled={count === MAX_OBJECTS}
          className="flex-1"
          aria-label={`Add a ${label.toLowerCase()} circle`}
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add {label}
        </Button>
      </div>

      {count === MAX_OBJECTS && (
        <p className="mt-2 text-xs text-ink-soft/70 dark:text-bone-soft/70">Maximum of {MAX_OBJECTS} reached.</p>
      )}
    </div>
  );
}
