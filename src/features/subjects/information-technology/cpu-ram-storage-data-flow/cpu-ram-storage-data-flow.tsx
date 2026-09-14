"use client";

import { useState } from "react";
import { MODES, type ModeId } from "./model";
import { ModeTabs } from "./components/mode-tabs";
import { OverviewMode } from "./components/overview-mode";
import { InstructionExecutionMode } from "./components/instruction-execution-mode";
import { MemoryAccessMode } from "./components/memory-access-mode";
import { CacheMode } from "./components/cache-mode";
import { BusExplorerMode } from "./components/bus-explorer-mode";
import { FullSystemMode } from "./components/full-system-mode";

/**
 * Computer Architecture / Instruction Execution Laboratory.
 *
 * Six focused modes instead of one overloaded screen (per the brief),
 * each owning its own local state — switching modes here fully
 * unmounts the previous one, same pattern Chemistry's molecule
 * builder uses between its Explore/Build modes, so nothing leaks
 * between e.g. an in-progress instruction-execution run and the cache
 * demo.
 */
export function CpuRamStorageDataFlow() {
  const [mode, setMode] = useState<ModeId>(MODES[0]!.id);

  return (
    <div className="flex flex-col gap-6">
      <ModeTabs active={mode} onSelect={setMode} />

      {mode === "overview" && <OverviewMode />}
      {mode === "instruction" && <InstructionExecutionMode />}
      {mode === "memory" && <MemoryAccessMode />}
      {mode === "cache" && <CacheMode />}
      {mode === "buses" && <BusExplorerMode />}
      {mode === "full-system" && <FullSystemMode />}

      <p className="text-xs text-ink-soft dark:text-bone-soft">
        Every moving dot represents conceptual data, an instruction, or an address/control signal — not a physical
        object literally traveling through the machine. Real computers run exchanges like these millions of times per
        second and overlap multiple instructions at once; this model walks through one step, and one instruction, at a
        time so it stays possible to follow.
      </p>
    </div>
  );
}
