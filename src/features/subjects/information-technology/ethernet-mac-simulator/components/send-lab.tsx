"use client";

import { useMemo, useState } from "react";
import { PlayerControls } from "../../tcp-ip-model-explorer/components/player-controls";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import type { EthernetLab } from "../hooks/use-ethernet-lab";
import { DEFAULT_ETHER_TYPE, ETHER_TYPES, STEP_COUNT, buildFrame, type DetailLevel, type FieldId } from "../model";
import { EventLog } from "./event-log";
import { FieldExplainer, FrameView } from "./frame-view";
import { FrameInspector } from "./frame-inspector";
import { MacTablePanel } from "./mac-table-panel";
import { NetworkDiagram } from "./network-diagram";

const selectClass =
  "h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone";

export function SendLab({ lab, level }: { lab: EthernetLab; level: DetailLevel }) {
  const { devices, tx, player } = lab;
  const [srcId, setSrcId] = useState("a");
  const [dstId, setDstId] = useState<string>("b");
  const [message, setMessage] = useState("Hello");
  const [etherType, setEtherType] = useState(DEFAULT_ETHER_TYPE);
  const [corrupt, setCorrupt] = useState(false);
  const [field, setField] = useState<FieldId | null>(null);

  const stepIndex = tx ? player.stepIndex : -1;
  const step = tx && stepIndex >= 0 ? tx.steps[Math.min(stepIndex, tx.steps.length - 1)]! : null;

  const dstOptions = devices.filter((d) => d.id !== srcId);
  const effectiveDst = dstId === "broadcast" || dstOptions.some((d) => d.id === dstId) ? dstId : dstOptions[0]!.id;

  const previewFrame = useMemo(() => {
    const src = devices.find((d) => d.id === srcId)!;
    const dst = devices.find((d) => d.id === effectiveDst);
    return buildFrame("preview", dst ? dst.mac : "FF:FF:FF:FF:FF:FF", src.mac, etherType, message.trim() || "Hello");
  }, [devices, srcId, effectiveDst, etherType, message]);

  const frame = tx?.frame ?? previewFrame;
  const filled = step ? step.filled : [];
  const args = { srcId, dstId: effectiveDst, message, etherType, corrupt: level === "technical" && corrupt };
  const busy = !!tx && player.isPlaying;

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Send data across the LAN">
        Pick a sender, a destination, and a message. The sender&apos;s network interface builds an Ethernet frame, the switch decides where to send it,
        and the destination checks whether the frame is for it.
      </SectionHeading>

      <Panel title="Send data">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs font-medium text-ink dark:text-bone">
            Source device
            <select className={selectClass} value={srcId} onChange={(e) => setSrcId(e.target.value)} disabled={busy}>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-ink dark:text-bone">
            Destination
            <select className={selectClass} value={effectiveDst} onChange={(e) => setDstId(e.target.value)} disabled={busy}>
              {dstOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
              <option value="broadcast">Broadcast (FF:FF:FF:FF:FF:FF)</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-ink sm:col-span-2 dark:text-bone">
            Message / data
            <input className={selectClass} value={message} maxLength={40} onChange={(e) => setMessage(e.target.value)} placeholder="Hello" disabled={busy} />
          </label>
        </div>

        {level === "technical" && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-medium text-ink dark:text-bone">
              EtherType
              <select className={selectClass} value={etherType} onChange={(e) => setEtherType(e.target.value)} disabled={busy}>
                {ETHER_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex min-h-[44px] items-center gap-2 self-end text-sm text-ink dark:text-bone">
              <input type="checkbox" checked={corrupt} onChange={(e) => setCorrupt(e.target.checked)} disabled={busy} className="h-4 w-4" />
              Damage the frame in transit (bit error)
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => lab.send(args, "auto")}
            className="inline-flex h-11 items-center rounded-full bg-subject-it px-5 text-sm font-medium text-paper hover:opacity-90"
          >
            Send Data
          </button>
          <button
            onClick={() => lab.send(args, "step")}
            className="inline-flex h-11 items-center rounded-full border border-subject-it px-5 text-sm font-medium text-subject-it hover:bg-subject-it-soft dark:hover:bg-subject-it/20"
          >
            Send step by step
          </button>
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-4">
          <NetworkDiagram devices={devices} tx={tx} stepIndex={stepIndex} />
          <PlayerControls player={player} total={STEP_COUNT} />
          <Panel title={step ? step.title : "What happens next"}>
            <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
              {step
                ? step.explain
                : "Press Send Data to watch the whole journey, or Send step by step and use Step to pause at every stage: create data → build frame → add MACs → send → switch receives → table check → forward → receive → process."}
            </p>
          </Panel>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <FrameView frame={frame} devices={devices} filled={tx ? filled : ["dst", "src", "type", "payload", "fcs"]} selected={field} onSelect={setField} level={level} />
          <FieldExplainer field={field} level={level} />
          <FrameInspector tx={tx} stepIndex={stepIndex} devices={devices} selected={field} onSelect={setField} level={level} />
        </div>
      </div>

      {tx && stepIndex >= 8 && tx.decision.kind === "unknown-unicast" && (
        <Callout tone="warn" title="Unknown unicast flooding — not a broadcast">
          The destination MAC is one device&apos;s address, so only that device accepted the frame. Other devices received a copy only because the switch had no
          table entry yet; their network interfaces discarded it. Send the same frame again and the switch will already know where the destination is.
        </Callout>
      )}
      {tx && stepIndex >= 8 && tx.decision.kind === "broadcast" && (
        <Callout tone="good" title="Broadcast">
          The destination was FF:FF:FF:FF:FF:FF, so every other device on the LAN accepted the frame — on purpose.
        </Callout>
      )}
      {tx && stepIndex >= 8 && tx.decision.kind === "known-unicast" && (
        <Callout tone="good" title="Known unicast">
          The switch already knew where the destination was, so only one port received the frame. The other devices never saw it.
        </Callout>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {level === "beginner" ? (
          <Panel title="The switch's address book">
            <p className="text-sm text-ink-soft dark:text-bone-soft">
              The switch keeps a small table that remembers which device is on which port. Switch to Intermediate to watch it fill up as frames arrive.
            </p>
          </Panel>
        ) : (
          <MacTablePanel table={lab.table} devices={devices} highlightMac={lab.highlightMac} onClear={lab.clearTable} onFill={lab.fillTable} />
        )}
        <EventLog entries={lab.log} onClear={lab.clearLog} />
      </div>

      <div>
        <button
          onClick={lab.resetAll}
          className="inline-flex h-11 items-center rounded-full border border-line px-4 text-sm font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
        >
          Reset whole LAN (devices, table, log)
        </button>
      </div>
    </div>
  );
}
