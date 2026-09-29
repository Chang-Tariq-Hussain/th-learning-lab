"use client";

import { cn } from "@/lib/utils";
import { formatIPv4 } from "../../ip-addressing-simulator/model";
import type { SplitPlan } from "../model";

/**
 * The original address space as one bar, then redrawn as equal subnet segments. The bar is redrawn
 * every time the prefix changes. With more than 16 subnets the labels are dropped (the table has them).
 */
export function SubnetMap({ plan, selected, onSelect }: { plan: SplitPlan; selected?: number; onSelect?: (n: number) => void }) {
  const count = plan.subnetCount;
  const labelled = count <= 16;
  const showStarts = count <= 8;
  const minWidth = labelled ? count * (showStarts ? 88 : 52) : undefined;
  const first = formatIPv4(plan.base);
  const last = formatIPv4(plan.parent.broadcast);

  return (
    <div className="flex flex-col gap-2" aria-label={`Subnet map: ${count} subnets of /${plan.newPrefix}`}>
      <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-ink dark:text-bone">
        <span>{first}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-ink/40 dark:bg-bone/40" />
        <span>{last}</span>
      </div>
      <div className="overflow-x-auto pb-1" tabIndex={0} aria-label="Scrollable subnet map">
        <div style={{ minWidth }} className="flex flex-col gap-1.5">
          <div className="flex h-9 items-center justify-center rounded-md border border-ink/30 bg-ink/[0.04] font-mono text-xs text-ink dark:border-bone/30 dark:bg-bone/[0.06] dark:text-bone">
            Original network /{plan.origPrefix}: {plan.parent.totalAddresses.toLocaleString()} addresses
          </div>
          <p className="text-center font-mono text-[11px] text-ink-soft dark:text-bone-soft" aria-hidden="true">
            ↓ {plan.borrowed === 0 ? "no bits borrowed" : `borrow ${plan.borrowed} bit${plan.borrowed > 1 ? "s" : ""}: ${count} × /${plan.newPrefix}`} ↓
          </p>
          <div className="flex h-14 gap-[2px]">
            {plan.rows.map((r) => {
              const active = selected === r.number;
              const cls = cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center rounded-[3px] border border-subject-it/50 font-mono transition-all duration-300",
                r.number % 2 === 1 ? "bg-subject-it/20" : "bg-subject-it/40",
                active && "ring-2 ring-amber-500",
                onSelect && "cursor-pointer hover:border-subject-it",
              );
              const inner = labelled ? (
                <>
                  <span className="text-xs font-semibold text-ink dark:text-bone">S{r.number}</span>
                  <span className="text-[10px] text-ink-soft dark:text-bone-soft">/{r.prefix}</span>
                </>
              ) : null;
              return onSelect ? (
                <button key={r.number} type="button" onClick={() => onSelect(r.number)} className={cls} aria-label={`Subnet ${r.number}: ${formatIPv4(r.network)}/${r.prefix}`} aria-pressed={active}>
                  {inner}
                </button>
              ) : (
                <div key={r.number} className={cls} aria-hidden="true">
                  {inner}
                </div>
              );
            })}
          </div>
          {showStarts && (
            <div className="flex gap-[2px]" aria-hidden="true">
              {plan.rows.map((r) => (
                <span key={r.number} className="min-w-0 flex-1 text-center font-mono text-[9px] text-ink-soft dark:text-bone-soft">
                  {formatIPv4(r.network)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {!labelled && <p className="text-xs text-ink-soft dark:text-bone-soft">{count} subnets are too many to label here. Each segment is one /{plan.newPrefix}; use the table to read them.</p>}
    </div>
  );
}
