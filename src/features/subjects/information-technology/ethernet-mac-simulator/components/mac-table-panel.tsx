"use client";

import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import { deviceByMac, type LabDevice, type MacTable } from "../model";

/**
 * The switch's MAC address table. Scrolls horizontally inside its own box on
 * narrow screens so the page itself never overflows.
 */
export function MacTablePanel({
  table,
  devices,
  highlightMac,
  onClear,
  onFill,
  showDeviceColumn = true,
  title = "Switch MAC address table",
}: {
  table: MacTable;
  devices: LabDevice[];
  highlightMac?: string | null;
  onClear?: () => void;
  onFill?: () => void;
  showDeviceColumn?: boolean;
  title?: string;
}) {
  const sorted = [...table].sort((a, b) => a.port - b.port);
  return (
    <Panel title={title}>
      {(onClear || onFill) && (
        <div className="mb-2 flex flex-wrap gap-2">
          {onClear && (
            <button onClick={onClear} disabled={table.length === 0} className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone">
              Clear table
            </button>
          )}
          {onFill && (
            <button onClick={onFill} className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone">
              Pre-fill with all devices
            </button>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[300px] text-left text-xs">
          <thead>
            <tr className="border-b border-line font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:border-line-dark dark:text-bone-soft">
              <th className="py-1.5 pr-3 font-medium">MAC address</th>
              <th className="py-1.5 pr-3 font-medium">Port</th>
              {showDeviceColumn && <th className="py-1.5 font-medium">Device</th>}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={showDeviceColumn ? 3 : 2} className="py-3 text-ink-soft dark:text-bone-soft">
                  [Empty] — the switch has not learned any addresses yet.
                </td>
              </tr>
            )}
            {sorted.map((e) => {
              const dev = deviceByMac(devices, e.mac);
              return (
                <tr key={e.mac} className={cn("border-b border-line/60 dark:border-line-dark/60", highlightMac === e.mac && "bg-emerald-50 dark:bg-emerald-500/10")}>
                  <td className="whitespace-nowrap py-1.5 pr-3 font-mono text-ink dark:text-bone">{e.mac}</td>
                  <td className="whitespace-nowrap py-1.5 pr-3 font-mono text-ink dark:text-bone">Port {e.port}</td>
                  {showDeviceColumn && <td className="whitespace-nowrap py-1.5 text-ink-soft dark:text-bone-soft">{dev ? dev.name : "(no device has this MAC now)"}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
