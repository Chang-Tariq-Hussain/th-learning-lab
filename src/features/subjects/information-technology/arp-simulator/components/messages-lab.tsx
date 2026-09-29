"use client";

import { useMemo, useState } from "react";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import { exampleExchange, type ArpFieldId, type DetailLevel } from "../model";
import { ArpFieldExplainer, ArpPacketView } from "./packet-view";

/** Request vs. reply, side by side, using the default scenario's addresses. */
export function MessagesLab({ level }: { level: DetailLevel }) {
  const ex = useMemo(() => exampleExchange(), []);
  const [reqField, setReqField] = useState<ArpFieldId | null>(null);
  const [repField, setRepField] = useState<ArpFieldId | null>(null);
  const shown = repField ?? reqField;

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="ARP Request vs. ARP Reply">
        The same message layout is used for both. What changes is the operation, who is sender and target, and whether the target MAC is still unknown.
      </SectionHeading>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <ArpPacketView packet={ex.request} level={level} title="ARP Request" selected={reqField} onSelect={(f) => { setReqField(f); setRepField(null); }} />
          <p className="text-xs text-ink-soft dark:text-bone-soft">
            Ethernet: destination <span className="font-mono">{ex.requestFrame.dst}</span> (broadcast), source <span className="font-mono">{ex.requestFrame.src}</span>.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <ArpPacketView packet={ex.reply} level={level} title="ARP Reply" selected={repField} onSelect={(f) => { setRepField(f); setReqField(null); }} />
          <p className="text-xs text-ink-soft dark:text-bone-soft">
            Ethernet: destination <span className="font-mono">{ex.replyFrame.dst}</span> (unicast to PC-A), source <span className="font-mono">{ex.replyFrame.src}</span>.
          </p>
        </div>
      </div>
      <ArpFieldExplainer field={shown} level={level} />
      <div className="grid gap-4 md:grid-cols-2">
        <Callout tone="neutral" title="What flips between them">
          The request&apos;s sender (PC-A) becomes the reply&apos;s target, and the reply&apos;s sender (PC-B) supplies the answer. The Target MAC goes from Unknown to PC-A&apos;s address, and the Ethernet destination goes from broadcast to a single device.
        </Callout>
        <Panel title="Where ARP sits">
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            An ARP message travels inside an Ethernet frame (EtherType 0x0806). ARP maps IPv4 addresses to link-layer addresses; IPv6 uses a different mechanism and is not covered here.
          </p>
        </Panel>
      </div>
    </div>
  );
}
