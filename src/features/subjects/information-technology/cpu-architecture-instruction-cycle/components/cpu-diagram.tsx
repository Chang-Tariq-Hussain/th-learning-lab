"use client";

import { cn } from "@/lib/utils";
import { CPU_PARTS, DETAIL_LEVELS, type CpuPartId, type DetailLevel } from "../model";

export interface CpuDiagramProps {
  detailLevel: DetailLevel;
  activeParts: CpuPartId[];
  selectedPart: CpuPartId | null;
  onSelectPart: (id: CpuPartId) => void;
  className?: string;
}

function levelIndex(level: DetailLevel): number {
  return DETAIL_LEVELS.indexOf(level);
}

function PartBox({
  id,
  label,
  sub,
  active,
  selected,
  onSelect,
  className,
}: {
  id: CpuPartId;
  label: string;
  sub?: string;
  active: boolean;
  selected: boolean;
  onSelect: (id: CpuPartId) => void;
  className?: string;
}) {
  return (
    <button
      onClick={() => onSelect(id)}
      aria-pressed={selected}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 px-3 py-3 text-center transition-all",
        active
          ? "border-subject-it bg-subject-it-soft shadow-sm dark:bg-subject-it/20"
          : "border-line bg-paper dark:border-line-dark dark:bg-chalkboard",
        selected && !active && "border-ink/50 dark:border-bone/50",
        className,
      )}
    >
      <span className={cn("font-mono text-[11px] font-semibold uppercase tracking-wide", active ? "text-subject-it" : "text-ink dark:text-bone")}>
        {label}
      </span>
      {sub ? <span className="text-[10px] text-ink-soft dark:text-bone-soft">{sub}</span> : null}
    </button>
  );
}

/**
 * A deliberately flat, 2D "boxes and arrows" internal CPU diagram —
 * per spec section 35, 3D is not required here and would add nothing
 * to understanding execution flow. Layout mirrors the ASCII diagram in
 * the brief: Control Unit on top, Registers/ALU in the middle
 * connected by the Bus, Memory Interface below. Parts fade in as
 * `detailLevel` increases (PC/IR/Flags at Intermediate, Bus/Cache at
 * Technical) so Beginner mode isn't overwhelmed.
 */
export function CpuDiagram({ detailLevel, activeParts, selectedPart, onSelectPart, className }: CpuDiagramProps) {
  const visible = (id: CpuPartId) => {
    const part = CPU_PARTS.find((p) => p.id === id);
    return part ? levelIndex(detailLevel) >= levelIndex(part.minLevel) : false;
  };
  const isActive = (id: CpuPartId) => activeParts.includes(id);

  return (
    <div className={cn("flex flex-col items-center gap-3 rounded-card border border-line bg-paper p-4 dark:border-line-dark dark:bg-chalkboard sm:p-6", className)}>
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-subject-it">Virtual CPU</p>

      <PartBox id="controlUnit" label="Control Unit" active={isActive("controlUnit")} selected={selectedPart === "controlUnit"} onSelect={onSelectPart} className="w-full max-w-xs" />

      {visible("pc") || visible("ir") ? (
        <div className="flex w-full max-w-md flex-wrap justify-center gap-2">
          {visible("pc") && <PartBox id="pc" label="PC" active={isActive("pc")} selected={selectedPart === "pc"} onSelect={onSelectPart} className="flex-1" />}
          {visible("ir") && <PartBox id="ir" label="IR" active={isActive("ir")} selected={selectedPart === "ir"} onSelect={onSelectPart} className="flex-1" />}
          {visible("flags") && <PartBox id="flags" label="Flags" active={isActive("flags")} selected={selectedPart === "flags"} onSelect={onSelectPart} className="flex-1" />}
          {visible("clock") && <PartBox id="clock" label="Clock" active={isActive("clock")} selected={selectedPart === "clock"} onSelect={onSelectPart} className="flex-1" />}
        </div>
      ) : null}

      <div className="flex w-full max-w-md items-stretch justify-center gap-3">
        <PartBox id="registers" label="Registers" sub="R0–R3" active={isActive("registers")} selected={selectedPart === "registers"} onSelect={onSelectPart} className="flex-1" />
        <div className="flex items-center px-1 text-ink-soft dark:text-bone-soft" aria-hidden>
          ↔
        </div>
        <PartBox id="alu" label="ALU" active={isActive("alu")} selected={selectedPart === "alu"} onSelect={onSelectPart} className="flex-1" />
      </div>

      {visible("bus") && (
        <PartBox id="bus" label="CPU Bus" active={isActive("bus")} selected={selectedPart === "bus"} onSelect={onSelectPart} className="w-full max-w-md" />
      )}

      <div className="flex w-full max-w-md items-center justify-center gap-2 text-ink-soft dark:text-bone-soft" aria-hidden>
        <span>↕</span>
      </div>

      <div className="flex w-full max-w-md gap-2">
        <PartBox id="memory" label="Memory Interface" active={isActive("memory")} selected={selectedPart === "memory"} onSelect={onSelectPart} className="flex-1" />
        {visible("cache") && <PartBox id="cache" label="Cache" sub="conceptual" active={isActive("cache")} selected={selectedPart === "cache"} onSelect={onSelectPart} className="flex-1" />}
      </div>

      <p className="max-w-md text-center text-[11px] text-ink-soft dark:text-bone-soft">RAM (simulated)</p>
    </div>
  );
}
