"use client";

import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import type { SwitchLab } from "../hooks/use-switch-lab";
import { DEVICES, formatPort } from "../model";

/** Per-port link switches: unplug a PC to see how the switch reacts. */
export function PortControls({ lab }: { lab: SwitchLab }) {
  const { state, inFlight } = lab;
  return (
    <Panel title="Port link control">
      <div className="grid grid-cols-5 gap-2">
        {DEVICES.map((d) => {
          const up = state.enabled[d.port] !== false;
          return (
            <button
              key={d.port}
              type="button"
              role="switch"
              aria-checked={up}
              aria-label={`${formatPort(d.port)} (${d.name}) link`}
              disabled={inFlight}
              onClick={() => lab.setPort(d.port, !up)}
              title={inFlight ? "Finish or cancel the current frame first" : up ? `Disable ${formatPort(d.port)} (unplug ${d.name})` : `Enable ${formatPort(d.port)} (plug ${d.name} back in)`}
              className={cn(
                "flex min-h-[48px] flex-col items-center justify-center rounded-xl border px-1 py-1.5 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                up ? "border-emerald-500/60 text-ink dark:text-bone" : "border-red-400 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
              )}
            >
              <span className="font-mono text-[11px] font-semibold">{formatPort(d.port)}</span>
              <span className="flex items-center gap-1 font-mono text-[10px]">
                <span className={cn("h-1.5 w-1.5 rounded-full", up ? "bg-emerald-500" : "bg-red-500")} aria-hidden />
                {up ? "up" : "down"}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-ink-soft dark:text-bone-soft">Tap a port to unplug or re-plug its PC. When a link goes down the switch forgets what it learned on that port and never floods frames out of it.</p>
    </Panel>
  );
}
