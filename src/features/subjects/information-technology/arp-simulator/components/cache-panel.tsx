"use client";

import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import type { ArpLab } from "../hooks/use-arp-lab";
import { nodeById, type EntryType, type NodeId } from "../model";

const TYPE_STYLE: Record<EntryType, string> = {
  dynamic: "border-sky-400/60 bg-sky-50 text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-300",
  static: "border-violet-400/60 bg-violet-50 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-300",
};
const TYPE_LABEL: Record<EntryType, string> = { dynamic: "learned", static: "static" };

/** Chips to choose whose ARP cache is shown. */
export function DevicePicker({ lab, value, onChange }: { lab: ArpLab; value: NodeId; onChange: (id: NodeId) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Choose a device to inspect">
      {lab.nodes.map((n) => (
        <button
          key={n.id}
          onClick={() => onChange(n.id)}
          aria-pressed={value === n.id}
          className={cn(
            "min-h-[36px] rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            value === n.id ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
          )}
        >
          {n.name}
          {lab.caches[n.id].length > 0 && <span className="ml-1 font-mono text-[10px] opacity-70">({lab.caches[n.id].length})</span>}
        </button>
      ))}
    </div>
  );
}

/** The ARP cache of one device: IPv4 address → MAC address, learned vs. static. Scrolls sideways inside its own box on narrow screens. */
export function CachePanel({ lab, showPicker = true, onRemove }: { lab: ArpLab; showPicker?: boolean; onRemove?: (ip: string) => void }) {
  const id = lab.inspectId;
  const node = nodeById(lab.nodes, id)!;
  const entries = lab.caches[id];
  const hasDynamic = entries.some((e) => e.type === "dynamic");

  return (
    <Panel title={`ARP cache · ${node.name}`}>
      <div className="flex flex-col gap-3">
        {showPicker && <DevicePicker lab={lab} value={id} onChange={lab.setInspectId} />}
        <div className="overflow-x-auto rounded-lg border border-line dark:border-line-dark">
          <table className="w-full min-w-[300px] text-left text-xs">
            <thead className="bg-ink/[0.04] font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:bg-bone/[0.06] dark:text-bone-soft">
              <tr>
                <th className="px-3 py-2 font-medium">IPv4 Address</th>
                <th className="px-3 py-2 font-medium">MAC Address</th>
                <th className="px-3 py-2 font-medium">Type</th>
                {onRemove && <th className="px-3 py-2 font-medium"><span className="sr-only">Remove</span></th>}
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 && (
                <tr>
                  <td colSpan={onRemove ? 4 : 3} className="px-3 py-4 text-center text-ink-soft dark:text-bone-soft">
                    Empty — {node.name} has not learned any MAC addresses yet.
                  </td>
                </tr>
              )}
              {entries.map((e) => {
                const fresh = lab.highlight?.node === id && lab.highlight.ip === e.ip;
                return (
                  <tr key={e.ip} className={cn("border-t border-line dark:border-line-dark", fresh && "bg-emerald-50 dark:bg-emerald-500/10")}>
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-ink dark:text-bone">{e.ip}</td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-ink dark:text-bone">{e.mac}</td>
                    <td className="whitespace-nowrap px-3 py-2">
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", TYPE_STYLE[e.type])}>{TYPE_LABEL[e.type]}</span>
                      {fresh && <span className="ml-2 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">just added</span>}
                    </td>
                    {onRemove && (
                      <td className="px-3 py-1 text-right">
                        <button onClick={() => onRemove(e.ip)} className="min-h-[36px] rounded-full border border-line px-3 text-[11px] text-ink hover:border-red-400 dark:border-line-dark dark:text-bone" aria-label={`Remove ${e.ip}`}>
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => lab.clearCache(id)}
            disabled={!hasDynamic}
            className="min-h-[36px] rounded-full border border-line px-3 text-xs font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone"
          >
            Clear cache
          </button>
          <span className="text-[11px] text-ink-soft dark:text-bone-soft">Removes learned entries. Static entries stay until removed by hand.</span>
        </div>
      </div>
    </Panel>
  );
}
