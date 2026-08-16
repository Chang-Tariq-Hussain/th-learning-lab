"use client";

import { forwardRef, useRef, useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DragDropQuestion } from "../types";

export interface DragDropQuestionViewProps {
  question: DragDropQuestion;
  locked: boolean;
  onSubmit: (correct: boolean) => void;
}

interface Tile {
  id: number;
  value: number;
}

export function DragDropQuestionView({ question, locked, onSubmit }: DragDropQuestionViewProps) {
  const tiles: Tile[] = question.tiles.map((value, id) => ({ id, value }));
  const [placedA, setPlacedA] = useState<Tile | null>(null);
  const [placedB, setPlacedB] = useState<Tile | null>(null);
  const slotARef = useRef<HTMLDivElement>(null);
  const slotBRef = useRef<HTMLDivElement>(null);
  const submittedRef = useRef(false);

  const availableTiles = tiles.filter((t) => t.id !== placedA?.id && t.id !== placedB?.id);

  const maybeSubmit = (a: Tile | null, b: Tile | null) => {
    if (!a || !b || submittedRef.current) return;
    submittedRef.current = true;
    onSubmit(a.value === question.answerA && b.value === question.answerB);
  };

  const placeInFirstEmpty = (tile: Tile) => {
    if (locked) return;
    if (!placedA) {
      setPlacedA(tile);
      maybeSubmit(tile, placedB);
    } else if (!placedB) {
      setPlacedB(tile);
      maybeSubmit(placedA, tile);
    }
  };

  const isOver = (ref: React.RefObject<HTMLDivElement>, point: { x: number; y: number }) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return false;
    return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
  };

  const handleDragEnd = (tile: Tile, info: PanInfo) => {
    if (locked) return;
    if (!placedA && isOver(slotARef, info.point)) {
      setPlacedA(tile);
      maybeSubmit(tile, placedB);
      return;
    }
    if (!placedB && isOver(slotBRef, info.point)) {
      setPlacedB(tile);
      maybeSubmit(placedA, tile);
    }
  };

  const clearSlot = (which: "A" | "B") => {
    if (locked) return;
    if (which === "A") setPlacedA(null);
    else setPlacedB(null);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-3">
        <Slot
          ref={slotARef}
          tile={placedA}
          correct={locked && placedA?.value === question.answerA}
          wrong={locked && placedA?.value !== question.answerA}
          locked={locked}
          label="First term"
          onClear={() => clearSlot("A")}
        />
        <span className="font-display text-3xl font-medium text-ink-soft dark:text-bone-soft">:</span>
        <Slot
          ref={slotBRef}
          tile={placedB}
          correct={locked && placedB?.value === question.answerB}
          wrong={locked && placedB?.value !== question.answerB}
          locked={locked}
          label="Second term"
          onClear={() => clearSlot("B")}
        />
      </div>

      <div className="flex min-h-[3.5rem] flex-wrap items-center justify-center gap-3">
        {availableTiles.map((tile) => (
          <motion.button
            type="button"
            key={tile.id}
            drag={!locked}
            dragSnapToOrigin
            dragElastic={0.15}
            dragMomentum={false}
            whileDrag={{ scale: 1.08, zIndex: 40 }}
            onDragEnd={(_, info) => handleDragEnd(tile, info)}
            onTap={() => placeInFirstEmpty(tile)}
            disabled={locked}
            aria-label={`Number tile ${tile.value}`}
            className={cn(
              "flex h-14 w-16 shrink-0 cursor-grab touch-none items-center justify-center rounded-xl border-2 border-subject-math/40 bg-subject-math-soft font-display text-2xl font-medium tabular-nums text-subject-math shadow-sm active:cursor-grabbing dark:border-subject-math/30 dark:bg-subject-math/15",
              locked && "pointer-events-none opacity-40",
            )}
          >
            {tile.value}
          </motion.button>
        ))}
      </div>

      {!locked && (
        <p className="text-center text-xs text-ink-soft/70 dark:text-bone-soft/60">
          Drag a tile into a blank, or tap a tile to place it in the next open blank.
        </p>
      )}
    </div>
  );
}

const Slot = forwardRef<
  HTMLDivElement,
  {
    tile: Tile | null;
    correct: boolean;
    wrong: boolean;
    locked: boolean;
    label: string;
    onClear: () => void;
  }
>(function Slot({ tile, correct, wrong, locked, label, onClear }, ref) {
  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      className={cn(
        "relative flex h-14 w-16 items-center justify-center rounded-xl border-2 border-dashed font-display text-3xl font-medium tabular-nums transition-colors",
        correct
          ? "border-solid border-subject-chemistry bg-subject-chemistry-soft text-subject-chemistry dark:bg-subject-chemistry/15"
          : wrong
            ? "border-solid border-subject-physics bg-subject-physics-soft text-subject-physics dark:bg-subject-physics/15"
            : tile
              ? "border-solid border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
              : "border-ink/20 text-ink-soft/40 dark:border-bone/25 dark:text-bone-soft/30",
      )}
    >
      {tile ? tile.value : "?"}
      {tile && !locked && (
        <button
          type="button"
          onClick={onClear}
          aria-label={`Remove tile from ${label}`}
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-ink/15 bg-paper text-ink-soft hover:text-ink dark:border-bone/20 dark:bg-chalkboard dark:text-bone-soft"
        >
          <X className="h-3 w-3" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
});
