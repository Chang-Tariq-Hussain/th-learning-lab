"use client";

import { cn } from "@/lib/utils";
import { TREND_ORDER, TRENDS, getScore, type ElementDef } from "../periodic-trends-model";

interface ComparePanelProps {
  a: ElementDef | null;
  b: ElementDef | null;
  onReset: () => void;
}

function Bar({ symbol, score, color }: { symbol: string; score: number | null; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-7 shrink-0 font-mono text-xs font-medium text-ink dark:text-bone">{symbol}</span>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-ink/5 dark:bg-bone/10">
        {score === null ? (
          <div className="flex h-full items-center px-2 text-[10px] text-ink-soft dark:text-bone-soft">n/a</div>
        ) : (
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.max(6, score * 100)}%`, background: color }}
          />
        )}
      </div>
    </div>
  );
}

export function ComparePanel({ a, b, onReset }: ComparePanelProps) {
  if (!a || !b) {
    return (
      <div className="rounded-card border border-dashed border-line p-4 text-center text-sm text-ink-soft dark:border-line-dark dark:text-bone-soft">
        Pick two elements on the table to compare them ({!a ? "1st" : "2nd"} pick).
      </div>
    );
  }

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <p className="font-display text-base font-medium text-ink dark:text-bone">
          Compare: {a.symbol} vs {b.symbol}
        </p>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-ink-soft underline-offset-2 hover:underline dark:text-bone-soft"
        >
          Clear
        </button>
      </div>
      <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">Which one is higher?</p>

      <div className="mt-4 space-y-4">
        {TREND_ORDER.map((id) => {
          const meta = TRENDS[id];
          const scoreA = getScore(id, a.symbol);
          const scoreB = getScore(id, b.symbol);
          return (
            <div key={id}>
              <p
                className={cn("mb-1.5 font-mono text-[11px] uppercase tracking-wide")}
                style={{ color: meta.color }}
              >
                {meta.label}
              </p>
              <div className="space-y-1.5">
                <Bar symbol={a.symbol} score={scoreA} color={meta.color} />
                <Bar symbol={b.symbol} score={scoreB} color={meta.color} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
