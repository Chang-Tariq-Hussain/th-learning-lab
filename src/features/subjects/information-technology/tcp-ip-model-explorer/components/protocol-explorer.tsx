"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Callout, Panel, SectionHeading } from "@/features/subjects/information-technology/osi-model-explorer/components/ui";
import { PROTOCOLS, TCPIP_LAYERS, getTcpIpLayer, type DetailLevel } from "../model";

/** Introductory protocol map: protocols grouped under their layer. */
export function ProtocolExplorer({ level }: { level: DetailLevel }) {
  const [selectedId, setSelectedId] = useState("http");
  const selected = PROTOCOLS.find((p) => p.id === selectedId)!;
  const layer = getTcpIpLayer(selected.layer);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Protocol explorer">
        Each protocol has a home layer. Click one to see what it is for and a simple example. This is a first look —
        dedicated simulations will cover the important ones in depth later.
      </SectionHeading>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <div className="flex flex-col overflow-hidden rounded-card border border-line dark:border-line-dark">
          {TCPIP_LAYERS.map((l) => (
            <div
              key={l.id}
              className="flex flex-col gap-2 border-b border-line/60 p-3 last:border-b-0 dark:border-line-dark/60 sm:flex-row sm:items-center"
              style={{ borderLeft: `5px solid ${l.accent}` }}
            >
              <p className="text-sm font-medium text-ink dark:text-bone sm:w-40 sm:shrink-0">{l.name}</p>
              <div className="flex flex-wrap gap-2">
                {PROTOCOLS.filter((p) => p.layer === l.id).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    aria-pressed={selectedId === p.id}
                    className={cn(
                      "min-h-[40px] rounded-full border px-3.5 py-1.5 font-mono text-xs font-medium transition-colors",
                      selectedId === p.id
                        ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                        : "border-line text-ink hover:border-ink/30 dark:border-line-dark dark:text-bone dark:hover:border-bone/30",
                    )}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <Panel title={selected.name}>
            <p className="text-sm text-ink dark:text-bone">{selected.purpose}</p>
          </Panel>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Panel title="Layer">
              <p className="flex items-center gap-2 text-sm text-ink dark:text-bone">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: layer.accent }} aria-hidden />
                {layer.name}
              </p>
            </Panel>
            <Panel title="Simple example">
              <p className="text-sm text-ink-soft dark:text-bone-soft">{selected.example}</p>
            </Panel>
          </div>
          {level === "technical" && (
            <Panel title="Protocol role">
              <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{selected.role}</p>
            </Panel>
          )}
        </div>
      </div>

      <Callout tone="neutral" title="Protocols work together">
        A single web page load involves protocols at every layer at once — for example HTTP over TCP over IP over
        Ethernet or Wi-Fi. Each protocol does its own job and relies on the layer beneath it.
      </Callout>
    </div>
  );
}
