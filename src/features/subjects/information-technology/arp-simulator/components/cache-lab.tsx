"use client";

import { useState } from "react";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import { BROADCAST_MAC, isBroadcastMac, isGroupMac, isValidMacFormat, normalizeMac } from "../../ethernet-mac-simulator/model";
import { parseIPv4 } from "../../ip-addressing-simulator/model";
import type { ArpLab } from "../hooks/use-arp-lab";
import { nodeById, type DetailLevel } from "../model";
import { CachePanel } from "./cache-panel";

/** Inspect, clear, reset — and (Intermediate and up) add or remove static entries by hand. */
export function CacheLab({ lab, level, onOpenResolve }: { lab: ArpLab; level: DetailLevel; onOpenResolve?: () => void }) {
  const [ip, setIp] = useState("");
  const [mac, setMac] = useState("");
  const [error, setError] = useState<string | null>(null);
  const node = nodeById(lab.nodes, lab.inspectId)!;
  const canEdit = level !== "beginner";
  const field = "min-h-[44px] rounded-lg border border-line bg-paper px-3 font-mono text-sm text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone";

  function add() {
    const parsed = parseIPv4(ip);
    if (!parsed.ok) return setError(parsed.reason);
    const cleanIp = ip.trim();
    if (cleanIp === node.ip) return setError(`${node.name} does not need an entry for its own address.`);
    const m = normalizeMac(mac);
    if (!isValidMacFormat(m)) return setError("Use six hex pairs, like AA:AA:AA:AA:AA:10.");
    if (isBroadcastMac(m) || isGroupMac(m)) return setError(`${m} is a group (broadcast/multicast) address, so it cannot be the MAC address of one device.`);
    setError(null);
    lab.addStatic(lab.inspectId, cleanIp, m);
    setIp("");
    setMac("");
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="ARP cache management">
        Every device keeps its own ARP cache. Pick a device to inspect it, clear what it has learned, or start it from scratch.
      </SectionHeading>

      <CachePanel lab={lab} onRemove={(entryIp) => lab.removeCacheEntry(lab.inspectId, entryIp)} />

      <div className="flex flex-wrap gap-2">
        <button onClick={() => lab.resetCache(lab.inspectId)} className="min-h-[44px] rounded-full border border-line px-4 text-sm font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone">
          Reset {node.name}&apos;s cache (remove everything)
        </button>
        <button onClick={lab.resetAllCaches} className="min-h-[44px] rounded-full border border-line px-4 text-sm font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone">
          Reset all caches
        </button>
        {onOpenResolve && (
          <button onClick={onOpenResolve} className="min-h-[44px] rounded-full border border-subject-it bg-subject-it-soft px-4 text-sm font-medium text-subject-it dark:bg-subject-it/20">
            Send data and watch the cache →
          </button>
        )}
      </div>

      {canEdit ? (
        <Panel title={`Add a static entry to ${node.name}`}>
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <label className="flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft">
              IPv4 address
              <input value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.20" spellCheck={false} autoComplete="off" className={field} />
            </label>
            <label className="flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft">
              MAC address
              <input value={mac} onChange={(e) => setMac(e.target.value)} placeholder="BA:BB:BB:BB:BB:20" spellCheck={false} autoComplete="off" className={field} />
            </label>
            <button onClick={add} className="min-h-[44px] rounded-full border border-subject-it bg-subject-it px-5 text-sm font-medium text-paper">
              Add static entry
            </button>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-ink-soft dark:text-bone-soft">
            <span>Quick fill MAC:</span>
            {lab.nodes.map((n) => (
              <button key={n.id} onClick={() => setMac(n.mac)} className="rounded-full border border-line px-2 py-1 font-mono dark:border-line-dark">
                {n.name}
              </button>
            ))}
          </div>
          {error && <p className="mt-2 text-xs text-red-700 dark:text-red-300" role="alert">{error}</p>}
          <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">
            You may enter a mapping that is wrong on purpose. The lab does not check it against the real devices — finding out is the point (see Challenge: Diagnose an incorrect IP/MAC mapping).
          </p>
        </Panel>
      ) : (
        <p className="text-xs text-ink-soft dark:text-bone-soft">Switch to Intermediate to add static entries by hand.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Callout tone="neutral" title="Learned vs. static entries">
          A <span className="font-medium">learned</span> (dynamic) entry is added automatically from ARP traffic. A <span className="font-medium">static</span> entry is configured by hand and is not replaced by ARP replies. Clear cache removes learned entries only.
        </Callout>
        <Callout tone="warn" title="Real systems are messier">
          Real operating systems age entries out after a while and differ in details, so this lab keeps only the essentials. Broadcast address {BROADCAST_MAC} is never stored as a device&apos;s MAC.
        </Callout>
      </div>
    </div>
  );
}
