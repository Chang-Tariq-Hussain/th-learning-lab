"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, Pause, Play, RotateCcw, StepForward, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DEFAULT_CONFIG,
  DEFAULT_PRIORITY,
  DEVICES,
  DEVICE_ORDER,
  ISR_DISCLAIMER,
  JOURNEY,
  MASK_DISCLAIMER,
  NESTING_DISCLAIMER,
  NMI_DISCLAIMER,
  NMI_INFO,
  PRIORITY_DISCLAIMER,
  PROGRAM,
  clearLog,
  controllerView,
  formatFlags,
  formatTime,
  hex,
  initialEngine,
  isDeferred,
  journeyIndex,
  levelAtLeast,
  pickNext,
  priorityRank,
  raiseEvent,
  sourceIcon,
  sourceLabel,
  stepEngine,
  type DeviceId,
  type EngineConfig,
  type EngineState,
  type IrqSource,
  type Level,
  type LogEntry,
} from "../model";
import { Btn, Callout, Panel, SectionHeading, SegmentedChoice, Toggle } from "./ui-bits";
import { DiagramLegend, SystemDiagram } from "./system-diagram";
import { Timeline } from "./timeline";

export interface EventLabPreset {
  config?: Partial<EngineConfig>;
  startPaused?: boolean;
}

interface LabState {
  engine: EngineState;
  config: EngineConfig;
  history: EngineState[];
}

type Action =
  | { type: "tick" }
  | { type: "raise"; sources: IrqSource[] }
  | { type: "reset" }
  | { type: "config"; patch: Partial<EngineConfig> }
  | { type: "clearLog" };

const HISTORY_LIMIT = 80;
const BASE_TICK_MS = 700;

function withHistory(state: LabState, engine: EngineState, config: EngineConfig = state.config): LabState {
  const history = [...state.history, engine];
  return { engine, config, history: history.length > HISTORY_LIMIT ? history.slice(history.length - HISTORY_LIMIT) : history };
}

function reducer(state: LabState, action: Action): LabState {
  switch (action.type) {
    case "tick":
      return withHistory(state, stepEngine(state.engine, state.config));
    case "raise": {
      let e = state.engine;
      for (const src of action.sources) e = raiseEvent(e, src);
      return withHistory(state, e);
    }
    case "clearLog":
      return withHistory(state, clearLog(state.engine));
    case "reset": {
      const e = initialEngine();
      return { engine: e, config: state.config, history: [e] };
    }
    case "config": {
      const config = { ...state.config, ...action.patch };
      let e = state.engine;
      if (action.patch.maskingOn !== undefined && action.patch.maskingOn !== state.config.maskingOn) {
        const text = action.patch.maskingOn
          ? "Interrupt masking enabled — masked devices will be deferred"
          : "Interrupt masking disabled — deferred interrupts are now eligible";
        e = { ...e, log: [...e.log, { id: (e.log[e.log.length - 1]?.id ?? -1) + 1, tick: e.tick, text, tone: "warn" as const }] };
      }
      return withHistory(state, e, config);
    }
  }
}

function initLab(preset?: EventLabPreset): LabState {
  const e = initialEngine();
  return { engine: e, config: { ...DEFAULT_CONFIG, ...preset?.config }, history: [e] };
}

const STATUS_BANNER: Record<EngineState["activity"], string> = {
  idle: "Ready — the CPU is about to run the main program.",
  main: "Main program running.",
  saving: "Interrupt received — CPU state saved.",
  identifying: "Identifying the interrupt and finding its ISR…",
  isr: "ISR executing…",
  restoring: "CPU state restored — returning to the interrupted code.",
};

export function EventLab({ level, preset }: { level: Level; preset?: EventLabPreset }) {
  const [lab, dispatch] = useReducer(reducer, preset, initLab);
  const [running, setRunning] = useState(!preset?.startPaused);
  const [speed, setSpeed] = useState<1 | 2 | 0.5>(1);
  const [viewIdx, setViewIdx] = useState<number | null>(null);
  const [selected, setSelected] = useState<DeviceId>("keyboard");

  const tickMs = Math.round(BASE_TICK_MS / speed);

  // A single interval drives the whole lab; it is cleared on pause,
  // speed change, and unmount.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => dispatch({ type: "tick" }), tickMs);
    return () => clearInterval(id);
  }, [running, tickMs]);

  const live = lab.engine;
  const shown = (viewIdx === null ? live : lab.history[Math.min(viewIdx, lab.history.length - 1)]) ?? live;
  const config = lab.config;
  const isTechnical = levelAtLeast(level, "technical");
  const isIntermediate = levelAtLeast(level, "intermediate");

  const raise = useCallback((sources: IrqSource[]) => {
    setViewIdx(null);
    dispatch({ type: "raise", sources });
  }, []);

  const pause = () => setRunning(false);
  const toggleRun = () => {
    setViewIdx(null);
    setRunning((r) => !r);
  };
  const step = () => {
    setRunning(false);
    setViewIdx(null);
    dispatch({ type: "tick" });
  };
  const reset = () => {
    setRunning(false);
    setViewIdx(null);
    dispatch({ type: "reset" });
  };

  const jIdx = journeyIndex(shown);
  const nextUp = useMemo(() => pickNext(shown.pending, config), [shown.pending, config]);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Realistic Event Lab">
        Trigger a device event and watch it travel: device → controller → interrupt request → CPU → ISR → device handling → return. Everything below updates
        together, one simulated tick at a time.
      </SectionHeading>

      {/* Transport controls */}
      <div className="flex flex-wrap items-center gap-2">
        <Btn variant="solid" onClick={toggleRun}>
          {running ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          {running ? "Pause" : "Resume"}
        </Btn>
        <Btn onClick={step}>
          <StepForward className="h-4 w-4" aria-hidden="true" /> Step
        </Btn>
        <Btn onClick={reset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
        </Btn>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-ink-soft dark:text-bone-soft">Speed</span>
          <SegmentedChoice
            label="Simulation speed"
            value={speed}
            onChange={setSpeed}
            options={[
              { id: 0.5, label: "0.5×" },
              { id: 1, label: "1×" },
              { id: 2, label: "2×" },
            ]}
          />
        </div>
      </div>

      <p
        className={cn(
          "rounded-card border px-3.5 py-2.5 font-mono text-sm",
          shown.activity === "isr"
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
            : shown.activity === "saving" || shown.activity === "identifying" || shown.activity === "restoring"
              ? "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300"
              : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
        )}
        aria-live="polite"
      >
        <span className="mr-2 text-xs opacity-70">t={shown.tick}</span>
        {STATUS_BANNER[shown.activity]}
        {shown.active && <span className="ml-2 opacity-80">({sourceLabel(shown.active.event.source)})</span>}
      </p>

      {/* Diagram + devices */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Panel title="I/O architecture (conceptual)">
          <SystemDiagram engine={shown} tickMs={tickMs} selected={selected} onSelect={setSelected} />
          <div className="mt-2">
            <DiagramLegend />
          </div>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Devices — generate an event">
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {DEVICE_ORDER.map((id) => {
                const d = DEVICES[id];
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(id);
                        raise([id]);
                      }}
                      className="flex min-h-[48px] w-full items-center gap-3 rounded-card border border-line px-3 py-2 text-left transition-colors hover:border-subject-it dark:border-line-dark"
                    >
                      <span className="text-2xl" aria-hidden="true">
                        {d.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-ink dark:text-bone">{d.eventButton}</span>
                        <span className="block text-xs text-ink-soft dark:text-bone-soft">
                          {d.label} · {d.direction === "both" ? "input & output" : d.direction}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              {isIntermediate && (
                <Btn onClick={() => raise(["keyboard", "network", "storage", "timer"])}>Burst: 4 events at once</Btn>
              )}
              {isTechnical && (
                <Btn onClick={() => raise(["nmi"])} className="border-rose-500/50 text-rose-700 dark:text-rose-300">
                  ⚠ Critical Event (NMI)
                </Btn>
              )}
            </div>
          </Panel>

          <ControllerInspector engine={shown} device={selected} technical={isTechnical} />
        </div>
      </div>

      {/* Event journey */}
      <Panel title="Event journey">
        <ol className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-8">
          {JOURNEY.map((j, i) => (
            <li
              key={j.id}
              className={cn(
                "rounded-md border px-2 py-1.5 text-center text-xs leading-tight transition-colors sm:text-[13px]",
                i === jIdx
                  ? "border-subject-it bg-subject-it-soft font-medium text-subject-it dark:bg-subject-it/20"
                  : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
              )}
              aria-current={i === jIdx ? "step" : undefined}
            >
              <span className="block font-mono text-[10px] opacity-60">{i + 1}</span>
              {j.label}
            </li>
          ))}
        </ol>
        <p className="mt-2 min-h-[2.25rem] text-sm text-ink-soft dark:text-bone-soft">
          {jIdx >= 0 ? JOURNEY[jIdx]?.detail : "Nothing is in flight. Generate an event above to follow one through the system."}
        </p>
        <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">{ISR_DISCLAIMER}</p>
      </Panel>

      {/* Timeline + scrub */}
      <Panel title="Interrupt timeline">
        <Timeline engine={shown} />
        <div className="mt-3 flex flex-col gap-1.5">
          <label htmlFor="io-scrub" className="text-xs text-ink-soft dark:text-bone-soft">
            Rewind and inspect ({lab.history.length} recent states)
            {viewIdx !== null && <span className="ml-2 font-medium text-subject-it">Viewing tick {shown.tick} — not live</span>}
          </label>
          <input
            id="io-scrub"
            type="range"
            min={0}
            max={lab.history.length - 1}
            value={viewIdx ?? lab.history.length - 1}
            onChange={(e) => {
              const v = Number(e.target.value);
              pause();
              setViewIdx(v >= lab.history.length - 1 ? null : v);
            }}
            className="w-full accent-[#B45309]"
          />
          {viewIdx !== null && (
            <div>
              <Btn onClick={() => setViewIdx(null)}>Return to live</Btn>
            </div>
          )}
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <QueuePanel engine={shown} config={config} nextUpId={nextUp?.id} technical={isTechnical} />
        {isIntermediate ? <CpuStatePanel engine={shown} /> : <BeginnerCpuNote />}
      </div>

      {isIntermediate && (
        <PriorityPanel
          config={config}
          onChange={(patch) => dispatch({ type: "config", patch })}
          technical={isTechnical}
        />
      )}
      {isTechnical && <MaskingPanel config={config} onChange={(patch) => dispatch({ type: "config", patch })} />}

      <EventLog
        entries={shown.log}
        running={running}
        onToggleRun={toggleRun}
        onClear={() => dispatch({ type: "clearLog" })}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Controller inspector
// ---------------------------------------------------------------------------

function ControllerInspector({ engine, device, technical }: { engine: EngineState; device: DeviceId; technical: boolean }) {
  const d = DEVICES[device];
  const v = controllerView(engine, device);
  const statusLabel = v.status === "idle" ? "Idle" : v.status === "data-ready" ? "Data ready" : "Being serviced by ISR";
  const statusCode = v.status === "idle" ? 0x00 : v.status === "data-ready" ? 0x01 : 0x02;
  return (
    <Panel title={`${d.controller} (inspect)`}>
      <p className="mb-2 text-xs text-ink-soft dark:text-bone-soft">
        Software normally talks to a device through its controller — not the physical device directly. Tap another controller in the diagram to inspect it.
      </p>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-md border border-line p-2 dark:border-line-dark">
          <dt className="text-xs text-ink-soft dark:text-bone-soft">Device status</dt>
          <dd className="font-medium text-ink dark:text-bone">{statusLabel}</dd>
        </div>
        <div className="rounded-md border border-line p-2 dark:border-line-dark">
          <dt className="text-xs text-ink-soft dark:text-bone-soft">Interrupt request</dt>
          <dd className={cn("font-medium", v.irqLine ? "text-amber-700 dark:text-amber-300" : "text-ink dark:text-bone")}>{v.irqLine ? "Asserted (1)" : "Clear (0)"}</dd>
        </div>
        <div className="rounded-md border border-line p-2 dark:border-line-dark">
          <dt className="text-xs text-ink-soft dark:text-bone-soft">Data buffer</dt>
          <dd className="font-mono text-ink dark:text-bone">{v.buffer ?? "empty"}</dd>
        </div>
        <div className="rounded-md border border-line p-2 dark:border-line-dark">
          <dt className="text-xs text-ink-soft dark:text-bone-soft">Control information</dt>
          <dd className="text-ink dark:text-bone">{v.control}</dd>
        </div>
      </dl>
      {technical && (
        <div className="mt-3 rounded-md border border-line p-2 font-mono text-xs text-ink-soft dark:border-line-dark dark:text-bone-soft">
          <p className="mb-1 font-sans text-[11px] uppercase tracking-wide">Simulated controller registers</p>
          <p>
            {d.registers.data} = {v.buffer ?? "(empty)"}
          </p>
          <p>
            {d.registers.status} = {hex(statusCode, 2)}
          </p>
          <p>
            {d.registers.control} = IRQ_ENABLE:1 · IRQ_PENDING:{v.irqLine ? 1 : 0}
          </p>
        </div>
      )}
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Queue
// ---------------------------------------------------------------------------

function QueuePanel({ engine, config, nextUpId, technical }: { engine: EngineState; config: EngineConfig; nextUpId?: number; technical: boolean }) {
  const completed = engine.completed.slice(-5).reverse();
  return (
    <Panel title="Interrupt queue">
      <div className="flex flex-col gap-3 text-sm">
        <div>
          <p className="text-xs text-ink-soft dark:text-bone-soft">Current handler</p>
          {engine.active ? (
            <p className="font-medium text-ink dark:text-bone">
              <span aria-hidden="true">{sourceIcon(engine.active.event.source)} </span>
              {sourceLabel(engine.active.event.source)} — {engine.active.event.data}
            </p>
          ) : (
            <p className="text-ink-soft dark:text-bone-soft">None — CPU is running the main program</p>
          )}
          {technical && engine.stack.length > 0 && (
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
              Nested: {engine.stack.map((h) => sourceLabel(h.event.source)).join(" → ")} interrupted (stack depth {engine.stack.length + 1})
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-ink-soft dark:text-bone-soft">In transit to the CPU ({engine.inFlight.length})</p>
          {engine.inFlight.length === 0 ? (
            <p className="text-ink-soft dark:text-bone-soft">—</p>
          ) : (
            <p className="text-ink dark:text-bone">{engine.inFlight.map((f) => `${sourceIcon(f.event.source)} ${sourceLabel(f.event.source)}`).join(" · ")}</p>
          )}
        </div>

        <div>
          <p className="text-xs text-ink-soft dark:text-bone-soft">Pending interrupts ({engine.pending.length})</p>
          {engine.pending.length === 0 ? (
            <p className="text-ink-soft dark:text-bone-soft">None waiting</p>
          ) : (
            <ol className="mt-1 flex flex-col gap-1">
              {engine.pending.map((e, i) => {
                const deferred = isDeferred(e.source, config);
                const rank = priorityRank(e.source, config);
                return (
                  <li key={e.id} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-md border border-line px-2.5 py-1.5 dark:border-line-dark">
                    <span className="font-mono text-xs text-ink-soft dark:text-bone-soft">#{i + 1} arrived</span>
                    <span className="font-medium text-ink dark:text-bone">
                      <span aria-hidden="true">{sourceIcon(e.source)} </span>
                      {sourceLabel(e.source)}
                    </span>
                    <span className="text-xs text-ink-soft dark:text-bone-soft">
                      {config.policy === "priority" ? (e.source === "nmi" ? "priority: highest (NMI)" : `priority ${rank + 1} of ${config.priority.length}`) : "first come, first served"}
                    </span>
                    {deferred && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-800 dark:text-amber-300">Masked / deferred</span>}
                    {!deferred && e.id === nextUpId && <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-800 dark:text-emerald-300">Next</span>}
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div>
          <p className="text-xs text-ink-soft dark:text-bone-soft">Completed (latest first)</p>
          {completed.length === 0 ? (
            <p className="text-ink-soft dark:text-bone-soft">—</p>
          ) : (
            <ul className="flex flex-col gap-0.5 text-ink dark:text-bone">
              {completed.map((c) => (
                <li key={c.event.id}>
                  <span aria-hidden="true">{sourceIcon(c.event.source)} </span>
                  {sourceLabel(c.event.source)} <span className="text-xs text-ink-soft dark:text-bone-soft">(t={c.startedAt}–{c.finishedAt})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-xs text-ink-soft dark:text-bone-soft">
          CPU time so far — main program: {engine.mainTicks} ticks · interrupt overhead: {engine.overheadTicks} ticks · ISR work: {engine.isrTicks} ticks
        </p>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// CPU state
// ---------------------------------------------------------------------------

function BeginnerCpuNote() {
  return (
    <Panel title="Why the CPU saves its place">
      <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        When an interrupt arrives, the CPU is in the middle of some other program. Before running the ISR, it saves where it was, so that afterwards it can
        pick up exactly where it left off. Switch to the Intermediate level to inspect the saved CPU state.
      </p>
    </Panel>
  );
}

function CpuStatePanel({ engine }: { engine: EngineState }) {
  const inIsr = engine.active !== null && engine.active.phase !== "identify" && engine.activity !== "restoring" && engine.activity !== "saving";
  const listing: { addr: number; text: string }[] = inIsr && engine.active
    ? (engine.active.event.source === "nmi" ? NMI_INFO.isrCode : DEVICES[engine.active.event.source].isrCode).map((text, i) => ({
        addr: (engine.active!.event.source === "nmi" ? NMI_INFO.isrAddress : DEVICES[engine.active!.event.source as DeviceId].isrAddress) + i,
        text,
      }))
    : PROGRAM;
  const frames = engine.active ? [...engine.stack, engine.active] : [];
  const listingTitle = inIsr && engine.active ? `${sourceLabel(engine.active.event.source)} ISR @ ${hex(listing[0]?.addr ?? 0)}` : "Main program";
  const bannerText =
    engine.activity === "saving"
      ? "CPU State Saved"
      : engine.activity === "isr"
        ? "ISR executing…"
        : engine.activity === "restoring"
          ? "CPU State Restored"
          : null;

  return (
    <Panel title="CPU state (simplified)">
      <div className="flex flex-col gap-3 text-sm">
        {bannerText && <p className="rounded-md bg-amber-500/10 px-2.5 py-1.5 font-mono text-xs text-amber-800 dark:text-amber-300">{bannerText}</p>}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-ink-soft dark:text-bone-soft">PC (next)</dt>
            <dd className="text-ink dark:text-bone">{engine.cpu.pc}</dd>
          </div>
          <div className="col-span-1 sm:col-span-2">
            <dt className="text-xs text-ink-soft dark:text-bone-soft">IR (last executed)</dt>
            <dd className="text-ink dark:text-bone">{engine.cpu.ir}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-soft dark:text-bone-soft">R1</dt>
            <dd className="text-ink dark:text-bone">{engine.cpu.r1}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-soft dark:text-bone-soft">R2</dt>
            <dd className="text-ink dark:text-bone">{engine.cpu.r2}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-soft dark:text-bone-soft">Flags</dt>
            <dd className="text-ink dark:text-bone">{formatFlags(engine.cpu)}</dd>
          </div>
        </dl>

        <div>
          <p className="mb-1 text-xs text-ink-soft dark:text-bone-soft">{listingTitle}</p>
          <ol className="rounded-md border border-line font-mono text-xs dark:border-line-dark">
            {listing.map((l) => (
              <li
                key={l.addr}
                className={cn(
                  "flex gap-3 px-2.5 py-1",
                  l.addr === engine.cpu.pc ? "bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "text-ink-soft dark:text-bone-soft",
                )}
              >
                <span className="w-16 shrink-0">{l.addr >= 0x8000 ? hex(l.addr) : l.addr}</span>
                <span>{l.text}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <p className="mb-1 text-xs text-ink-soft dark:text-bone-soft">Saved state ({frames.length === 0 ? "nothing saved" : "return information"})</p>
          {frames.length === 0 ? (
            <p className="text-xs text-ink-soft dark:text-bone-soft">
              No interrupt is being handled, so nothing needs saving. Trigger an event and watch a snapshot appear here.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {frames.map((f, i) => (
                <li key={`${f.event.id}-${i}`} className="rounded-md border border-dashed border-amber-500/50 px-2.5 py-1.5 font-mono text-xs text-ink dark:text-bone">
                  <span className="text-amber-800 dark:text-amber-300">Saved on {sourceLabel(f.event.source)} entry:</span> PC={f.saved.pc} · R1={f.saved.r1} · R2={f.saved.r2} · {formatFlags(f.saved)}
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-xs text-ink-soft dark:text-bone-soft">
          Notice how the ISR overwrites R1 and R2 — restoring the saved copy is what makes the interruption invisible to the main program. To see how the
          CPU executes each instruction, visit{" "}
          <Link href="/dashboard/information-technology/cpu-architecture-instruction-cycle" className="text-subject-it underline underline-offset-2">
            CPU Architecture &amp; Instruction Cycle
          </Link>
          .
        </p>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Priority, masking, nesting
// ---------------------------------------------------------------------------

function PriorityPanel({ config, onChange, technical }: { config: EngineConfig; onChange: (patch: Partial<EngineConfig>) => void; technical: boolean }) {
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...config.priority];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    const a = next[idx] as DeviceId;
    next[idx] = next[j] as DeviceId;
    next[j] = a;
    onChange({ priority: next });
  };
  return (
    <Panel title="Interrupt priority">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <SegmentedChoice
            label="Handling order"
            value={config.policy}
            onChange={(policy) => onChange({ policy })}
            options={[
              { id: "priority", label: "By priority" },
              { id: "fifo", label: "First come, first served" },
            ]}
          />
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            {config.policy === "priority"
              ? "When several interrupts are pending, the highest-priority one is handled first — even if it arrived last. Use the arrows to change the order, then press “Burst”."
              : "Interrupts are handled strictly in arrival order, ignoring device priority. Compare this with priority order using the Burst button."}
          </p>
          <Callout tone="note">{PRIORITY_DISCLAIMER}</Callout>
        </div>
        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">High priority ↑</p>
          <ol className="flex flex-col gap-1.5">
            {technical && (
              <li className="flex items-center gap-2 rounded-md border border-rose-500/40 bg-rose-500/5 px-2.5 py-1.5 text-sm text-ink dark:text-bone">
                <span className="w-5 font-mono text-xs text-ink-soft dark:text-bone-soft">★</span>
                <span aria-hidden="true">{NMI_INFO.icon}</span> Critical Event (NMI) — always highest
              </li>
            )}
            {config.priority.map((id, i) => (
              <li key={id} className="flex items-center gap-2 rounded-md border border-line px-2.5 py-1.5 text-sm dark:border-line-dark">
                <span className="w-5 font-mono text-xs text-ink-soft dark:text-bone-soft">{i + 1}</span>
                <span aria-hidden="true">{DEVICES[id].icon}</span>
                <span className="flex-1 text-ink dark:text-bone">{DEVICES[id].label}</span>
                <button
                  type="button"
                  aria-label={`Raise ${DEVICES[id].label} priority`}
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-line disabled:opacity-30 dark:border-line-dark"
                >
                  <ArrowUp className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={`Lower ${DEVICES[id].label} priority`}
                  disabled={i === config.priority.length - 1}
                  onClick={() => move(i, 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-line disabled:opacity-30 dark:border-line-dark"
                >
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
          <p className="mt-1 text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Low priority ↓</p>
          <div className="mt-2">
            <Btn onClick={() => onChange({ priority: DEFAULT_PRIORITY })}>Reset order</Btn>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function MaskingPanel({ config, onChange }: { config: EngineConfig; onChange: (patch: Partial<EngineConfig>) => void }) {
  const toggleMasked = (id: DeviceId, on: boolean) => {
    onChange({ masked: on ? [...config.masked, id] : config.masked.filter((m) => m !== id) });
  };
  return (
    <Panel title="Masking, NMI, and nesting (Technical)">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-ink dark:text-bone">Interrupt masking</p>
          <SegmentedChoice
            label="Interrupt masking"
            value={config.maskingOn ? "on" : "off"}
            onChange={(v) => onChange({ maskingOn: v === "on" })}
            options={[
              { id: "on", label: "Masking ON" },
              { id: "off", label: "Masking OFF" },
            ]}
          />
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            {config.maskingOn
              ? "ON: interrupts from the checked (masked) devices are deferred — they wait in the pending list instead of being handled."
              : "OFF: every interrupt is eligible — the CPU handles whichever is next."}
          </p>
          <fieldset>
            <legend className="mb-1 text-xs text-ink-soft dark:text-bone-soft">Devices to mask when masking is ON</legend>
            <div className="flex flex-wrap gap-2">
              {DEVICE_ORDER.map((id) => (
                <label key={id} className="flex min-h-[40px] cursor-pointer items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm dark:border-line-dark">
                  <input
                    type="checkbox"
                    className="accent-[#B45309]"
                    checked={config.masked.includes(id)}
                    onChange={(e) => toggleMasked(id, e.target.checked)}
                  />
                  <span aria-hidden="true">{DEVICES[id].icon}</span> {DEVICES[id].label}
                </label>
              ))}
            </div>
          </fieldset>
          <Callout tone="note">{MASK_DISCLAIMER}</Callout>
        </div>
        <div className="flex flex-col gap-3">
          <Toggle
            checked={config.nesting}
            onChange={(nesting) => onChange({ nesting, policy: nesting ? "priority" : config.policy })}
            label="Advanced: allow interrupt nesting"
            hint="A higher-priority interrupt may interrupt a lower-priority ISR that is already running. Without nesting, the ISR runs to completion first."
          />
          <Callout tone="note">{NESTING_DISCLAIMER}</Callout>
          <div className="rounded-card border border-rose-500/30 bg-rose-500/5 p-3 text-sm text-ink-soft dark:text-bone-soft">
            <p className="font-medium text-ink dark:text-bone">⚠ Non-maskable interrupt (NMI)</p>
            <p className="mt-1">
              Try this: turn masking ON, then raise a Critical Event. Ordinary interrupts from masked devices are deferred, but the NMI still gets through —
              even while an ISR is running.
            </p>
            <p className="mt-1 text-xs">{NMI_DISCLAIMER}</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Event log
// ---------------------------------------------------------------------------

const TONE_CLASS: Record<LogEntry["tone"], string> = {
  event: "text-sky-700 dark:text-sky-300",
  isr: "text-emerald-700 dark:text-emerald-300",
  info: "text-ink-soft dark:text-bone-soft",
  warn: "text-amber-700 dark:text-amber-300",
};

function EventLog({ entries, running, onToggleRun, onClear }: { entries: LogEntry[]; running: boolean; onToggleRun: () => void; onClear: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const count = entries.length;
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [count]);

  return (
    <Panel
      title="Event log (simulated timestamps)"
      action={
        <div className="flex gap-2">
          <Btn onClick={onToggleRun} className="min-h-[36px] px-3 py-1 text-xs">
            {running ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
            {running ? "Pause" : "Resume"}
          </Btn>
          <Btn onClick={onClear} className="min-h-[36px] px-3 py-1 text-xs">
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Clear
          </Btn>
        </div>
      }
    >
      <div ref={ref} className="max-h-64 overflow-y-auto rounded-md border border-line bg-paper p-2 font-mono text-xs dark:border-line-dark dark:bg-chalkboard" role="log" aria-live="off" tabIndex={0} aria-label="Event log">
        {entries.length === 0 ? (
          <p className="text-ink-soft dark:text-bone-soft">Log cleared.</p>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {entries.map((e) => (
              <li key={e.id} className="flex gap-2">
                <span className="shrink-0 text-ink-soft dark:text-bone-soft">{formatTime(e.tick)}</span>
                <span className={TONE_CLASS[e.tone]}>{e.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
}
