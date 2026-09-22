"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BASES, convertAll, levelAtLeast, type BaseId, type Level } from "../model";
import { Btn, Panel, SectionHeading } from "./ui-bits";

const SAMPLE_VALUES = [5, 13, 42, 90, 255];

export function BasesLab({ level }: { level: Level }) {
  const [selected, setSelected] = useState<BaseId>("decimal");
  const [sample, setSample] = useState(42);
  const bases = BASES.filter((b) => levelAtLeast(level, b.minLevel));
  const info = bases.find((b) => b.id === selected) ?? bases[0]!;
  const shown = convertAll(BigInt(sample));

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Number systems">
        A number system is a way of writing quantities using a fixed set of digits and place values. Computers work in binary, but people find it easier to
        read numbers grouped into octal or hexadecimal — the same value, just written differently.
      </SectionHeading>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Choose a number system">
        {bases.map((b) => (
          <button
            key={b.id}
            role="tab"
            aria-selected={selected === b.id}
            onClick={() => setSelected(b.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              selected === b.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {b.label}
          </button>
        ))}
      </div>

      <Panel>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h4 className="font-display text-lg font-medium text-ink dark:text-bone">
            {info.label} <span className="text-ink-soft dark:text-bone-soft">— base {info.radix}</span>
          </h4>
          <span className="font-mono text-xs text-ink-soft dark:text-bone-soft">digits: {info.digitRange}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{info.summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Example</span>
          <span className="rounded-md bg-ink/[0.04] px-2.5 py-1 font-mono text-base text-ink dark:bg-bone/[0.08] dark:text-bone">
            {info.example}
            {info.subscript}
          </span>
        </div>
      </Panel>

      <Panel title="Same value, every system">
        <p className="mb-3 text-sm text-ink-soft dark:text-bone-soft">Pick a sample value and see how it&apos;s written in each unlocked number system.</p>
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Sample value">
          {SAMPLE_VALUES.map((v) => (
            <Btn key={v} pressed={sample === v} onClick={() => setSample(v)}>
              {v}
            </Btn>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {bases.map((b) => (
            <div
              key={b.id}
              className={cn(
                "rounded-card border p-3 text-center transition-colors",
                b.id === "decimal" ? "border-subject-it/60 bg-subject-it-soft/40 dark:bg-subject-it/10" : "border-line dark:border-line-dark",
              )}
            >
              <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{b.label}</p>
              <p className="mt-1 break-all font-mono text-lg font-semibold text-ink dark:text-bone">
                {shown[b.id]}
                {b.subscript}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
