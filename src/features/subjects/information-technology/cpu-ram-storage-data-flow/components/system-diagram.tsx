"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { COMPONENTS, type ComponentId, type RegisterSnapshot } from "../model";

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Fixed layout, in a 940×400 viewBox, shared by every 2D mode. Left to
 *  right mirrors the direction a program's data travels when loading:
 *  Storage → RAM → cache hierarchy (outer to inner) → CPU internals,
 *  with the cache + core enclosed in a dashed "CPU package" boundary
 *  so it's visually clear the cache lives inside the CPU, not beside it. */
const LAYOUT: Record<ComponentId, Box> = {
  storage: { x: 14, y: 172, w: 104, h: 60 },
  ram: { x: 166, y: 172, w: 104, h: 60 },
  l3: { x: 330, y: 172, w: 84, h: 60 },
  l2: { x: 452, y: 172, w: 84, h: 60 },
  l1: { x: 574, y: 172, w: 84, h: 60 },
  pc: { x: 706, y: 20, w: 140, h: 42 },
  ir: { x: 706, y: 74, w: 140, h: 42 },
  controlUnit: { x: 706, y: 128, w: 140, h: 48 },
  r1: { x: 706, y: 208, w: 140, h: 42 },
  r2: { x: 706, y: 260, w: 140, h: 42 },
  alu: { x: 706, y: 314, w: 140, h: 48 },
  addressBus: { x: 0, y: 0, w: 0, h: 0 },
  dataBus: { x: 0, y: 0, w: 0, h: 0 },
  controlBus: { x: 0, y: 0, w: 0, h: 0 },
};

const CPU_BOUNDARY: Box = { x: 316, y: 8, w: 546, h: 366 };

/** Plain internal pathways — not labeled as buses, since only the
 *  RAM↔CPU-package link is drawn as the three-bus teaching model. */
const INTERNAL_CONNECTORS: [ComponentId, ComponentId][] = [
  ["l3", "l2"],
  ["l2", "l1"],
  ["l1", "ir"],
  ["l1", "r1"],
  ["pc", "controlUnit"],
  ["ir", "controlUnit"],
  ["controlUnit", "alu"],
  ["r1", "alu"],
  ["r2", "alu"],
];

const BUS_DEFS: { id: "addressBus" | "dataBus" | "controlBus"; label: string; yOffset: number }[] = [
  { id: "addressBus", label: "Address", yOffset: -16 },
  { id: "dataBus", label: "Data", yOffset: 0 },
  { id: "controlBus", label: "Control", yOffset: 16 },
];

function center(id: ComponentId): { x: number; y: number } {
  const box = LAYOUT[id];
  return { x: box.x + box.w / 2, y: box.y + box.h / 2 };
}

export interface DiagramStepProps {
  activeComponents: ComponentId[];
  from?: ComponentId;
  to?: ComponentId;
  packetLabel?: string;
  busSignal?: { bus: "addressBus" | "dataBus" | "controlBus"; value: string };
  /** Changing this key re-triggers the packet's travel animation, even
   *  if `from`/`to` happen to repeat a previous step. */
  stepKey: string;
  registers?: RegisterSnapshot;
}

interface SystemDiagramProps extends DiagramStepProps {
  inspectedId: ComponentId | null;
  onInspect: (id: ComponentId) => void;
  /** Milliseconds the packet takes to travel — kept in sync with the
   *  caller's own auto-play timing so the two never feel disjointed. */
  travelMs?: number;
}

export function SystemDiagram({
  activeComponents,
  from,
  to,
  packetLabel,
  busSignal,
  stepKey,
  registers,
  inspectedId,
  onInspect,
  travelMs = 1100,
}: SystemDiagramProps) {
  const [packetPos, setPacketPos] = useState<{ x: number; y: number } | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!from || !to) {
      setPacketPos(null);
      return;
    }
    setTransitioning(false);
    setPacketPos(center(from));
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        setTransitioning(true);
        setPacketPos(center(to));
      });
      rafRef.current = raf2;
    });
    rafRef.current = raf1;
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepKey]);

  const activeSet = new Set(activeComponents);
  const activeBusDef = busSignal ? BUS_DEFS.find((b) => b.id === busSignal.bus) : undefined;
  const busY = center("ram").y + (activeBusDef?.yOffset ?? 0);
  const busX1 = LAYOUT.ram.x + LAYOUT.ram.w;
  const busX2 = CPU_BOUNDARY.x;

  const registerText = (id: "pc" | "ir" | "r1" | "r2") => {
    if (!registers) return null;
    if (id === "pc") return `= ${registers.pc}`;
    if (id === "ir") return registers.ir ? registers.ir : "(empty)";
    if (id === "r1") return `= ${registers.r1}`;
    return `= ${registers.r2}`;
  };

  return (
    <svg viewBox="0 0 940 400" className="mx-auto w-full max-w-4xl" role="img" aria-label="CPU, cache, RAM, and storage architecture diagram">
      {/* CPU package boundary */}
      <rect
        x={CPU_BOUNDARY.x}
        y={CPU_BOUNDARY.y}
        width={CPU_BOUNDARY.w}
        height={CPU_BOUNDARY.h}
        rx={14}
        strokeDasharray="4 5"
        className="fill-none stroke-ink/25 dark:stroke-bone/25"
        strokeWidth={1.5}
      />
      <text x={CPU_BOUNDARY.x + 12} y={CPU_BOUNDARY.y - 12} className="fill-ink-soft font-mono text-[10px] uppercase tracking-wide dark:fill-bone-soft">
        CPU package (cache + core)
      </text>

      {/* storage <-> ram connector */}
      <line
        x1={LAYOUT.storage.x + LAYOUT.storage.w}
        y1={center("storage").y}
        x2={LAYOUT.ram.x}
        y2={center("ram").y}
        strokeWidth={2}
        className="stroke-ink/15 dark:stroke-bone/15"
      />

      {/* three-bus teaching model between RAM and the CPU package */}
      {BUS_DEFS.map((bus) => {
        const y = center("ram").y + bus.yOffset;
        const isActive = busSignal?.bus === bus.id;
        return (
          <g key={bus.id}>
            <line
              x1={busX1}
              y1={y}
              x2={busX2}
              y2={y}
              strokeWidth={isActive ? 2.5 : 1.5}
              className={isActive ? "stroke-subject-it" : "stroke-ink/15 dark:stroke-bone/15"}
            />
            <text x={busX1 + 4} y={y - 4} className="fill-ink-soft font-mono text-[8px] uppercase tracking-wide dark:fill-bone-soft">
              {bus.label}
            </text>
            {isActive && busSignal && (
              <text
                x={(busX1 + busX2) / 2}
                y={y - 6}
                textAnchor="middle"
                className="select-none fill-subject-it font-mono text-[11px] font-semibold"
              >
                {busSignal.value}
              </text>
            )}
          </g>
        );
      })}

      {/* internal (non-bus) connectors */}
      {INTERNAL_CONNECTORS.map(([a, b]) => {
        const p1 = center(a);
        const p2 = center(b);
        return (
          <line
            key={`${a}-${b}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            strokeWidth={1.5}
            className="stroke-ink/12 dark:stroke-bone/15"
          />
        );
      })}

      {/* component boxes */}
      {(Object.keys(LAYOUT) as ComponentId[])
        .filter((id) => !["addressBus", "dataBus", "controlBus"].includes(id))
        .map((id) => {
          const box = LAYOUT[id];
          const def = COMPONENTS[id];
          const isActive = activeSet.has(id);
          const isInspected = inspectedId === id;
          const regText = ["pc", "ir", "r1", "r2"].includes(id) ? registerText(id as "pc" | "ir" | "r1" | "r2") : null;
          return (
            <g
              key={id}
              onClick={() => onInspect(id)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`${def.label}. ${def.description}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onInspect(id);
              }}
            >
              <rect
                x={box.x}
                y={box.y}
                width={box.w}
                height={box.h}
                rx={10}
                strokeWidth={isActive || isInspected ? 2.5 : 1.5}
                className={cn(
                  "transition-colors",
                  isActive
                    ? "fill-subject-it-soft stroke-subject-it dark:fill-subject-it/20"
                    : isInspected
                      ? "fill-paper stroke-subject-it dark:fill-chalkboard"
                      : "fill-paper stroke-ink/20 dark:fill-chalkboard dark:stroke-bone/20"
                )}
              />
              <text
                x={box.x + box.w / 2}
                y={box.y + box.h / 2 + (regText ? -3 : 4)}
                textAnchor="middle"
                className={cn("select-none font-mono text-[11px] font-medium", isActive ? "fill-subject-it" : "fill-ink dark:fill-bone")}
              >
                {def.label}
              </text>
              {regText && (
                <text
                  x={box.x + box.w / 2}
                  y={box.y + box.h / 2 + 13}
                  textAnchor="middle"
                  className={cn("select-none font-mono text-[10px]", isActive ? "fill-subject-it" : "fill-ink-soft dark:fill-bone-soft")}
                >
                  {regText}
                </text>
              )}
            </g>
          );
        })}

      {/* moving data packet */}
      {packetPos && from && to && (
        <g>
          <circle
            cx={packetPos.x}
            cy={packetPos.y}
            r={8}
            className="fill-subject-it"
            style={{ transition: transitioning ? `cx ${travelMs}ms ease-in-out, cy ${travelMs}ms ease-in-out` : "none" }}
          />
          {packetLabel && (
            <text
              x={packetPos.x}
              y={packetPos.y - 14}
              textAnchor="middle"
              className="select-none fill-subject-it font-mono text-[10px] font-medium"
              style={{ transition: transitioning ? `x ${travelMs}ms ease-in-out, y ${travelMs}ms ease-in-out` : "none" }}
            >
              {packetLabel}
            </text>
          )}
        </g>
      )}
    </svg>
  );
}
