"use client";

import { useState } from "react";
import { Callout, PillButton, SectionHeading } from "../../osi-model-explorer/components/ui";
import { findDuplicates, hostById, validateConfig, type ConfigIssue, type DetailLevel, type HostId } from "../model";
import type { IpLab } from "../hooks/use-ip-lab";
import { Chip, TextField } from "./parts";
import { NetworkMapDiagram } from "./network-map-diagram";

const SEV_TONE = { error: "bad", warning: "warn", note: "neutral" } as const;
const SEV_LABEL = { error: "Error", warning: "Warning", note: "Note" } as const;

function DeviceForm({ lab, hostId, level, onApplied }: { lab: IpLab; hostId: HostId; level: DetailLevel; onApplied: () => void }) {
  const host = hostById(lab.hosts, hostId)!;
  const [ip, setIp] = useState(host.ip);
  const [mask, setMask] = useState(`/${host.prefix}`);
  const [gw, setGw] = useState(host.gateway);
  const check = validateConfig({ ip, mask, gateway: gw }, hostId, lab.hosts, level);
  const by = (f: ConfigIssue["field"]) => check.issues.filter((i) => i.field === f);
  const firstError = (f: ConfigIssue["field"]) => by(f).find((i) => i.severity === "error")?.message ?? null;

  const apply = () => {
    if (!check.ok || !check.parsed) return;
    lab.updateHost(hostId, { ip: check.parsed.ip, prefix: check.parsed.prefix, gateway: check.parsed.gateway });
    onApplied();
  };

  return (
    <div className="flex flex-col gap-3 rounded-card border border-line p-3 dark:border-line-dark">
      <div className="grid gap-3 sm:grid-cols-3">
        <TextField id={`cfg-ip-${hostId}`} label="IPv4 address" value={ip} onChange={setIp} error={firstError("ip")} />
        <TextField id={`cfg-mask-${hostId}`} label="Subnet mask or /prefix" value={mask} onChange={setMask} error={firstError("mask")} />
        <TextField id={`cfg-gw-${hostId}`} label="Default gateway" value={gw} onChange={setGw} error={firstError("gateway")} placeholder="optional" />
      </div>
      <ul className="flex flex-col gap-2" aria-live="polite">
        {check.issues.filter((i) => i.severity !== "error").map((i, idx) => (
          <li key={idx} className="flex flex-wrap items-start gap-2 text-sm text-ink dark:text-bone">
            <Chip tone={SEV_TONE[i.severity]}>{SEV_LABEL[i.severity]} · {i.field}</Chip>
            <span className="min-w-0 flex-1">{i.message}</span>
          </li>
        ))}
        {check.ok && check.issues.length === 0 && <li className="text-sm text-emerald-700 dark:text-emerald-300">✓ This configuration looks valid.</li>}
      </ul>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={apply} disabled={!check.ok} className="min-h-[44px] rounded-full border border-subject-it bg-subject-it px-5 text-sm font-medium text-paper disabled:opacity-40">Apply to {host.name}</button>
        <button type="button" onClick={() => { setIp(host.ip); setMask(`/${host.prefix}`); setGw(host.gateway); }} className="min-h-[44px] rounded-full border border-line px-4 text-sm dark:border-line-dark">Revert fields</button>
      </div>
      {!check.ok && <p className="text-xs text-ink-soft dark:text-bone-soft">Errors must be fixed before the configuration can be applied. Warnings can be applied so you can observe what goes wrong.</p>}
    </div>
  );
}

/** Sections 12-13: configure a device, validate with explanations, experiment with duplicate IPs. */
export function ConfigLab({ lab, level }: { lab: IpLab; level: DetailLevel }) {
  const [sel, setSel] = useState<HostId>("a");
  const [applied, setApplied] = useState(0);
  const dups = findDuplicates(lab.hosts);
  const a = hostById(lab.hosts, "a")!;
  const b = hostById(lab.hosts, "b")!;

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="IP configuration">Choose a device and edit its address, mask, and default gateway. Each problem is explained rather than just marked invalid.</SectionHeading>
      <NetworkMapDiagram hosts={lab.hosts} selected={sel} onSelect={(id) => id !== "router" && id !== "sw1" && id !== "sw2" && setSel(id)} showGatewayLabels />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Device to configure">
        {lab.hosts.map((h) => <PillButton key={h.id} active={sel === h.id} onClick={() => setSel(h.id)}>{h.name}</PillButton>)}
      </div>
      <DeviceForm key={`${sel}-${applied}`} lab={lab} hostId={sel} level={level} onApplied={() => setApplied((n) => n + 1)} />

      <div className="flex flex-col gap-3 rounded-card border border-line p-3 dark:border-line-dark">
        <p className="font-mono text-xs uppercase text-ink-soft dark:text-bone-soft">Duplicate IP experiment</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => { lab.updateHost("b", { ip: a.ip, prefix: a.prefix }); setApplied((n) => n + 1); }} className="min-h-[44px] rounded-full border border-amber-500 px-4 text-sm text-ink dark:text-bone">Give PC-B the same address as PC-A ({a.ip})</button>
          <button type="button" onClick={() => { lab.updateHost("b", { ip: "192.168.1.20" }); setApplied((n) => n + 1); }} className="min-h-[44px] rounded-full border border-line px-4 text-sm dark:border-line-dark">Restore PC-B ({b.ip === "192.168.1.20" ? "already 192.168.1.20" : "192.168.1.20"})</button>
        </div>
        {dups.length > 0 ? (
          <Callout tone="bad" title="Duplicate IP address">
            {dups.map((g) => (
              <p key={g.ip}><span className="font-mono">{g.ip}</span> is configured on: {g.holders.map((h) => h.name).join(" and ")}. If two interfaces claim the same address, traffic meant for one may reach the other or be lost, and connections become unreliable. Real behavior varies by system, so this lab only shows the warning. Fix it by giving each interface a different address in the same network.</p>
            ))}
          </Callout>
        ) : (
          <Callout tone="good" title="No duplicates">Every interface currently has a unique IPv4 address, which is what an IP network needs.</Callout>
        )}
      </div>
      <p className="text-xs text-ink-soft dark:text-bone-soft">Tip: in a /24 network such as 192.168.1.0/24, valid host addresses run from .1 to .254. The .0 and .255 addresses are the network and broadcast addresses.</p>
    </div>
  );
}
