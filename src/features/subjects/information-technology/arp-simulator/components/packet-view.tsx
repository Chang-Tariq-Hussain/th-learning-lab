"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import { FieldExplainer, FrameView } from "../../ethernet-mac-simulator/components/frame-view";
import type { EthernetFrame, FieldId } from "../../ethernet-mac-simulator/model";
import { ARP_FIELDS, arpFieldValue, toLabDevices, type ArpFieldId, type ArpNode, type ArpPacket, type DetailLevel, type Run } from "../model";

const BEGINNER_ORDER: ArpFieldId[] = ["operation", "senderIp", "senderMac", "targetIp", "targetMac"];
const ALL_FIELDS: FieldId[] = ["dst", "src", "type", "payload", "fcs"];

const TONE = {
  request: "border-amber-400/70 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10",
  reply: "border-emerald-400/70 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10",
} as const;

/**
 * One ARP message as a list of clickable fields. Beginner shows only the five essentials
 * (in the order the lab teaches them); Technical shows all nine in wire order.
 */
export function ArpPacketView({
  packet,
  level,
  title,
  selected,
  onSelect,
}: {
  packet: ArpPacket;
  level: DetailLevel;
  title: string;
  selected: ArpFieldId | null;
  onSelect: (id: ArpFieldId) => void;
}) {
  const technical = level === "technical";
  const fields = technical ? ARP_FIELDS : BEGINNER_ORDER.map((id) => ARP_FIELDS.find((f) => f.id === id)!);
  return (
    <div className={cn("rounded-xl border p-2", TONE[packet.operation])} role="group" aria-label={`${title} fields`}>
      <p className="px-1 pb-2 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
        {title} · sent by {packet.senderName}
      </p>
      <div className="flex flex-col gap-1.5">
        {fields.map((f) => {
          const unknown = f.id === "targetMac" && packet.targetMac === null;
          return (
            <button
              key={f.id}
              onClick={() => onSelect(f.id)}
              aria-pressed={selected === f.id}
              className={cn(
                "flex min-h-[44px] w-full flex-col items-start gap-0.5 rounded-lg border border-line bg-white/70 px-3 py-2 text-left transition-all dark:border-line-dark dark:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between",
                selected === f.id && "ring-2 ring-subject-it",
              )}
            >
              <span className="text-xs font-medium text-ink dark:text-bone">
                {f.label}
                {technical && <span className="ml-2 font-mono text-[10px] text-ink-soft dark:text-bone-soft">{f.size}</span>}
              </span>
              <span className={cn("max-w-full break-all font-mono text-xs", unknown ? "text-amber-700 dark:text-amber-300" : "text-ink dark:text-bone")}>{arpFieldValue(packet, f.id, technical)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ArpFieldExplainer({ field, level }: { field: ArpFieldId | null; level: DetailLevel }) {
  if (!field) {
    return (
      <Panel>
        <p className="text-sm text-ink-soft dark:text-bone-soft">Select any ARP field to see what it is for.</p>
      </Panel>
    );
  }
  const info = ARP_FIELDS.find((f) => f.id === field)!;
  return (
    <Panel title={info.label}>
      <p className="text-sm text-ink dark:text-bone">{info.purpose}</p>
      {level === "technical" && <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">{info.technical}</p>}
    </Panel>
  );
}

/** The Ethernet header that carries an ARP message — the link between "ARP" and "Ethernet frame". */
function CarrierNote({ frame, isBroadcast }: { frame: EthernetFrame; isBroadcast: boolean }) {
  return (
    <p className="mt-2 break-words text-xs text-ink-soft dark:text-bone-soft">
      Carried in an Ethernet frame: destination MAC <span className="font-mono text-ink dark:text-bone">{frame.dst}</span> ({isBroadcast ? "broadcast" : "unicast"}), source MAC{" "}
      <span className="font-mono text-ink dark:text-bone">{frame.src}</span>, EtherType <span className="font-mono text-ink dark:text-bone">{frame.etherType}</span> (ARP).
    </p>
  );
}

/**
 * Shows whichever message the current step is about: the ARP request, the ARP reply,
 * or the final Ethernet data frame (with the IP destination it carries).
 */
export function MessageInspector({ run, message, nodes, level }: { run: Run | null; message: "request" | "reply" | "data" | null; nodes: ArpNode[]; level: DetailLevel }) {
  const [arpField, setArpField] = useState<ArpFieldId | null>(null);
  const [frameField, setFrameField] = useState<FieldId | null>(null);
  const devices = toLabDevices(nodes);

  let body: React.ReactNode;
  if (!run || !message) {
    body = <p className="text-sm text-ink-soft dark:text-bone-soft">{run ? "This step does not send a message. Move to a step that creates or sends one." : "Start the scenario to see the messages it sends."}</p>;
  } else if (message === "request" && run.arpRequest && run.requestFrame) {
    body = (
      <>
        <ArpPacketView packet={run.arpRequest} level={level} title="ARP Request" selected={arpField} onSelect={setArpField} />
        <CarrierNote frame={run.requestFrame} isBroadcast />
        <div className="mt-3"><ArpFieldExplainer field={arpField} level={level} /></div>
      </>
    );
  } else if (message === "reply" && run.arpReply && run.replyFrame) {
    body = (
      <>
        <ArpPacketView packet={run.arpReply} level={level} title="ARP Reply" selected={arpField} onSelect={setArpField} />
        <CarrierNote frame={run.replyFrame} isBroadcast={false} />
        <div className="mt-3"><ArpFieldExplainer field={arpField} level={level} /></div>
      </>
    );
  } else if (message === "data" && run.dataFrame) {
    const remote = !run.local;
    body = (
      <>
        <FrameView frame={run.dataFrame} devices={devices} filled={ALL_FIELDS} selected={frameField} onSelect={setFrameField} level={level} />
        <div className="mt-3 rounded-xl border border-line p-3 text-xs dark:border-line-dark">
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Inside the frame: the IP packet</p>
          <p className="mt-1 text-ink dark:text-bone">
            Destination IP <span className="font-mono font-semibold">{run.ipDst}</span> · Destination MAC <span className="font-mono font-semibold">{run.dataFrame.dst}</span>
          </p>
          <p className="mt-1 text-ink-soft dark:text-bone-soft">
            {remote
              ? "The IP address names the final (remote) host. The MAC address names only the next device on this link: the gateway."
              : "The IP address names the destination host, and the MAC address names the same device on this local network."}
          </p>
        </div>
        <div className="mt-3"><FieldExplainer field={frameField} level={level} /></div>
      </>
    );
  } else {
    body = <p className="text-sm text-ink-soft dark:text-bone-soft">No message for this step.</p>;
  }

  return <div>{body}</div>;
}
