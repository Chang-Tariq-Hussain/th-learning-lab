"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ALLOCATION_STRATEGY_LABELS,
  PROCESS_COLORS,
  allocate,
  createInitialBlocks,
  deallocate,
  logicalToPhysical,
  nextBlockId,
  type AllocationStrategy,
  type MemoryBlock,
  type SimProcess,
} from "../model";
import { MemoryBlockBar } from "./memory-block-bar";

let processCounter = 0;
function nextProcessId() {
  processCounter += 1;
  return `P${processCounter}`;
}

/**
 * The core experience: request memory for named processes, watch the
 * OS memory manager allocate it (Request → Memory Manager →
 * Allocation → Process), deallocate a process and watch its memory
 * become free again, and inspect any block's address range —
 * including the logical-vs-physical addressing distinction for
 * allocated blocks.
 */
export function MemoryMapLab() {
  const [blocks, setBlocks] = useState<MemoryBlock[]>(() => createInitialBlocks());
  const [processes, setProcesses] = useState<SimProcess[]>([]);
  const [strategy, setStrategy] = useState<AllocationStrategy>("first-fit");
  const [name, setName] = useState("");
  const [size, setSize] = useState(100);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [logicalAddress, setLogicalAddress] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const processColors = useMemo(() => {
    const map: Record<string, string> = {};
    processes.forEach((p, i) => {
      map[p.id] = p.color ?? PROCESS_COLORS[i % PROCESS_COLORS.length];
    });
    return map;
  }, [processes]);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) ?? null;

  const createAndAllocate = () => {
    if (!name.trim() || size <= 0) return;
    const process: SimProcess = {
      id: nextProcessId(),
      name: name.trim(),
      size,
      color: PROCESS_COLORS[processes.length % PROCESS_COLORS.length]!,
    };
    const result = allocate(blocks, process, strategy);
    if (!result) {
      setMessage(`Not enough contiguous free memory for ${process.name} (${process.size} MB) using ${ALLOCATION_STRATEGY_LABELS[strategy]}.`);
      return;
    }
    setBlocks(result);
    setProcesses((p) => [...p, process]);
    setMessage(`${process.name} allocated ${process.size} MB using ${ALLOCATION_STRATEGY_LABELS[strategy]}.`);
    setName("");
  };

  const handleDeallocate = (processId: string) => {
    setBlocks((b) => deallocate(b, processId));
    setProcesses((p) => p.filter((proc) => proc.id !== processId));
    setSelectedBlockId((id) => (blocks.find((b) => b.id === id)?.processId === processId ? null : id));
    setMessage(`Memory released back to the free pool.`);
  };

  const reset = () => {
    setBlocks(createInitialBlocks());
    setProcesses([]);
    setSelectedBlockId(null);
    setMessage(null);
    // Fresh, non-colliding ids for the next session.
    for (let i = 0; i < 50; i++) nextBlockId();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-card border border-line bg-ink/[0.02] p-4 dark:border-line-dark dark:bg-bone/[0.03]">
        <p className="mb-2 text-xs font-mono uppercase tracking-wide text-ink-soft dark:text-bone-soft">
          RAM — {blocks.length} region{blocks.length === 1 ? "" : "s"}
        </p>
        <MemoryBlockBar blocks={blocks} processColors={processColors} selectedBlockId={selectedBlockId} onSelectBlock={(b) => { setSelectedBlockId(b.id); setLogicalAddress(0); }} />
        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-ink-soft dark:text-bone-soft">
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-ink/70 dark:bg-bone/40" /> Operating System</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm border border-ink/30 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.15),rgba(0,0,0,0.15)_3px,transparent_3px,transparent_6px)] dark:border-bone/30" /> Free memory</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: PROCESS_COLORS[0] }} /> Allocated process</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-card border border-line p-4 dark:border-line-dark">
          <p className="mb-3 text-sm font-medium text-ink dark:text-bone">Create process → Request memory</p>
          <div className="flex flex-col gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Process name (e.g. Photo Editor)"
              className="h-9 rounded-md border border-line bg-paper px-3 text-sm text-ink outline-none focus:border-subject-it dark:border-line-dark dark:bg-chalkboard dark:text-bone"
            />
            <label className="flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft">
              Requested size: {size} MB
              <input
                type="range"
                min={10}
                max={400}
                step={10}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="accent-subject-it"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft">
              Allocation strategy
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as AllocationStrategy)}
                className="h-9 rounded-md border border-line bg-paper px-2 text-sm text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone"
              >
                {(Object.keys(ALLOCATION_STRATEGY_LABELS) as AllocationStrategy[]).map((s) => (
                  <option key={s} value={s}>{ALLOCATION_STRATEGY_LABELS[s]}</option>
                ))}
              </select>
            </label>
            <button
              onClick={createAndAllocate}
              disabled={!name.trim()}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-subject-it px-4 text-sm font-medium text-paper hover:opacity-90 disabled:opacity-40"
            >
              <Plus className="h-4 w-4" /> Create &amp; Allocate
            </button>
          </div>
        </div>

        <div className="rounded-card border border-line p-4 dark:border-line-dark">
          <p className="mb-3 text-sm font-medium text-ink dark:text-bone">Processes ({processes.length})</p>
          {processes.length === 0 ? (
            <p className="text-sm text-ink-soft dark:text-bone-soft">No processes yet — create one to see it allocated above.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {processes.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2 rounded-md border border-line px-3 py-2 text-sm dark:border-line-dark">
                  <span className="flex items-center gap-2 text-ink dark:text-bone">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: p.color }} />
                    {p.name} <span className="font-mono text-xs text-ink-soft dark:text-bone-soft">{p.size} MB</span>
                  </span>
                  <button
                    onClick={() => handleDeallocate(p.id)}
                    className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
                  >
                    Terminate &amp; free
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={reset}
            className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset RAM
          </button>
        </div>
      </div>

      {message && (
        <p className={cn("text-sm", message.startsWith("Not enough") ? "text-rose-600 dark:text-rose-400" : "text-ink-soft dark:text-bone-soft")}>{message}</p>
      )}

      {selectedBlock && (
        <div className="rounded-card bg-ink/[0.03] p-4 dark:bg-bone/[0.05]">
          <p className="mb-1 text-xs font-mono uppercase tracking-wide text-subject-it">Inspecting block</p>
          <p className="text-sm text-ink dark:text-bone">
            {selectedBlock.status === "os" ? "Operating System" : selectedBlock.status === "free" ? "Free memory" : processes.find((p) => p.id === selectedBlock.processId)?.name ?? selectedBlock.processId}
            {" · "}
            <span className="font-mono">{selectedBlock.size} MB</span>
            {" · physical addresses "}
            <span className="font-mono">{selectedBlock.start}–{selectedBlock.start + selectedBlock.size} MB</span>
          </p>
          {selectedBlock.status === "allocated" && (
            <div className="mt-3">
              <label className="flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft">
                This process&apos;s logical address: {logicalAddress} MB (0 = start of its own memory)
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, selectedBlock.size - 1)}
                  value={logicalAddress}
                  onChange={(e) => setLogicalAddress(Number(e.target.value))}
                  className="accent-subject-it"
                />
              </label>
              <p className="mt-2 font-mono text-sm text-ink dark:text-bone">
                Logical {logicalAddress} MB → Physical {logicalToPhysical(logicalAddress, selectedBlock.start)} MB
              </p>
              <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">
                The process only ever &quot;sees&quot; its own logical addresses starting at 0. The OS&apos;s memory manager translates each one to the real physical address by adding the block&apos;s base address.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
