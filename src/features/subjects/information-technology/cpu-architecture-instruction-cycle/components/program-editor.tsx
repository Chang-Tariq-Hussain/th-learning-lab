"use client";

import { cn } from "@/lib/utils";
import { OPCODES, OPCODE_INFO, SCENARIOS, type ParseError } from "../model";

export interface ProgramEditorProps {
  source: string;
  onChangeSource: (source: string) => void;
  activeScenarioId: string | null;
  onSelectScenario: (id: string) => void;
  errors: ParseError[];
  instructionCount: number;
  className?: string;
}

export function ProgramEditor({
  source,
  onChangeSource,
  activeScenarioId,
  onSelectScenario,
  errors,
  instructionCount,
  className,
}: ProgramEditorProps) {
  return (
    <div className={cn("rounded-card border border-line bg-paper p-4 dark:border-line-dark dark:bg-chalkboard", className)}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subject-it">Simple Program Editor</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelectScenario(s.id)}
            title={s.description}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              activeScenarioId === s.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {s.title}
          </button>
        ))}
      </div>

      <textarea
        value={source}
        onChange={(e) => onChangeSource(e.target.value)}
        spellCheck={false}
        rows={6}
        className="mt-3 w-full resize-y rounded-lg border border-line bg-white p-3 font-mono text-sm text-ink outline-none focus:border-subject-it dark:border-line-dark dark:bg-black/20 dark:text-bone"
      />

      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] text-ink-soft dark:text-bone-soft">{instructionCount} instruction{instructionCount === 1 ? "" : "s"} compiled</span>
        <details className="text-[11px] text-ink-soft dark:text-bone-soft">
          <summary className="cursor-pointer select-none text-subject-it">Instruction reference</summary>
          <ul className="mt-1 space-y-0.5 font-mono">
            {OPCODES.map((op) => (
              <li key={op}>
                <span className="font-semibold">{OPCODE_INFO[op].syntax}</span> — {OPCODE_INFO[op].summary}
              </li>
            ))}
          </ul>
        </details>
      </div>

      {errors.length > 0 && (
        <div className="mt-2 rounded-lg border border-amber-400/60 bg-amber-50 p-2 text-xs text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/30 dark:text-amber-300">
          {errors.map((e, i) => (
            <p key={i}>
              Line {e.line}: {e.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
