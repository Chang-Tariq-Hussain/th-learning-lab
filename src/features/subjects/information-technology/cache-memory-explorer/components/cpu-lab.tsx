"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DEFAULT_CONFIG,
  accessSystem,
  createSystem,
  formatHex,
  type AccessResult,
  type CacheConfig,
  type SystemState,
} from "../model";
import { CPU_LINK, MINI_PROGRAM } from "../content";
import { CacheTable, NO_FOCUS, focusFor } from "./cache-table";
import { ActionButton, Callout, LABEL_CLASS, OutcomeBadge, Panel } from "./ui-bits";

const CONFIG: CacheConfig = { ...DEFAULT_CONFIG, levelCount: 1, l1Lines: 4, lineSize: 4, policy: "lru", mapping: "full" };

interface EventDef {
  ins: number;
  kind: "fetch" | "data" | "reg";
}

/** Fetch always happens; a data access only if the instruction reads memory. */
const EVENTS: EventDef[] = MINI_PROGRAM.flatMap((instr, ins): EventDef[] => [
  { ins, kind: "fetch" },
  { ins, kind: instr.dataAddress === null ? "reg" : "data" },
]);

interface LogRow {
  pass: number;
  ins: number;
  kind: EventDef["kind"];
  cache: "instruction" | "data" | "shared";
  result: AccessResult | null;
}

interface Machine {
  i: SystemState;
  d: SystemState;
  cursor: number;
  pass: number;
  log: LogRow[];
  last: { which: "i" | "d"; result: AccessResult } | null;
}

const fresh = (): Machine => ({ i: createSystem(CONFIG), d: createSystem(CONFIG), cursor: 0, pass: 1, log: [], last: null });

function advance(m: Machine, split: boolean): Machine {
  const ev = EVENTS[m.cursor]!;
  const instr = MINI_PROGRAM[ev.ins]!;
  let { i, d } = m;
  let result: AccessResult | null = null;
  let which: "i" | "d" = "i";

  if (ev.kind === "fetch") {
    const out = accessSystem(i, instr.address);
    i = out.next;
    if (!split) d = out.next;
    result = out.result;
  } else if (ev.kind === "data") {
    which = "d";
    const source = split ? d : i;
    const out = accessSystem(source, instr.dataAddress!);
    if (split) d = out.next;
    else {
      i = out.next;
      d = out.next;
    }
    result = out.result;
  }

  const row: LogRow = { pass: m.pass, ins: ev.ins, kind: ev.kind, cache: !split ? "shared" : ev.kind === "fetch" ? "instruction" : "data", result };
  const nextCursor = (m.cursor + 1) % EVENTS.length;
  return {
    i,
    d,
    cursor: nextCursor,
    pass: nextCursor === 0 ? m.pass + 1 : m.pass,
    log: [...m.log, row],
    last: result ? { which, result } : m.last,
  };
}

export function CpuLab({ split }: { split: boolean }) {
  const [m, setM] = useState<Machine>(fresh);

  const step = () => setM((prev) => advance(prev, split));
  const runPass = () =>
    setM((prev) => {
      let cur = prev;
      do {
        cur = advance(cur, split);
      } while (cur.cursor !== 0);
      return cur;
    });

  const next = EVENTS[m.cursor]!;
  const nextInstr = MINI_PROGRAM[next.ins]!;
  const passTotals = new Map<number, { units: number; accesses: number }>();
  for (const row of m.log) {
    if (!row.result) continue;
    const t = passTotals.get(row.pass) ?? { units: 0, accesses: 0 };
    t.units += row.result.latency;
    t.accesses += 1;
    passTotals.set(row.pass, t);
  }

  const focusI = m.last && (split ? m.last.which === "i" : true) ? focusFor(m.last.result, "l1") : NO_FOCUS;
  const focusD = m.last && m.last.which === "d" ? focusFor(m.last.result, "l1") : NO_FOCUS;

  return (
    <div className="flex flex-col gap-5">
      <Callout title="Cache supports the CPU — it doesn’t replace the instruction cycle">
        Every time the CPU fetches an instruction, or loads or stores data, it asks the memory system first. If the cache has it, the CPU carries on quickly; if not, the data must be retrieved from a lower level.{" "}
        <Link href={CPU_LINK.href} className="font-medium underline underline-offset-2">
          {CPU_LINK.label}
        </Link>{" "}
        shows what the CPU does with each instruction; this lab shows where the instruction and its data come from.
      </Callout>

      <Panel title="What the CPU asks the cache">
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <div className="flex-1 rounded-lg border border-line p-2.5 text-sm dark:border-line-dark">CPU needs an instruction or data</div>
          <ArrowRight className="mx-auto h-4 w-4 rotate-90 text-ink-soft sm:rotate-0 dark:text-bone-soft" aria-hidden="true" />
          <div className="flex-1 rounded-lg border border-line p-2.5 text-sm dark:border-line-dark">Check the cache</div>
          <ArrowRight className="mx-auto h-4 w-4 rotate-90 text-ink-soft sm:rotate-0 dark:text-bone-soft" aria-hidden="true" />
          <div className="flex-1 space-y-1 rounded-lg border border-line p-2.5 text-sm dark:border-line-dark">
            <p>
              <strong className="font-medium text-emerald-700 dark:text-emerald-300">Hit</strong> → continue quickly
            </p>
            <p>
              <strong className="font-medium text-rose-700 dark:text-rose-300">Miss</strong> → retrieve from a lower level
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="A tiny program" aside={<span className={LABEL_CLASS}>{split ? "separate instruction & data caches" : "one shared cache"}</span>}>
        <ol className="flex flex-col gap-1.5">
          {MINI_PROGRAM.map((instr, i) => {
            const isNext = next.ins === i;
            return (
              <li key={instr.address} className={cn("rounded-lg border p-2.5", isNext ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/15" : "border-line dark:border-line-dark")}>
                <p className="font-mono text-sm text-ink dark:text-bone">
                  <span className="text-ink-soft dark:text-bone-soft">{instr.address}:</span> {instr.text}
                </p>
                <p className="text-xs text-ink-soft dark:text-bone-soft">{instr.note}</p>
              </li>
            );
          })}
        </ol>
        <div className="mt-3 flex flex-wrap gap-2">
          <ActionButton onClick={step}>
            Step: {next.kind === "fetch" ? `fetch instruction ${nextInstr.address}` : next.kind === "data" ? `read data ${nextInstr.dataAddress}` : "execute (registers)"}
          </ActionButton>
          <ActionButton variant="ghost" onClick={runPass}>
            Run whole program
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setM(fresh())}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
          </ActionButton>
        </div>
        <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">
          Run it once (cold cache), then run it again (warm cache) and compare the totals below.
        </p>
      </Panel>

      <Panel title="What happened">
        {m.log.length === 0 ? (
          <p className="text-sm text-ink-soft dark:text-bone-soft">Press Step to run the first access.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] text-left text-xs">
              <thead>
                <tr className="border-b border-line dark:border-line-dark">
                  {["Run", "Instruction", "Access", "Cache", "Address", "Result", "Units"].map((h) => (
                    <th key={h} scope="col" className="px-2 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {m.log.map((row, idx) => (
                  <tr key={idx} className="border-b border-line/70 last:border-b-0 dark:border-line-dark/70">
                    <td className="px-2 py-1.5 font-mono">{row.pass}</td>
                    <td className="px-2 py-1.5 font-mono">{MINI_PROGRAM[row.ins]!.text}</td>
                    <td className="px-2 py-1.5">{row.kind === "fetch" ? "Fetch instruction" : row.kind === "data" ? "Read data" : "Registers only"}</td>
                    <td className="px-2 py-1.5">{row.result ? row.cache : "—"}</td>
                    <td className="px-2 py-1.5 font-mono">{row.result ? `${row.result.address} (${formatHex(row.result.address, 3)})` : "—"}</td>
                    <td className="px-2 py-1.5">{row.result ? <OutcomeBadge hit={row.result.hit} /> : <span className="text-ink-soft dark:text-bone-soft">no cache access</span>}</td>
                    <td className="px-2 py-1.5 font-mono tabular-nums">{row.result ? row.result.latency : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {passTotals.size > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-ink dark:text-bone" aria-label="Totals per run">
            {[...passTotals.entries()].map(([pass, t]) => (
              <li key={pass}>
                Run {pass}: {t.units} units over {t.accesses} accesses
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-2 text-[11px] text-ink-soft dark:text-bone-soft">Simulation values. Instruction 101 hits because instruction 100’s line brought its neighbours along — spatial locality again.</p>
      </Panel>

      <Panel title="Cache contents">
        <div className="flex flex-col gap-4">
          {split ? (
            <>
              <CacheTable level={m.i.levels[0]!} lineSize={CONFIG.lineSize} title="Instruction cache (holds program instructions)" focus={focusI} />
              <CacheTable level={m.d.levels[0]!} lineSize={CONFIG.lineSize} title="Data cache (holds program data)" focus={focusD} />
              <Callout tone="neutral">Many CPUs use separate instruction and data caches at some levels (often L1) and unified caches at others. Organizations vary by architecture.</Callout>
            </>
          ) : (
            <CacheTable level={m.i.levels[0]!} lineSize={CONFIG.lineSize} title="Cache (instructions and data share it)" focus={focusI} />
          )}
        </div>
      </Panel>
    </div>
  );
}
