"use client";

import { useState } from "react";
import { Callout, PillButton, SectionHeading } from "../../osi-model-explorer/components/ui";
import { bitAt, formatIPv4, ipBinary, octetBinary, parseIPv4, setBit, toOctets } from "../model";
import { OctetBits, TextField } from "./parts";

const WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];

/** Section 2: decimal and binary, expandable octets, clickable bits with their decimal contribution. */
export function ExplorerLab() {
  const [text, setText] = useState("192.168.1.10");
  const [open, setOpen] = useState<Set<number>>(new Set([3]));
  const parsed = parseIPv4(text);

  const toggleOpen = (i: number) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  const toggleBit = (bitIndex: number) => {
    if (!parsed.ok) return;
    setText(formatIPv4(setBit(parsed.value, bitIndex, bitAt(parsed.value, bitIndex) === 0)));
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="IPv4 Explorer">An IPv4 address is 32 bits, written as four 8-bit numbers (octets) separated by dots. Type an address, then open an octet and click its bits.</SectionHeading>
      <div className="flex flex-wrap items-end gap-3">
        <TextField id="ex-ip" label="IPv4 address" value={text} onChange={setText} error={parsed.ok ? null : parsed.reason} className="w-full max-w-xs" />
        <div className="flex flex-wrap gap-2">
          {["192.168.1.10", "10.0.0.1", "172.16.254.3", "8.8.8.8"].map((p) => (
            <PillButton key={p} active={text === p} onClick={() => setText(p)}>{p}</PillButton>
          ))}
        </div>
      </div>

      {parsed.ok && (
        <>
          <div className="grid gap-3 rounded-card border border-line p-3 dark:border-line-dark">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Decimal notation</p>
              <p className="mt-1 break-all font-mono text-lg text-ink dark:text-bone">{toOctets(parsed.value).join(" . ")}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Binary notation (32 bits)</p>
              <p className="mt-1 break-all font-mono text-base text-ink dark:text-bone">{ipBinary(parsed.value)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((i) => {
              const val = toOctets(parsed.value)[i]!;
              const isOpen = open.has(i);
              const parts = WEIGHTS.filter((_, b) => octetBinary(val)[b] === "1");
              return (
                <div key={i} className="rounded-card border border-line p-3 dark:border-line-dark">
                  <button type="button" onClick={() => toggleOpen(i)} aria-expanded={isOpen} className="flex min-h-[44px] w-full flex-wrap items-center justify-between gap-2 text-left">
                    <span className="font-mono text-sm text-ink dark:text-bone">
                      Octet {i + 1}: <strong>{val}</strong> = <span>{octetBinary(val)}</span>
                    </span>
                    <span className="text-xs text-subject-it">{isOpen ? "Collapse" : "Expand"}</span>
                  </button>
                  {isOpen && (
                    <div className="mt-2 flex flex-col gap-2 overflow-x-auto">
                      <OctetBits value={parsed.value} octetIndex={i} showWeights onToggle={toggleBit} />
                      <p className="font-mono text-sm text-ink dark:text-bone" aria-live="polite">
                        {parts.length === 0 ? "No bits are 1, so the value is 0." : `${parts.join(" + ")} = ${val}`}
                      </p>
                      <p className="text-xs text-ink-soft dark:text-bone-soft">Each bit is worth a power of two. Only the bits set to 1 add their value.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
      <Callout title="Why 0 to 255?">
        Eight bits can hold 2⁸ = 256 different values, from 0 (00000000) to 255 (11111111). That is why no octet can be 256 or more, and why the whole address has 4 × 8 = 32 bits.
      </Callout>
    </div>
  );
}
