"use client";

import { cn } from "@/lib/utils";
import { OS_RESERVED_RAM_GB, PHYSICAL_RAM_GB, residentGB, type SimProcess } from "../model";

interface PhysicalRamBarProps {
  processes: SimProcess[];
  height?: string;
}

/**
 * A single proportional horizontal bar representing physical RAM
 * capacity: the fixed OS reservation, each process's currently
 * resident memory (color-matched to that process), and whatever
 * capacity remains free. Deliberately a capacity bar rather than a
 * byte-addressed block map — that level of detail is what the
 * Memory Management Simulator already covers; this component is
 * about how much of RAM is actually occupied by what right now.
 */
export function PhysicalRamBar({ processes, height = "h-14" }: PhysicalRamBarProps) {
  const segments = [
    { id: "os", label: "Operating System", sizeGB: OS_RESERVED_RAM_GB, color: undefined as string | undefined, muted: true },
    ...processes
      .filter((p) => residentGB(p) > 0)
      .map((p) => ({ id: p.id, label: `${p.name} (resident)`, sizeGB: residentGB(p), color: p.color, muted: false })),
  ];
  const used = segments.reduce((sum, s) => sum + s.sizeGB, 0);
  const free = Math.max(0, PHYSICAL_RAM_GB - used);

  return (
    <div
      className={cn("flex w-full overflow-hidden rounded-lg border border-line dark:border-line-dark", height)}
      role="img"
      aria-label="Physical RAM capacity"
    >
      {segments.map((s) => (
        <div
          key={s.id}
          title={`${s.label} · ${s.sizeGB.toFixed(2)} GB`}
          style={{ width: `${(s.sizeGB / PHYSICAL_RAM_GB) * 100}%`, ...(s.color ? { backgroundColor: s.color } : {}) }}
          className={cn(
            "flex items-center justify-center border-r border-paper/60 text-[10px] font-mono text-paper last:border-r-0 dark:border-chalkboard/60",
            s.muted && "bg-ink/70 dark:bg-bone/40",
          )}
        >
          {(s.sizeGB / PHYSICAL_RAM_GB) * 100 > 8 && <span className="truncate px-1">{s.label}</span>}
        </div>
      ))}
      {free > 0 && (
        <div
          title={`Free RAM · ${free.toFixed(2)} GB`}
          style={{ width: `${(free / PHYSICAL_RAM_GB) * 100}%` }}
          className="flex items-center justify-center bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.04),rgba(0,0,0,0.04)_6px,transparent_6px,transparent_12px)] text-[10px] font-mono text-ink-soft dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.06),rgba(255,255,255,0.06)_6px,transparent_6px,transparent_12px)] dark:text-bone-soft"
        >
          {(free / PHYSICAL_RAM_GB) * 100 > 8 && <span className="truncate px-1">Free RAM</span>}
        </div>
      )}
    </div>
  );
}
