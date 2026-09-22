"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  bytesPerUnitText,
  converterUnits,
  convertUnits,
  prefixGapPercent,
  UNITS_DISCLAIMER,
  unitsInFamily,
  type Level,
} from "../model";
import { Callout, Panel, SectionHeading, SegmentedChoice, TextField } from "./ui-bits";

export interface DataUnitsLabPreset {
  from?: string;
  to?: string;
  value?: string;
}

const HIERARCHY: { label: string; note: string }[] = [
  { label: "bit", note: "smallest unit — 0 or 1" },
  { label: "byte", note: "8 bits" },
  { label: "kilobyte / kibibyte", note: "≈ a thousand bytes" },
  { label: "megabyte / mebibyte", note: "≈ a million bytes" },
  { label: "gigabyte / gibibyte", note: "≈ a billion bytes" },
  { label: "terabyte / tebibyte", note: "≈ a trillion bytes" },
  { label: "petabyte / pebibyte", note: "≈ a quadrillion bytes" },
];

export function DataUnitsLab({ level, preset }: { level: Level; preset?: DataUnitsLabPreset }) {
  return (
    <div className="flex flex-col gap-8">
      <SectionHeading title="Data units">
        Bytes stack into ever-larger units so people don&apos;t have to write huge byte counts. Two different conventions name those larger units — decimal and
        binary — and they are not the same size.
      </SectionHeading>

      <Panel title="The hierarchy">
        <div className="flex flex-col gap-1.5">
          {HIERARCHY.map((h, i) => (
            <div key={h.label} className="flex items-center gap-3">
              <span className="w-5 shrink-0 text-center font-mono text-xs text-ink-soft dark:text-bone-soft">{i > 0 ? "↓" : ""}</span>
              <span className="min-w-[13rem] font-mono text-sm font-medium text-ink dark:text-bone">{h.label}</span>
              <span className="text-xs text-ink-soft dark:text-bone-soft">{h.note}</span>
            </div>
          ))}
        </div>
      </Panel>

      <DecimalVsBinary detailed={level === "technical"} />
      <UnitConverter preset={preset} />
    </div>
  );
}

function DecimalVsBinary({ detailed }: { detailed: boolean }) {
  const decimalUnits = unitsInFamily("decimal");
  const binaryUnits = unitsInFamily("binary");

  return (
    <Panel title="Decimal (SI) vs binary (IEC) units">
      <Callout>{UNITS_DISCLAIMER}</Callout>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Decimal — powers of 1,000</p>
          <div className="flex flex-col gap-1 font-mono text-sm">
            {decimalUnits.map((u) => (
              <p key={u.id}>
                1 {u.symbol} = {bytesPerUnitText(u)} bytes
              </p>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Binary — powers of 1,024</p>
          <div className="flex flex-col gap-1 font-mono text-sm">
            {binaryUnits.map((u) => (
              <p key={u.id}>
                1 {u.symbol} = {bytesPerUnitText(u)} bytes
              </p>
            ))}
          </div>
        </div>
      </div>

      {detailed && (
        <div className="mt-4 rounded-card bg-ink/[0.03] p-3 dark:bg-bone/[0.05]">
          <p className="text-sm text-ink dark:text-bone">The gap between the two conventions grows with the prefix:</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
            {[1, 2, 3, 4].map((power) => (
              <div key={power} className="rounded-md border border-line px-2 py-1.5 dark:border-line-dark">
                <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">{["kilo/kibi", "mega/mebi", "giga/gibi", "tera/tebi"][power - 1]}</p>
                <p className="font-mono text-sm font-semibold text-subject-it">+{prefixGapPercent(power).toFixed(2)}%</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">
            It is not correct to say “1 KB always means 1,024 bytes.” KB (decimal) is 1,000 bytes; KiB (binary) is 1,024 bytes. Some tools use “KB” loosely
            to mean either.
          </p>
        </div>
      )}
    </Panel>
  );
}

function UnitConverter({ preset }: { preset?: DataUnitsLabPreset }) {
  const [system, setSystem] = useState<"decimal" | "binary">("decimal");
  const units = converterUnits(system);
  const [fromId, setFromId] = useState(preset?.from ?? "GB");
  const [toId, setToId] = useState(preset?.to ?? "MB");
  const [value, setValue] = useState(preset?.value ?? "4");

  const from = units.find((u) => u.id === fromId) ?? units[0]!;
  const to = units.find((u) => u.id === toId) ?? units[1]!;
  const result = convertUnits(value, from, to);

  const changeSystem = (s: "decimal" | "binary") => {
    setSystem(s);
    const first = converterUnits(s);
    setFromId(first.find((u) => u.family === s)?.id ?? first[0]!.id);
    setToId(first.find((u) => u.power === 2 && u.family === s)?.id ?? first[0]!.id);
  };

  return (
    <Panel title="Unit converter">
      <SegmentedChoice
        label="System"
        value={system}
        onChange={changeSystem}
        options={[
          { id: "decimal", label: "Decimal (kB, MB, GB…)" },
          { id: "binary", label: "Binary (KiB, MiB, GiB…)" },
        ]}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-end">
        <TextField id="unit-converter-value" label="Value" value={value} onChange={setValue} placeholder="4" />
        <UnitSelect label="From" units={units} value={fromId} onChange={setFromId} />
        <div className="hidden pb-2.5 text-center text-ink-soft dark:text-bone-soft sm:block">→</div>
        <UnitSelect label="To" units={units} value={toId} onChange={setToId} />
        <div />
      </div>

      {result.ok ? (
        <div className="mt-4 rounded-card bg-ink/[0.03] p-3 dark:bg-bone/[0.05]">
          <p className="text-center font-display text-xl font-semibold text-subject-it" aria-live="polite">
            {value || "0"} {from.symbol} = {result.exact ? "" : "≈ "}
            {result.result} {to.symbol}
          </p>
          <div className="mt-2 flex flex-col gap-0.5 text-center font-mono text-xs text-ink-soft dark:text-bone-soft">
            {result.steps.map((s, i) => (
              <p key={i}>{s}</p>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">{result.error}</p>
      )}
    </Panel>
  );
}

function UnitSelect({ label, units, value, onChange }: { label: string; units: { id: string; symbol: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-ink-soft dark:text-bone-soft">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-10 w-full rounded-lg border border-line bg-paper px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-subject-it dark:border-line-dark dark:bg-chalkboard",
        )}
      >
        {units.map((u) => (
          <option key={u.id} value={u.id}>
            {u.symbol}
          </option>
        ))}
      </select>
    </div>
  );
}
