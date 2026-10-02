"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import { formatIp, hostById, maskText, networkOf, parseIp, type PlanStep, type Scenario } from "../model";

/**
 * The host's own decision, before any router is involved: is the destination on my network?
 * Shown as a live preview of the packet being built; it lights up while the packet is at stages 2 and 3.
 */
export const GatewayPanel = memo(function GatewayPanel({ scenario, srcId, dstIp, step }: { scenario: Scenario; srcId: string; dstIp: string | null; step: PlanStep | null }) {
  const src = hostById(scenario, srcId);
  const srcN = parseIp(src.ip)!;
  const dstN = dstIp ? parseIp(dstIp) : null;
  const mask = maskText(src.prefix);
  const srcNet = formatIp(networkOf(srcN, src.prefix));
  const dstNet = dstN === null ? null : formatIp(networkOf(dstN, src.prefix));
  const same = dstNet !== null && dstNet === srcNet;
  const live = !!step && (step.phase === 2 || step.phase === 3) && step.at.t !== "router";
  const gwActive = !!step && step.phase === 3;

  return (
    <Panel title="Host decision · default gateway">
      <div className="flex flex-col gap-3">
        <dl className="grid grid-cols-1 gap-2 text-xs min-[420px]:grid-cols-3">
          <div className="rounded-lg border border-line px-2.5 py-2 dark:border-line-dark">
            <dt className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{src.name} IP</dt>
            <dd className="font-mono text-sm text-ink dark:text-bone">{src.ip}</dd>
          </div>
          <div className="rounded-lg border border-line px-2.5 py-2 dark:border-line-dark">
            <dt className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Subnet mask</dt>
            <dd className="font-mono text-sm text-ink dark:text-bone">
              {mask} <span className="text-ink-soft dark:text-bone-soft">/{src.prefix}</span>
            </dd>
          </div>
          <div className={cn("rounded-lg border-2 px-2.5 py-2 transition-colors", gwActive ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10" : "border-amber-400/60 bg-amber-50/50 dark:border-amber-500/40 dark:bg-amber-500/5")}>
            <dt className="font-mono text-[10px] uppercase tracking-wide text-amber-700 dark:text-amber-300">Default gateway</dt>
            <dd className="font-mono text-sm font-semibold text-ink dark:text-bone">{src.gateway}</dd>
          </div>
        </dl>

        <div className={cn("rounded-xl border px-3 py-2.5 text-xs transition-colors", live ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/15" : "border-line dark:border-line-dark")}>
          {dstN === null || dstIp === null ? (
            <p className="text-ink-soft dark:text-bone-soft">Enter a valid destination to see the host’s decision.</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              <p className="font-mono text-ink dark:text-bone">
                Destination: <strong>{dstIp}</strong>
              </p>
              <p className="break-words font-mono text-ink-soft dark:text-bone-soft">
                My network: {src.ip} AND {mask} = <span className="text-ink dark:text-bone">{srcNet}</span>
              </p>
              <p className="break-words font-mono text-ink-soft dark:text-bone-soft">
                Its network: {dstIp} AND {mask} = <span className="text-ink dark:text-bone">{dstNet}</span>
              </p>
              <p aria-hidden className="font-mono text-ink-soft dark:text-bone-soft">
                ↓
              </p>
              {same ? (
                <p className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">Same network → deliver directly (no router needed)</p>
              ) : (
                <>
                  <p className="font-mono font-semibold text-amber-700 dark:text-amber-300">Different network detected</p>
                  <p aria-hidden className="font-mono text-ink-soft dark:text-bone-soft">
                    ↓
                  </p>
                  <p className="font-mono font-semibold text-ink dark:text-bone">Send to default gateway {src.gateway}</p>
                </>
              )}
            </div>
          )}
        </div>
        <p className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">A host normally sends traffic for a remote network to its configured default gateway: the router interface on its own network.</p>
      </div>
    </Panel>
  );
});
