"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { breakdownTotal, formatBig, groupBits, groupFromRight, HEX_LETTERS, parseInBase, placeValueBreakdown, superscript } from "../model";
import { BitRow, Panel, SectionHeading, SegmentedChoice, TextField } from "./ui-bits";

export interface GroupingLabPreset {
  sub?: "hex" | "octal" | "hex2dec";
  bits?: string;
}

const STARTERS = { hex: "10101101", octal: "101101", hex2dec: "2A" };

export function GroupingLab({ preset }: { preset?: GroupingLabPreset }) {
  const [sub, setSub] = useState<"hex" | "octal" | "hex2dec">(preset?.sub ?? "hex");

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Binary ↔ Hexadecimal ↔ Octal">
        Grouping bits is why hex and octal exist: 4 bits map exactly onto one hex digit, and 3 bits map exactly onto one octal digit — no remainder, no
        rounding.
      </SectionHeading>
      <SegmentedChoice
        label="What to explore"
        value={sub}
        onChange={setSub}
        options={[
          { id: "hex", label: "Binary ↔ Hex (groups of 4)" },
          { id: "octal", label: "Binary ↔ Octal (groups of 3)" },
          { id: "hex2dec", label: "Hex → Decimal (place value)" },
        ]}
      />
      {sub === "hex" && <BinaryGrouping key="hex" size={4} initial={preset?.bits ?? STARTERS.hex} />}
      {sub === "octal" && <BinaryGrouping key="octal" size={3} initial={preset?.bits ?? STARTERS.octal} />}
      {sub === "hex2dec" && <HexToDecimal />}
    </div>
  );
}

function BinaryGrouping({ size, initial }: { size: 3 | 4; initial: string }) {
  const width = Math.ceil(initial.length / size) * size;
  const [bits, setBits] = useState<string[]>(() => initial.padStart(width, "0").split(""));
  const joined = bits.join("");
  const groups = useMemo(() => groupBits(joined, size), [joined, size]);
  const targetLabel = size === 4 ? "hexadecimal" : "octal";

  const toggle = (i: number) => setBits((prev) => prev.map((b, idx) => (idx === i ? (b === "1" ? "0" : "1") : b)));
  const grow = () => setBits((prev) => ["0", ...prev]);
  const shrink = () => setBits((prev) => (prev.length > size ? prev.slice(1) : prev));

  return (
    <Panel title={`Group into ${size}s → ${targetLabel}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-ink-soft dark:text-bone-soft">Toggle bits, or grow/shrink the value by one group.</p>
        <div className="flex gap-2">
          <button onClick={shrink} className="rounded-full border border-line px-3 py-1 text-xs font-medium hover:border-ink/30 dark:border-line-dark dark:hover:border-bone/30">
            − group
          </button>
          <button onClick={grow} className="rounded-full border border-line px-3 py-1 text-xs font-medium hover:border-ink/30 dark:border-line-dark dark:hover:border-bone/30">
            + group
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto pb-2">
        <div className="flex min-w-max justify-center gap-3">
          {groups.map((g, gi) => (
            <div key={gi} className="flex flex-col items-center gap-1.5 rounded-card border border-line p-2 dark:border-line-dark">
              <BitRow bits={g.bits.split("")} onToggle={(local) => toggle(gi * size + local)} />
              <span className="font-mono text-xs text-ink-soft dark:text-bone-soft">
                {g.bits} = {g.value}
              </span>
              <span className="rounded-md bg-subject-it-soft px-2 py-0.5 font-mono text-base font-semibold text-subject-it dark:bg-subject-it/20">{g.digit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-card bg-ink/[0.03] p-3 text-center dark:bg-bone/[0.05]" aria-live="polite">
        <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">{groupFromRight(joined, size)}₂</p>
        <p className="mt-1 font-display text-2xl font-semibold text-subject-it">
          {groups.map((g) => g.digit).join("")}
          {size === 4 ? "₁₆" : "₈"}
        </p>
      </div>
    </Panel>
  );
}

function HexToDecimal() {
  const [input, setInput] = useState("2A");
  const parsed = parseInBase(input, "hex");
  const parts = parsed.ok ? placeValueBreakdown(parsed.digits, "hex") : [];

  return (
    <div className="flex flex-col gap-5">
      <TextField id="hex2dec-input" label="Type a hexadecimal value" value={input} onChange={setInput} error={parsed.ok ? null : parsed.error} placeholder="2A" />

      <Panel title="A–F mapping">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {HEX_LETTERS.map((h) => (
            <div key={h.letter} className="rounded-md border border-line px-2 py-1.5 text-center font-mono text-sm dark:border-line-dark">
              {h.letter} = {h.value}
            </div>
          ))}
        </div>
      </Panel>

      {parsed.ok && parts.length > 0 && (
        <Panel title="Place-value conversion">
          <div className="flex flex-col gap-1.5 font-mono text-sm">
            {parts.map((p, i) => (
              <div key={i} className={cn("rounded-md px-2.5 py-1.5", i === parts.length - 1 ? "bg-subject-it-soft text-ink dark:bg-subject-it/20 dark:text-bone" : "text-ink-soft dark:text-bone-soft")}>
                {p.char} × 16{superscript(p.power)} = {p.digitValue} × {formatBig(p.place)} = {formatBig(p.contribution)}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-card bg-ink/[0.03] p-3 text-center dark:bg-bone/[0.05]" aria-live="polite">
            <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">{parts.map((p) => formatBig(p.contribution)).join(" + ")}</p>
            <p className="mt-1 font-display text-2xl font-semibold text-subject-it">= {formatBig(breakdownTotal(parts))}₁₀</p>
          </div>
        </Panel>
      )}
    </div>
  );
}
