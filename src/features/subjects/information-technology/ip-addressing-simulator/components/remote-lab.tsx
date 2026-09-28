"use client";

import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { Callout, PillButton, SectionHeading } from "../../osi-model-explorer/components/ui";
import { evaluateSend, type HostId, type OneWay, type SendEvaluation } from "../model";
import type { IpLab } from "../hooks/use-ip-lab";
import { Chip, TextField } from "./parts";
import { NetworkMapDiagram } from "./network-map-diagram";

const HOST_IDS: HostId[] = ["a", "b", "d", "c"];

function Flow({ way }: { way: OneWay }) {
  const local = way.scope === "local";
  const steps = local
    ? ["Destination is on the local network", "Local destination", "Delivered directly (no gateway needed)"]
    : way.scope === "remote"
      ? ["Destination is not on the local network", "Remote destination", "Router is needed (via the default gateway)"]
      : ["Address problem"];
  return (
    <ol className="flex flex-col items-start gap-1">
      {steps.map((s, i) => (
        <li key={s} className="flex flex-col items-start gap-1">
          <span className="rounded-card border border-line px-3 py-1.5 text-sm text-ink dark:border-line-dark dark:text-bone">{s}</span>
          {i < steps.length - 1 && <ArrowDown className="ml-4 h-4 w-4 text-ink-soft dark:text-bone-soft" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}

/** Sections 10-11: local vs. remote destination and the default gateway. No routing protocol is simulated. */
export function RemoteLab({ lab, initialSrc = "a", initialDst = "c" }: { lab: IpLab; initialSrc?: HostId; initialDst?: HostId }) {
  const [src, setSrc] = useState<HostId>(initialSrc);
  const [dst, setDst] = useState<HostId>(initialDst);
  const [result, setResult] = useState<SendEvaluation | null>(null);
  const srcHost = lab.hosts.find((h) => h.id === src)!;

  const clear = () => setResult(null);
  const send = () => setResult(evaluateSend(src, dst, lab.hosts));
  const setGw = (g: string) => {
    lab.updateHost(src, { gateway: g });
    clear();
  };
  const routerGw = srcHost.lan === 1 ? "192.168.1.1" : "192.168.2.1";
  const otherPc = lab.hosts.find((h) => h.lan === srcHost.lan && h.id !== src);

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Local or remote destination? The default gateway">
        A host first asks: is the destination on my own network? If yes, it delivers directly. If not, it hands the data to its <strong>default gateway</strong>, the router address on its own network. This is a simplified decision, not a routing simulation.
      </SectionHeading>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft">
          <span className="font-mono uppercase">Sender</span>
          <select value={src} onChange={(e) => { const v = e.target.value as HostId; setSrc(v); if (v === dst) setDst(HOST_IDS.find((h) => h !== v)!); clear(); }} className="min-h-[44px] rounded-card border border-line bg-paper px-2 text-sm text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone">
            {lab.hosts.map((h) => <option key={h.id} value={h.id}>{h.name} · {h.ip}/{h.prefix}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft">
          <span className="font-mono uppercase">Destination</span>
          <select value={dst} onChange={(e) => { setDst(e.target.value as HostId); clear(); }} className="min-h-[44px] rounded-card border border-line bg-paper px-2 text-sm text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone">
            {lab.hosts.filter((h) => h.id !== src).map((h) => <option key={h.id} value={h.id}>{h.name} · {h.ip}/{h.prefix}</option>)}
          </select>
        </label>
      </div>

      <NetworkMapDiagram hosts={lab.hosts} path={result?.forward.path} pathOk={result?.forward.ok ?? true} gatewayFor={src} showGatewayLabels />

      <div className="flex flex-col gap-3 rounded-card border border-line p-3 dark:border-line-dark">
        <p className="font-mono text-xs uppercase text-ink-soft dark:text-bone-soft">{srcHost.name}&apos;s default gateway</p>
        <TextField id="rm-gw" label="Default gateway" value={srcHost.gateway} onChange={setGw} placeholder="e.g. 192.168.1.1 (empty = none)" />
        <div className="flex flex-wrap gap-2">
          <PillButton active={srcHost.gateway === routerGw} onClick={() => setGw(routerGw)}>Router: {routerGw}</PillButton>
          <PillButton active={srcHost.gateway === ""} onClick={() => setGw("")}>No gateway</PillButton>
          {otherPc && <PillButton active={srcHost.gateway === otherPc.ip} onClick={() => setGw(otherPc.ip)}>A PC: {otherPc.ip}</PillButton>}
          <PillButton active={srcHost.gateway === "192.168.9.1"} onClick={() => setGw("192.168.9.1")}>Off-network: 192.168.9.1</PillButton>
        </div>
        <p className="text-xs text-ink-soft dark:text-bone-soft">A default gateway is the device a host can use to reach destinations outside its local IP network. It must be an address on the host&apos;s own network.</p>
      </div>

      <button type="button" onClick={send} className="min-h-[44px] self-start rounded-full border border-subject-it bg-subject-it px-5 py-2 text-sm font-medium text-paper">
        Send from {srcHost.name} to {lab.hosts.find((h) => h.id === dst)?.name}
      </button>

      {result && (
        <div className="flex flex-col gap-4 rounded-card border border-line p-3 dark:border-line-dark" aria-live="polite">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone={result.ok ? "good" : "bad"}>{result.ok ? "✓ Can proceed" : "✕ Cannot proceed"}</Chip>
            <Chip tone="info">{result.forward.scope === "local" ? "Local destination" : result.forward.scope === "remote" ? "Remote destination" : "Invalid"}</Chip>
          </div>
          <p className="text-sm font-medium text-ink dark:text-bone">{result.headline}</p>
          <Flow way={result.forward} />
          <div>
            <p className="font-mono text-xs uppercase text-ink-soft dark:text-bone-soft">Reasoning</p>
            <ol className="mt-1 list-decimal pl-5 text-sm text-ink dark:text-bone">
              {result.forward.lines.map((l, i) => <li key={i}>{l}</li>)}
            </ol>
          </div>
          {result.forward.ok && (
            <div>
              <p className="font-mono text-xs uppercase text-ink-soft dark:text-bone-soft">Reply direction ({result.reverse.from} → {result.reverse.to})</p>
              <p className="mt-1 text-sm text-ink dark:text-bone">{result.reverse.ok ? "✓ " : "✕ "}{result.reverse.headline}</p>
              {!result.reverse.ok && <ol className="mt-1 list-decimal pl-5 text-sm text-ink-soft dark:text-bone-soft">{result.reverse.lines.map((l, i) => <li key={i}>{l}</li>)}</ol>}
            </div>
          )}
          <p className="text-sm text-ink-soft dark:text-bone-soft">{result.summary}</p>
        </div>
      )}
      <Callout title="Only remote traffic needs the gateway">Sending to a device on your own network does not use the default gateway. Try PC-A → PC-B with no gateway set: it still works, because that destination is local.</Callout>
      <div className="text-right"><button type="button" onClick={() => { lab.resetAll(); clear(); }} className="min-h-[44px] rounded-full border border-line px-4 text-xs dark:border-line-dark">Reset all addresses</button></div>
    </div>
  );
}
