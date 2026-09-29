"use client";

import { Callout, SectionHeading } from "../../osi-model-explorer/components/ui";
import { CollapsiblePanel } from "../../ip-addressing-simulator/components/parts";
import { SPECIAL_CASES, guideRows, pow2 } from "../model";

/** Section 17: expandable quick guide for /24 to /30, with the reasoning behind every number. */
export function GuideLab() {
  const rows = guideRows();
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Common prefix quick guide">A reference for splitting a /24. Every number below comes from the same three ideas, so you can rebuild any row yourself.</SectionHeading>
      <Callout title="Derive it, don't memorize it">
        Borrowed bits = prefix − 24. Subnets = 2<sup>borrowed</sup>. Host bits = 32 − prefix. Addresses = 2<sup>host bits</sup>. Typical usable hosts = addresses − 2. If you forget a row, rebuild it in ten seconds.
      </Callout>

      <div className="overflow-x-auto rounded-card border border-line dark:border-line-dark" tabIndex={0} aria-label="Prefix comparison table">
        <table className="w-full min-w-[560px] text-left text-xs">
          <thead className="bg-ink/[0.03] text-ink-soft dark:bg-bone/[0.05] dark:text-bone-soft">
            <tr>
              <th className="p-2">Prefix</th>
              <th className="p-2">Mask</th>
              <th className="p-2">Addresses</th>
              <th className="p-2">Typical usable</th>
              <th className="p-2">Subnets from a /24</th>
            </tr>
          </thead>
          <tbody className="font-mono text-ink dark:text-bone">
            {rows.map((r) => (
              <tr key={r.prefix} className="border-t border-line dark:border-line-dark">
                <td className="p-2">/{r.prefix}</td>
                <td className="p-2">{r.mask}</td>
                <td className="p-2">{r.addresses}</td>
                <td className="p-2">{r.usable}</td>
                <td className="p-2">{r.subnetsFromSlash24}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <CollapsiblePanel key={r.prefix} title={`/${r.prefix} — ${r.mask}`} defaultOpen={false}>
            <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
              <Line label="Mask" value={r.mask} />
              <Line label="Host bits" value={`32 − ${r.prefix} = ${r.hostBits}`} />
              <Line label="Addresses" value={`${pow2(r.hostBits)} = ${r.addresses}`} />
              <Line label="Typical usable hosts" value={`${r.addresses} − 2 = ${r.usable}`} />
              <Line label="Borrowed from a /24" value={`${r.prefix} − 24 = ${r.borrowedFromSlash24}`} />
              <Line label="Subnets when splitting a /24" value={`${pow2(r.borrowedFromSlash24)} = ${r.subnetsFromSlash24}`} />
            </dl>
          </CollapsiblePanel>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Special cases — not ordinary subnets</p>
        {SPECIAL_CASES.map((s) => (
          <Callout key={s.prefix} tone="warn" title={s.title}>
            {s.text}
          </Callout>
        ))}
      </div>
      <Callout title="Old address classes">Older material sorted addresses into Class A, B and C to decide the mask. Modern networks use CIDR: the prefix you choose decides the boundary, whatever the first number of the address is.</Callout>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 py-1 sm:flex-row sm:gap-2">
      <dt className="text-xs text-ink-soft dark:text-bone-soft sm:w-44 sm:shrink-0">{label}</dt>
      <dd className="break-words font-mono text-ink dark:text-bone">{value}</dd>
    </div>
  );
}
