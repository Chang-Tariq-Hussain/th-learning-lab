"use client";

import { useState } from "react";
import { bitsArrayToDecimal, bitsToBytes, bytesToBits, formatBig, parseCount, toBase } from "../model";
import { BitRow, Btn, Panel, SectionHeading, TextField } from "./ui-bits";

export interface BitsBytesLabPreset {
  byte?: string;
}

const BIT_EXAMPLES = [8, 16, 32, 64];

export function BitsBytesLab({ preset }: { preset?: BitsBytesLabPreset }) {
  return (
    <div className="flex flex-col gap-8">
      <SectionHeading title="Bit &amp; byte laboratory">8 bits make 1 byte. Toggle a full byte below, then explore how bit counts scale up into bytes.</SectionHeading>
      <ByteToggle initial={preset?.byte} />
      <BitsToBytesConverter />
    </div>
  );
}

function ByteToggle({ initial }: { initial?: string }) {
  const [bits, setBits] = useState<string[]>(() => (initial ?? "01011010").padStart(8, "0").split(""));
  const joined = bits.join("");
  const value = bitsArrayToDecimal(bits);

  const toggle = (i: number) => setBits((prev) => prev.map((b, idx) => (idx === i ? (b === "1" ? "0" : "1") : b)));

  return (
    <Panel title="One byte, 8 bits">
      <BitRow bits={bits} onToggle={toggle} />
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-card bg-ink/[0.03] p-2.5 dark:bg-bone/[0.05]">
          <p className="text-[11px] text-ink-soft dark:text-bone-soft">Binary</p>
          <p className="font-mono text-base font-semibold text-ink dark:text-bone">{joined}</p>
        </div>
        <div className="rounded-card bg-ink/[0.03] p-2.5 dark:bg-bone/[0.05]">
          <p className="text-[11px] text-ink-soft dark:text-bone-soft">Decimal</p>
          <p className="font-mono text-base font-semibold text-subject-it">{value}</p>
        </div>
        <div className="rounded-card bg-ink/[0.03] p-2.5 dark:bg-bone/[0.05]">
          <p className="text-[11px] text-ink-soft dark:text-bone-soft">Hex</p>
          <p className="font-mono text-base font-semibold text-ink dark:text-bone">{toBase(BigInt(value), "hex")}</p>
        </div>
      </div>
    </Panel>
  );
}

function BitsToBytesConverter() {
  const [bitsInput, setBitsInput] = useState("64");
  const [bytesInput, setBytesInput] = useState("8");

  const bitsParsed = parseCount(bitsInput);
  const bytesParsed = parseCount(bytesInput);
  const fromBits = bitsParsed.ok ? bitsToBytes(bitsParsed.value) : null;
  const fromBytes = bytesParsed.ok ? bytesToBits(bytesParsed.value) : null;

  return (
    <Panel title="Bits ⇄ Bytes">
      <p className="mb-3 text-sm text-ink-soft dark:text-bone-soft">Common examples:</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {BIT_EXAMPLES.map((n) => (
          <Btn key={n} onClick={() => setBitsInput(String(n))}>
            {n} bits
          </Btn>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <TextField id="bits-to-bytes" label="Bits" value={bitsInput} onChange={setBitsInput} error={bitsParsed.ok ? null : bitsParsed.error} placeholder="64" />
          {fromBits && (
            <p className="text-sm text-ink dark:text-bone" aria-live="polite">
              = <span className="font-mono font-semibold text-subject-it">{fromBits.bytes}</span> bytes
              {!fromBits.exact && <span className="text-ink-soft dark:text-bone-soft"> ({fromBits.wholeBytes.toString()} whole bytes, {fromBits.leftoverBits} bits left over)</span>}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <TextField id="bytes-to-bits" label="Bytes" value={bytesInput} onChange={setBytesInput} error={bytesParsed.ok ? null : bytesParsed.error} placeholder="8" />
          {fromBytes !== null && (
            <p className="text-sm text-ink dark:text-bone" aria-live="polite">
              = <span className="font-mono font-semibold text-subject-it">{formatBig(fromBytes)}</span> bits
            </p>
          )}
        </div>
      </div>
    </Panel>
  );
}
