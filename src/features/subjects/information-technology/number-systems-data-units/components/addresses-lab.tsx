"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ADDRESS_DISCLAIMER,
  ADDRESS_WIDTHS,
  addressRange,
  addressSequence,
  formatBinaryAddress,
  formatHexAddress,
  isPowerOfTwo,
  levelAtLeast,
  log2Exact,
  parseInBase,
  splitAddress,
  type AddressWidth,
  type Level,
} from "../model";
import { Btn, Callout, Panel, SectionHeading, TextField } from "./ui-bits";

export interface AddressesLabPreset {
  decimal?: number;
  addressBits?: AddressWidth;
}

export function AddressesLab({ level, preset }: { level: Level; preset?: AddressesLabPreset }) {
  return (
    <div className="flex flex-col gap-8">
      <SectionHeading title="Memory addresses">
        Every byte in memory has an address. Hexadecimal is the usual way to write addresses because it packs 4 bits per digit, so a long binary address
        becomes a short, readable string.
      </SectionHeading>
      <AddressConverter initial={preset?.decimal} />
      <HexAddressLab />
      <AddressRangeCalculator initial={preset?.addressBits} technical={level === "technical"} />
    </div>
  );
}

function AddressConverter({ initial }: { initial?: number }) {
  const [input, setInput] = useState(String(initial ?? 4096));
  const parsed = parseInBase(input, "decimal");
  const width = parsed.ok ? Math.max(16, Math.ceil(parsed.value.toString(2).length / 4) * 4) : 16;

  return (
    <Panel title="Decimal ⇄ hex ⇄ binary address converter">
      <TextField id="address-decimal" label="Decimal address" value={input} onChange={setInput} error={parsed.ok ? null : parsed.error} placeholder="4096" />
      {parsed.ok && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-card bg-ink/[0.03] p-3 text-center dark:bg-bone/[0.05]">
            <p className="text-[11px] text-ink-soft dark:text-bone-soft">Hexadecimal</p>
            <p className="font-mono text-lg font-semibold text-subject-it">{formatHexAddress(parsed.value, width)}</p>
          </div>
          <div className="rounded-card bg-ink/[0.03] p-3 text-center dark:bg-bone/[0.05]">
            <p className="text-[11px] text-ink-soft dark:text-bone-soft">Binary</p>
            <p className="break-all font-mono text-sm font-semibold text-ink dark:text-bone">{formatBinaryAddress(parsed.value, width)}</p>
          </div>
        </div>
      )}
      <Callout className="mt-3">{ADDRESS_DISCLAIMER}</Callout>
    </Panel>
  );
}

function HexAddressLab() {
  const [selected, setSelected] = useState<bigint | null>(null);
  const addresses = addressSequence(BigInt(0x1000), 4, 5);

  return (
    <Panel title="Hex address lab">
      <p className="mb-3 text-sm text-ink-soft dark:text-bone-soft">These five addresses are 4 bytes apart. Click one to see it in every base.</p>
      <div className="flex flex-wrap gap-2">
        {addresses.map((a) => (
          <button
            key={a.toString()}
            onClick={() => setSelected(a)}
            className={cn(
              "rounded-md border px-3 py-1.5 font-mono text-sm transition-colors",
              selected === a
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink hover:border-ink/30 dark:border-line-dark dark:text-bone dark:hover:border-bone/30",
            )}
          >
            {formatHexAddress(a, 16)}
          </button>
        ))}
      </div>
      {selected !== null && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-card bg-ink/[0.03] p-3 text-center dark:bg-bone/[0.05]">
            <p className="text-[11px] text-ink-soft dark:text-bone-soft">Hex</p>
            <p className="font-mono text-base font-semibold text-subject-it">{formatHexAddress(selected, 16)}</p>
          </div>
          <div className="rounded-card bg-ink/[0.03] p-3 text-center dark:bg-bone/[0.05]">
            <p className="text-[11px] text-ink-soft dark:text-bone-soft">Decimal</p>
            <p className="font-mono text-base font-semibold text-ink dark:text-bone">{selected.toString()}</p>
          </div>
          <div className="rounded-card bg-ink/[0.03] p-3 text-center dark:bg-bone/[0.05]">
            <p className="text-[11px] text-ink-soft dark:text-bone-soft">Binary</p>
            <p className="break-all font-mono text-xs font-semibold text-ink dark:text-bone">{formatBinaryAddress(selected, 16)}</p>
          </div>
        </div>
      )}
      <p className="mt-4 text-xs text-ink-soft dark:text-bone-soft">
        See these ideas at work in{" "}
        <Link href="/dashboard/information-technology/cache-memory-explorer" className="underline decoration-dotted underline-offset-2 hover:text-subject-it">
          Cache Memory Explorer
        </Link>{" "}
        (cache-line addressing) and{" "}
        <Link href="/dashboard/information-technology/cpu-architecture-instruction-cycle" className="underline decoration-dotted underline-offset-2 hover:text-subject-it">
          CPU Architecture &amp; Instruction Cycle
        </Link>{" "}
        (registers and instruction values).
      </p>
    </Panel>
  );
}

function AddressRangeCalculator({ initial, technical }: { initial?: AddressWidth; technical: boolean }) {
  const [bits, setBits] = useState<number>(initial ?? 8);
  const range = addressRange(bits);
  const [lineSize, setLineSize] = useState(64);
  const [setCount, setSetCount] = useState(256);
  const validCache = isPowerOfTwo(lineSize) && isPowerOfTwo(setCount) && log2Exact(lineSize) + log2Exact(setCount) <= 32;
  const split = validCache ? splitAddress(BigInt(0x1000), 32, lineSize, setCount) : null;

  return (
    <Panel title="Address range calculator">
      <div className="flex flex-wrap gap-2">
        {ADDRESS_WIDTHS.map((w) => (
          <Btn key={w} pressed={bits === w} onClick={() => setBits(w)}>
            {w}-bit
          </Btn>
        ))}
      </div>
      <div className="mt-4 rounded-card bg-ink/[0.03] p-3 text-center dark:bg-bone/[0.05]" aria-live="polite">
        <p className="font-mono text-sm text-ink-soft dark:text-bone-soft">
          2{"^"}
          {bits} =
        </p>
        <p className="mt-1 font-display text-xl font-semibold text-subject-it">{range.count.toLocaleString()} possible addresses</p>
        <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">
          Addresses 0 to {range.highestHex} ({range.byteAddressable} if each address names one byte)
        </p>
      </div>
      <Callout className="mt-3">{ADDRESS_DISCLAIMER} Many processors marketed as “64-bit” implement fewer than 64 real address bits.</Callout>

      {technical && (
        <div className="mt-5 border-t border-line pt-4 dark:border-line-dark">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Tag / index / offset (32-bit address, example)</p>
          <div className="flex flex-wrap gap-4">
            <TextField id="cache-line-size" label="Line size (bytes, power of 2)" value={String(lineSize)} onChange={(v) => setLineSize(Number(v) || 0)} className="w-36" />
            <TextField id="cache-set-count" label="Set count (power of 2)" value={String(setCount)} onChange={(v) => setSetCount(Number(v) || 0)} className="w-36" />
          </div>
          {split ? (
            <div className="mt-3 flex flex-wrap justify-center gap-1 font-mono text-sm">
              <span className="rounded-md bg-ink/[0.06] px-2 py-1 dark:bg-bone/[0.1]">tag ({split.tagBits}b): {split.tag || "—"}</span>
              <span className="rounded-md bg-subject-it-soft px-2 py-1 text-subject-it dark:bg-subject-it/20">index ({split.indexBits}b): {split.index || "—"}</span>
              <span className="rounded-md bg-ink/[0.06] px-2 py-1 dark:bg-bone/[0.1]">offset ({split.offsetBits}b): {split.offset || "—"}</span>
            </div>
          ) : (
            <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">Line size and set count must both be powers of two.</p>
          )}
          <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">
            Full mapping, associativity, and replacement policy live in{" "}
            <Link href="/dashboard/information-technology/cache-memory-explorer" className="underline decoration-dotted underline-offset-2 hover:text-subject-it">
              Cache Memory Explorer
            </Link>
            .
          </p>
        </div>
      )}
    </Panel>
  );
}
