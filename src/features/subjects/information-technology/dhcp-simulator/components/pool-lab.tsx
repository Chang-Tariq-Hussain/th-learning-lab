"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import type { DhcpLab } from "../hooks/use-dhcp-lab";
import {
  DEFAULT_POOL,
  DNS_OPTIONS,
  GATEWAY_OPTIONS,
  LEASE_OPTIONS_MIN,
  NETWORK_ADDRESS,
  NETWORK_PREFIX,
  ROUTER,
  SERVER,
  SUBNET_MASK,
  addressState,
  formatDuration,
  ipAt,
  poolAddresses,
  poolStats,
  validatePool,
  type AddressState,
  type LabState,
  type PoolConfig,
} from "../model";
import { ActionButton, LeaseTable } from "./parts";

const CELL: Record<AddressState, string> = {
  available: "border border-line bg-white dark:border-line-dark dark:bg-white/[0.05]",
  offered: "bg-sky-500",
  leased: "bg-emerald-500",
  released: "bg-amber-400",
  expired: "bg-red-400",
  static: "bg-violet-500",
};
const CELL_LABEL: Record<AddressState, string> = { available: "Available", offered: "Offered", leased: "Leased", released: "Released", expired: "Expired", static: "In use (static)" };

/** Every address in the pool as a small square, coloured by its state. */
export function AddressMap({ state }: { state: LabState }) {
  const addrs = poolAddresses(state.pool);
  const stats = poolStats(state);
  const states: AddressState[] = ["available", "offered", "leased", "released", "expired", "static"];
  return (
    <Panel title={`Address pool map: .${state.pool.start} to .${state.pool.end}`}>
      <div className="flex flex-wrap gap-1" role="img" aria-label={`${addrs.length} pool addresses: ${stats.available} available, ${stats.leased} leased, ${stats.offered} offered`}>
        {addrs.length === 0 && <p className="text-xs text-ink-soft dark:text-bone-soft">The pool is empty.</p>}
        {addrs.map((ip) => {
          const st = addressState(state, ip);
          return <span key={ip} title={`${ip}: ${CELL_LABEL[st]}`} className={cn("h-4 w-4 rounded-[3px]", CELL[st])} />;
        })}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-ink-soft dark:text-bone-soft">
        {states.map((st) => (
          <li key={st} className="flex items-center gap-1.5">
            <span className={cn("inline-block h-3 w-3 rounded-[3px]", CELL[st])} aria-hidden />
            {CELL_LABEL[st]}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

const field = "min-h-[44px] w-full rounded-lg border border-line bg-paper px-3 text-sm text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone";

/** The DHCP server's configuration. Edits only take effect when the student presses Apply. */
export function PoolEditor({ lab }: { lab: DhcpLab }) {
  const saved = lab.saved.pool;
  const [start, setStart] = useState(String(saved.start));
  const [end, setEnd] = useState(String(saved.end));
  const [draft, setDraft] = useState<PoolConfig>(saved);
  const key = JSON.stringify(saved);
  useEffect(() => {
    setStart(String(saved.start));
    setEnd(String(saved.end));
    setDraft(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const candidate: PoolConfig = { ...draft, start: start.trim() === "" ? NaN : Number(start), end: end.trim() === "" ? NaN : Number(end) };
  const issues = validatePool(candidate);
  const dirty = JSON.stringify(candidate) !== JSON.stringify(saved);
  const size = issues.length === 0 ? candidate.end - candidate.start + 1 : 0;

  return (
    <Panel title="DHCP server configuration">
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="text-xs text-ink-soft dark:text-bone-soft">Network</dt>
        <dd className="font-mono text-ink dark:text-bone">
          {NETWORK_ADDRESS}/{NETWORK_PREFIX}
        </dd>
        <dt className="text-xs text-ink-soft dark:text-bone-soft">Subnet mask</dt>
        <dd className="font-mono text-ink dark:text-bone">{SUBNET_MASK}</dd>
        <dt className="text-xs text-ink-soft dark:text-bone-soft">Fixed addresses</dt>
        <dd className="text-xs text-ink dark:text-bone">
          Router {ROUTER.ip}, DHCP server {SERVER.ip} (keep these out of the pool)
        </dd>
      </dl>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft">
          First address
          <span className="flex items-center gap-1 font-mono text-[11px]">
            192.168.1.
            <input inputMode="numeric" value={start} onChange={(e) => setStart(e.target.value.replace(/\D/g, ""))} className={cn(field, "w-20 font-mono")} aria-label="First address of the pool (last number)" />
          </span>
        </label>
        <label className="flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft">
          Last address
          <span className="flex items-center gap-1 font-mono text-[11px]">
            192.168.1.
            <input inputMode="numeric" value={end} onChange={(e) => setEnd(e.target.value.replace(/\D/g, ""))} className={cn(field, "w-20 font-mono")} aria-label="Last address of the pool (last number)" />
          </span>
        </label>
        <label className="col-span-2 flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft sm:col-span-1">
          Default gateway handed out
          <select value={draft.gateway} onChange={(e) => setDraft({ ...draft, gateway: e.target.value })} className={field}>
            {GATEWAY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="col-span-2 flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft sm:col-span-1">
          DNS server handed out
          <select value={draft.dns} onChange={(e) => setDraft({ ...draft, dns: e.target.value })} className={field}>
            {DNS_OPTIONS.map((o) => (
              <option key={o.value || "none"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="col-span-2 flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft">
          Lease duration
          <select value={draft.leaseMin} onChange={(e) => setDraft({ ...draft, leaseMin: Number(e.target.value) })} className={field}>
            {LEASE_OPTIONS_MIN.map((m) => (
              <option key={m} value={m}>
                {formatDuration(m)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {issues.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1 rounded-lg border border-red-400/60 bg-red-50 p-2.5 text-xs text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200" role="alert">
          {issues.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      )}
      {issues.length === 0 && <p className="mt-3 text-xs text-ink-soft dark:text-bone-soft">This range holds {size} address{size === 1 ? "" : "es"}: {ipAt(candidate.start)} – {ipAt(candidate.end)}.</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <ActionButton tone="primary" disabled={issues.length > 0 || !dirty} onClick={() => lab.applyPoolConfig(candidate)}>
          Apply
        </ActionButton>
        <ActionButton onClick={() => lab.applyPoolConfig(DEFAULT_POOL)} disabled={JSON.stringify(saved) === JSON.stringify(DEFAULT_POOL)}>
          Restore defaults
        </ActionButton>
      </div>
    </Panel>
  );
}

export function PoolLab({ lab }: { lab: DhcpLab }) {
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="The DHCP address pool">
        A DHCP server does not invent addresses. It hands out addresses from a range an administrator configured, and remembers who holds each one.
      </SectionHeading>
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <PoolEditor lab={lab} />
        <div className="flex min-w-0 flex-col gap-4">
          <AddressMap state={lab.state} />
          <LeaseTable state={lab.state} />
        </div>
      </div>
      <Callout tone="neutral" title="Try it">
        Change the range, press Apply, then go to Get an Address and configure a PC: it receives the first free address of your range. Changing the pool does not move leases that already exist, and a wrong gateway or DNS value is handed to every new client.
      </Callout>
    </div>
  );
}
