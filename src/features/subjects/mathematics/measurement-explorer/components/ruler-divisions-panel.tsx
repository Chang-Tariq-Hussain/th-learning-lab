"use client";

import { useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HIGHLIGHT_START_CM = 3;
const HIGHLIGHT_END_CM = 4;

function WholeRulerView() {
  const maxCm = 10;
  const percentFor = (cm: number) => (cm / maxCm) * 100;
  const ticks = Array.from({ length: maxCm + 1 }, (_, i) => i);

  return (
    <div className="w-full px-4 pt-6 sm:px-8">
      <div className="relative h-1.5 w-full rounded-full bg-ink/10 dark:bg-bone/15">
        <div
          className="absolute -top-2 bottom-[-0.5rem] rounded-md bg-subject-math/20"
          style={{ left: `${percentFor(HIGHLIGHT_START_CM)}%`, width: `${percentFor(HIGHLIGHT_END_CM) - percentFor(HIGHLIGHT_START_CM)}%` }}
        />
        {ticks.map((t) => (
          <div key={t} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${percentFor(t)}%` }}>
            <div className="h-3.5 w-px bg-ink/25 dark:bg-bone/30" />
            <span className="absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-ink-soft dark:text-bone-soft">
              {t}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-ink-soft dark:text-bone-soft">
        The highlighted centimeter is one whole unit — zoom in to see what&apos;s inside it.
      </p>
    </div>
  );
}

function ZoomedMillimeterView() {
  const ticks = Array.from({ length: 11 }, (_, i) => i);
  const percentFor = (mm: number) => (mm / 10) * 100;

  return (
    <div className="w-full px-4 pt-6 sm:px-8">
      <div className="relative h-1.5 w-full rounded-full bg-subject-math/20">
        {ticks.map((mm) => (
          <div key={mm} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${percentFor(mm)}%` }}>
            <div className={cn("bg-ink/25 dark:bg-bone/30", mm === 0 || mm === 10 ? "h-4 w-px" : "h-3 w-px")} />
            <span className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-ink-soft dark:text-bone-soft">
              {mm === 0 ? "0 cm" : mm === 10 ? "1 cm" : `${mm} mm`}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-ink-soft dark:text-bone-soft">
        One centimeter is divided into 10 equal millimeters — the small ticks between the numbers.
      </p>
    </div>
  );
}

/** Level 5 — Ruler Divisions. Zoom into a single centimeter to see the 10 millimeter subdivisions inside it. */
export function RulerDivisionsPanel() {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4">
      {zoomed ? <ZoomedMillimeterView /> : <WholeRulerView />}

      <p className="font-mono text-sm font-semibold text-subject-math">1 cm = 10 mm</p>

      <Button variant="primary" size="sm" onClick={() => setZoomed((z) => !z)}>
        {zoomed ? <ZoomOut className="h-3.5 w-3.5" strokeWidth={1.75} /> : <ZoomIn className="h-3.5 w-3.5" strokeWidth={1.75} />}
        {zoomed ? "Zoom Out" : "Zoom Into 1 cm"}
      </Button>
    </div>
  );
}
