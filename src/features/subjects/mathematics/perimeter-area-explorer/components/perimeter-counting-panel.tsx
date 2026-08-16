"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";
import { RectShape } from "./rect-shape";
import { COUNTING_RECTANGLE, pointOnRectBoundary, rectanglePerimeter } from "../perimeter-area-model";

const STEP_MS = 350;

/** Level 2 — Perimeter by Counting. Steps a marker around the boundary one unit at a time, building the count before the formula appears. */
export function PerimeterCountingPanel() {
  const { length, width } = COUNTING_RECTANGLE;
  const perimeter = rectanglePerimeter(length, width);
  const [counted, setCounted] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setCounted((c) => {
        if (c >= perimeter) {
          setRunning(false);
          if (timerRef.current) clearInterval(timerRef.current);
          return c;
        }
        return c + 1;
      });
    }, STEP_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, perimeter]);

  const handleStart = () => {
    setCounted(0);
    setRunning(true);
  };
  const handleReset = () => {
    setRunning(false);
    setCounted(0);
  };

  const marker = pointOnRectBoundary(length, width, counted);
  const done = counted >= perimeter;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <p className="max-w-md text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Count one unit at a time all the way around the boundary.
      </p>

      <div className="relative">
        <RectShape
          length={length}
          width={width}
          showDimensionLabels
          boundaryReveal={counted / perimeter}
          maxPixelWidth={280}
          ariaLabel={`Counting the perimeter of a ${length} by ${width} rectangle`}
        />
        {counted > 0 ? (
          <span
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-amber-500 shadow-sm transition-all duration-300 dark:border-chalkboard"
            style={{ left: `${marker.xPercent}%`, top: `${marker.yPercent}%` }}
          />
        ) : null}
      </div>

      <p className="font-mono text-lg text-ink dark:text-bone">
        {length} + {width} + {length} + {width}
        {done ? (
          <>
            {" "}
            = <span className="text-subject-math">{perimeter} units</span>
          </>
        ) : (
          <span className="text-ink-soft dark:text-bone-soft"> — counted {counted} so far</span>
        )}
      </p>

      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={handleStart} disabled={running}>
          <Play className="h-3.5 w-3.5" strokeWidth={1.75} />
          {counted > 0 ? "Count Again" : "Start Counting"}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
          Reset
        </Button>
      </div>
    </div>
  );
}
