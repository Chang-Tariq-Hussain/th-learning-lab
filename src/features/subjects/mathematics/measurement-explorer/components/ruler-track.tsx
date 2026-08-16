"use client";

import { useCallback, useRef, useState, type PointerEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatLength } from "../measurement-model";

export interface RulerTrackProps {
  /** Total length of the ruler shown, in cm. */
  maxCm: number;
  /** The object's own length in cm — fixed, only its position moves. */
  objectLengthCm: number;
  /** Where the object's left edge starts, in cm. */
  initialStartCm?: number;
  /** Whether the object can be dragged along the ruler. */
  draggable?: boolean;
  /** Short label shown on the object bar, e.g. "Pencil". */
  objectLabel?: string;
  /** Show the "Length = End − Start" breakdown rather than just the final length. */
  showCalculation?: boolean;
  /** Called whenever the measured start/end/length changes (including on mount). */
  onMeasure?: (start: number, end: number, length: number) => void;
}

/**
 * The shared ruler + draggable-object measurement widget used across
 * Levels 2, 3, 4, and the Measurement Lab. A realistic ruler (major cm
 * ticks, minor mm ticks) with a colored object bar the student can
 * drag into place — dragging follows the same pointer-capture pattern
 * as the Number Line simulation's marker.
 */
export function RulerTrack({
  maxCm,
  objectLengthCm,
  initialStartCm = 0,
  draggable = true,
  objectLabel,
  showCalculation = false,
  onMeasure,
}: RulerTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ pointerId: number; startClientX: number; startCm: number } | null>(null);
  const [objectStartCm, setObjectStartCm] = useState(
    Math.min(Math.max(initialStartCm, 0), Math.max(0, maxCm - objectLengthCm)),
  );
  const [dragging, setDragging] = useState(false);

  const clampStart = useCallback(
    (cm: number) => Math.min(Math.max(cm, 0), Math.max(0, maxCm - objectLengthCm)),
    [maxCm, objectLengthCm],
  );

  const snap = (cm: number) => Math.round(cm * 10) / 10;

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggable) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { pointerId: e.pointerId, startClientX: e.clientX, startCm: objectStartCm };
    setDragging(true);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging || !dragState.current) return;
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const deltaCm = ((e.clientX - dragState.current.startClientX) / rect.width) * maxCm;
    const next = snap(clampStart(dragState.current.startCm + deltaCm));
    setObjectStartCm(next);
    onMeasure?.(next, next + objectLengthCm, objectLengthCm);
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    dragState.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Pointer capture may already have been released — nothing to do.
    }
  };

  const percentFor = (cm: number) => (cm / maxCm) * 100;
  const minorStep = maxCm <= 15 ? 0.1 : 0.5;
  const minorTicks: number[] = [];
  for (let t = 0; t <= maxCm + 1e-6; t += minorStep) minorTicks.push(Math.round(t * 10) / 10);

  const start = objectStartCm;
  const end = objectStartCm + objectLengthCm;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="w-full px-4 pt-14 sm:px-8">
        {/* Object bar, dragged along the ruler above the tick baseline. */}
        <div className="relative h-9">
          <motion.div
            className={cn(
              "absolute top-0 flex h-9 touch-none items-center justify-center rounded-md border-2 border-white bg-subject-math/80 font-mono text-[11px] font-semibold text-white shadow-sm dark:border-chalkboard",
              draggable && "cursor-grab active:cursor-grabbing",
            )}
            style={{ width: `${percentFor(objectLengthCm)}%` }}
            animate={{ left: `${percentFor(start)}%`, scale: dragging ? 1.03 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {objectLabel ?? `${formatLength(objectLengthCm)} cm`}
          </motion.div>
        </div>

        {/* Ruler baseline with cm/mm ticks. */}
        <div ref={trackRef} className="relative mt-2 h-1.5 w-full rounded-full bg-ink/10 dark:bg-bone/15">
          {minorTicks.map((t) => {
            const isMajor = Math.abs(t - Math.round(t)) < 1e-6;
            return (
              <div key={t} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${percentFor(t)}%` }}>
                <div className={cn("bg-ink/25 dark:bg-bone/30", isMajor ? "h-3.5 w-px" : "h-2 w-px")} />
                {isMajor ? (
                  <span className="absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-ink-soft dark:text-bone-soft">
                    {Math.round(t)}
                  </span>
                ) : null}
              </div>
            );
          })}

          {/* Start/end endpoint flags. */}
          <motion.div
            className="absolute top-0 z-20 -translate-x-1/2 -translate-y-full"
            animate={{ left: `${percentFor(start)}%` }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          >
            <span className="whitespace-nowrap rounded-full bg-[#2E9E6C] px-2 py-0.5 font-mono text-[10px] font-semibold text-white shadow-sm">
              Start = {formatLength(start)} cm
            </span>
          </motion.div>
          <motion.div
            className="absolute top-0 z-20 -translate-x-1/2 -translate-y-full"
            animate={{ left: `${percentFor(end)}%` }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          >
            <span className="whitespace-nowrap rounded-full bg-[#E0524F] px-2 py-0.5 font-mono text-[10px] font-semibold text-white shadow-sm">
              End = {formatLength(end)} cm
            </span>
          </motion.div>
        </div>
      </div>

      <p className="text-center font-mono text-sm text-ink dark:text-bone">
        {showCalculation
          ? `Length = End − Start = ${formatLength(end)} − ${formatLength(start)} = ${formatLength(objectLengthCm)} cm`
          : `Length = ${formatLength(objectLengthCm)} cm`}
      </p>
    </div>
  );
}
