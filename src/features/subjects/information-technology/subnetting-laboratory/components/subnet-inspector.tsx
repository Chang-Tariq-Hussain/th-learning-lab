"use client";

import { useState } from "react";
import { formatIPv4, ipBinary, parseIPv4 } from "../../ip-addressing-simulator/model";
import { CollapsiblePanel, Chip, KV, TextField } from "../../ip-addressing-simulator/components/parts";
import { findSubnet, pow2, type SplitPlan, type SubnetRow } from "../model";
import { SplitBits, SplitLegend } from "./split-bits";

/** Section 14: everything about one subnet, and why its addresses belong to it. Collapsible for phones. */
export function SubnetInspector({ plan, row }: { plan: SplitPlan; row: SubnetRow }) {
  return (
    <CollapsiblePanel title={`Subnet inspector — Subnet ${row.number} of ${plan.subnetCount}`}>
      <Body key={row.number} plan={plan} row={row} />
    </CollapsiblePanel>
  );
}

function Body({ plan, row }: { plan: SplitPlan; row: SubnetRow }) {
  const [probe, setProbe] = useState(formatIPv4(row.firstHost));
  const prefixBits = ipBinary(row.network).replace(/\./g, "").slice(0, plan.newPrefix);
  const hostBits = plan.hostBits;
  const p = parseIPv4(probe);
  const hit = p.ok ? findSubnet(plan, p.value) : null;

  return (
    <div className="flex flex-col gap-3">
      <dl>
        <KV label="Subnet number" value={`${row.number} of ${plan.subnetCount}`} hint={row.idBits ? `Its borrowed bits are ${row.idBits}. Each pattern of borrowed bits names one subnet.` : "Nothing is borrowed, so the whole network is subnet 1."} />
        <KV label="CIDR" value={`${formatIPv4(row.network)}/${row.prefix}`} />
        <KV label="Subnet mask" value={formatIPv4(plan.newMask)} />
        <KV label="Network address" value={formatIPv4(row.network)} hint="All host bits are 0." />
        <KV label="First host" value={formatIPv4(row.firstHost)} hint="Network address + 1." />
        <KV label="Last host" value={formatIPv4(row.lastHost)} hint="Broadcast address − 1." />
        <KV label="Broadcast" value={formatIPv4(row.broadcast)} hint="All host bits are 1." />
        <KV label="Host capacity" value={`${plan.addressesPerSubnet.toLocaleString()} addresses`} hint={`${pow2(plan.hostBits)} − 2 = ${plan.usablePerSubnet.toLocaleString()} typical usable hosts (ordinary subnet rule).`} />
      </dl>

      <div className="flex flex-col gap-2">
        <SplitBits orig={plan.origPrefix} next={plan.newPrefix} value={row.network} label="Binary network boundary (network address)" />
        <SplitLegend borrowed={plan.borrowed > 0} />
        <p className="text-sm text-ink-soft dark:text-bone-soft">
          Every address in this subnet starts with the same {plan.newPrefix} bits: <span className="break-all font-mono text-ink dark:text-bone">{prefixBits}</span>. Only the last {hostBits} host bit{hostBits === 1 ? "" : "s"} change, from {"0".repeat(hostBits)} (network) up to {"1".repeat(hostBits)} (broadcast).
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-card border border-dashed border-line p-3 dark:border-line-dark">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Try an address</p>
        <TextField id={`si-probe-${row.number}`} label="IPv4 address" value={probe} onChange={setProbe} error={p.ok ? null : p.reason} className="max-w-xs" />
        {p.ok && (
          <div className="flex flex-col gap-1 text-sm" aria-live="polite">
            <p className="break-all font-mono text-xs text-ink dark:text-bone">{ipBinary(p.value)}</p>
            {hit ? (
              <p className="text-ink-soft dark:text-bone-soft">
                First {plan.newPrefix} bits <span className="font-mono">{ipBinary(p.value).replace(/\./g, "").slice(0, plan.newPrefix)}</span> → network {formatIPv4(hit.network)}/{hit.prefix} = Subnet {hit.number}.
              </p>
            ) : (
              <p className="text-ink-soft dark:text-bone-soft">This address is outside {formatIPv4(plan.base)}/{plan.origPrefix}, so it belongs to none of these subnets.</p>
            )}
            {hit && <Chip tone={hit.number === row.number ? "good" : "warn"}>{hit.number === row.number ? "✓ Inside the inspected subnet" : `Belongs to Subnet ${hit.number}, not Subnet ${row.number}`}</Chip>}
          </div>
        )}
      </div>
    </div>
  );
}
