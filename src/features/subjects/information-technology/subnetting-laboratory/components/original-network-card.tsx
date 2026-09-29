"use client";

import { formatIPv4 } from "../../ip-addressing-simulator/model";
import { KV } from "../../ip-addressing-simulator/components/parts";
import { pow2, type SplitPlan } from "../model";

/** Section 1: the starting network at a glance. */
export function OriginalNetworkCard({ plan }: { plan: SplitPlan }) {
  const p = plan.parent;
  return (
    <div className="rounded-card border border-line p-3 dark:border-line-dark" aria-live="polite">
      <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Starting network</p>
      <dl className="mt-1">
        <KV label="Network" value={formatIPv4(p.network)} />
        <KV label="Prefix" value={`/${p.prefix}`} />
        <KV label="Subnet mask" value={formatIPv4(p.mask)} />
        <KV label="Host bits" value={p.hostBits} hint={`32 − ${p.prefix} = ${p.hostBits}`} />
        <KV label="Addresses" value={p.totalAddresses.toLocaleString()} hint={`${pow2(p.hostBits)}`} />
        <KV label="Typical usable hosts" value={p.usableHosts.toLocaleString()} hint={`${pow2(p.hostBits)} − 2: the network and broadcast addresses are not given to devices.`} />
      </dl>
    </div>
  );
}
