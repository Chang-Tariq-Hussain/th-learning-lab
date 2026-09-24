"use client";

import { cn } from "@/lib/utils";
import { useStepPlayer } from "@/features/subjects/information-technology/osi-model-explorer/hooks/use-step-player";
import { Callout, Panel, SectionHeading } from "@/features/subjects/information-technology/osi-model-explorer/components/ui";
import {
  DATA_UNITS,
  DATA_UNIT_NOTE,
  ENCAP_FRAMES,
  ENCAP_STEP_LABELS,
  getTcpIpLayer,
  type DetailLevel,
  type EncapFrame,
  type HeaderId,
} from "../model";
import { PlayerControls } from "./player-controls";

const HEADER_STYLE: Record<HeaderId, { label: string; color: string }> = {
  transport: { label: "Transport hdr", color: getTcpIpLayer("transport").accent },
  internet: { label: "IP hdr", color: getTcpIpLayer("internet").accent },
  link: { label: "Link hdr", color: getTcpIpLayer("link").accent },
};

function PduBlock({ frame }: { frame: Pick<EncapFrame, "headers" | "pduName"> }) {
  const has = (h: HeaderId) => frame.headers.includes(h);
  return (
    <div className="max-w-full overflow-x-auto" aria-label={`Current data unit: ${frame.pduName}`}>
      <div className="mx-auto flex w-max items-center justify-center gap-0.5">
        {has("link") && (
          <span className="rounded-l-md px-2 py-3 font-mono text-[10px] font-semibold text-white" style={{ backgroundColor: HEADER_STYLE.link.color }}>
            {HEADER_STYLE.link.label}
          </span>
        )}
        {has("internet") && (
          <span className="px-2 py-3 font-mono text-[10px] font-semibold text-white" style={{ backgroundColor: HEADER_STYLE.internet.color }}>
            {HEADER_STYLE.internet.label}
          </span>
        )}
        {has("transport") && (
          <span className="px-2 py-3 font-mono text-[10px] font-semibold text-white" style={{ backgroundColor: HEADER_STYLE.transport.color }}>
            {HEADER_STYLE.transport.label}
          </span>
        )}
        <span className={cn("bg-ink px-4 py-3 font-mono text-[11px] font-semibold text-paper dark:bg-bone dark:text-chalkboard", !has("link") && "rounded-l-md rounded-r-md")}>
          DATA
        </span>
        {has("link") && (
          <span className="rounded-r-md px-2 py-3 font-mono text-[10px] font-semibold text-white" style={{ backgroundColor: HEADER_STYLE.link.color }}>
            trailer
          </span>
        )}
      </div>
    </div>
  );
}

const IDLE: EncapFrame = {
  phase: "encapsulating",
  layer: null,
  pduName: "Data",
  headers: [],
  side: "sender",
  description: "Press Play to send data from the sender to the receiver, layer by layer.",
};

/**
 * Encapsulation + decapsulation for the four-layer model, plus the
 * data-unit terminology table. Uses the OSI Model Explorer's
 * `useStepPlayer` (the shared animation engine) rather than a new one.
 */
export function EncapsulationLab({ level }: { level: DetailLevel }) {
  const player = useStepPlayer(ENCAP_FRAMES.length);
  const frame = player.stepIndex >= 0 ? ENCAP_FRAMES[player.stepIndex]! : IDLE;

  const sideBox = (side: EncapFrame["side"]) =>
    cn("rounded-card border p-3 text-center transition-colors", frame.side === side && player.stepIndex >= 0 ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/20" : "border-line dark:border-line-dark");

  // Which layer in the sender's / receiver's flow strip is active.
  const activeLayer = frame.layer;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Encapsulation and decapsulation">
        Data is wrapped with a header at each layer on the way down, sent as bits, then unwrapped one layer at a time on
        the way back up.
      </SectionHeading>

      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-ink-soft dark:text-bone-soft" aria-label="Sender flow">
        {ENCAP_STEP_LABELS.map((label, i) => (
          <span key={label} className="flex items-center gap-2">
            <span className="rounded-full border border-line px-2.5 py-1 dark:border-line-dark">{label}</span>
            {i < ENCAP_STEP_LABELS.length - 1 && <span aria-hidden>↓</span>}
          </span>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className={sideBox("sender")}>
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Sender</p>
          <p className="mt-1 text-sm font-medium text-ink dark:text-bone">Encapsulating ↓</p>
        </div>
        <div className={sideBox("wire")}>
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Transmission</p>
          <p className="mt-1 text-sm font-medium text-ink dark:text-bone">Cable / radio / fiber</p>
        </div>
        <div className={sideBox("receiver")}>
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Receiver</p>
          <p className="mt-1 text-sm font-medium text-ink dark:text-bone">Decapsulating ↑</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-6">
        <PduBlock frame={frame} />
        <p className="text-center font-mono text-xs uppercase tracking-wide text-subject-it">
          {activeLayer ? `${getTcpIpLayer(activeLayer).name}` : "In transit"} — currently{" "}
          <span className="font-semibold">{frame.pduName}</span>
        </p>
        <p className="max-w-xl text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft" aria-live="polite">
          {frame.description}
        </p>
        {level === "technical" && frame.technical && (
          <p className="max-w-xl rounded-lg bg-ink/[0.04] p-3 text-center text-xs leading-relaxed text-ink-soft dark:bg-bone/[0.06] dark:text-bone-soft">
            <span className="font-semibold">Header detail:</span> {frame.technical}
          </p>
        )}
      </div>

      <PlayerControls player={player} total={ENCAP_FRAMES.length} />

      <div className="flex flex-col gap-2">
        <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">TCP/IP data units</p>
        <div className="overflow-x-auto rounded-card border border-line dark:border-line-dark">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="bg-ink/[0.04] text-xs uppercase tracking-wide text-ink-soft dark:bg-bone/[0.05] dark:text-bone-soft">
              <tr>
                <th className="px-3 py-2 font-medium">Layer</th>
                <th className="px-3 py-2 font-medium">Data unit</th>
                <th className="px-3 py-2 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {DATA_UNITS.map((row) => (
                <tr key={row.layer} className="border-t border-line dark:border-line-dark">
                  <td className="px-3 py-2 font-medium text-ink dark:text-bone">{row.layer}</td>
                  <td className="px-3 py-2 font-mono text-ink dark:text-bone">{row.unit}</td>
                  <td className="px-3 py-2 text-ink-soft dark:text-bone-soft">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="neutral" title="Terminology varies">
        {DATA_UNIT_NOTE}
      </Callout>

      {level === "technical" && (
        <Panel title="Why decapsulation reverses the order">
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            The link header is the outermost wrapper (added last), so it is the first one removed. Each layer reads only
            its own header and treats everything inside as opaque payload — that is what lets layers work independently.
          </p>
        </Panel>
      )}
    </div>
  );
}
