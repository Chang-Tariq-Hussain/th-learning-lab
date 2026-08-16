"use client";

import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { colorForValue } from "../colors";
import { ConfettiBurst } from "./confetti-burst";

const MIN = -20;
const MAX = 20;
const RANGE = MAX - MIN;

function percentFor(value: number): number {
  return ((value - MIN) / RANGE) * 100;
}

function clamp(value: number): number {
  return Math.min(MAX, Math.max(MIN, value));
}

function valueFromClientX(clientX: number, rect: DOMRect): number {
  const ratio = (clientX - rect.left) / rect.width;
  return clamp(Math.round(MIN + ratio * RANGE));
}

export interface NumberLineTrackProps {
  value: number;
  onChange: (value: number) => void;
  celebrating: boolean;
  confettiKey: number;
}

const TICKS = Array.from({ length: RANGE + 1 }, (_, i) => MIN + i);

export function NumberLineTrack({ value, onChange, celebrating, confettiKey }: NumberLineTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const updateFromPointer = useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;
      onChange(valueFromClientX(clientX, rect));
    },
    [onChange]
  );

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    trackRef.current?.setPointerCapture(e.pointerId);
    setDragging(true);
    updateFromPointer(e.clientX);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromPointer(e.clientX);
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    try {
      trackRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // Pointer capture may already have been released — nothing to do.
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    let next = value;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        next = value - 1;
        break;
      case "ArrowRight":
      case "ArrowUp":
        next = value + 1;
        break;
      case "PageDown":
        next = value - 5;
        break;
      case "PageUp":
        next = value + 5;
        break;
      case "Home":
        next = MIN;
        break;
      case "End":
        next = MAX;
        break;
      default:
        return;
    }
    e.preventDefault();
    onChange(clamp(next));
  };

  const color = colorForValue(value);

  return (
    <div className="w-full px-3 pb-8 pt-16 sm:px-8">
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative h-2 w-full touch-none rounded-full bg-gradient-to-r from-[#E0524F]/25 via-[#E8B923]/35 to-[#3D5AFE]/25"
      >
        {TICKS.map((n) => {
          const isMajor = n % 5 === 0;
          return (
            <div
              key={n}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${percentFor(n)}%` }}
            >
              <div className={cn("rounded-full bg-ink/25 dark:bg-bone/30", isMajor ? "h-3.5 w-1" : "h-2 w-px")} />
              <span
                className={cn(
                  "absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap font-mono text-ink-soft dark:text-bone-soft",
                  isMajor ? "text-[11px]" : "hidden text-[10px] opacity-70 md:block"
                )}
              >
                {n}
              </span>
            </div>
          );
        })}

        <motion.div
          className="absolute top-1/2 z-10"
          animate={{ left: `${percentFor(value)}%` }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
        >
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 6, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 font-mono text-sm font-semibold text-white shadow-md"
              style={{ backgroundColor: color }}
            >
              {value > 0 ? `+${value}` : value}
            </motion.div>

            <motion.div
              role="slider"
              tabIndex={0}
              aria-valuemin={MIN}
              aria-valuemax={MAX}
              aria-valuenow={value}
              aria-label="Number line marker"
              onKeyDown={handleKeyDown}
              animate={celebrating ? { scale: [1, 1.35, 1] } : { scale: dragging ? 1.15 : 1 }}
              transition={{ duration: celebrating ? 0.5 : 0.15 }}
              className="h-9 w-9 cursor-grab rounded-full border-4 border-white outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-chalkboard dark:focus-visible:ring-bone dark:focus-visible:ring-offset-chalkboard sm:h-10 sm:w-10"
              style={{ backgroundColor: color, boxShadow: `0 0 0 6px ${color}22, 0 0 26px 6px ${color}66` }}
            />

            <ConfettiBurst triggerKey={confettiKey} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
