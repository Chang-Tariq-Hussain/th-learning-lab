"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Callout, Panel, SectionHeading } from "@/features/subjects/information-technology/osi-model-explorer/components/ui";
import { TCPIP_LAYERS, getTcpIpLayer, type DetailLevel, type TcpIpLayerId } from "../model";

/**
 * The four-layer interactive stack. Selecting a layer shows its
 * responsibility, protocols, typical data, OSI relationship, and a
 * real-world example (all levels); Intermediate adds a short deep-dive;
 * Technical adds how the layer interacts with its neighbours.
 */
export function LayerStack({ level }: { level: DetailLevel }) {
  const [selected, setSelected] = useState<TcpIpLayerId>("application");
  const [flow, setFlow] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  function sendData() {
    if (timerRef.current) clearTimeout(timerRef.current);
    const n = TCPIP_LAYERS.length;
    let i = 0;
    setFlow(0);
    const step = () => {
      i += 1;
      if (i >= n * 2) {
        setFlow(null);
        return;
      }
      setFlow(i < n ? i : n * 2 - 1 - i);
      timerRef.current = setTimeout(step, 450);
    };
    timerRef.current = setTimeout(step, 450);
  }

  const active = getTcpIpLayer(selected);
  const flowId = flow !== null ? TCPIP_LAYERS[flow]?.id : null;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="The four TCP/IP layers">
        TCP/IP is the practical model for how Internet communication is organized. Click a layer to inspect it, or
        press &quot;Send data&quot; to see data travel down the sender&apos;s stack and back up the receiver&apos;s.
      </SectionHeading>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Sender ↓ · Receiver ↑</span>
            <button
              onClick={sendData}
              disabled={flow !== null}
              className="rounded-full border border-subject-it bg-subject-it-soft px-3 py-1.5 text-xs font-medium text-subject-it disabled:opacity-40 dark:bg-subject-it/20"
            >
              Send data ▾
            </button>
          </div>

          <div className="flex flex-col overflow-hidden rounded-card border border-line dark:border-line-dark" role="list" aria-label="TCP/IP layers, Application at top through Network Access at bottom">
            {TCPIP_LAYERS.map((layer) => {
              const isSelected = layer.id === selected;
              const isFlowing = layer.id === flowId;
              return (
                <button
                  key={layer.id}
                  aria-pressed={isSelected}
                  onClick={() => setSelected(layer.id)}
                  className={cn(
                    "flex items-center gap-3 border-b border-line/60 px-4 py-4 text-left transition-colors last:border-b-0 dark:border-line-dark/60",
                    isSelected ? "bg-ink/[0.06] dark:bg-bone/[0.08]" : "hover:bg-ink/[0.03] dark:hover:bg-bone/[0.04]",
                  )}
                  style={{ borderLeft: `5px solid ${layer.accent}` }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold text-white"
                    style={{ backgroundColor: layer.accent }}
                  >
                    {layer.number}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-display text-sm font-medium text-ink dark:text-bone">{layer.name}</span>
                    <span className="text-xs text-ink-soft dark:text-bone-soft">
                      {layer.protocols.join(" · ")}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-ink-soft dark:border-line-dark dark:text-bone-soft">
                    OSI {layer.osiLayers.join("·")}
                  </span>
                  {isFlowing && <span className="h-3 w-3 shrink-0 animate-pulse rounded-full" style={{ backgroundColor: layer.accent }} aria-hidden />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Panel title={`Layer ${active.number} · ${active.name}`}>
            <p className="text-sm text-ink dark:text-bone">{active.responsibility}</p>
          </Panel>

          <div className="grid gap-3 sm:grid-cols-2">
            <Panel title="Common protocols">
              <div className="flex flex-wrap gap-1.5">
                {active.protocols.map((p) => (
                  <span key={p} className="rounded-full border border-line px-2.5 py-1 font-mono text-xs text-ink dark:border-line-dark dark:text-bone">
                    {p}
                  </span>
                ))}
              </div>
            </Panel>
            <Panel title="Typical data handled">
              <p className="text-sm text-ink-soft dark:text-bone-soft">{active.typicalData}</p>
            </Panel>
          </div>

          <Panel title="Relationship to OSI">
            <p className="text-sm text-ink-soft dark:text-bone-soft">{active.osiRelation}</p>
          </Panel>

          <Panel title="Real-world example">
            <p className="text-sm text-ink-soft dark:text-bone-soft">{active.example}</p>
          </Panel>

          {level !== "beginner" && (
            <Panel title="Going deeper">
              <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
                {active.deepDive.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </Panel>
          )}

          {level === "technical" && (
            <Panel title="Layer interactions">
              <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{active.interaction}</p>
            </Panel>
          )}

          {active.id === "application" && (
            <Callout tone="warn" title="Not a one-to-one match with OSI">
              TCP/IP&apos;s Application layer <em>encompasses</em> functions OSI separates into Application,
              Presentation, and Session. That is different from saying HTTP, DNS, or DHCP simply &quot;are&quot; those OSI
              layers — real protocols are not neatly assigned to one OSI layer.
            </Callout>
          )}
        </div>
      </div>
    </div>
  );
}
