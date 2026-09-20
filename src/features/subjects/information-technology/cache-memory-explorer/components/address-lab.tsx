"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ADDRESS_BITS, ADDRESS_MAX, formatHex, splitAddress, type AddressSplit } from "../model";
import { Callout, LABEL_CLASS, Panel, SelectField, Segmented } from "./ui-bits";

const SIZE_OPTIONS = [16, 32, 64, 128];
const LINE_OPTIONS = [1, 2, 4, 8];

function parse(raw: string): number | null {
  const t = raw.trim();
  if (!/^\d+$/.test(t)) return null;
  const n = Number(t);
  return n <= ADDRESS_MAX ? n : null;
}

function associativityName(sets: number, lines: number): string {
  if (sets === lines) return "direct-mapped (1 line per set)";
  if (sets === 1) return `fully associative (1 set of ${lines} lines)`;
  return `${lines / sets}-way set-associative`;
}

function FieldBar({ split }: { split: AddressSplit }) {
  const fields = [
    { name: "TAG", bits: split.tagBits, digits: split.tagStr, tone: "border-sky-500 bg-sky-50 text-sky-900 dark:bg-sky-500/10 dark:text-sky-200" },
    { name: "INDEX", bits: split.indexBits, digits: split.indexStr, tone: "border-subject-it bg-subject-it-soft text-amber-800 dark:text-amber-300 dark:bg-subject-it/15" },
    { name: "OFFSET", bits: split.offsetBits, digits: split.offsetStr, tone: "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200" },
  ];
  return (
    <div className="overflow-x-auto" role="img" aria-label={`Address ${split.binary}: tag ${split.tagStr || "none"}, index ${split.indexStr || "none"}, offset ${split.offsetStr || "none"}`}>
      <div className="flex min-w-[320px] gap-1">
        {fields.map((f) => (
          <div
            key={f.name}
            style={{ flexGrow: Math.max(f.bits, 1.2), flexBasis: 0 }}
            className={cn("min-w-[4.5rem] rounded-lg border-2 px-2 py-2 text-center", f.bits === 0 ? "border-dashed border-line text-ink-soft dark:border-line-dark dark:text-bone-soft" : f.tone)}
          >
            <p className="font-mono text-[10px] font-semibold tracking-wide">{f.name}</p>
            <p className="my-0.5 font-mono text-base font-semibold tracking-[0.15em]">{f.bits === 0 ? "—" : f.digits}</p>
            <p className="font-mono text-[10px]">{f.bits} bit{f.bits === 1 ? "" : "s"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AddressLab() {
  const [words, setWords] = useState(32);
  const [lineSize, setLineSize] = useState(4);
  const [setsChoice, setSetsChoice] = useState(4);
  const [rawA, setRawA] = useState("100");
  const [rawB, setRawB] = useState("228");

  const lines = words / lineSize;
  const sets = Math.min(setsChoice, lines);
  const ways = lines / sets;
  const setOptions: number[] = [];
  for (let s = 1; s <= lines; s *= 2) setOptions.push(s);

  const a = parse(rawA);
  const b = parse(rawB);
  const splitA = a === null ? null : splitAddress(a, lineSize, sets);
  const splitB = b === null ? null : splitAddress(b, lineSize, sets);

  return (
    <div className="flex flex-col gap-5">
      <Callout title="How a cache reads an address">
        The cache slices an address into three fields. The <strong className="font-medium">index</strong> picks which set to look in, the <strong className="font-medium">tag</strong> is compared against what is stored there to see whether it is the right block, and the <strong className="font-medium">offset</strong> picks the word inside the line.
      </Callout>

      <Panel title="Design the cache">
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <Segmented label="Cache size" options={SIZE_OPTIONS.map((n) => ({ value: n, label: `${n} words` }))} value={words} onChange={setWords} />
          <Segmented label="Line size" options={LINE_OPTIONS.map((n) => ({ value: n, label: n === 1 ? "1 word" : `${n} words` }))} value={lineSize} onChange={setLineSize} />
          <SelectField label="Number of sets" value={sets} options={setOptions.map((s) => ({ value: s, label: `${s} set${s === 1 ? "" : "s"}` }))} onChange={(v) => setSetsChoice(Number(v))} />
        </div>
        <p className="mt-3 font-mono text-xs text-ink-soft dark:text-bone-soft">
          {words} words ÷ {lineSize} per line = {lines} lines · {sets} set{sets === 1 ? "" : "s"} × {ways} way{ways === 1 ? "" : "s"} → {associativityName(sets, lines)}
        </p>
      </Panel>

      <Panel title="Split an address">
        <label className="flex flex-col gap-1">
          <span className={LABEL_CLASS}>Memory address (0–{ADDRESS_MAX})</span>
          <input
            type="text"
            inputMode="numeric"
            value={rawA}
            onChange={(e) => setRawA(e.target.value)}
            aria-invalid={a === null}
            className="h-11 w-32 rounded-lg border border-line bg-transparent px-3 font-mono text-base text-ink dark:border-line-dark dark:text-bone"
          />
        </label>
        {splitA && a !== null ? (
          <div className="mt-4 flex flex-col gap-4">
            <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">
              {a} = {formatHex(a, 3)} = {splitA.binary} ({ADDRESS_BITS}-bit address)
            </p>
            <FieldBar split={splitA} />
            <ol className="flex flex-col gap-1.5 font-mono text-xs text-ink dark:text-bone">
              <li>
                <span className="text-emerald-700 dark:text-emerald-300">Offset</span> = {a} mod {lineSize} = <strong>{splitA.offset}</strong> — word {splitA.offset} inside the line
              </li>
              <li>
                Block number = ⌊{a} ÷ {lineSize}⌋ = <strong>{splitA.block}</strong>
              </li>
              <li>
                <span className="text-amber-800 dark:text-amber-300">Index</span> = {splitA.block} mod {sets} = <strong>{splitA.index}</strong>
                {sets === 1 ? " — only one set, so there are no index bits" : ` — look in set ${splitA.index}`}
              </li>
              <li>
                <span className="text-sky-700 dark:text-sky-300">Tag</span> = ⌊{splitA.block} ÷ {sets}⌋ = <strong>{splitA.tag}</strong> — stored with the line to tell blocks in the same set apart
              </li>
            </ol>
          </div>
        ) : (
          <p className="mt-3 text-xs text-rose-700 dark:text-rose-300">Enter a whole number from 0 to {ADDRESS_MAX}.</p>
        )}
      </Panel>

      <Panel title="Do two addresses collide?">
        <label className="flex flex-col gap-1">
          <span className={LABEL_CLASS}>Second address</span>
          <input
            type="text"
            inputMode="numeric"
            value={rawB}
            onChange={(e) => setRawB(e.target.value)}
            aria-invalid={b === null}
            className="h-11 w-32 rounded-lg border border-line bg-transparent px-3 font-mono text-base text-ink dark:border-line-dark dark:text-bone"
          />
        </label>
        {splitA && splitB && a !== null && b !== null ? (
          <div className="mt-3 flex flex-col gap-2 text-sm text-ink dark:text-bone">
            <p className="font-mono text-xs">
              {a}: tag {splitA.tag}, index {splitA.index} · {b}: tag {splitB.tag}, index {splitB.index}
            </p>
            <p>
              {splitA.block === splitB.block
                ? "Same block: both addresses live in the same cache line, so one fetch serves both (spatial locality)."
                : splitA.index !== splitB.index
                  ? "Different sets: these blocks never compete for a line."
                  : ways === 1
                    ? "Same set, different tags — and this cache is direct-mapped, so they compete for one line. Using them alternately causes conflict misses."
                    : `Same set, different tags. They compete for the ${ways} line${ways === 1 ? "" : "s"} in that set — they can coexist, until a third block arrives for the same set.`}
            </p>
          </div>
        ) : (
          <p className="mt-3 text-xs text-rose-700 dark:text-rose-300">Enter a whole number from 0 to {ADDRESS_MAX}.</p>
        )}
      </Panel>

      <Callout tone="neutral">
        Simplified educational arithmetic. Real processors address bytes, use much longer addresses (often 32 to 48 bits or more), and the exact split depends on the architecture and cache design.
      </Callout>
    </div>
  );
}
