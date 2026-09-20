"use client";

import { cn } from "@/lib/utils";
import {
  formatPercent,
  formatUnits,
  levelName,
  unitsLabel,
  type LatencyPart,
  type Servicer,
  type StatSummary,
  type Stats,
} from "../model";
import { LABEL_CLASS, Stat } from "./ui-bits";

export function StatsPanel({
  summary,
  stats,
  levelCount,
  showBreakdown = false,
  showTime = true,
  showEvictions = true,
  className,
}: {
  summary: StatSummary;
  stats?: Stats;
  levelCount: 1 | 3;
  showBreakdown?: boolean;
  showTime?: boolean;
  showEvictions?: boolean;
  className?: string;
}) {
  const empty = summary.total === 0;
  return (
    <div className={cn("flex flex-col gap-3", className)} aria-live="polite">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Total accesses" value={summary.total} />
        <Stat label="Hits" value={summary.hits} tone="hit" />
        <Stat label="Misses" value={summary.misses} tone="miss" />
        <Stat label="Evictions" value={showEvictions ? summary.evictions : "—"} />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Hit rate" value={empty ? "—" : formatPercent(summary.hitRate)} sub="hits ÷ accesses" />
        <Stat label="Miss rate" value={empty ? "—" : formatPercent(summary.missRate)} sub="misses ÷ accesses" />
        {showTime ? (
          <>
            <Stat label="Total simulated time" value={empty ? "—" : formatUnits(summary.totalTime)} sub="simulated units" />
            <Stat label="Average access time" value={empty ? "—" : formatUnits(Number(summary.averageTime.toFixed(2)))} sub="units per access" />
          </>
        ) : null}
      </div>
      {showBreakdown && stats && levelCount === 3 ? (
        <p className="text-xs text-ink-soft dark:text-bone-soft">
          Served by:{" "}
          <span className="font-mono text-ink dark:text-bone">
            L1 {stats.byLevel.l1} · L2 {stats.byLevel.l2} · L3 {stats.byLevel.l3} · RAM {stats.byLevel.ram}
          </span>
          . A “hit” means some cache level answered; a “miss” means the request had to reach RAM.
        </p>
      ) : null}
    </div>
  );
}

const BAR_COLOR: Record<Servicer, string> = {
  l1: "bg-emerald-500",
  l2: "bg-teal-500",
  l3: "bg-sky-500",
  ram: "bg-amber-600",
};

export function LatencyBars({
  latency,
  levelCount,
  showStorage = true,
}: {
  latency: Record<Servicer, number>;
  levelCount: 1 | 3;
  showStorage?: boolean;
}) {
  const ids: Servicer[] = levelCount === 1 ? ["l1", "ram"] : ["l1", "l2", "l3", "ram"];
  const max = Math.max(...ids.map((id) => latency[id]));
  return (
    <div>
      <p className={cn(LABEL_CLASS, "mb-2")}>Access time per level — simulation values, linear scale</p>
      <ul className="flex flex-col gap-2">
        {ids.map((id) => (
          <li key={id} className="grid grid-cols-[3.5rem_1fr_4.5rem] items-center gap-2 text-xs">
            <span className="font-mono text-ink dark:text-bone">{levelName(id, levelCount)}</span>
            <span className="h-3 rounded-sm bg-ink/[0.06] dark:bg-bone/[0.08]">
              <span
                className={cn("block h-3 rounded-sm transition-[width] duration-500", BAR_COLOR[id])}
                style={{ width: `${Math.max(2, (latency[id] / max) * 100)}%` }}
              />
            </span>
            <span className="text-right font-mono tabular-nums text-ink dark:text-bone">{unitsLabel(latency[id])}</span>
          </li>
        ))}
        {showStorage ? (
          <li className="grid grid-cols-[3.5rem_1fr_4.5rem] items-center gap-2 text-xs">
            <span className="font-mono text-ink dark:text-bone">Storage</span>
            <span className="relative h-3 overflow-hidden rounded-sm bg-ink/[0.06] dark:bg-bone/[0.08]">
              <span className="absolute inset-y-0 left-0 w-[92%] rounded-sm bg-ink/30 dark:bg-bone/30" />
              <span className="absolute inset-y-0 right-[6%] w-1.5 -skew-x-12 bg-paper dark:bg-chalkboard" />
            </span>
            <span className="text-right font-mono text-[10px] text-ink-soft dark:text-bone-soft">off scale</span>
          </li>
        ) : null}
      </ul>
    </div>
  );
}

/** Where one access spent its simulated time, as a single stacked bar. */
export function LatencyBreakdown({ parts, levelCount }: { parts: LatencyPart[]; levelCount: 1 | 3 }) {
  const total = parts.reduce((sum, p) => sum + p.units, 0);
  if (total === 0) return null;
  return (
    <div>
      <div className="flex h-4 w-full overflow-hidden rounded-sm bg-ink/[0.06] dark:bg-bone/[0.08]" role="img" aria-label={`Total ${total} simulated units`}>
        {parts.map((p) => (
          <span
            key={p.id}
            className={cn("h-4 transition-[width] duration-500", BAR_COLOR[p.id])}
            style={{ width: `${(p.units / total) * 100}%`, minWidth: 3 }}
            title={`${levelName(p.id, levelCount)}: ${unitsLabel(p.units)}`}
          />
        ))}
      </div>
      <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-ink-soft dark:text-bone-soft">
        {parts.map((p) => (
          <li key={p.id} className="inline-flex items-center gap-1">
            <span className={cn("inline-block h-2 w-2 rounded-sm", BAR_COLOR[p.id])} aria-hidden="true" />
            {levelName(p.id, levelCount)} {p.units}
          </li>
        ))}
        <li className="font-medium text-ink dark:text-bone">= {unitsLabel(total)}</li>
      </ul>
    </div>
  );
}
