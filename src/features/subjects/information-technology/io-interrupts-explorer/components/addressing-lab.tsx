"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ADDRESS_MAP,
  INITIAL_MMIO,
  INITIAL_PORTS,
  MMIO_DISCLAIMER,
  PORT_DISCLAIMER,
  VECTOR_DISCLAIMER,
  VECTOR_TABLE,
  execMmio,
  execPortOp,
  finishDeviceWork,
  hex,
  levelAtLeast,
  type Level,
  type MmioResult,
  type MmioState,
  type PortInstr,
  type PortResult,
  type PortState,
} from "../model";
import { Btn, Callout, Panel, SectionHeading, SegmentedChoice } from "./ui-bits";

/** Reveals `total` items one at a time (restarts whenever `resetKey` changes). */
function useReveal(total: number, resetKey: number, ms = 380): number {
  const [n, setN] = useState(total);
  useEffect(() => {
    setN(0);
    if (total === 0) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= total) clearInterval(id);
    }, ms);
    return () => clearInterval(id);
  }, [resetKey, total, ms]);
  return n;
}

export function AddressingLab({ level }: { level: Level }) {
  const technical = levelAtLeast(level, "technical");
  return (
    <div className="flex flex-col gap-10">
      <VectorLab />
      {technical ? (
        <>
          <MemoryMappedLab />
          <PortMappedLab />
        </>
      ) : (
        <Callout tone="note">Switch to the Technical level to explore memory-mapped I/O and port-mapped I/O — two ways software can address device registers.</Callout>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Interrupt vector
// ---------------------------------------------------------------------------

function VectorLab() {
  const [vector, setVector] = useState(5);
  const [runKey, setRunKey] = useState(0);
  const entry = VECTOR_TABLE.find((v) => v.vector === vector)!;
  const stage = useReveal(4, runKey, 450);

  const chain = [
    { label: "Interrupt number", value: String(entry.vector) },
    { label: "Vector table entry", value: `[${entry.vector}]` },
    { label: "ISR address", value: hex(entry.address) },
    { label: "ISR runs", value: entry.name },
  ];

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading title="Interrupt vector">
        When an interrupt arrives, the CPU needs to know which handler to run. The interrupt number selects an entry in the vector table, and that entry holds
        the address of the ISR. Pick an interrupt number and follow the lookup.
      </SectionHeading>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Interrupt number">
        {VECTOR_TABLE.map((v) => (
          <Btn
            key={v.vector}
            pressed={vector === v.vector}
            onClick={() => {
              setVector(v.vector);
              setRunKey((k) => k + 1);
            }}
            ariaLabel={`Interrupt ${v.vector}`}
          >
            Interrupt {v.vector}
          </Btn>
        ))}
      </div>

      <ol className="grid gap-2 sm:grid-cols-4" aria-live="polite">
        {chain.map((c, i) => (
          <li key={c.label} className="relative">
            <div
              className={cn(
                "h-full rounded-card border p-3 text-center transition-all duration-300",
                i < stage ? "border-subject-it bg-subject-it-soft/60 opacity-100 dark:bg-subject-it/15" : "border-line opacity-40 dark:border-line-dark",
              )}
            >
              <p className="text-xs text-ink-soft dark:text-bone-soft">{c.label}</p>
              <p className="mt-1 font-mono text-sm font-medium text-ink dark:text-bone">{c.value}</p>
            </div>
            {i < chain.length - 1 && (
              <span className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2 text-ink-soft sm:-right-2.5 sm:bottom-auto sm:left-auto sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 dark:text-bone-soft" aria-hidden="true">
                <span className="sm:hidden">↓</span>
                <span className="hidden sm:inline">→</span>
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Simulated interrupt vector table">
          <ol className="flex flex-col gap-1 font-mono text-xs sm:text-sm">
            {VECTOR_TABLE.map((v) => (
              <li
                key={v.vector}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2.5 py-1.5",
                  v.vector === vector ? "bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "text-ink-soft dark:text-bone-soft",
                )}
              >
                <span className="w-6">{v.vector}</span>
                <span className="w-16">{hex(v.address)}</span>
                <span className="font-sans">{v.name}</span>
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title={`${entry.name} @ ${hex(entry.address)}`}>
          <p className="text-sm text-ink-soft dark:text-bone-soft">{entry.note}</p>
          <ol className="mt-2 rounded-md border border-line font-mono text-xs dark:border-line-dark">
            {entry.code.map((line, i) => (
              <li key={line} className="flex gap-3 px-2.5 py-1 text-ink-soft dark:text-bone-soft">
                <span className="w-16 shrink-0">{hex(entry.address + i)}</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
      <Callout tone="note">{VECTOR_DISCLAIMER}</Callout>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Memory-mapped I/O
// ---------------------------------------------------------------------------

function MemoryMappedLab() {
  const [state, setState] = useState<MmioState>(INITIAL_MMIO);
  const [op, setOp] = useState<"STORE" | "LOAD">("STORE");
  const [addr, setAddr] = useState(0x2000);
  const [value, setValue] = useState(42);
  const [result, setResult] = useState<MmioResult | null>(null);
  const [runKey, setRunKey] = useState(0);
  const shown = useReveal(result?.stages.length ?? 0, runKey);

  // The device finishes its work a moment after being started.
  useEffect(() => {
    if (state.devStatus !== "BUSY") return;
    const id = setTimeout(() => setState((s) => finishDeviceWork(s)), 1800);
    return () => clearTimeout(id);
  }, [state.devStatus]);

  const execute = () => {
    const r = execMmio(state, op, addr, value);
    setState(r.state);
    setResult(r);
    setRunKey((k) => k + 1);
  };

  const statusTone =
    state.devStatus === "READY" ? "text-emerald-700 dark:text-emerald-300" : state.devStatus === "BUSY" ? "text-amber-700 dark:text-amber-300" : "text-ink dark:text-bone";

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading title="Memory-mapped I/O">
        In a system that uses memory-mapped I/O, device registers occupy addresses in the same address space as RAM. The CPU reaches a device with ordinary
        load and store instructions — the address decides whether RAM or a device responds.
      </SectionHeading>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Memory address space">
          <ul className="flex flex-col gap-1.5">
            {ADDRESS_MAP.map((r) => (
              <li key={r.addr}>
                <button
                  type="button"
                  onClick={() => setAddr(r.addr)}
                  aria-pressed={addr === r.addr}
                  className={cn(
                    "flex w-full min-h-[44px] items-center gap-3 rounded-md border px-3 py-1.5 text-left text-sm transition-colors",
                    r.kind === "device" ? "bg-subject-it-soft/50 dark:bg-subject-it/10" : "",
                    addr === r.addr ? "border-subject-it" : "border-line dark:border-line-dark",
                  )}
                >
                  <span className="w-16 shrink-0 font-mono text-xs text-ink-soft dark:text-bone-soft">{hex(r.addr)}</span>
                  <span className="text-ink dark:text-bone">{r.label}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">{ADDRESS_MAP.find((r) => r.addr === addr)!.detail}</p>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Issue an instruction">
            <div className="flex flex-col gap-3">
              <SegmentedChoice
                label="Instruction"
                value={op}
                onChange={setOp}
                options={[
                  { id: "STORE", label: "STORE (write)" },
                  { id: "LOAD", label: "LOAD (read)" },
                ]}
              />
              {op === "STORE" && (
                <label className="flex flex-col gap-1 text-sm text-ink dark:text-bone">
                  Value to store: {value} <span className="text-xs text-ink-soft dark:text-bone-soft">(control register: 1 = START)</span>
                  <input type="range" min={0} max={255} value={value} onChange={(e) => setValue(Number(e.target.value))} className="accent-[#B45309]" />
                </label>
              )}
              <p className="rounded-md bg-ink/5 px-3 py-2 font-mono text-sm text-ink dark:bg-bone/5 dark:text-bone">
                {op === "STORE" ? `STORE [${hex(addr)}], ${value}` : `LOAD R1, [${hex(addr)}]`}
              </p>
              <div>
                <Btn variant="solid" onClick={execute}>
                  Execute
                </Btn>
              </div>
            </div>
          </Panel>

          <Panel title="Simulated device registers">
            <dl className="grid grid-cols-3 gap-2 font-mono text-sm">
              <div>
                <dt className="text-xs text-ink-soft dark:text-bone-soft">DEV_DATA</dt>
                <dd className="text-ink dark:text-bone">{state.devData}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-soft dark:text-bone-soft">DEV_CTRL</dt>
                <dd className="text-ink dark:text-bone">{state.devCtrl}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-soft dark:text-bone-soft">DEV_STATUS</dt>
                <dd className={statusTone}>{state.devStatus}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">
              RAM: {hex(0x0000)} = {state.ram[0x0000] ?? 0} · {hex(0x1000)} = {state.ram[0x1000] ?? 0}
              {state.devOutput.length > 0 && ` · Device log: ${state.devOutput[state.devOutput.length - 1]}`}
            </p>
          </Panel>
        </div>
      </div>

      <Panel title="What just happened">
        {result ? (
          <div className="flex flex-col gap-2">
            <ol className="flex flex-col gap-1" aria-live="polite">
              {result.stages.map((s, i) => (
                <li
                  key={`${runKey}-${i}`}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm transition-opacity duration-300",
                    i < shown ? "border-subject-it/60 opacity-100" : "border-line opacity-30 dark:border-line-dark",
                  )}
                >
                  <span className="font-mono text-xs text-ink-soft dark:text-bone-soft">{i + 1}</span>
                  <span className="text-ink dark:text-bone">{s}</span>
                </li>
              ))}
            </ol>
            {shown >= result.stages.length && <p className="text-sm text-ink-soft dark:text-bone-soft">{result.description}</p>}
          </div>
        ) : (
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            Try it: STORE 42 to 0x2000, STORE 1 to 0x2004 (START), then LOAD from 0x2008 — twice, a moment apart. That last step is polling a status register.
          </p>
        )}
      </Panel>
      <Callout tone="note">{MMIO_DISCLAIMER}</Callout>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Port-mapped I/O
// ---------------------------------------------------------------------------

const PORT_INSTRS: { id: PortInstr; label: string; space: "memory" | "io" }[] = [
  { id: "STORE [0x0010]", label: "STORE [0x0010], value", space: "memory" },
  { id: "OUT 0x10", label: "OUT 0x10, value", space: "io" },
  { id: "LOAD [0x0010]", label: "LOAD R1, [0x0010]", space: "memory" },
  { id: "IN 0x10", label: "IN R1, 0x10", space: "io" },
];

function PortMappedLab() {
  const [state, setState] = useState<PortState>(INITIAL_PORTS);
  const [instr, setInstr] = useState<PortInstr>("OUT 0x10");
  const [value, setValue] = useState(7);
  const [result, setResult] = useState<PortResult | null>(null);
  const [runKey, setRunKey] = useState(0);
  const shown = useReveal(result?.stages.length ?? 0, runKey);

  const execute = () => {
    const r = execPortOp(state, instr, value);
    setState(r.state);
    setResult(r);
    setRunKey((k) => k + 1);
  };
  const writes = instr === "STORE [0x0010]" || instr === "OUT 0x10";

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading title="Port-mapped I/O">
        Some architectures provide a separate I/O address space with dedicated instructions such as IN and OUT. The same number can name a memory address in one
        space and a device port in the other — and the instruction decides which space is used.
      </SectionHeading>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className={cn("rounded-card border p-3 transition-colors", result?.space === "memory" ? "border-subject-it bg-subject-it-soft/50 dark:bg-subject-it/10" : "border-line dark:border-line-dark")}>
          <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Memory address space</p>
          <p className="mt-1 font-mono text-sm text-ink dark:text-bone">RAM[0x0010] = {state.ram10}</p>
        </div>
        <div className={cn("rounded-card border p-3 transition-colors", result?.space === "io" ? "border-subject-it bg-subject-it-soft/50 dark:bg-subject-it/10" : "border-line dark:border-line-dark")}>
          <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">I/O address space (ports)</p>
          <p className="mt-1 font-mono text-sm text-ink dark:text-bone">Port 0x10 (device register) = {state.port10}</p>
        </div>
      </div>

      <Panel title="Issue an instruction">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Instruction">
            {PORT_INSTRS.map((p) => (
              <Btn key={p.id} pressed={instr === p.id} onClick={() => setInstr(p.id)}>
                {p.label}
              </Btn>
            ))}
          </div>
          {writes && (
            <label className="flex flex-col gap-1 text-sm text-ink dark:text-bone">
              Value: {value}
              <input type="range" min={0} max={255} value={value} onChange={(e) => setValue(Number(e.target.value))} className="accent-[#B45309]" />
            </label>
          )}
          <div>
            <Btn variant="solid" onClick={execute}>
              Execute
            </Btn>
          </div>
        </div>
      </Panel>

      {result && (
        <Panel title="What just happened">
          <ol className="flex flex-col gap-1" aria-live="polite">
            {result.stages.map((s, i) => (
              <li key={`${runKey}-${i}`} className={cn("rounded-md border px-2.5 py-1.5 text-sm text-ink transition-opacity duration-300 dark:text-bone", i < shown ? "border-subject-it/60 opacity-100" : "border-line opacity-30 dark:border-line-dark")}>
                {s}
              </li>
            ))}
          </ol>
          {shown >= result.stages.length && <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">{result.description}</p>}
        </Panel>
      )}
      <Callout tone="note">{PORT_DISCLAIMER}</Callout>
    </div>
  );
}
