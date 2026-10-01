"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import type { DhcpLab } from "../hooks/use-dhcp-lab";
import { CLIENT_META, canRunDora, diagnoseConfig, hasErrors, type ClientId, type DetailLevel, type IpConfig, type LabState } from "../model";
import { LabDiagram } from "./run-panel";
import { ActionButton, ClientPicker, ConfigCard, StepBanner } from "./parts";

const COMPARE: { row: string; manual: string; dhcp: string }[] = [
  { row: "Who chooses the values", manual: "A person types every value on every device.", dhcp: "The DHCP server supplies them all." },
  { row: "Effort for 100 devices", manual: "100 devices to configure and document.", dhcp: "One server configuration." },
  { row: "Typing mistakes", manual: "Likely: a wrong gateway or mask breaks the device.", dhcp: "Rare: the values are entered once." },
  { row: "Duplicate addresses", manual: "Easy to create by accident.", dhcp: "The server tracks who holds each address." },
  { row: "Changing the gateway or DNS", manual: "Visit every device.", dhcp: "Change the server; clients pick it up at renewal." },
  { row: "Needs a server on the network", manual: "No. Works even if nothing else is running.", dhcp: "Yes. Without a server the client gets no address." },
  { row: "Address stays the same", manual: "Always.", dhcp: "Usually, but not guaranteed. Leases can change." },
  { row: "Best for", manual: "Servers, routers, printers that others must find.", dhcp: "Laptops, phones and ordinary PCs." },
];

const inputCls = "min-h-[44px] w-full rounded-lg border border-line bg-paper px-3 font-mono text-sm text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone";

function ManualForm({ lab, id }: { lab: DhcpLab; id: ClientId }) {
  const saved = lab.saved.clients[id].manual;
  const [draft, setDraft] = useState<IpConfig>(saved);
  const findings = diagnoseConfig(draft, lab.saved, id);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const set = (k: keyof IpConfig) => (e: React.ChangeEvent<HTMLInputElement>) => setDraft({ ...draft, [k]: e.target.value.trim() });
  const rows: { k: keyof IpConfig; label: string }[] = [
    { k: "ip", label: "IP address" },
    { k: "mask", label: "Subnet mask" },
    { k: "gateway", label: "Default gateway" },
    { k: "dns", label: "DNS server" },
  ];
  return (
    <Panel title={`Type ${CLIENT_META[id].name}'s settings by hand`}>
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <label key={r.k} className="flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft">
            {r.label}
            <input value={draft[r.k]} onChange={set(r.k)} inputMode="decimal" autoComplete="off" spellCheck={false} className={inputCls} />
          </label>
        ))}
      </div>
      <ul className="mt-3 flex flex-col gap-1.5" aria-label="Diagnosis of these settings">
        {findings.map((f, i) => (
          <li
            key={i}
            className={cn(
              "rounded-lg border px-2.5 py-1.5 text-xs",
              f.level === "error" && "border-red-400/60 bg-red-50 text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200",
              f.level === "warn" && "border-amber-400/60 bg-amber-50 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200",
              f.level === "ok" && "border-emerald-400/60 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200",
            )}
          >
            <span className="font-semibold">{f.level === "error" ? "Problem: " : f.level === "warn" ? "Warning: " : "OK: "}</span>
            {f.text}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2">
        <ActionButton tone="primary" disabled={!dirty} onClick={() => lab.setManual(id, draft)}>
          Save settings
        </ActionButton>
        <ActionButton disabled={!dirty} onClick={() => setDraft(saved)}>
          Undo edits
        </ActionButton>
      </div>
    </Panel>
  );
}

function Diagnosis({ state, id }: { state: LabState; id: ClientId }) {
  const cfg = state.clients[id].config;
  if (!cfg) return null;
  const findings = diagnoseConfig(cfg, state, id);
  const bad = hasErrors(findings);
  return (
    <Callout tone={bad ? "bad" : "good"} title={bad ? "This configuration has problems" : "This configuration works"}>
      <ul className="flex list-disc flex-col gap-1 pl-4">
        {findings.map((f, i) => (
          <li key={i}>{f.text}</li>
        ))}
      </ul>
    </Callout>
  );
}

export function StaticLab({ lab, level }: { lab: DhcpLab; level: DetailLevel }) {
  const id = lab.selectedId;
  const c = lab.saved.clients[id];
  const running = !!lab.run && !lab.player.isFinished;
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Manual (static) configuration or DHCP?">
        A device can get its settings from a person or from a server. Switch a PC between the two and compare the work and the risks.
      </SectionHeading>
      <ClientPicker state={lab.state} value={id} onChange={lab.setSelectedId} />
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Configuration method">
        {(["dhcp", "manual"] as const).map((m) => (
          <button
            key={m}
            role="radio"
            aria-checked={c.mode === m}
            disabled={running}
            onClick={() => lab.setMode(id, m)}
            className={cn("min-h-[48px] rounded-card border-2 px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-40", c.mode === m ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft")}
          >
            {m === "dhcp" ? "DHCP Configuration" : "Manual Configuration"}
          </button>
        ))}
      </div>
      {c.mode === "manual" && <p className="text-xs text-ink-soft dark:text-bone-soft">Switching a PC to manual releases the lease it held, so its address goes back to the pool. (Most systems do this; if one did not, the server would keep the address reserved until the lease expired.)</p>}

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="flex min-w-0 flex-col gap-4">
          {c.mode === "manual" ? (
            <ManualForm key={`${id}-${JSON.stringify(c.manual)}`} lab={lab} id={id} />
          ) : (
            <Panel title="The server supplies everything">
              <p className="text-sm text-ink dark:text-bone">In DHCP mode there is nothing to type. The client asks, and the server answers with an address, mask, gateway, DNS server and lease time.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ActionButton tone="primary" disabled={running || !canRunDora(lab.saved, id)} onClick={() => lab.startDora([id], "auto")}>
                  Ask the DHCP server
                </ActionButton>
              </div>
            </Panel>
          )}
          {lab.run && <StepBanner lab={lab} level={level} />}
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <ConfigCard state={lab.state} id={id} />
          <Diagnosis state={lab.state} id={id} />
        </div>
      </div>
      {lab.run && <LabDiagram lab={lab} showIdleHint={false} />}

      <Panel title="Static or DHCP: the practical differences">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">Manual configuration compared with DHCP</caption>
            <thead>
              <tr className="border-b border-line text-ink-soft dark:border-line-dark dark:text-bone-soft">
                <th className="py-1.5 pr-2 font-medium" />
                <th className="py-1.5 pr-2 font-medium">Manual (static)</th>
                <th className="py-1.5 font-medium">DHCP</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((r) => (
                <tr key={r.row} className="border-b border-line/60 align-top dark:border-line-dark/60">
                  <th scope="row" className="py-2 pr-2 text-left font-medium text-ink dark:text-bone">
                    {r.row}
                  </th>
                  <td className="py-2 pr-2 text-ink-soft dark:text-bone-soft">{r.manual}</td>
                  <td className="py-2 text-ink-soft dark:text-bone-soft">{r.dhcp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
