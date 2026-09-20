"use client";

import { cn } from "@/lib/utils";
import { levelName } from "../model";
import type { HierarchyNodeId } from "../content";

export type NodeVisual = "idle" | "active" | "checking" | "hit" | "miss" | "stored" | "source";

const VISUAL_CLASS: Record<NodeVisual, string> = {
  idle: "border-line bg-paper dark:border-line-dark dark:bg-chalkboard",
  active: "border-subject-it bg-subject-it-soft dark:bg-subject-it/20",
  checking: "border-amber-500 bg-amber-50 dark:bg-amber-500/10",
  hit: "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15",
  miss: "border-rose-500 bg-rose-50 dark:bg-rose-500/10",
  stored: "border-sky-500 bg-sky-50 dark:bg-sky-500/10",
  source: "border-amber-600 bg-amber-50 dark:bg-amber-500/15",
};

const BADGE_TEXT: Partial<Record<NodeVisual, string>> = {
  checking: "CHECKING…",
  hit: "FOUND ✓",
  miss: "MISS ✕",
  stored: "COPY STORED",
  source: "DATA HERE",
};

const BADGE_CLASS: Partial<Record<NodeVisual, string>> = {
  checking: "text-amber-800 dark:text-amber-300",
  hit: "text-emerald-800 dark:text-emerald-300",
  miss: "text-rose-800 dark:text-rose-300",
  stored: "text-sky-800 dark:text-sky-300",
  source: "text-amber-900 dark:text-amber-300",
};

export interface HierarchyDiagramProps {
  levelCount: 1 | 3;
  visuals?: Partial<Record<HierarchyNodeId, NodeVisual>>;
  /** Small second line under each node's name. */
  subs?: Partial<Record<HierarchyNodeId, string>>;
  selected?: HierarchyNodeId | null;
  onSelect?: (id: HierarchyNodeId) => void;
  /** How many connectors (counted from the CPU) carry traffic. */
  activeEdges?: number;
  edgeDirection?: "down" | "up" | null;
  className?: string;
}

/**
 * CPU → L1 → L2 → L3 → RAM → Storage as a vertical stack. Vertical
 * position encodes distance from the CPU; node *width* encodes
 * capacity, so the speed/size trade-off is visible at a glance.
 * Purely presentational: the parent supplies each node's visual state.
 */
export function HierarchyDiagram({
  levelCount,
  visuals = {},
  subs = {},
  selected = null,
  onSelect,
  activeEdges = 0,
  edgeDirection = null,
  className,
}: HierarchyDiagramProps) {
  const ids: HierarchyNodeId[] = levelCount === 1 ? ["cpu", "l1", "ram", "storage"] : ["cpu", "l1", "l2", "l3", "ram", "storage"];
  const labelOf = (id: HierarchyNodeId) => (id === "cpu" ? "CPU + registers" : id === "storage" ? "Storage" : levelName(id, levelCount));

  return (
    <div className={cn("flex gap-2", className)}>
      <div className="flex w-5 shrink-0 flex-col items-center py-1 text-ink-soft dark:text-bone-soft" aria-hidden="true">
        <span className="rotate-180 font-mono text-[10px] [writing-mode:vertical-rl]">▲ faster · smaller · closer</span>
        <span className="my-1 w-px flex-1 bg-line dark:bg-line-dark" />
        <span className="font-mono text-[10px] [writing-mode:vertical-rl]">slower · larger · farther ▼</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-center">
        {ids.map((id, index) => {
          const visual = visuals[id] ?? "idle";
          const width = 48 + (index * 52) / (ids.length - 1);
          const badge = BADGE_TEXT[visual];
          const isSelected = selected === id;
          const body = (
            <>
              <span className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                <span className="font-mono text-xs font-semibold text-ink dark:text-bone">{labelOf(id)}</span>
                {badge ? (
                  <span className={cn("cme-pop font-mono text-[10px] font-semibold tracking-wide", BADGE_CLASS[visual])}>{badge}</span>
                ) : null}
              </span>
              {subs[id] ? <span className="mt-0.5 block text-[11px] leading-snug text-ink-soft dark:text-bone-soft">{subs[id]}</span> : null}
            </>
          );
          const nodeClass = cn(
            "block w-full rounded-xl border-2 px-3 py-2 text-left transition-colors duration-300",
            VISUAL_CLASS[visual],
            isSelected && "ring-2 ring-ink/50 dark:ring-bone/60",
            onSelect && "cursor-pointer hover:border-ink/40 dark:hover:border-bone/40",
          );

          return (
            <div key={id} className="flex w-full flex-col items-center">
              {index > 0 ? (
                <div className="relative flex h-6 w-full items-center justify-center" aria-hidden="true">
                  <span className={cn("h-full w-0.5 transition-colors duration-300", index <= activeEdges ? "bg-subject-it" : "bg-line dark:bg-line-dark")} />
                  {index <= activeEdges && edgeDirection ? (
                    <span className="absolute font-mono text-[11px] leading-none text-amber-800 dark:text-amber-300">{edgeDirection === "down" ? "▼" : "▲"}</span>
                  ) : null}
                </div>
              ) : null}
              <div style={{ width: `${width}%` }} className="min-w-[8.5rem] max-w-full">
                {onSelect ? (
                  <button type="button" onClick={() => onSelect(id)} aria-pressed={isSelected} className={nodeClass}>
                    {body}
                  </button>
                ) : (
                  <div className={nodeClass}>{body}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
