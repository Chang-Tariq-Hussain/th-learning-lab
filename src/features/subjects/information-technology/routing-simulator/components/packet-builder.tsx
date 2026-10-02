"use client";

import { Pause, Play, RotateCcw, Send, SkipForward, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import type { RoutingLab } from "../hooks/use-routing-lab";
import { PHASES, SCENARIOS, SCENARIO_IDS, hostById, validateDestination, type ScenarioId } from "../model";
import { BTN, BTN_PLAIN, BTN_PRIMARY, Chip, FIELD, LABEL } from "./ui";

export const CUSTOM = "custom";

export interface PacketBuilderProps {
  lab: RoutingLab;
  src: string;
  dst: string;
  custom: string;
  onSrc: (id: string) => void;
  onDst: (id: string) => void;
  onCustom: (text: string) => void;
  onScenario: (id: ScenarioId) => void;
  onReset: () => void;
}

/** Resolve the destination IP the builder currently describes, or an error to show. */
export function resolveDestination(lab: RoutingLab, src: string, dst: string, custom: string): { ok: true; ip: string } | { ok: false; error: string } {
  const sc = SCENARIOS[lab.state.scenarioId];
  const srcHost = hostById(sc, src);
  if (dst === CUSTOM) return validateDestination(srcHost, custom);
  const h = sc.hosts.find((x) => x.id === dst);
  return h ? { ok: true, ip: h.ip } : { ok: false, error: "Pick a destination." };
}

export function PacketBuilder({ lab, src, dst, custom, onSrc, onDst, onCustom, onScenario, onReset }: PacketBuilderProps) {
  const { state, inFlight } = lab;
  const sc = SCENARIOS[state.scenarioId];
  const srcHost = hostById(sc, src);
  const target = resolveDestination(lab, src, dst, custom);
  const stepName = inFlight && lab.step ? PHASES[Math.min(lab.step.phase, PHASES.length - 1)]?.label : undefined;
  const customError = dst === CUSTOM && custom.trim() !== "" && !target.ok ? target.error : null;

  return (
    <Panel title="Build and send a packet">
      <div className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="routing-scenario" className={LABEL}>
              Scenario
            </label>
            <select id="routing-scenario" value={state.scenarioId} disabled={inFlight} onChange={(e) => onScenario(e.target.value as ScenarioId)} className={cn(FIELD, "font-sans")}>
              {SCENARIO_IDS.map((id) => (
                <option key={id} value={id}>
                  {SCENARIOS[id].title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className={LABEL}>Playback</p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Playback mode">
              {(["auto", "step"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={state.mode === m}
                  onClick={() => lab.setMode(m)}
                  className={cn("min-h-[44px] rounded-full border px-4 py-1.5 text-xs font-medium transition-colors", state.mode === m ? "border-subject-it bg-subject-it text-paper" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30")}
                >
                  {m === "auto" ? "Auto Run" : "Step Mode"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{sc.blurb}</p>

        <div>
          <p className={LABEL}>From (source device)</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="Source device">
            {sc.hosts.map((h) => (
              <Chip key={h.id} selected={src === h.id} disabled={inFlight} onClick={() => onSrc(h.id)}>
                <span className="font-mono text-sm font-semibold">{h.name}</span>
                <span className="font-mono text-[10px] font-normal text-ink-soft dark:text-bone-soft">{h.ip}</span>
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className={LABEL}>To (destination)</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="Destination">
            {sc.hosts
              .filter((h) => h.id !== src)
              .map((h) => (
                <Chip key={h.id} selected={dst === h.id} disabled={inFlight} onClick={() => onDst(h.id)}>
                  <span className="font-mono text-sm font-semibold">{h.name}</span>
                  <span className="font-mono text-[10px] font-normal text-ink-soft dark:text-bone-soft">{h.ip}</span>
                </Chip>
              ))}
            <Chip selected={dst === CUSTOM} disabled={inFlight} onClick={() => onDst(CUSTOM)} title="Type any IPv4 address">
              <span className="font-mono text-sm font-semibold">Other IP…</span>
              <span className="font-mono text-[10px] font-normal text-ink-soft dark:text-bone-soft">type an address</span>
            </Chip>
          </div>
          {dst === CUSTOM && (
            <div className="mt-2">
              <label htmlFor="routing-custom-ip" className={LABEL}>
                Destination IP address
              </label>
              <input
                id="routing-custom-ip"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                value={custom}
                disabled={inFlight}
                onChange={(e) => onCustom(e.target.value)}
                placeholder={sc.id === "single" ? "e.g. 192.168.2.99" : "e.g. 192.168.1.50"}
                aria-invalid={customError ? true : undefined}
                aria-describedby={customError ? "routing-custom-error" : undefined}
                className={FIELD}
              />
              {customError && (
                <p id="routing-custom-error" role="alert" className="mt-1 text-xs text-red-700 dark:text-red-300">
                  {customError}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-line bg-ink/[0.03] px-3 py-2 text-xs dark:border-line-dark dark:bg-bone/[0.05]">
          <p className="break-all font-mono text-ink dark:text-bone">
            {srcHost.ip} <span aria-hidden>→</span> <span className="sr-only">to</span> {target.ok ? target.ip : "…"}
          </p>
          <p className="mt-0.5 text-ink-soft dark:text-bone-soft">Routers decide where to send a packet from its destination IP address.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className={cn(BTN, BTN_PRIMARY)} disabled={inFlight || !target.ok} onClick={() => target.ok && lab.send(src, target.ip)}>
            <Send className="h-4 w-4" strokeWidth={1.75} /> Send packet
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
            <SkipForward className="h-4 w-4" strokeWidth={1.75} /> Next step
          </button>
          <button type="button" className={cn(BTN, BTN_PLAIN)} disabled={!inFlight} onClick={lab.cancel}>
            <X className="h-4 w-4" strokeWidth={1.75} /> Cancel
          </button>
          <button type="button" className={cn(BTN, BTN_PLAIN)} onClick={onReset} title="Restore this scenario's routes and clear the log">
            <RotateCcw className="h-4 w-4" strokeWidth={1.75} /> Reset
          </button>
        </div>
        {state.mode === "step" && inFlight && stepName && <p className="text-xs text-ink-soft dark:text-bone-soft">Now showing: {stepName}. Press Next step to continue.</p>}
      </div>
    </Panel>
  );
}
