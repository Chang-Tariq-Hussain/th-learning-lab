"use client";

import { cn } from "@/lib/utils";
import { buildPipelineTable, PIPELINE_DISCLAIMER, STAGE_LABELS, type CycleStage, type ProgramInstruction } from "../model";

export interface PipelineModeProps {
  instructions: ProgramInstruction[];
  className?: string;
}

const STAGE_SHORT: Record<CycleStage, string> = { fetch: "F", decode: "D", execute: "E", writeback: "W" };

export function PipelineMode({ instructions, className }: PipelineModeProps) {
  const shown = instructions.slice(0, 5);
  const { cells, totalCycles } = buildPipelineTable(shown.length);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="rounded-card border border-line bg-paper p-4 dark:border-line-dark dark:bg-chalkboard">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subject-it">Pipeline — Advanced Concept</p>
        <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">
          Multiple instructions can occupy different pipeline stages at the same time. Instead of finishing Instruction 1&rsquo;s entire cycle before
          Instruction 2 even starts Fetch, a pipelined CPU starts fetching Instruction 2 as soon as Instruction 1 moves on to Decode.
        </p>

        {shown.length === 0 ? (
          <p className="mt-4 text-sm text-ink-soft dark:text-bone-soft">Compile a program with at least two instructions to see it pipelined below.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-[420px] border-separate border-spacing-1 font-mono text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left font-normal text-ink-soft dark:text-bone-soft">Cycle</th>
                  {Array.from({ length: totalCycles }, (_, i) => i + 1).map((c) => (
                    <th key={c} className="px-2 py-1 text-center font-normal text-ink-soft dark:text-bone-soft">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((instr, i) => (
                  <tr key={instr.address}>
                    <td className="whitespace-nowrap px-2 py-1 text-ink dark:text-bone">
                      Instr {i + 1} <span className="opacity-60">({instr.text})</span>
                    </td>
                    {Array.from({ length: totalCycles }, (_, ci) => ci + 1).map((c) => {
                      const cell = cells.find((cell) => cell.instructionIndex === i && cell.cycle === c);
                      return (
                        <td key={c} className="text-center">
                          {cell ? (
                            <span
                              title={STAGE_LABELS[cell.stage]}
                              className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-subject-it bg-subject-it-soft font-semibold text-subject-it dark:bg-subject-it/20"
                            >
                              {STAGE_SHORT[cell.stage]}
                            </span>
                          ) : (
                            <span className="inline-flex h-6 w-6 items-center justify-center text-ink-soft/30 dark:text-bone-soft/20">·</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-3 text-[11px] text-ink-soft dark:text-bone-soft">{PIPELINE_DISCLAIMER}</p>
      </div>
    </div>
  );
}
