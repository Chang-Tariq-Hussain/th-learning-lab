"use client";

import { cn } from "@/lib/utils";
import { binaryOf, type AluOperation } from "../model";

export interface AluPanelProps {
  alu: AluOperation | undefined;
  stage: string | undefined;
  showBinary?: boolean;
  className?: string;
}

export function AluPanel({ alu, stage, showBinary, className }: AluPanelProps) {
  const active = stage === "execute" && !!alu;
  return (
    <div
      className={cn(
        "rounded-card border p-4 transition-colors",
        active ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/20" : "border-line bg-paper dark:border-line-dark dark:bg-chalkboard",
        className,
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subject-it">ALU</p>
      {alu ? (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 font-mono text-sm">
          <span className="rounded-lg border border-line px-3 py-1.5 text-ink dark:border-line-dark dark:text-bone">A = {alu.inputA}</span>
          <span className="text-ink-soft dark:text-bone-soft">{alu.op}</span>
          <span className="rounded-lg border border-line px-3 py-1.5 text-ink dark:border-line-dark dark:text-bone">B = {alu.inputB}</span>
          <span className="text-ink-soft dark:text-bone-soft">→</span>
          <span className="rounded-lg border border-subject-it bg-subject-it-soft px-3 py-1.5 font-semibold text-subject-it dark:bg-subject-it/20">
            Result = {alu.result}
          </span>
        </div>
      ) : null}
      {alu && showBinary ? (
        <div className="mt-3 border-t border-line/60 pt-3 text-center font-mono text-xs text-ink-soft dark:border-line-dark/60 dark:text-bone-soft">
          <p>
            {binaryOf(alu.inputA)}
            <span className="mx-2">{alu.op === "SUB" ? "−" : alu.op}</span>
            {binaryOf(alu.inputB)}
            <span className="mx-2">=</span>
            <span className="font-semibold text-subject-it">{binaryOf(alu.result)}</span>
          </p>
          <p className="mt-1">
            {binaryOf(alu.result)}₂ = {alu.result}₁₀
          </p>
        </div>
      ) : null}
      {!alu && (
        <p className="mt-3 text-sm text-ink-soft dark:text-bone-soft">No ALU operation this step.</p>
      )}
    </div>
  );
}
