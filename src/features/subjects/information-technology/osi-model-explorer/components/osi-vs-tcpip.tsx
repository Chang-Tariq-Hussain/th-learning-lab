"use client";

import { OSI_LAYERS, TCP_IP_LAYERS, getLayer } from "../model";
import { Callout, SectionHeading } from "./ui";

export function OsiVsTcpIp() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="OSI vs. TCP/IP — a quick introductory comparison">
        The TCP/IP model is the model the real internet is built on. It groups the same ideas into four layers
        instead of seven. This is only a small introduction — a dedicated TCP/IP Model simulation covers it in
        depth.
      </SectionHeading>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-card border border-line p-4 dark:border-line-dark">
          <p className="mb-3 text-center font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
            OSI — 7 layers
          </p>
          <div className="flex flex-col overflow-hidden rounded-lg border border-line dark:border-line-dark">
            {OSI_LAYERS.map((layer) => (
              <div key={layer.number} className="flex items-center gap-2 border-b border-line/60 px-3 py-2 last:border-b-0 dark:border-line-dark/60" style={{ borderLeft: `4px solid ${layer.accent}` }}>
                <span className="font-mono text-xs text-ink-soft dark:text-bone-soft">{layer.number}</span>
                <span className="text-sm text-ink dark:text-bone">{layer.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-line p-4 dark:border-line-dark">
          <p className="mb-3 text-center font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
            TCP/IP — 4 layers
          </p>
          <div className="flex flex-col gap-2">
            {TCP_IP_LAYERS.map((group) => (
              <div key={group.name} className="rounded-lg border border-line p-3 dark:border-line-dark">
                <p className="text-sm font-medium text-ink dark:text-bone">{group.name}</p>
                <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">
                  Roughly covers: {group.osiLayers.map((n) => getLayer(n).name).join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Callout tone="neutral" title="Different organization, not a contradiction">
        Both models describe the same underlying ideas — addressing, delivery, reliability, and application data —
        just grouped differently. OSI&apos;s seven layers are mainly a detailed teaching and reference model; TCP/IP&apos;s
        four layers are closer to how real internet protocols are actually organized.
      </Callout>
    </div>
  );
}
