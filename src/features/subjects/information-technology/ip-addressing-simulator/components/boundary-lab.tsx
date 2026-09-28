"use client";

import { useState } from "react";
import { Callout, PillButton, SectionHeading } from "../../osi-model-explorer/components/ui";
import { COMMON_MASKS, analyze, formatIPv4, parseIPv4, prefixLimits, splitPortionsText, toOctets, type DetailLevel } from "../model";
import { BinaryAddress, BitLegend, KV, PrefixControl, TextField } from "./parts";

/** Sections 3-5: subnet mask, network vs host portion, binary mask visualizer. */
export function BoundaryLab({ level }: { level: DetailLevel }) {
  const [text, setText] = useState("192.168.1.25");
  const [prefix, setPrefix] = useState(24);
  const { min, max } = prefixLimits(level);
  const p = Math.max(min, Math.min(max, prefix));
  const parsed = parseIPv4(text);
  const info = parsed.ok ? analyze(parsed.value, p) : null;
  const split = parsed.ok ? splitPortionsText(parsed.value, p) : null;
  const o = parsed.ok ? toOctets(parsed.value) : [0, 0, 0, 0];
  const boundaryOctet = Math.floor(p / 8);
  const bitsIn = p % 8;

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Subnet mask and the network / host boundary">
        A subnet mask is 32 bits of 1s followed by 0s. Where the mask has a 1, the address bit belongs to the <strong>network portion</strong>; where it has a 0, the bit belongs to the <strong>host portion</strong>. The prefix length (/24) simply counts the 1s.
      </SectionHeading>

      <div className="grid gap-3 sm:grid-cols-2">
        <TextField id="bd-ip" label="IPv4 address" value={text} onChange={setText} error={parsed.ok ? null : parsed.reason} />
        <PrefixControl id="bd-prefix" prefix={p} onChange={setPrefix} min={min} max={max} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-ink-soft dark:text-bone-soft">Common masks:</span>
        {COMMON_MASKS.map((m) => (
          <PillButton key={m.prefix} active={p === m.prefix} onClick={() => setPrefix(m.prefix)}>
            /{m.prefix} · {m.mask}
          </PillButton>
        ))}
      </div>

      {info && parsed.ok && split && (
        <>
          <div className="rounded-card border border-line p-3 dark:border-line-dark" aria-live="polite">
            <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
              {formatIPv4(parsed.value)}/{p}
            </p>
            {split.aligned ? (
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <div className="rounded-card border-2 border-solid border-subject-it bg-subject-it-soft p-3 dark:bg-subject-it/20">
                  <p className="font-mono text-[10px] uppercase text-subject-it">Network portion ({p} bits)</p>
                  <p className="mt-1 font-mono text-xl text-ink dark:text-bone">{split.network}</p>
                </div>
                <div className="rounded-card border-2 border-dashed border-ink/50 p-3 dark:border-bone/50">
                  <p className="font-mono text-[10px] uppercase text-ink-soft dark:text-bone-soft">Host portion ({32 - p} bits)</p>
                  <p className="mt-1 font-mono text-xl text-ink dark:text-bone">{split.host}</p>
                </div>
              </div>
            ) : (
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <div className="rounded-card border-2 border-solid border-subject-it bg-subject-it-soft p-3 dark:bg-subject-it/20">
                  <p className="font-mono text-[10px] uppercase text-subject-it">Network portion ({p} bits)</p>
                  <p className="mt-1 text-sm text-ink dark:text-bone">
                    {boundaryOctet > 0 ? `The first ${boundaryOctet} octet${boundaryOctet > 1 ? "s" : ""} (${o.slice(0, boundaryOctet).join(".")}) plus the first ${bitsIn} bits of octet ${boundaryOctet + 1}.` : `The first ${bitsIn} bits of octet 1.`}
                  </p>
                </div>
                <div className="rounded-card border-2 border-dashed border-ink/50 p-3 dark:border-bone/50">
                  <p className="font-mono text-[10px] uppercase text-ink-soft dark:text-bone-soft">Host portion ({32 - p} bits)</p>
                  <p className="mt-1 text-sm text-ink dark:text-bone">The remaining {8 - bitsIn} bits of octet {boundaryOctet + 1}{boundaryOctet < 3 ? `, and every octet after it.` : "."}</p>
                </div>
              </div>
            )}
            {!split.aligned && <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">This prefix is not a multiple of 8, so the boundary falls <em>inside</em> an octet. It cannot be read from the dotted decimal alone. Check the bits below.</p>}
          </div>

          {/* proportional bar */}
          <div aria-hidden="true">
            <div className="flex h-6 overflow-hidden rounded-full border border-line dark:border-line-dark">
              <div className="flex items-center justify-center bg-subject-it text-[10px] font-semibold text-paper" style={{ width: `${(p / 32) * 100}%` }}>{p > 4 ? `network ${p}` : ""}</div>
              <div className="flex items-center justify-center border-l-4 border-amber-500 text-[10px] text-ink dark:text-bone" style={{ width: `${((32 - p) / 32) * 100}%`, backgroundImage: "repeating-linear-gradient(45deg, transparent 0 4px, rgba(128,128,128,.25) 4px 6px)" }}>{32 - p > 4 ? `host ${32 - p}` : ""}</div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-card border border-line p-3 dark:border-line-dark">
            <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Binary mask visualizer</p>
            <BinaryAddress value={parsed.value} prefix={p} label="IP address" />
            <BinaryAddress value={info.mask} prefix={p} label={`Mask (${formatIPv4(info.mask)}, /${p})`} />
            <BitLegend />
            <p className="text-xs text-ink-soft dark:text-bone-soft">Network bits are solid and filled; host bits are hollow with a dashed outline; the amber bar marks the boundary. Shape and labels carry the meaning, not only color.</p>
          </div>

          <dl className="rounded-card border border-line px-3 dark:border-line-dark">
            <KV label="Mask, decimal" value={formatIPv4(info.mask)} />
            <KV label="CIDR notation" value={`/${p}`} hint="A count of the 1 bits in the mask." />
            <KV label="Network bits / host bits" value={`${info.networkBits} / ${info.hostBits}`} />
          </dl>
        </>
      )}
      <Callout title="What a mask does">A mask does not change the address. It tells a device where to draw the line between &quot;which network&quot; and &quot;which device on that network&quot;. The same 32 bits give very different answers under /8, /16, or /24.</Callout>
    </div>
  );
}
