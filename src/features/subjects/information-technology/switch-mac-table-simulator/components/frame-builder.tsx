"use client";

import { Pause, Play, RotateCcw, Send, SkipForward, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import type { SwitchLab } from "../hooks/use-switch-lab";
import { DEVICES, STAGES, UNKNOWN_MAC, BROADCAST_MAC, deviceById, dstMacFor, formatPort, lookupMac, type DeviceId, type DstChoice } from "../model";

const BTN = "inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";
const BTN_PRIMARY = "border-subject-it bg-subject-it text-paper hover:opacity-90";
const BTN_PLAIN = "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40";

function Chip({ selected, disabled, onClick, children, title }: { selected: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      title={title}
      className={cn(
        "flex min-h-[44px] flex-col items-start justify-center rounded-xl border px-3 py-1.5 text-left text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        selected ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40",
      )}
    >
      {children}
    </button>
  );
}

export function FrameBuilder({ lab, src, dst, onSrc, onDst }: { lab: SwitchLab; src: DeviceId; dst: DstChoice; onSrc: (id: DeviceId) => void; onDst: (d: DstChoice) => void }) {
  const { state, inFlight } = lab;
  const srcDev = deviceById(src);
  const srcUp = state.enabled[srcDev.port] !== false;
  const dstMac = dstMacFor(dst);
  const stage = state.tx?.stage ?? 0;
  const nextLabel = inFlight ? STAGES[stage]?.label : undefined; // STAGES is 0-based; `stage` is the current 1-based stage = index of the next one

  const known = dst === "broadcast" ? undefined : lookupMac(state.table, dstMac);
  const readout =
    dst === "broadcast"
      ? "Broadcast: the switch never looks this up — it floods it."
      : known
        ? `The switch already knows this MAC (${formatPort(known.port)}) → expect forward to one port.`
        : "The switch has not learned this MAC → expect a flood.";

  return (
    <Panel title="Build and send a frame">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Playback mode">
            {(["auto", "step"] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={state.mode === m}
                onClick={() => lab.setMode(m)}
                className={cn("min-h-[40px] rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors", state.mode === m ? "border-subject-it bg-subject-it text-paper" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30")}
              >
                {m === "auto" ? "Auto Run" : "Step Mode"}
              </button>
            ))}
          </div>
          <p className="text-xs text-ink-soft dark:text-bone-soft">{state.mode === "auto" ? "The whole sequence plays by itself — pause any time." : "You advance one stage at a time with “Next step”."}</p>
        </div>

        <div>
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">From (source)</p>
          <div className="grid grid-cols-5 gap-2" role="group" aria-label="Source device">
            {DEVICES.map((d) => (
              <Chip key={d.id} selected={src === d.id} disabled={inFlight} onClick={() => onSrc(d.id)} title={state.enabled[d.port] === false ? `${d.name}'s link is down` : undefined}>
                <span className="font-mono text-sm font-semibold">{d.name}</span>
                <span className={cn("font-mono text-[10px] font-normal", state.enabled[d.port] === false ? "text-red-600 dark:text-red-300" : "text-ink-soft dark:text-bone-soft")}>{state.enabled[d.port] === false ? "link down" : formatPort(d.port)}</span>
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">To (destination MAC)</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" role="group" aria-label="Destination">
            {DEVICES.filter((d) => d.id !== src).map((d) => {
              const hit = lookupMac(state.table, d.mac);
              return (
                <Chip key={d.id} selected={dst === d.id} disabled={inFlight} onClick={() => onDst(d.id)}>
                  <span className="font-mono text-sm font-semibold">{d.name}</span>
                  <span className={cn("flex items-center gap-1 font-mono text-[10px] font-normal", hit ? "text-emerald-700 dark:text-emerald-300" : "text-ink-soft dark:text-bone-soft")}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", hit ? "bg-emerald-500" : "bg-ink/30 dark:bg-bone/30")} aria-hidden />
                    {hit ? `known · ${formatPort(hit.port)}` : "not learned"}
                  </span>
                </Chip>
              );
            })}
            <Chip selected={dst === "unknown"} disabled={inFlight} onClick={() => onDst("unknown")} title={`${UNKNOWN_MAC}: no device on this LAN has it`}>
              <span className="font-mono text-sm font-semibold">Unknown MAC</span>
              <span className="font-mono text-[10px] font-normal text-ink-soft dark:text-bone-soft">…:99</span>
            </Chip>
            <Chip selected={dst === "broadcast"} disabled={inFlight} onClick={() => onDst("broadcast")} title={BROADCAST_MAC}>
              <span className="font-mono text-sm font-semibold">Broadcast</span>
              <span className="font-mono text-[10px] font-normal text-ink-soft dark:text-bone-soft">FF:FF:…</span>
            </Chip>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-ink/[0.03] px-3 py-2 text-xs dark:border-line-dark dark:bg-bone/[0.05]">
          <p className="break-all font-mono text-ink dark:text-bone">
            {srcDev.mac} <span aria-hidden>→</span> <span className="sr-only">to</span> {dstMac}
          </p>
          <p className="mt-0.5 text-ink-soft dark:text-bone-soft">{srcUp ? readout : `${srcDev.name}'s link is down — it can't send. Re-enable ${formatPort(srcDev.port)} below, or pick another sender.`}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className={cn(BTN, BTN_PRIMARY)} disabled={inFlight || !srcUp} onClick={() => lab.send(src, dst)}>
            <Send className="h-4 w-4" strokeWidth={1.75} /> Send frame
          </button>
          {state.mode === "auto" && (
            <button type="button" className={cn(BTN, BTN_PLAIN)} disabled={!inFlight} onClick={state.playing ? lab.pause : lab.play}>
              {state.playing ? (
                <>
                  <Pause className="h-4 w-4" strokeWidth={1.75} /> Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" strokeWidth={1.75} /> Play
                </>
              )}
            </button>
          )}
          <button type="button" className={cn(BTN, BTN_PLAIN)} disabled={!inFlight || state.playing} onClick={lab.next}>
            <SkipForward className="h-4 w-4" strokeWidth={1.75} /> {nextLabel ? `Next: ${nextLabel}` : "Next step"}
          </button>
          <button type="button" className={cn(BTN, BTN_PLAIN)} disabled={!inFlight} onClick={lab.cancel}>
            <X className="h-4 w-4" strokeWidth={1.75} /> Cancel frame
          </button>
          <button type="button" className={cn(BTN, BTN_PLAIN)} onClick={lab.reset} title="Empty the MAC table, bring every port up, clear the log">
            <RotateCcw className="h-4 w-4" strokeWidth={1.75} /> Reset lab
          </button>
        </div>
      </div>
    </Panel>
  );
}
