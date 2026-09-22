"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { BASES, convertAll, formatBig, levelAtLeast, parseInBase, type BaseId, type Level } from "../model";
import { Panel, SectionHeading, TextField } from "./ui-bits";

export interface ConverterLabPreset {
  base?: BaseId;
  input?: string;
}

export function ConverterLab({ level, preset }: { level: Level; preset?: ConverterLabPreset }) {
  const bases = BASES.filter((b) => levelAtLeast(level, b.minLevel));
  const [base, setBase] = useState<BaseId>(preset?.base ?? "decimal");
  const [input, setInput] = useState(preset?.input ?? "42");

  const info = bases.find((b) => b.id === base) ?? bases[0]!;
  const parsed = useMemo(() => parseInBase(input, info.id), [input, info.id]);
  const results = parsed.ok ? convertAll(parsed.value) : null;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Universal converter">
        Type a value in any unlocked base and see it instantly in every other one. Invalid digits are explained, not just rejected.
      </SectionHeading>

      <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-end">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-ink-soft dark:text-bone-soft">Base</label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Input base">
            {bases.map((b) => (
              <button
                key={b.id}
                type="button"
                aria-pressed={base === b.id}
                onClick={() => setBase(b.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  base === b.id
                    ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                    : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
                )}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
        <TextField id="universal-converter-input" label={`Input (${info.digitRange})`} value={input} onChange={setInput} error={parsed.ok ? null : parsed.error} placeholder={info.example} />
      </div>

      {results && (
        <Panel title="Results">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {bases.map((b) => (
              <div
                key={b.id}
                className={cn(
                  "rounded-card border p-3 transition-colors",
                  b.id === base ? "border-subject-it/60 bg-subject-it-soft/40 dark:bg-subject-it/10" : "border-line dark:border-line-dark",
                )}
              >
                <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{b.label}</p>
                <p className="mt-1 break-all font-mono text-lg font-semibold text-ink dark:text-bone">{results[b.id]}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-ink-soft dark:text-bone-soft">Decimal value: {parsed.ok ? formatBig(parsed.value) : "—"}</p>
        </Panel>
      )}
    </div>
  );
}
