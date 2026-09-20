"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BYTES_PER_WORD,
  DEFAULT_SCENARIO,
  DEVICE_SPEEDS,
  DMA_DISCLAIMER,
  POLLING_NOTE,
  TRANSFER_METHODS,
  TRANSFER_SIZES,
  computeTransfer,
  levelAtLeast,
  runScenario,
  type IoMethod,
  type Level,
  type ScenarioKind,
  type TransferMethod,
} from "../model";
import { Btn, Callout, Panel, SectionHeading, SegmentedChoice, Stat } from "./ui-bits";

export interface PollingLabPreset {
  method?: IoMethod;
  pollEvery?: 1 | 2 | 4;
}

const CELL_CLASS: Record<ScenarioKind, string> = {
  work: "bg-sky-500/60",
  "check-no": "bg-amber-500/70",
  "check-yes": "bg-rose-500/70",
  handle: "bg-emerald-500/70",
  overhead: "bg-amber-500/70",
};
const CELL_LABEL: Record<ScenarioKind, string> = {
  work: "Useful work",
  "check-no": "Check: not ready",
  "check-yes": "Check: ready!",
  handle: "Handling device",
  overhead: "Interrupt overhead",
};

export function PollingLab({ level, preset }: { level: Level; preset?: PollingLabPreset }) {
  const [method, setMethod] = useState<IoMethod>(preset?.method ?? "polling");
  const [pollEvery, setPollEvery] = useState<1 | 2 | 4>(preset?.pollEvery ?? DEFAULT_SCENARIO.pollEvery);
  const [readyAt, setReadyAt] = useState(DEFAULT_SCENARIO.readyAt);
  const [pos, setPos] = useState(0);
  const [running, setRunning] = useState(false);

  const params = useMemo(() => ({ ...DEFAULT_SCENARIO, readyAt, pollEvery }), [readyAt, pollEvery]);
  const result = useMemo(() => runScenario(method, params), [method, params]);
  const both = useMemo(
    () => ({ polling: runScenario("polling", params), interrupt: runScenario("interrupt", params) }),
    [params],
  );
  const total = params.totalTicks;

  useEffect(() => {
    if (!running) return;
    if (pos >= total) {
      setRunning(false);
      return;
    }
    const id = setTimeout(() => setPos((p) => Math.min(p + 1, total)), 380);
    return () => clearTimeout(id);
  }, [running, pos, total]);

  // Any change to the scenario restarts the run.
  const restart = () => {
    setRunning(false);
    setPos(0);
  };
  const changeMethod = (m: IoMethod) => {
    setMethod(m);
    restart();
  };
  const revealed = result.ticks.slice(0, pos);
  const checks = revealed.filter((t) => t.kind === "check-no" || t.kind === "check-yes").length;
  const useful = revealed.filter((t) => t.kind === "work").length;
  const checkingWaste = revealed.filter((t) => t.kind === "check-no").length;
  const handling = revealed.filter((t) => t.kind === "handle").length;
  const overhead = revealed.filter((t) => t.kind === "overhead").length;
  const firstHandle = revealed.find((t) => t.kind === "handle");
  const delay = firstHandle ? firstHandle.t - readyAt : null;
  const recent = revealed.slice(-4).reverse();
  const done = pos >= total;
  const intermediate = levelAtLeast(level, "intermediate");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <SectionHeading title="Polling vs. interrupt-driven I/O">
          The same device event, handled two ways. In polling mode the CPU keeps asking “are you ready?”. In interrupt mode the CPU keeps doing useful work
          until the device gets its attention.
        </SectionHeading>

        <SegmentedChoice
          label="I/O method"
          value={method}
          onChange={changeMethod}
          options={[
            { id: "polling", label: "Polling mode" },
            { id: "interrupt", label: "Interrupt mode" },
          ]}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-ink dark:text-bone">
            Device becomes ready at tick {readyAt}
            <input
              type="range"
              min={4}
              max={16}
              value={readyAt}
              onChange={(e) => {
                setReadyAt(Number(e.target.value));
                restart();
              }}
              className="accent-[#B45309]"
            />
          </label>
          {method === "polling" && (
            <div className="flex flex-col gap-1 text-sm text-ink dark:text-bone">
              <span>How often the CPU checks</span>
              <SegmentedChoice
                label="Polling interval"
                value={pollEvery}
                onChange={(v) => {
                  setPollEvery(v);
                  restart();
                }}
                options={[
                  { id: 1, label: "Every tick" },
                  { id: 2, label: "Every 2" },
                  { id: 4, label: "Every 4" },
                ]}
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Btn
            variant="solid"
            onClick={() => {
              if (done) setPos(0);
              setRunning((r) => (done ? true : !r));
            }}
          >
            {running ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            {running ? "Pause" : done ? "Replay" : pos === 0 ? "Run" : "Resume"}
          </Btn>
          <Btn
            onClick={() => {
              setRunning(false);
              setPos((p) => Math.min(p + 1, total));
            }}
          >
            <StepForward className="h-4 w-4" aria-hidden="true" /> Step
          </Btn>
          <Btn onClick={restart}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
          </Btn>
        </div>

        {/* Tick strip */}
        <Panel title={`CPU activity, tick by tick (${pos}/${total})`}>
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }} role="img" aria-label="Strip of CPU activity per tick">
            {result.ticks.map((t, i) => (
              <div
                key={t.t}
                title={`t=${t.t}: ${CELL_LABEL[t.kind]}`}
                className={cn("h-8 rounded-sm transition-opacity duration-300", i < pos ? CELL_CLASS[t.kind] : "bg-ink/10 dark:bg-bone/10", i === pos - 1 && "ring-2 ring-subject-it")}
              />
            ))}
          </div>
          <div className="mt-1 grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }} aria-hidden="true">
            {result.ticks.map((t, i) => (
              <div key={t.t} className={cn("h-1.5 rounded-sm", t.deviceReady && i < pos ? "bg-rose-500" : "bg-ink/10 dark:bg-bone/10")} />
            ))}
          </div>
          <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">Top row: what the CPU did. Thin bottom row: the device is ready (red).</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft dark:text-bone-soft">
            {(method === "polling" ? (["work", "check-no", "check-yes", "handle"] as const) : (["work", "overhead", "handle"] as const)).map((k) => (
              <li key={k} className="flex items-center gap-1.5">
                <span className={cn("h-2.5 w-4 rounded-sm", CELL_CLASS[k])} aria-hidden="true" /> {CELL_LABEL[k]}
              </li>
            ))}
          </ul>
        </Panel>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="What the CPU is saying">
            {recent.length === 0 ? (
              <p className="text-sm text-ink-soft dark:text-bone-soft">Press Run or Step to begin.</p>
            ) : (
              <ul className="flex flex-col gap-1.5" aria-live="polite">
                {recent.map((t, i) => (
                  <li
                    key={t.t}
                    className={cn(
                      "rounded-md border px-2.5 py-1.5 text-sm",
                      i === 0 ? "border-subject-it bg-subject-it-soft/60 text-ink dark:bg-subject-it/15 dark:text-bone" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
                    )}
                  >
                    <span className="mr-2 font-mono text-xs opacity-70">t={t.t}</span>
                    {t.note}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <div className="grid grid-cols-2 gap-3">
            {method === "polling" ? (
              <>
                <Stat label="CPU checks" value={checks} />
                <Stat label="Useful work (ticks)" value={useful} tone="good" />
                <Stat label="Wasted checking (ticks)" value={checkingWaste} tone={checkingWaste > 0 ? "warn" : "neutral"} />
                <Stat label="Response delay" value={delay === null ? "—" : `${delay} ticks`} />
              </>
            ) : (
              <>
                <Stat label="CPU checks" value={0} />
                <Stat label="Useful work (ticks)" value={useful} tone="good" />
                <Stat label="Interrupt overhead (ticks)" value={overhead} tone={overhead > 0 ? "warn" : "neutral"} />
                <Stat label="Response delay" value={delay === null ? "—" : `${delay} ticks`} />
              </>
            )}
            <Stat label="Device handling (ticks)" value={handling} />
            <Stat label="Ticks elapsed" value={pos} />
          </div>
        </div>

        <Callout tone="note">{method === "polling" ? POLLING_NOTE : "Interrupt-driven I/O lets the CPU do useful work while it waits, but each interrupt costs some overhead (save state, identify, restore). For a device that is almost always ready, that overhead may not pay off. Response delay is measured in simulated ticks."}</Callout>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading title="Same scenario, both methods">
          These totals use your current settings for a full {total}-tick run. Neither method is universally better — look at what each one trades.
        </SectionHeading>
        <div className="overflow-x-auto rounded-card border border-line dark:border-line-dark">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="bg-ink/5 text-xs uppercase tracking-wide text-ink-soft dark:bg-bone/5 dark:text-bone-soft">
              <tr>
                <th className="px-3 py-2">Measure</th>
                <th className="px-3 py-2">Polling</th>
                <th className="px-3 py-2">Interrupt</th>
              </tr>
            </thead>
            <tbody className="text-ink dark:text-bone">
              {(
                [
                  ["CPU checks", both.polling.checks, 0],
                  ["Useful main-program ticks", both.polling.useful, both.interrupt.useful],
                  ["Checking / interrupt overhead ticks", both.polling.overhead, both.interrupt.overhead],
                  ["Device handling ticks", both.polling.handling, both.interrupt.handling],
                  ["Response delay (ticks)", both.polling.responseDelay ?? "—", both.interrupt.responseDelay ?? "—"],
                ] as [string, number | string, number | string][]
              ).map(([label, a, b]) => (
                <tr key={label} className="border-t border-line dark:border-line-dark">
                  <td className="px-3 py-2">{label}</td>
                  <td className="px-3 py-2 font-mono">{a}</td>
                  <td className="px-3 py-2 font-mono">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-ink-soft dark:text-bone-soft">
          Try polling “Every 4”: less time wasted checking, but a longer response delay. Simulated ticks — not real hardware timings.
        </p>
      </div>

      {intermediate && <MethodComparison />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// I/O methods comparison: polling vs interrupt vs DMA on one block transfer
// ---------------------------------------------------------------------------

export function MethodComparison() {
  const [words, setWords] = useState(128);
  const [ticksPerWord, setTicksPerWord] = useState(6);
  const [focus, setFocus] = useState<TransferMethod>("interrupt");

  const results = TRANSFER_METHODS.map((m) => computeTransfer(m.id, { words, ticksPerWord, transfers: 1 }));
  const maxTotal = Math.max(...results.map((r) => r.totalTime));
  const focusResult = results.find((r) => r.method === focus)!;

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading title="I/O methods comparison">
        Move one block of data from a device into memory using each method. Change the block size or device speed and see how the trade-offs shift — no method wins every case.
      </SectionHeading>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 text-sm text-ink dark:text-bone">
          <span>Block size</span>
          <SegmentedChoice
            label="Block size in words"
            value={words}
            onChange={setWords}
            options={TRANSFER_SIZES.map((w) => ({ id: w, label: `${w} word${w === 1 ? "" : "s"}` }))}
          />
        </div>
        <div className="flex flex-col gap-1.5 text-sm text-ink dark:text-bone">
          <span>Device speed</span>
          <SegmentedChoice
            label="Device speed"
            value={ticksPerWord}
            onChange={setTicksPerWord}
            options={DEVICE_SPEEDS.map((d) => ({ id: d.ticks, label: d.label.split(" (")[0] ?? d.label }))}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {results.map((r) => {
          const meta = TRANSFER_METHODS.find((m) => m.id === r.method)!;
          const widthPct = (r.totalTime / maxTotal) * 100;
          const busyPct = r.totalTime === 0 ? 0 : (r.cpuBusy / r.totalTime) * 100;
          return (
            <button
              type="button"
              key={r.method}
              onClick={() => setFocus(r.method)}
              aria-pressed={focus === r.method}
              className={cn(
                "rounded-card border p-3 text-left transition-colors",
                focus === r.method ? "border-subject-it bg-subject-it-soft/40 dark:bg-subject-it/10" : "border-line dark:border-line-dark",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-ink dark:text-bone">{meta.label}</span>
                <span className="text-xs text-ink-soft dark:text-bone-soft">CPU involvement: {meta.involvement}</span>
              </div>
              <div className="mt-2 h-5 rounded-sm bg-ink/5 dark:bg-bone/5">
                <div className="flex h-5 overflow-hidden rounded-sm transition-all duration-500" style={{ width: `${widthPct}%` }}>
                  <div className="bg-amber-500/80" style={{ width: `${busyPct}%` }} title="CPU busy" />
                  <div className="bg-emerald-500/70" style={{ width: `${100 - busyPct}%` }} title="CPU free" />
                </div>
              </div>
              <p className="mt-1 font-mono text-xs text-ink-soft dark:text-bone-soft">
                total {r.totalTime} ticks · CPU busy {r.cpuBusy} · CPU free {r.cpuFree}
              </p>
            </button>
          );
        })}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft dark:text-bone-soft">
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded-sm bg-amber-500/80" aria-hidden="true" /> CPU busy with the transfer
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded-sm bg-emerald-500/70" aria-hidden="true" /> CPU free for other work
        </li>
        <li>Bar length = total transfer time.</li>
      </ul>
      <Callout tone="note">
        {TRANSFER_METHODS.find((m) => m.id === focus)!.label}: {focusResult.note} ({focusResult.bytes} bytes at {BYTES_PER_WORD} bytes per word.) Try 1 word: the fixed setup cost makes DMA a poor choice for tiny transfers. {DMA_DISCLAIMER}
      </Callout>
    </div>
  );
}
