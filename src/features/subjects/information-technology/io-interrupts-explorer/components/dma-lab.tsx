"use client";

import { useEffect, useState } from "react";
import { Play, RotateCcw, StepForward } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BYTES_PER_WORD,
  DEVICE_SPEEDS,
  DMA_DISCLAIMER,
  TRANSFER_SIZES,
  computeTransfer,
  levelAtLeast,
  type Level,
  type TransferMethod,
} from "../model";
import { Btn, Callout, Panel, SectionHeading, SegmentedChoice, Stat } from "./ui-bits";

export interface DmaLabPreset {
  method?: TransferMethod;
  words?: number;
}

type Pt = { x: number; y: number };

const DEVICE: Pt = { x: 50, y: 110 };
const CPU: Pt = { x: 200, y: 40 };
const DMA: Pt = { x: 200, y: 165 };
const MEM: Pt = { x: 350, y: 110 };

function lerpPath(points: Pt[], t: number): Pt {
  const segs = points.length - 1;
  const f = Math.min(Math.max(t, 0), 0.9999) * segs;
  const i = Math.floor(f);
  const local = f - i;
  const a = points[i] as Pt;
  const b = points[i + 1] as Pt;
  return { x: a.x + (b.x - a.x) * local, y: a.y + (b.y - a.y) * local };
}

function DataPathDiagram({ method, progress }: { method: TransferMethod; progress: number }) {
  const viaCpu = method !== "dma";
  const path = viaCpu ? [DEVICE, CPU, MEM] : [DEVICE, DMA, MEM];
  const dots = [0, 0.33, 0.66].map((off) => (progress + off) % 1);
  const running = progress > 0;
  return (
    <svg viewBox="0 0 400 210" className="h-auto w-full" role="img" aria-label={viaCpu ? "Data flows from the device through the CPU into memory." : "Data flows from the device through the DMA controller into memory while the CPU does other work."}>
      <title>{viaCpu ? "CPU-driven transfer: Device to CPU to Memory" : "DMA transfer: Device to DMA controller to Memory, CPU free"}</title>
      <polyline points={path.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" strokeWidth="3" strokeDasharray="6 4" className={viaCpu ? "stroke-amber-500/60" : "stroke-emerald-500/60"} />
      {/* Nodes */}
      {[
        { p: DEVICE, label: "Device", icon: "💾" },
        { p: MEM, label: "Memory", icon: "🧠" },
      ].map((n) => (
        <g key={n.label}>
          <rect x={n.p.x - 42} y={n.p.y - 26} width={84} height={52} rx={10} className="fill-subject-it-soft/70 stroke-subject-it/60 dark:fill-subject-it/15" strokeWidth="1.5" />
          <text x={n.p.x} y={n.p.y - 3} textAnchor="middle" className="text-[18px]" aria-hidden="true">{n.icon}</text>
          <text x={n.p.x} y={n.p.y + 16} textAnchor="middle" className="fill-ink font-mono text-[12px] dark:fill-bone">{n.label}</text>
        </g>
      ))}
      <rect x={CPU.x - 55} y={CPU.y - 24} width={110} height={48} rx={10} strokeWidth="2" className={cn("fill-white dark:fill-white/5", viaCpu && running ? "stroke-amber-500" : "stroke-subject-it")} />
      <text x={CPU.x} y={CPU.y - 3} textAnchor="middle" className="fill-ink font-display text-[15px] dark:fill-bone">CPU</text>
      <text x={CPU.x} y={CPU.y + 15} textAnchor="middle" className="fill-ink-soft font-mono text-[11px] dark:fill-bone-soft">
        {viaCpu ? (running ? "Copying data" : "Idle") : running ? "Other work ✓" : "Idle"}
      </text>
      <rect x={DMA.x - 55} y={DMA.y - 20} width={110} height={40} rx={10} strokeWidth="2" className={cn("fill-white dark:fill-white/5", !viaCpu ? "stroke-emerald-500" : "stroke-ink/20 dark:stroke-bone/20")} opacity={viaCpu ? 0.45 : 1} />
      <text x={DMA.x} y={DMA.y + 5} textAnchor="middle" className="fill-ink font-mono text-[12px] dark:fill-bone">DMA Controller</text>
      {!viaCpu && (
        <>
          <line x1={CPU.x} y1={CPU.y + 24} x2={DMA.x} y2={DMA.y - 20} strokeWidth="1.5" strokeDasharray="3 3" className="stroke-ink/40 dark:stroke-bone/40" />
          <text x={CPU.x + 8} y={102} className="fill-ink-soft font-mono text-[11px] dark:fill-bone-soft">start</text>
        </>
      )}
      {running && dots.map((t, i) => {
        const p = lerpPath(path, t);
        return <circle key={i} cx={p.x} cy={p.y} r={6} className={viaCpu ? "fill-amber-500" : "fill-emerald-500"} />;
      })}
    </svg>
  );
}

const SEQUENCE = [
  { label: "CPU starts the transfer", detail: "The CPU writes the source, destination, and size to the DMA controller's registers, then starts it.", cpu: "Setting up (a few ticks)" },
  { label: "Device ↔ Memory", detail: "The DMA controller moves data between the device and memory itself — the CPU is not copying each word.", cpu: "Free to run other work" },
  { label: "Transfer completes", detail: "The DMA controller has moved the whole block and sets its status to done.", cpu: "Still running other work" },
  { label: "DMA generates an interrupt", detail: "The controller raises an interrupt request to tell the CPU the transfer has finished.", cpu: "Interrupt arrives" },
  { label: "CPU handles completion", detail: "The CPU saves its state, runs the DMA-complete ISR (vector 6 in this lab), and marks the data ready.", cpu: "Running the ISR" },
  { label: "CPU uses the data", detail: "The CPU returns to its work, and the program that was waiting can now use the data in memory.", cpu: "Back to normal work" },
];

export function DmaLab({ level, preset }: { level: Level; preset?: DmaLabPreset }) {
  const [method, setMethod] = useState<TransferMethod>(preset?.method ?? "dma");
  const [words, setWords] = useState(preset?.words ?? 128);
  const [ticksPerWord, setTicksPerWord] = useState(6);
  const [transfers, setTransfers] = useState(1);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [seq, setSeq] = useState(-1);
  const [seqPlaying, setSeqPlaying] = useState(false);
  const technical = levelAtLeast(level, "technical");

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setProgress((p) => (p + 0.04) % 1 || 0.01), 90);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!seqPlaying) return;
    if (seq >= SEQUENCE.length - 1) {
      setSeqPlaying(false);
      return;
    }
    const id = setTimeout(() => setSeq((s) => s + 1), 1600);
    return () => clearTimeout(id);
  }, [seqPlaying, seq]);

  const params = { words, ticksPerWord, transfers };
  const cpuDriven = computeTransfer(method === "dma" ? "polling" : method, params);
  const dma = computeTransfer("dma", params);
  const chosen = method === "dma" ? dma : cpuDriven;
  const maxTotal = Math.max(cpuDriven.totalTime, dma.totalTime);

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading title="DMA laboratory — Direct Memory Access">
        Moving a big block of data through the CPU one word at a time keeps it busy copying. With DMA, a controller moves the data to or from memory while the
        CPU keeps working.
      </SectionHeading>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title={method === "dma" ? "DMA transfer" : "CPU-driven transfer"}>
          <DataPathDiagram method={method} progress={running ? progress : 0} />
          <div className="mt-2 flex flex-wrap gap-2">
            <Btn variant="solid" onClick={() => { setProgress(0.01); setRunning((r) => !r); }}>
              <Play className="h-4 w-4" aria-hidden="true" /> {running ? "Stop animation" : "Animate transfer"}
            </Btn>
          </div>
          <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">
            {method === "dma"
              ? "Device → DMA controller → Memory. The CPU only starts the transfer, then continues other work."
              : "Device → CPU → Memory. Every word passes through the CPU."}
          </p>
        </Panel>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-sm text-ink dark:text-bone">
            <span>CPU involvement</span>
            <SegmentedChoice
              label="Transfer method"
              value={method}
              onChange={setMethod}
              options={[
                { id: "polling", label: "CPU-driven (polling)" },
                { id: "interrupt", label: "CPU-driven (interrupt per word)" },
                { id: "dma", label: "DMA" },
              ]}
            />
          </div>
          <div className="flex flex-col gap-1.5 text-sm text-ink dark:text-bone">
            <span>Transfer size</span>
            <SegmentedChoice label="Transfer size in words" value={words} onChange={setWords} options={TRANSFER_SIZES.map((w) => ({ id: w, label: `${w} word${w === 1 ? "" : "s"}` }))} />
          </div>
          <div className="flex flex-col gap-1.5 text-sm text-ink dark:text-bone">
            <span>Transfer speed</span>
            <SegmentedChoice label="Device speed" value={ticksPerWord} onChange={setTicksPerWord} options={DEVICE_SPEEDS.map((d) => ({ id: d.ticks, label: d.label.split(" (")[0] ?? d.label }))} />
          </div>
          <label className="flex flex-col gap-1 text-sm text-ink dark:text-bone">
            Number of transfers: {transfers}
            <input type="range" min={1} max={5} value={transfers} onChange={(e) => setTransfers(Number(e.target.value))} className="accent-[#B45309]" />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="CPU work (busy ticks)" value={chosen.cpuBusy} tone="warn" />
          <Stat label="Data transferred" value={`${chosen.bytes} B`} />
          <Stat label="Transfer time (ticks)" value={chosen.totalTime} />
          <Stat label="CPU available for other work" value={chosen.cpuFree} tone="good" />
        </div>
        <p className="text-sm text-ink-soft dark:text-bone-soft">{chosen.note}</p>

        <Panel title="Side by side (same settings)">
          {[
            { label: "CPU-driven", r: cpuDriven },
            { label: "DMA", r: dma },
          ].map(({ label, r }) => (
            <div key={label} className="mb-3 last:mb-0">
              <div className="flex justify-between text-xs text-ink-soft dark:text-bone-soft">
                <span>{label}</span>
                <span className="font-mono">busy {r.cpuBusy} · free {r.cpuFree} · total {r.totalTime}</span>
              </div>
              <div className="mt-1 h-4 rounded-sm bg-ink/5 dark:bg-bone/5">
                <div className="flex h-4 overflow-hidden rounded-sm transition-all duration-500" style={{ width: `${(r.totalTime / maxTotal) * 100}%` }}>
                  <div className="bg-amber-500/80" style={{ width: `${r.totalTime ? (r.cpuBusy / r.totalTime) * 100 : 0}%` }} />
                  <div className="bg-emerald-500/70 flex-1" />
                </div>
              </div>
            </div>
          ))}
          <p className="text-xs text-ink-soft dark:text-bone-soft">Amber = CPU busy · green = CPU free. {BYTES_PER_WORD} bytes per word. Try “1 word”: the DMA setup and completion costs then outweigh the benefit.</p>
        </Panel>
        <Callout tone="note">{DMA_DISCLAIMER}</Callout>
      </div>

      {technical ? (
        <div className="flex flex-col gap-4">
          <SectionHeading title="DMA completion interrupt">
            DMA and interrupts work together: the CPU is not watching the transfer, so the DMA controller interrupts it when the block is done.
          </SectionHeading>
          <div className="flex flex-wrap gap-2">
            <Btn variant="solid" onClick={() => {
              if (seq === -1 || seq >= SEQUENCE.length - 1) {
                setSeq(0);
                setSeqPlaying(true);
              } else {
                setSeqPlaying((p) => !p);
              }
            }}>
              <Play className="h-4 w-4" aria-hidden="true" /> {seqPlaying ? "Pause" : "Play sequence"}
            </Btn>
            <Btn onClick={() => { setSeqPlaying(false); setSeq((s) => Math.min(s + 1, SEQUENCE.length - 1)); }}>
              <StepForward className="h-4 w-4" aria-hidden="true" /> Step
            </Btn>
            <Btn onClick={() => { setSeqPlaying(false); setSeq(-1); }}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
            </Btn>
          </div>
          <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SEQUENCE.map((s, i) => (
              <li key={s.label} className={cn("rounded-card border p-3 transition-colors", i === seq ? "border-subject-it bg-subject-it-soft/60 dark:bg-subject-it/15" : i < seq ? "border-emerald-500/40" : "border-line opacity-60 dark:border-line-dark")}>
                <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">Step {i + 1}</p>
                <p className="text-sm font-medium text-ink dark:text-bone">{s.label}</p>
                {i === seq && (
                  <>
                    <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">{s.detail}</p>
                    <p className="mt-1 font-mono text-xs text-emerald-700 dark:text-emerald-300">CPU: {s.cpu}</p>
                  </>
                )}
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <Callout tone="note">Switch to the Technical level to trace how a DMA transfer notifies the CPU with a completion interrupt.</Callout>
      )}
    </div>
  );
}
