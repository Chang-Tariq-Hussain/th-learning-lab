"use client";

import { useState } from "react";
import { Callout, PillButton, SectionHeading } from "@/features/subjects/information-technology/osi-model-explorer/components/ui";
import {
  OSI_LAYERS,
  WHICH_MODEL_EVENT,
  WHICH_MODEL_NOTE,
  WHICH_MODEL_OSI_ROWS,
  WHICH_MODEL_TCPIP_ROWS,
  getTcpIpLayer,
  tcpIpLayerForOsi,
} from "../model";

type View = "osi" | "tcpip" | "both";

function Row({ accent, label, badge, text }: { accent: string; label: string; badge: string; text: string }) {
  return (
    <div className="flex gap-3 border-b border-line/60 px-3 py-3 last:border-b-0 dark:border-line-dark/60" style={{ borderLeft: `5px solid ${accent}` }}>
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold text-white" style={{ backgroundColor: accent }}>
        {badge}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink dark:text-bone">{label}</p>
        <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{text}</p>
      </div>
    </div>
  );
}

function OsiColumn() {
  return (
    <div className="overflow-hidden rounded-card border border-line dark:border-line-dark">
      {WHICH_MODEL_OSI_ROWS.map((r) => {
        const layer = OSI_LAYERS.find((l) => l.number === r.osi)!;
        return <Row key={r.osi} accent={layer.accent} label={layer.name} badge={String(r.osi)} text={r.text} />;
      })}
    </div>
  );
}

function TcpIpColumn() {
  return (
    <div className="overflow-hidden rounded-card border border-line dark:border-line-dark">
      {WHICH_MODEL_TCPIP_ROWS.map((r) => {
        const layer = getTcpIpLayer(r.layer);
        return <Row key={r.layer} accent={layer.accent} label={layer.name} badge={String(layer.number)} text={r.text} />;
      })}
    </div>
  );
}

/** One communication event, viewed through OSI, TCP/IP, or both. */
export function WhichModelLab() {
  const [view, setView] = useState<View>("osi");

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Which model?">
        The same communication event can be described with either model. Switch views and compare.
      </SectionHeading>

      <div className="rounded-card border border-line bg-white/60 p-3.5 dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Event</p>
        <p className="mt-1 text-base text-ink dark:text-bone">{WHICH_MODEL_EVENT}</p>
        <p className="mt-1 font-mono text-[11px] text-ink-soft dark:text-bone-soft">HTTP request ↓ layers ↓ network</p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a model view">
        <PillButton active={view === "osi"} onClick={() => setView("osi")}>OSI view</PillButton>
        <PillButton active={view === "tcpip"} onClick={() => setView("tcpip")}>TCP/IP view</PillButton>
        <PillButton active={view === "both"} onClick={() => setView("both")}>Side by side</PillButton>
      </div>

      {view === "osi" && <OsiColumn />}
      {view === "tcpip" && <TcpIpColumn />}
      {view === "both" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">OSI — 7 layers</p>
            <OsiColumn />
          </div>
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">TCP/IP — 4 layers</p>
            <TcpIpColumn />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft dark:text-bone-soft">
        <span className="font-mono uppercase tracking-wide">Then →</span>
        <span className="rounded-full border border-line px-2.5 py-1 dark:border-line-dark">Network</span>
        <span>
          (OSI 7–5 → {tcpIpLayerForOsi(7).shortName}; 4 → {tcpIpLayerForOsi(4).shortName}; 3 → {tcpIpLayerForOsi(3).shortName}; 2–1 → {tcpIpLayerForOsi(2).shortName})
        </span>
      </div>

      <Callout tone="neutral" title="Two descriptions, one event">
        {WHICH_MODEL_NOTE}
      </Callout>
    </div>
  );
}
