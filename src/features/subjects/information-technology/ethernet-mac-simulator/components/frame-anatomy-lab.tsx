"use client";

import { useMemo, useState } from "react";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import type { EthernetLab } from "../hooks/use-ethernet-lab";
import { DEFAULT_ETHER_TYPE, FIELD_ORDER, buildFrame, type DetailLevel, type FieldId } from "../model";
import { FieldExplainer, FrameView } from "./frame-view";

export function FrameAnatomyLab({ lab, level }: { lab: EthernetLab; level: DetailLevel }) {
  const [field, setField] = useState<FieldId | null>("dst");
  const [visited, setVisited] = useState<Set<FieldId>>(() => new Set(["dst"]));

  const a = lab.devices.find((d) => d.id === "a")!;
  const b = lab.devices.find((d) => d.id === "b")!;
  const frame = useMemo(() => buildFrame("sample", b.mac, a.mac, DEFAULT_ETHER_TYPE, "Hello"), [a.mac, b.mac]);

  function select(id: FieldId) {
    setField(id);
    setVisited((prev) => new Set(prev).add(id));
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Anatomy of an Ethernet frame">
        A frame is the unit of data Ethernet delivers across one local link: a header (who and what), the payload (the data), and a trailer (a check
        value). This is an <span className="font-medium">educational simplified Ethernet frame</span> — real Ethernet has a few more physical-layer details.
      </SectionHeading>

      <div className="grid gap-5 lg:grid-cols-2">
        <FrameView frame={frame} devices={lab.devices} filled={FIELD_ORDER} selected={field} onSelect={select} level={level} />
        <div className="flex flex-col gap-4">
          <FieldExplainer field={field} level={level} />
          <Panel title="Fields explored">
            <p className="text-sm text-ink-soft dark:text-bone-soft">
              {visited.size} of {FIELD_ORDER.length} fields opened.{" "}
              {visited.size === FIELD_ORDER.length ? "You have inspected every field of the frame." : "Click the rest to complete the frame inspection."}
            </p>
          </Panel>
          <Panel title="Header · payload · trailer">
            <p className="text-sm text-ink-soft dark:text-bone-soft">
              Destination MAC, Source MAC, and EtherType / Length form the <span className="font-medium text-ink dark:text-bone">header</span>. The payload is the
              data. The FCS is the <span className="font-medium text-ink dark:text-bone">trailer</span> — it comes last because the sender can only calculate it
              once everything before it is known.
            </p>
          </Panel>
        </div>
      </div>

      {level === "technical" && (
        <Callout tone="neutral" title="What this simplified frame leaves out">
          On the wire, an Ethernet frame is preceded by a preamble and start frame delimiter for the physical layer, and short payloads are padded to reach the
          64-byte minimum frame size (header + payload + FCS). Frames are separated by an interframe gap. VLAN tags can add four more bytes. None of that is
          needed to understand local delivery, so it is not drawn here.
        </Callout>
      )}
    </div>
  );
}
