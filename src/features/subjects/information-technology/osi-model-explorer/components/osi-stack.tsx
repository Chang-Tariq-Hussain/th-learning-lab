"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { OSI_LAYERS, type DetailLevel, type OsiLayerNumber } from "../model";
import { Callout, Panel, SectionHeading } from "./ui";

interface OsiStackProps {
  level: DetailLevel;
}

/**
 * The centerpiece visual: a large interactive 7-layer stack (top =
 * Application, bottom = Physical). Clicking a layer selects it and
 * shows its detail below. A "Send data" control animates a small dot
 * traveling down through every layer, then back up, to communicate
 * that data actually passes through each layer in turn rather than
 * jumping straight from an application to the wire — the full
 * encapsulation/decapsulation mechanics live in their own tab; this is
 * the at-a-glance version that lives right next to the stack itself.
 */
export function OsiStack({ level }: OsiStackProps) {
  const [selected, setSelected] = useState<OsiLayerNumber>(7);
  const [flowIndex, setFlowIndex] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  function playFlow() {
    if (timerRef.current) clearTimeout(timerRef.current);
    let i = 0;
    setFlowIndex(0);
    const step = () => {
      i += 1;
      if (i >= OSI_LAYERS.length * 2) {
        setFlowIndex(null);
        return;
      }
      setFlowIndex(i < OSI_LAYERS.length ? i : OSI_LAYERS.length * 2 - 1 - i);
      timerRef.current = setTimeout(step, 380);
    };
    timerRef.current = setTimeout(step, 380);
  }

  const activeLayer = OSI_LAYERS.find((l) => l.number === selected)!;
  const flowLayerNumber = flowIndex !== null ? OSI_LAYERS[flowIndex]?.number : null;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="The seven OSI layers">
        Click any layer to inspect it. Data created by an application travels down through every layer to be
        transmitted, and a receiving device travels back up through the same layers to reconstruct it — press
        &quot;Send data&quot; to see that motion.
      </SectionHeading>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
              Computer A — sending
            </span>
            <button
              onClick={playFlow}
              disabled={flowIndex !== null}
              className="rounded-full border border-subject-it bg-subject-it-soft px-3 py-1.5 text-xs font-medium text-subject-it disabled:opacity-40 dark:bg-subject-it/20"
            >
              Send data ▾
            </button>
          </div>

          <div className="flex flex-col overflow-hidden rounded-card border border-line dark:border-line-dark" role="list" aria-label="OSI layers, Application at top through Physical at bottom">
            {OSI_LAYERS.map((layer) => {
              const isSelected = layer.number === selected;
              const isFlowing = layer.number === flowLayerNumber;
              return (
                <button
                  key={layer.number}
                  aria-pressed={isSelected}
                  onClick={() => setSelected(layer.number)}
                  className={cn(
                    "group relative flex items-center gap-3 border-b border-line/60 px-4 py-3 text-left transition-colors last:border-b-0 dark:border-line-dark/60",
                    isSelected ? "bg-ink/[0.06] dark:bg-bone/[0.08]" : "bg-transparent hover:bg-ink/[0.03] dark:hover:bg-bone/[0.04]",
                  )}
                  style={{ borderLeft: `5px solid ${layer.accent}` }}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold text-white"
                    style={{ backgroundColor: layer.accent }}
                  >
                    {layer.number}
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="font-display text-sm font-medium text-ink dark:text-bone">{layer.name}</span>
                    <span className="text-xs text-ink-soft dark:text-bone-soft">{layer.responsibility}</span>
                  </span>
                  {isFlowing && (
                    <span
                      className="h-3 w-3 shrink-0 animate-pulse rounded-full"
                      style={{ backgroundColor: layer.accent }}
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
          </div>
          <span className="text-center font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
            Computer B — receiving
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <Panel title={`Layer ${activeLayer.number} · ${activeLayer.name}`}>
            <p className="text-sm text-ink dark:text-bone">{activeLayer.responsibility}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{activeLayer.realWorld}</p>
          </Panel>

          <Panel title="What happens here?">
            <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{activeLayer.whatHappensHere}</p>
          </Panel>

          {level !== "beginner" && (
            <div className="grid grid-cols-2 gap-3">
              <Panel title="Typical PDU">
                <p className="font-mono text-sm text-ink dark:text-bone">{activeLayer.pdu}</p>
              </Panel>
              <Panel title="Example device">
                <p className="font-mono text-sm text-ink dark:text-bone">{activeLayer.device ?? "End host (multiple layers)"}</p>
              </Panel>
            </div>
          )}

          {level !== "beginner" && (
            <Panel title="Protocols & examples">
              <div className="flex flex-wrap gap-1.5">
                {activeLayer.protocols.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-line px-2.5 py-1 text-xs font-mono text-ink dark:border-line-dark dark:text-bone"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>

      {level === "beginner" && (
        <Callout tone="neutral" title="Coming into focus gradually">
          Switch to Intermediate or Technical (top of the page) to see each layer&apos;s typical data unit, example
          devices, and protocol examples alongside its responsibility.
        </Callout>
      )}
    </div>
  );
}
