"use client";

import { useState } from "react";
import { Callout, PillButton, SectionHeading } from "../../osi-model-explorer/components/ui";
import { CIDR_PREFIXES, analyze, formatIPv4, parseIPv4, prefixLimits, type DetailLevel } from "../model";
import { BinaryAddress, BitLegend, KV, PrefixControl, TextField } from "./parts";

/** Sections 17-18: CIDR prefix visualizer and address capacity. */
export function CidrLab({ level }: { level: DetailLevel }) {
  const [text, setText] = useState("192.168.1.130");
  const [prefix, setPrefix] = useState(24);
  const lim = prefixLimits(level);
  const p = Math.max(lim.min, Math.min(lim.max, prefix));
  const ip = parseIPv4(text);
  const info = ip.ok ? analyze(ip.value, p) : null;
  const prefixes = level === "beginner" ? CIDR_PREFIXES : Array.from({ length: lim.max - lim.min + 1 }, (_, i) => lim.min + i);

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="CIDR prefix visualizer">CIDR writes a network as address/prefix. Move the prefix and watch the boundary shift: each extra network bit halves the number of addresses.</SectionHeading>
      <TextField id="cd-ip" label="IPv4 address" value={text} onChange={setText} error={ip.ok ? null : ip.reason} className="max-w-xs" />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Prefix length">
        {CIDR_PREFIXES.map((c) => <PillButton key={c} active={p === c} onClick={() => setPrefix(c)}>/{c}</PillButton>)}
      </div>
      <PrefixControl id="cd-prefix" prefix={p} onChange={setPrefix} min={lim.min} max={lim.max} />

      {info && ip.ok && (
        <div className="flex flex-col gap-3 rounded-card border border-line p-3 dark:border-line-dark" aria-live="polite">
          <BinaryAddress value={ip.value} prefix={p} label={`${formatIPv4(ip.value)}/${p}`} />
          <BitLegend />
          <dl>
            <KV label="Network bits" value={info.networkBits} />
            <KV label="Host bits (H)" value={info.hostBits} />
            <KV label="Network address" value={formatIPv4(info.network)} />
            <KV label="Broadcast address" value={info.kind === "ordinary" ? formatIPv4(info.broadcast) : info.kind === "point-to-point" ? "special case (/31)" : "not applicable (/32)"} />
            <KV label="Total addresses" value={`2^${info.hostBits} = ${info.totalAddresses.toLocaleString()}`} />
            <KV label="Usable hosts (ordinary)" value={info.kind === "ordinary" ? `2^${info.hostBits} − 2 = ${info.usableHosts.toLocaleString()}` : `${info.usableHosts} (special case)`} />
          </dl>
        </div>
      )}

      <div className="overflow-x-auto rounded-card border border-line dark:border-line-dark" tabIndex={0} aria-label="Prefix comparison table">
        <table className="w-full min-w-[520px] text-left text-xs">
          <thead className="bg-ink/[0.03] text-ink-soft dark:bg-bone/[0.05] dark:text-bone-soft"><tr><th className="p-2">Prefix</th><th className="p-2">Mask</th><th className="p-2">Host bits</th><th className="p-2">Addresses</th><th className="p-2">Usable</th></tr></thead>
          <tbody className="font-mono text-ink dark:text-bone">
            {prefixes.map((c) => {
              const i = analyze(ip.ok ? ip.value : 0, c);
              return (
                <tr key={c} onClick={() => setPrefix(c)} className={"cursor-pointer border-t border-line dark:border-line-dark " + (c === p ? "bg-subject-it-soft font-semibold dark:bg-subject-it/20" : "")}>
                  <td className="p-2">{c === p ? "▶ " : ""}/{c}</td><td className="p-2">{formatIPv4(i.mask)}</td><td className="p-2">{i.hostBits}</td><td className="p-2">{i.totalAddresses.toLocaleString()}</td><td className="p-2">{i.kind === "ordinary" ? i.usableHosts.toLocaleString() : `${i.usableHosts}*`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Callout title="Where the numbers come from">
        IPv4 has 32 bits. With H host bits there are 2^H addresses in the block. In an ordinary subnet two are reserved (network and broadcast), leaving 2^H − 2 for devices. Each extra network bit takes one bit away from H, so the block halves. {level !== "technical" ? "Special cases /31 and /32 are covered in Technical mode." : "* /31 and /32 are special cases: /31 gives 2 usable addresses for point-to-point links, /32 is a single address."}
      </Callout>
    </div>
  );
}
