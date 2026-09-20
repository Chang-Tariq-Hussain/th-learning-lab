"use client";

import { memo, useState } from "react";
import { cn } from "@/lib/utils";
import { sourceIcon, sourceLabel, type EngineState, type Segment } from "../model";

const WINDOW = 40; // ticks visible at once
const W = 480;
const H = 118;
const LEFT_PAD = 6;
const TRACK_Y = 52;
const TRACK_H = 34;

const KIND_CLASS: Record<Segment["kind"], string> = {
  main: "fill-sky-500/60 stroke-sky-600",
  overhead: "fill-amber-500/70 stroke-amber-600",
  isr: "fill-emerald-500/70 stroke-emerald-600",
};

function describe(seg: Segment): string {
  const end = seg.start + seg.len - 1;
  const range = seg.len === 1 ? `tick ${seg.start}` : `ticks ${seg.start}–${end}`;
  if (seg.kind === "main") return `Main program ran for ${seg.len} tick${seg.len === 1 ? "" : "s"} (${range}).`;
  const who = seg.source ? sourceLabel(seg.source) : "Interrupt";
  if (seg.kind === "overhead")
    return `${who} interrupt overhead (${range}): the CPU saves state, identifies the interrupt, or restores state. This time isn't spent on main-program work.`;
  return `${who} ISR ran for ${seg.len} tick${seg.len === 1 ? "" : "s"} (${range}): the handler talked to the device.`;
}

function TimelineInner({ engine }: { engine: EngineState }) {
  const [inspected, setInspected] = useState<number | null>(null);
  const end = Math.max(engine.tick, WINDOW);
  const startTick = end - WINDOW + 1;
  const px = (W - LEFT_PAD * 2) / WINDOW;
  const x = (tick: number) => LEFT_PAD + (tick - startTick) * px;

  const visible = engine.segments.filter((s) => s.start + s.len - 1 >= startTick);
  const markers = engine.markers.filter((m) => m.tick >= startTick);
  const inspectedSeg = inspected !== null ? engine.segments.find((s) => s.start === inspected) : undefined;

  return (
    <div className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Timeline of the last ${WINDOW} ticks showing main program, interrupt overhead, and ISR execution.`}>
        <text x={LEFT_PAD} y={14} className="fill-ink-soft font-mono text-[12px] dark:fill-bone-soft">
          Time →
        </text>

        {/* Device event markers */}
        {markers.map((m, i) => (
          <g key={`${m.tick}-${m.source}-${i}`}>
            <line x1={x(m.tick) + px / 2} y1={26} x2={x(m.tick) + px / 2} y2={TRACK_Y - 2} strokeWidth="1.5" strokeDasharray="3 2" className="stroke-rose-500" />
            <text x={x(m.tick) + px / 2} y={24} textAnchor="middle" className="text-[13px]" aria-hidden="true">
              {sourceIcon(m.source)}
            </text>
          </g>
        ))}

        <rect x={LEFT_PAD} y={TRACK_Y} width={W - LEFT_PAD * 2} height={TRACK_H} rx={4} className="fill-ink/5 dark:fill-bone/5" />

        {visible.map((seg) => {
          const s0 = Math.max(seg.start, startTick);
          const len = seg.start + seg.len - s0;
          const width = len * px;
          const label = seg.kind === "main" ? "Main" : seg.kind === "isr" && seg.source ? sourceIcon(seg.source) : "";
          const isSel = inspected === seg.start;
          return (
            <g
              key={seg.start}
              role="button"
              tabIndex={0}
              aria-label={describe(seg)}
              className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-subject-it"
              onClick={() => setInspected(isSel ? null : seg.start)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setInspected(isSel ? null : seg.start);
                }
              }}
            >
              <rect x={x(s0)} y={TRACK_Y} width={Math.max(width - 1, 1)} height={TRACK_H} strokeWidth={isSel ? 3 : 1} className={cn(KIND_CLASS[seg.kind], isSel && "stroke-subject-it")} />
              {width >= 30 && label && (
                <text x={x(s0) + width / 2} y={TRACK_Y + TRACK_H / 2 + 5} textAnchor="middle" className="fill-ink font-mono text-[12px] dark:fill-bone">
                  {label}
                </text>
              )}
            </g>
          );
        })}

        {/* Playhead */}
        {engine.tick > 0 && <line x1={x(engine.tick) + px} y1={TRACK_Y - 6} x2={x(engine.tick) + px} y2={TRACK_Y + TRACK_H + 6} strokeWidth="2" className="stroke-ink dark:stroke-bone" />}

        <text x={LEFT_PAD} y={TRACK_Y + TRACK_H + 22} className="fill-ink-soft font-mono text-[11px] dark:fill-bone-soft">
          tick {startTick}
        </text>
        <text x={W - LEFT_PAD} y={TRACK_Y + TRACK_H + 22} textAnchor="end" className="fill-ink-soft font-mono text-[11px] dark:fill-bone-soft">
          tick {end}
        </text>
      </svg>

      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft dark:text-bone-soft">
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded-sm bg-sky-500/60" aria-hidden="true" /> Main program
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded-sm bg-amber-500/70" aria-hidden="true" /> Save / identify / restore
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded-sm bg-emerald-500/70" aria-hidden="true" /> ISR running
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-3 w-0 border-l-2 border-dashed border-rose-500" aria-hidden="true" /> Device event
        </li>
      </ul>

      <p className="min-h-[2.5rem] rounded-card border border-line bg-white/60 px-3 py-2 text-xs leading-relaxed text-ink-soft dark:border-line-dark dark:bg-white/[0.03] dark:text-bone-soft sm:text-sm">
        {inspectedSeg ? describe(inspectedSeg) : "Pause the simulation, then tap any block to inspect the transition."}
      </p>
    </div>
  );
}

export const Timeline = memo(TimelineInner);
