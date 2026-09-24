"use client";

import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { Callout, Panel, SectionHeading } from "@/features/subjects/information-technology/osi-model-explorer/components/ui";
import {
  DESIGN_DIFFERENCES,
  OSI_LAYERS,
  OSI_TCPIP_MAPPING_NOTES,
  TCPIP_LAYERS,
  getTcpIpLayer,
  tcpIpLayerForOsi,
  type DetailLevel,
  type OsiLayerNumber,
  type TcpIpLayerId,
} from "../model";

type Selection = { model: "osi"; layer: OsiLayerNumber } | { model: "tcpip"; layer: TcpIpLayerId };

/** OSI rows a TCP/IP layer spans, as grid row-start / row-span (7 rows top→bottom). */
function rowSpan(id: TcpIpLayerId): { start: number; span: number } {
  const layer = getTcpIpLayer(id);
  const nums = layer.osiLayers;
  const top = Math.max(...nums);
  const start = 8 - top; // OSI 7 → row 1
  return { start, span: nums.length };
}

/**
 * Interactive OSI ↔ TCP/IP comparison. Click a layer in either model
 * to highlight the corresponding layer(s) in the other. On phones the
 * two models stack vertically as plain lists; from `sm` up they line
 * up as the classic side-by-side diagram with TCP/IP layers spanning
 * the OSI rows they cover.
 */
export function OsiMapping({ level }: { level: DetailLevel }) {
  const [sel, setSel] = useState<Selection>({ model: "tcpip", layer: "application" });

  const activeTcp: TcpIpLayerId | null =
    sel.model === "tcpip" ? sel.layer : tcpIpLayerForOsi(sel.layer).id;
  const activeOsi: OsiLayerNumber[] =
    sel.model === "osi" ? [sel.layer] : getTcpIpLayer(sel.layer).osiLayers;

  const isOsiHighlighted = (n: OsiLayerNumber) => activeOsi.includes(n);
  const osiIsPrimary = (n: OsiLayerNumber) => sel.model === "osi" && sel.layer === n;
  const tcpIsPrimary = (id: TcpIpLayerId) => sel.model === "tcpip" && sel.layer === id;

  const activeTcpLayer = getTcpIpLayer(activeTcp!);
  const summary =
    sel.model === "osi"
      ? `OSI ${OSI_LAYERS.find((l) => l.number === sel.layer)!.name} is covered by TCP/IP ${activeTcpLayer.name}.`
      : `TCP/IP ${activeTcpLayer.name} covers OSI ${activeTcpLayer.osiLayers
          .map((n) => OSI_LAYERS.find((l) => l.number === n)!.name)
          .join(", ")}.`;

  const osiBtn = (n: OsiLayerNumber, className?: string) => {
    const layer = OSI_LAYERS.find((l) => l.number === n)!;
    const hi = isOsiHighlighted(n);
    return (
      <button
        key={n}
        onClick={() => setSel({ model: "osi", layer: n })}
        aria-pressed={osiIsPrimary(n)}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
          hi ? "bg-ink/[0.06] dark:bg-bone/[0.08]" : "border-line opacity-60 hover:opacity-100 dark:border-line-dark",
          osiIsPrimary(n) && "ring-2 ring-subject-it",
          className,
        )}
        style={{ boxShadow: `inset 5px 0 0 0 ${layer.accent}`, ...(hi ? { borderColor: layer.accent } : {}) }}
      >
        <span className="font-mono text-xs text-ink-soft dark:text-bone-soft">{n}</span>
        <span className="text-ink dark:text-bone">{layer.name}</span>
      </button>
    );
  };

  const tcpBtn = (id: TcpIpLayerId, style?: CSSProperties, className?: string) => {
    const layer = getTcpIpLayer(id);
    const hi = activeTcp === id;
    return (
      <button
        key={id}
        onClick={() => setSel({ model: "tcpip", layer: id })}
        aria-pressed={tcpIsPrimary(id)}
        className={cn(
          "flex flex-col justify-center rounded-lg border px-3 py-2 text-left transition-colors",
          hi ? "bg-ink/[0.06] dark:bg-bone/[0.08]" : "border-line opacity-60 hover:opacity-100 dark:border-line-dark",
          tcpIsPrimary(id) && "ring-2 ring-subject-it",
          className,
        )}
        style={{ ...style, boxShadow: `inset 5px 0 0 0 ${layer.accent}`, ...(hi ? { borderColor: layer.accent } : {}) }}
      >
        <span className="text-sm font-medium text-ink dark:text-bone">{layer.name}</span>
        <span className="text-[11px] text-ink-soft dark:text-bone-soft">OSI {layer.osiLayers.join(" · ")}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="TCP/IP ↔ OSI mapping">
        Click a layer in either model to highlight the layer or layers that cover the same ground in the other model.
      </SectionHeading>

      {/* Desktop / tablet: classic aligned diagram */}
      <div className="hidden sm:block">
        <div className="mx-auto grid max-w-2xl grid-cols-[1fr,56px,1fr] gap-x-2">
          <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">OSI — 7 layers</p>
          <span />
          <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">TCP/IP — 4 layers</p>

          <div className="grid grid-rows-7 gap-1.5" style={{ gridColumn: 1 }}>
            {OSI_LAYERS.map((l) => osiBtn(l.number, "h-12"))}
          </div>
          <div className="flex items-center justify-center text-xl text-ink-soft dark:text-bone-soft" aria-hidden>
            →
          </div>
          <div className="grid grid-rows-7 gap-1.5" style={{ gridColumn: 3 }}>
            {TCPIP_LAYERS.map((l) => {
              const { start, span } = rowSpan(l.id);
              return tcpBtn(l.id, { gridRow: `${start} / span ${span}` });
            })}
          </div>
        </div>
      </div>

      {/* Mobile: two stacked lists */}
      <div className="flex flex-col gap-4 sm:hidden">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">OSI — 7 layers</p>
          <div className="flex flex-col gap-1.5">{OSI_LAYERS.map((l) => osiBtn(l.number))}</div>
        </div>
        <div className="text-center text-xl text-ink-soft dark:text-bone-soft" aria-hidden>↓ maps to ↓</div>
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">TCP/IP — 4 layers</p>
          <div className="flex flex-col gap-1.5">{TCPIP_LAYERS.map((l) => tcpBtn(l.id))}</div>
        </div>
      </div>

      <Panel title="Selected mapping">
        <p className="text-sm text-ink dark:text-bone" aria-live="polite">{summary}</p>
      </Panel>

      <Callout tone="warn" title="A conceptual mapping">
        <p>{OSI_TCPIP_MAPPING_NOTES.conceptual}</p>
        {level !== "beginner" && (
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {OSI_TCPIP_MAPPING_NOTES.blurry.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
      </Callout>

      <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        OSI is primarily a conceptual, reference model used for teaching and shared vocabulary. TCP/IP describes the
        practical protocol suite commonly used for Internet networking. Modern network stacks are not literally
        built as seven separate OSI layers.
      </p>

      {level === "technical" && (
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Design differences</p>
          <div className="overflow-x-auto rounded-card border border-line dark:border-line-dark">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-ink/[0.04] text-xs uppercase tracking-wide text-ink-soft dark:bg-bone/[0.05] dark:text-bone-soft">
                <tr>
                  <th className="px-3 py-2 font-medium">Aspect</th>
                  <th className="px-3 py-2 font-medium">OSI</th>
                  <th className="px-3 py-2 font-medium">TCP/IP</th>
                </tr>
              </thead>
              <tbody>
                {DESIGN_DIFFERENCES.map((row) => (
                  <tr key={row.aspect} className="border-t border-line dark:border-line-dark">
                    <td className="px-3 py-2 font-medium text-ink dark:text-bone">{row.aspect}</td>
                    <td className="px-3 py-2 text-ink-soft dark:text-bone-soft">{row.osi}</td>
                    <td className="px-3 py-2 text-ink-soft dark:text-bone-soft">{row.tcpip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
