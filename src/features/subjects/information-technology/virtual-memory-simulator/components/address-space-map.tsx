"use client";

import { cn } from "@/lib/utils";
import type { SimProcess, VirtualRegion } from "../model";

interface AddressSpaceMapProps {
  process: SimProcess;
  /** "residency" colors resident vs non-resident; "working-set" colors
   *  active vs inactive; "plain" just shows region kind labels evenly
   *  tinted by the process color. */
  mode?: "residency" | "working-set" | "plain";
  selectedRegionId?: string | null;
  onSelectRegion?: (region: VirtualRegion) => void;
}

/**
 * A single vertical bar representing one process's virtual address
 * space, ordered low-to-high the way the brief's own diagram reads:
 * Code, Data, Heap (growing up), Free Virtual Space, Stack (growing
 * down). Reused across the Overview, Resident/Working-Set, and
 * Isolation panels so every tab renders a process's address space
 * the same way.
 */
export function AddressSpaceMap({ process, mode = "plain", selectedRegionId, onSelectRegion }: AddressSpaceMapProps) {
  return (
    <div
      className="flex w-full flex-col overflow-hidden rounded-lg border border-line dark:border-line-dark"
      style={{ minHeight: "220px" }}
      role="img"
      aria-label={`${process.name} virtual address space`}
    >
      {process.regions.map((r) => {
        const heightPct = (r.sizeGB / process.virtualSizeGB) * 100;
        const isSelected = selectedRegionId === r.id;
        const isFree = r.kind === "free";

        let bg: string | undefined;
        let textClass = "text-paper";
        if (isFree) {
          bg = undefined;
        } else if (mode === "residency") {
          bg = r.resident ? process.color : undefined;
          textClass = r.resident ? "text-paper" : "text-ink-soft dark:text-bone-soft";
        } else if (mode === "working-set") {
          bg = r.active ? process.color : undefined;
          textClass = r.active ? "text-paper" : "text-ink-soft dark:text-bone-soft";
        } else {
          bg = process.color;
        }

        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onSelectRegion?.(r)}
            title={`${r.label} · ${r.sizeGB} GB`}
            style={{ height: `${heightPct}%`, ...(bg ? { backgroundColor: bg } : {}) }}
            className={cn(
              "group relative flex min-h-[10px] items-center justify-center border-b border-paper/60 px-2 text-[11px] font-mono transition-all last:border-b-0 dark:border-chalkboard/60",
              !bg && "bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.04),rgba(0,0,0,0.04)_6px,transparent_6px,transparent_12px)] text-ink-soft dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.06),rgba(255,255,255,0.06)_6px,transparent_6px,transparent_12px)] dark:text-bone-soft",
              bg && textClass,
              isSelected && "ring-2 ring-inset ring-ink dark:ring-bone",
              onSelectRegion && "cursor-pointer hover:brightness-110",
            )}
          >
            {heightPct > 5 && <span className="truncate">{r.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
