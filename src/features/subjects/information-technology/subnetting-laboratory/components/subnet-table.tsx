"use client";

import { cn } from "@/lib/utils";
import { formatIPv4 } from "../../ip-addressing-simulator/model";
import type { SplitPlan } from "../model";

/** Section 5: the interactive subnet table. Click a row (or its number) to inspect that subnet. */
export function SubnetTable({ plan, selected, onSelect, maxHeight = true }: { plan: SplitPlan; selected?: number; onSelect?: (n: number) => void; maxHeight?: boolean }) {
  return (
    <div className={cn("overflow-auto rounded-card border border-line dark:border-line-dark", maxHeight && "max-h-[420px]")} tabIndex={0} aria-label="Subnet table (scrolls sideways on small screens)">
      <table className="w-full min-w-[560px] text-left text-xs">
        <thead className="sticky top-0 z-10 bg-paper text-ink-soft dark:bg-chalkboard dark:text-bone-soft">
          <tr className="border-b border-line dark:border-line-dark">
            <th scope="col" className="p-2">Subnet</th>
            <th scope="col" className="p-2">Network</th>
            <th scope="col" className="p-2">First host</th>
            <th scope="col" className="p-2">Last host</th>
            <th scope="col" className="p-2">Broadcast</th>
          </tr>
        </thead>
        <tbody className="font-mono text-ink dark:text-bone">
          {plan.rows.map((r) => {
            const active = selected === r.number;
            return (
              <tr key={r.number} onClick={onSelect ? () => onSelect(r.number) : undefined} className={cn("border-t border-line dark:border-line-dark", onSelect && "cursor-pointer hover:bg-subject-it-soft/60 dark:hover:bg-subject-it/10", active && "bg-subject-it-soft font-semibold dark:bg-subject-it/20")}>
                <td className="p-2">
                  {onSelect ? (
                    <button type="button" onClick={() => onSelect(r.number)} aria-pressed={active} aria-label={`Inspect subnet ${r.number}`} className="min-h-[28px] min-w-[28px] text-left underline-offset-2 hover:underline">
                      {active ? "▶ " : ""}
                      {r.number}
                    </button>
                  ) : (
                    r.number
                  )}
                </td>
                <td className="p-2">{formatIPv4(r.network)}/{r.prefix}</td>
                <td className="p-2">{formatIPv4(r.firstHost)}</td>
                <td className="p-2">{formatIPv4(r.lastHost)}</td>
                <td className="p-2">{formatIPv4(r.broadcast)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
