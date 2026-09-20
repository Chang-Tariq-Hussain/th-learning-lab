"use client";

import { cn } from "@/lib/utils";
import { formatRange, lineWords, type AccessResult, type LevelId, type LevelState } from "../model";
import { LABEL_CLASS } from "./ui-bits";

export interface LineFocus {
  hitBlock: number | null;
  loadedBlock: number | null;
  evicted: { setIndex: number; way: number; block: number } | null;
}

export const NO_FOCUS: LineFocus = { hitBlock: null, loadedBlock: null, evicted: null };

/** What the last access did at one level — drives the row highlights. */
export function focusFor(result: AccessResult | undefined, level: LevelId): LineFocus {
  if (!result) return NO_FOCUS;
  const lookup = result.lookups.find((l) => l.level === level);
  const fill = result.fills.find((f) => f.level === level);
  return {
    hitBlock: lookup && lookup.outcome === "hit" ? result.block : null,
    loadedBlock: fill ? result.block : null,
    evicted: fill && fill.evictedBlock !== null ? { setIndex: fill.setIndex, way: fill.way, block: fill.evictedBlock } : null,
  };
}

interface Row {
  index: number;
  setIndex: number;
  way: number;
  block: number | null;
}

function rowsOf(level: LevelState): Row[] {
  const rows: Row[] = [];
  level.sets.forEach((set, setIndex) => {
    set.forEach((line, way) => {
      rows.push({ index: setIndex * level.ways + way, setIndex, way, block: line ? line.block : null });
    });
  });
  return rows;
}

function rowState(row: Row, focus: LineFocus) {
  const isNew = row.block !== null && row.block === focus.loadedBlock;
  const isHit = row.block !== null && row.block === focus.hitBlock;
  const evicted = focus.evicted && focus.evicted.setIndex === row.setIndex && focus.evicted.way === row.way ? focus.evicted : null;
  return { isNew, isHit, evicted };
}

export function CacheTable({
  level,
  lineSize,
  title,
  focus = NO_FOCUS,
  variant = "table",
  blockLabel,
}: {
  level: LevelState;
  lineSize: number;
  title: string;
  focus?: LineFocus;
  variant?: "table" | "grid";
  /** Optional friendlier name for a block (e.g. the letter “A”), used instead of its address range. */
  blockLabel?: (block: number) => string;
}) {
  const fmt = (block: number) => (blockLabel ? blockLabel(block) : formatRange(block, lineSize));
  const rows = rowsOf(level);
  const showSet = level.ways > 1 && level.setCount > 1;
  const geometry =
    level.setCount === level.lines
      ? "direct-mapped"
      : level.setCount === 1
        ? "any line"
        : `${level.setCount} sets × ${level.ways} ways`;

  if (variant === "grid") {
    return (
      <div>
        <p className={cn(LABEL_CLASS, "mb-1.5")}>
          {title} · {level.lines} lines
        </p>
        <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-4" aria-label={`${title} contents`}>
          {rows.map((row) => {
            const { isNew, isHit, evicted } = rowState(row, focus);
            return (
              <li
                key={row.index}
                className={cn(
                  "min-h-[44px] rounded-md border px-2 py-1 font-mono text-[11px] transition-colors",
                  row.block === null && "border-dashed border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
                  row.block !== null && "border-line text-ink dark:border-line-dark dark:text-bone",
                  isNew && "cme-flash border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15",
                  isHit && "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15",
                )}
              >
                <span className="text-ink-soft dark:text-bone-soft">{row.index}</span>{" "}
                {row.block === null ? "empty" : fmt(row.block)}
                {isNew ? <span className="ml-1 font-semibold text-emerald-700 dark:text-emerald-300">NEW</span> : null}
                {isHit ? <span className="ml-1 font-semibold text-emerald-700 dark:text-emerald-300">HIT</span> : null}
                {evicted ? (
                  <span className="block text-rose-700 line-through dark:text-rose-300">{fmt(evicted.block)}</span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <p className={cn(LABEL_CLASS, "mb-1.5")}>
        {title} · {level.lines} lines · {geometry}
      </p>
      <div className="overflow-x-auto rounded-lg border border-line dark:border-line-dark">
        <table className="w-full min-w-[420px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-line bg-ink/[0.03] dark:border-line-dark dark:bg-bone/[0.04]">
              <th scope="col" className="px-2.5 py-2 font-mono text-[10px] font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                Line
              </th>
              {showSet ? (
                <th scope="col" className="px-2.5 py-2 font-mono text-[10px] font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                  Set
                </th>
              ) : null}
              <th scope="col" className="px-2.5 py-2 font-mono text-[10px] font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                Address range
              </th>
              <th scope="col" className="px-2.5 py-2 font-mono text-[10px] font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                Data
              </th>
              <th scope="col" className="px-2.5 py-2 font-mono text-[10px] font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const { isNew, isHit, evicted } = rowState(row, focus);
              return (
                <tr
                  key={row.index}
                  className={cn(
                    "border-b border-line/70 last:border-b-0 dark:border-line-dark/70",
                    isNew && "cme-flash bg-emerald-50 dark:bg-emerald-500/15",
                    isHit && "bg-emerald-50 dark:bg-emerald-500/15",
                  )}
                >
                  <td className="px-2.5 py-2 font-mono tabular-nums text-ink dark:text-bone">{row.index}</td>
                  {showSet ? <td className="px-2.5 py-2 font-mono tabular-nums text-ink-soft dark:text-bone-soft">{row.setIndex}</td> : null}
                  <td className="px-2.5 py-2 font-mono tabular-nums text-ink dark:text-bone">
                    {row.block === null ? <span className="italic text-ink-soft dark:text-bone-soft">empty</span> : fmt(row.block)}
                  </td>
                  <td className="px-2.5 py-2 font-mono tabular-nums text-ink dark:text-bone">
                    {row.block === null ? "—" : `[${lineWords(row.block, lineSize).map((w) => w.value).join(", ")}]`}
                  </td>
                  <td className="px-2.5 py-2">
                    {isNew ? <span className="font-semibold text-emerald-700 dark:text-emerald-300">Newly loaded</span> : null}
                    {isHit ? <span className="font-semibold text-emerald-700 dark:text-emerald-300">Hit — recently used</span> : null}
                    {evicted ? (
                      <span className="block text-rose-700 dark:text-rose-300">
                        Evicted <span className="line-through">{fmt(evicted.block)}</span>
                      </span>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
