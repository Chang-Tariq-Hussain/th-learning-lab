"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import {
  ACTIVITY_LABEL,
  DEVICES,
  SIGNAL_LEGS,
  controllerView,
  type DeviceId,
  type EngineState,
} from "../model";

/**
 * The central architecture: CPU on top, a System Bus spine down the
 * middle, and a device controller + device on each side per row. Kept
 * conceptual — not any real motherboard or chipset.
 */

const ROWS = [170, 250, 330];
const LEFT: DeviceId[] = ["keyboard", "mouse", "timer"];
const RIGHT: DeviceId[] = ["storage", "network", "printer"];
const SPINE_X = 220;
const CPU_PIN = { x: SPINE_X, y: 108 };

interface Slot {
  device: DeviceId;
  cy: number;
  side: "left" | "right";
}

const SLOTS: Slot[] = [
  ...LEFT.map((device, i): Slot => ({ device, cy: ROWS[i] as number, side: "left" })),
  ...RIGHT.map((device, i): Slot => ({ device, cy: ROWS[i] as number, side: "right" })),
];

function geometry(slot: Slot) {
  const left = slot.side === "left";
  const deviceBox = { x: left ? 6 : 330, w: 104 };
  const ctrlBox = { x: left ? 126 : 240, w: 74 };
  return {
    deviceBox,
    ctrlBox,
    deviceCenter: { x: deviceBox.x + deviceBox.w / 2, y: slot.cy },
    ctrlCenter: { x: ctrlBox.x + ctrlBox.w / 2, y: slot.cy },
    junction: { x: SPINE_X, y: slot.cy },
  };
}

function signalPosition(slot: Slot, leg: number) {
  const g = geometry(slot);
  if (leg <= 0) return g.deviceCenter;
  if (leg === 1) return g.ctrlCenter;
  if (leg === 2) return g.junction;
  return CPU_PIN;
}

const STATUS_DOT: Record<string, string> = {
  idle: "fill-ink/25 dark:fill-bone/30",
  "data-ready": "fill-amber-500",
  servicing: "fill-emerald-500",
};

function SystemDiagramInner({
  engine,
  tickMs,
  selected,
  onSelect,
}: {
  engine: EngineState;
  tickMs: number;
  selected: DeviceId;
  onSelect: (d: DeviceId) => void;
}) {
  const activeSource = engine.active?.event.source;
  const servicing = engine.active?.phase === "run" || engine.activity === "isr";
  const cpuStroke =
    engine.activity === "isr"
      ? "stroke-emerald-500"
      : engine.activity === "saving" || engine.activity === "identifying" || engine.activity === "restoring"
        ? "stroke-amber-500"
        : "stroke-subject-it";
  const irqLit = engine.pending.length > 0 || engine.inFlight.some((f) => f.leg >= SIGNAL_LEGS - 1);
  const summary = `CPU is ${ACTIVITY_LABEL[engine.activity].toLowerCase()}. ${engine.pending.length} interrupt${engine.pending.length === 1 ? "" : "s"} pending.`;

  return (
    <svg viewBox="0 0 440 372" className="h-auto w-full" role="img" aria-label={`I/O architecture diagram. ${summary}`}>
      <title>{`CPU connected by the system bus to six device controllers and devices. ${summary}`}</title>

      {/* System bus spine */}
      <line x1={SPINE_X} y1={CPU_PIN.y} x2={SPINE_X} y2={352} strokeWidth="5" strokeLinecap="round" className="stroke-ink/25 dark:stroke-bone/30" />
      <text x={SPINE_X + 8} y={132} className="fill-ink-soft font-mono text-[11px] dark:fill-bone-soft">
        SYSTEM BUS
      </text>

      {/* CPU */}
      <rect x={120} y={8} width={200} height={100} rx={12} strokeWidth="2.5" className={cn("fill-white dark:fill-white/5", cpuStroke)} />
      <text x={220} y={30} textAnchor="middle" className="fill-ink font-display text-[16px] font-medium dark:fill-bone">
        CPU
      </text>
      <text x={220} y={50} textAnchor="middle" className="fill-ink-soft font-mono text-[11px] dark:fill-bone-soft">
        Registers · Control Unit
      </text>
      <text x={220} y={72} textAnchor="middle" className="fill-ink font-mono text-[12px] dark:fill-bone">
        {ACTIVITY_LABEL[engine.activity]}
      </text>
      <text x={220} y={92} textAnchor="middle" className="fill-ink-soft font-mono text-[11px] dark:fill-bone-soft">
        PC = {engine.cpu.pc}
      </text>
      {/* Interrupt pin */}
      <circle cx={CPU_PIN.x} cy={CPU_PIN.y} r={7} className={cn("stroke-ink/40 dark:stroke-bone/40", irqLit ? "fill-amber-500" : "fill-white dark:fill-chalkboard")} strokeWidth="1.5" />
      <text x={CPU_PIN.x - 12} y={CPU_PIN.y + 4} textAnchor="end" className="fill-ink-soft font-mono text-[11px] dark:fill-bone-soft">
        IRQ
      </text>

      {SLOTS.map((slot) => {
        const g = geometry(slot);
        const dev = DEVICES[slot.device];
        const view = controllerView(engine, slot.device);
        const isSelected = selected === slot.device;
        const isServicing = servicing && activeSource === slot.device;
        const left = slot.side === "left";
        const linkFromDeviceX = left ? g.deviceBox.x + g.deviceBox.w : g.deviceBox.x;
        const linkFromCtrlX = left ? g.ctrlBox.x + g.ctrlBox.w : g.ctrlBox.x;
        const linkToCtrlX = left ? g.ctrlBox.x : g.ctrlBox.x + g.ctrlBox.w;
        return (
          <g key={slot.device}>
            {/* Links: device — controller — bus */}
            <line x1={linkFromDeviceX} y1={slot.cy} x2={linkToCtrlX} y2={slot.cy} strokeWidth="2" className="stroke-ink/30 dark:stroke-bone/30" />
            <line
              x1={linkFromCtrlX}
              y1={slot.cy}
              x2={SPINE_X}
              y2={slot.cy}
              strokeWidth={isServicing ? 4 : 2}
              className={cn(isServicing ? "animate-pulse stroke-emerald-500" : "stroke-ink/30 dark:stroke-bone/30")}
            />

            {/* Controller (clickable) */}
            <g
              role="button"
              tabIndex={0}
              aria-label={`Inspect ${dev.controller}`}
              aria-pressed={isSelected}
              className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-subject-it"
              onClick={() => onSelect(slot.device)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(slot.device);
                }
              }}
            >
              <rect
                x={g.ctrlBox.x}
                y={slot.cy - 22}
                width={g.ctrlBox.w}
                height={44}
                rx={8}
                strokeWidth={isSelected ? 2.5 : 1.5}
                className={cn("fill-white dark:fill-white/5", isSelected ? "stroke-subject-it" : "stroke-ink/30 dark:stroke-bone/30")}
              />
              <text x={g.ctrlCenter.x} y={slot.cy - 3} textAnchor="middle" className="fill-ink font-mono text-[11px] dark:fill-bone">
                {dev.controllerShort}
              </text>
              <circle cx={g.ctrlCenter.x - 12} cy={slot.cy + 12} r={4.5} className={STATUS_DOT[view.status]} />
              <text x={g.ctrlCenter.x - 4} y={slot.cy + 16} className="fill-ink-soft font-mono text-[11px] dark:fill-bone-soft">
                {view.irqLine ? "IRQ" : "—"}
              </text>
            </g>

            {/* Device */}
            <g
              role="button"
              tabIndex={0}
              aria-label={`Inspect ${dev.label} controller`}
              className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-subject-it"
              onClick={() => onSelect(slot.device)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(slot.device);
                }
              }}
            >
              <rect
                x={g.deviceBox.x}
                y={slot.cy - 26}
                width={g.deviceBox.w}
                height={52}
                rx={10}
                strokeWidth="1.5"
                className={cn("fill-subject-it-soft/70 dark:fill-subject-it/15", isServicing ? "stroke-emerald-500" : "stroke-subject-it/60")}
              />
              <text x={g.deviceCenter.x} y={slot.cy - 4} textAnchor="middle" className="text-[20px]" aria-hidden="true">
                {dev.icon}
              </text>
              <text x={g.deviceCenter.x} y={slot.cy + 17} textAnchor="middle" className="fill-ink font-mono text-[12px] dark:fill-bone">
                {dev.label}
              </text>
            </g>
          </g>
        );
      })}

      {/* Travelling interrupt signals */}
      {engine.inFlight.map((f) => {
        const slot = SLOTS.find((s) => s.device === f.event.source);
        if (!slot) return null;
        const pos = signalPosition(slot, f.leg);
        return (
          <g
            key={f.event.id}
            style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, transition: `transform ${Math.round(tickMs * 0.85)}ms linear` }}
          >
            <circle r={13} className="fill-amber-500/25" />
            <circle r={7} className="fill-amber-500 stroke-white dark:stroke-chalkboard" strokeWidth="1.5" />
          </g>
        );
      })}

      {/* NMI banner — the critical event has no device row; it goes straight to the CPU pin */}
      {engine.inFlight.some((f) => f.event.source === "nmi") && (
        <g style={{ transform: `translate(${CPU_PIN.x}px, ${CPU_PIN.y + 20}px)` }}>
          <circle r={9} className="fill-rose-500 stroke-white dark:stroke-chalkboard" strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
}

export const SystemDiagram = memo(SystemDiagramInner);

export function DiagramLegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft dark:text-bone-soft">
      <li className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500" aria-hidden="true" /> Interrupt signal / data ready
      </li>
      <li className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" /> ISR servicing device
      </li>
      <li className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-ink/25 dark:bg-bone/30" aria-hidden="true" /> Controller idle
      </li>
      <li>Tap a controller or device to inspect it.</li>
    </ul>
  );
}
