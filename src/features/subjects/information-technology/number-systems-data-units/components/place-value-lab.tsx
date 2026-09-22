"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  BASES,
  breakdownTotal,
  formatBig,
  levelAtLeast,
  parseInBase,
  placeValueBreakdown,
  superscript,
  type BaseId,
  type Level,
} from "../model";
import { Panel, SectionHeading, TextField } from "./ui-bits";

const STARTER: Record<BaseId, string> = { decimal: "203", binary: "1011", octal: "203", hex: "1A3" };

export function PlaceValueLab({ level }: { level: Level }) {
  const bases = BASES.filter((b) => levelAtLeast(level, b.minLevel));
  const [base, setBase] = useState<BaseId>("binary");
  const [input, setInput] = useState(STARTER.binary);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const info = bases.find((b) => b.id === base) ?? bases[0]!;

  const parsed = useMemo(() => parseInBase(input, info.id), [input, info.id]);
  const parts = parsed.ok ? placeValueBreakdown(parsed.digits, info.id) : [];
  const total = parts.length ? breakdownTotal(parts) : null;

  const changeBase = (id: BaseId) => {
    setBase(id);
    setInput(STARTER[id]);
    setActiveIndex(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Place value visualizer">
        Every digit in a number is worth its digit value times a place value — the base raised to a power. Click a digit below to see exactly what it
        contributes to the total.
      </SectionHeading>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Number system for the place-value visualizer">
        {bases.map((b) => (
          <button
            key={b.id}
            role="tab"
            aria-selected={base === b.id}
            onClick={() => changeBase(b.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              base === b.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {b.label}
          </button>
        ))}
      </div>

      <TextField
        id="place-value-input"
        label={`Type a ${info.label.toLowerCase()} value (digits ${info.digitRange})`}
        value={input}
        onChange={(v) => {
          setInput(v);
          setActiveIndex(null);
        }}
        error={parsed.ok ? null : parsed.error}
        placeholder={info.example}
      />

      {parsed.ok && parts.length > 0 && (
        <Panel>
          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-max justify-center gap-2 sm:gap-3">
              {parts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex((cur) => (cur === i ? null : i))}
                  className={cn(
                    "flex w-16 flex-col items-center gap-1 rounded-card border-2 p-2.5 text-center transition-all sm:w-20",
                    activeIndex === i ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/20" : "border-line dark:border-line-dark hover:border-ink/30 dark:hover:border-bone/30",
                  )}
                >
                  <span className="font-mono text-[10px] text-ink-soft dark:text-bone-soft">
                    {info.radix}
                    {superscript(p.power)}
                  </span>
                  <span className="font-mono text-2xl font-semibold text-ink dark:text-bone">{p.char}</span>
                  <span className="font-mono text-[10px] text-ink-soft dark:text-bone-soft">= {formatBig(p.place)}</span>
                </button>
              ))}
            </div>
          </div>

          {activeIndex !== null && parts[activeIndex] ? (
            <p className="mt-4 text-center text-sm text-ink dark:text-bone" aria-live="polite">
              Digit <span className="font-mono font-semibold">{parts[activeIndex]!.char}</span> is in the {info.radix}
              {superscript(parts[activeIndex]!.power)} place, worth {formatBig(parts[activeIndex]!.place)}. Contribution: {parts[activeIndex]!.digitValue}
              &nbsp;×&nbsp;{formatBig(parts[activeIndex]!.place)} = <span className="font-mono font-semibold text-subject-it">{formatBig(parts[activeIndex]!.contribution)}</span>
            </p>
          ) : (
            <p className="mt-4 text-center text-sm text-ink-soft dark:text-bone-soft">Click any digit above to see its contribution.</p>
          )}

          <div className="mt-4 rounded-card bg-ink/[0.03] p-3 text-center dark:bg-bone/[0.05]">
            <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">
              {parts.map((p) => `${p.digitValue}×${formatBig(p.place)}`).join(" + ")}
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-subject-it">= {total !== null ? formatBig(total) : "—"}₁₀</p>
          </div>
        </Panel>
      )}
    </div>
  );
}
