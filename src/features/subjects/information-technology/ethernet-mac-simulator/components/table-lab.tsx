"use client";

import { useState } from "react";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import type { EthernetLab } from "../hooks/use-ethernet-lab";
import { FORWARD_KIND_LABEL, deviceById, type DetailLevel } from "../model";
import { EventLog } from "./event-log";
import { MacTablePanel } from "./mac-table-panel";
import { NetworkDiagram } from "./network-diagram";

const PRESETS: { label: string; src: string; dst: string }[] = [
  { label: "PC-A → Laptop-B", src: "a", dst: "b" },
  { label: "Laptop-B → PC-A", src: "b", dst: "a" },
  { label: "PC-C → Server", src: "c", dst: "s" },
  { label: "Server → PC-C", src: "s", dst: "c" },
  { label: "PC-D → PC-A", src: "d", dst: "a" },
];

/** MAC learning lab: instant (non-animated) sends so the table can be watched filling up. */
export function TableLab({ lab, level }: { lab: EthernetLab; level: DetailLevel }) {
  const { devices, instant } = lab;
  const [srcId, setSrcId] = useState("a");
  const [dstId, setDstId] = useState("b");
  const dstChoices = devices.filter((d) => d.id !== srcId);
  const effectiveDst = dstId === "broadcast" || dstChoices.some((d) => d.id === dstId) ? dstId : dstChoices[0]!.id;
  const selectClass = "h-11 rounded-xl border border-line bg-paper px-3 text-sm text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone";

  const learn = instant?.decision.learn;
  const srcName = instant ? deviceById(devices, instant.srcId)?.name : "";

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Teach the switch: MAC learning">
        A switch is never told which device is on which port. It learns by watching the <span className="font-medium">source MAC address</span> of every frame that arrives and
        remembering the port it arrived on.
      </SectionHeading>

      <Callout tone="neutral" title="Try this">
        1. Press Clear table (it starts empty). 2. Send PC-A → Laptop-B: the table gains PC-A. 3. Send Laptop-B → PC-A: the table gains Laptop-B.
        Notice that the table only ever gains the <em>sender</em>.
      </Callout>

      <Panel title="Send a frame (instantly)">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => lab.sendInstant({ srcId: p.src, dstId: p.dst, message: "Hello" })}
              className="min-h-[44px] rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:border-subject-it dark:border-line-dark dark:text-bone"
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-ink dark:text-bone">
            From
            <select className={selectClass} value={srcId} onChange={(e) => setSrcId(e.target.value)}>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-ink dark:text-bone">
            To
            <select className={selectClass} value={effectiveDst} onChange={(e) => setDstId(e.target.value)}>
              {dstChoices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
              <option value="broadcast">Broadcast</option>
            </select>
          </label>
          <button
            onClick={() => lab.sendInstant({ srcId, dstId: effectiveDst, message: "Hello" })}
            className="inline-flex h-11 items-center rounded-full bg-subject-it px-5 text-sm font-medium text-paper hover:opacity-90"
          >
            Send frame
          </button>
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-4">
          <MacTablePanel table={lab.table} devices={devices} highlightMac={lab.highlightMac} onClear={lab.clearTable} onFill={lab.fillTable} />
          <Panel title="What the switch just did">
            {!instant ? (
              <p className="text-sm text-ink-soft dark:text-bone-soft">Send a frame to see the switch&apos;s learn → look up → forward decision.</p>
            ) : (
              <ol className="space-y-1.5 text-sm text-ink-soft dark:text-bone-soft">
                <li>
                  <span className="font-medium text-ink dark:text-bone">1. Frame arrived</span> on Port {instant.decision.ingressPort} from {srcName}.
                </li>
                <li>
                  <span className="font-medium text-ink dark:text-bone">2. Learn:</span>{" "}
                  {learn?.status === "new" ? `${instant.frame.src} → Port ${learn.port} was added.` : learn?.status === "moved" ? `${instant.frame.src} moved to Port ${learn.port}.` : `${instant.frame.src} was already known on Port ${learn?.port}.`}
                </li>
                <li>
                  <span className="font-medium text-ink dark:text-bone">3. Look up</span> destination {instant.frame.dst}.
                </li>
                <li>
                  <span className="font-medium text-ink dark:text-bone">4. Decide:</span> {FORWARD_KIND_LABEL[instant.decision.kind]}
                  {instant.decision.egressPorts.length > 0 && ` (Port${instant.decision.egressPorts.length > 1 ? "s" : ""} ${instant.decision.egressPorts.join(", ")})`}.
                </li>
              </ol>
            )}
          </Panel>
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <NetworkDiagram devices={devices} tx={instant} stepIndex={instant ? 9 : -1} />
          <EventLog entries={lab.log} onClear={lab.clearLog} />
        </div>
      </div>

      {level === "technical" && (
        <Callout tone="neutral" title="Details this lab simplifies">
          Real switches age out entries after a period of inactivity (often minutes), so the table does not grow forever. If an interface&apos;s MAC address changes, the old
          entry lingers until it ages out or the new address is learned from a frame. Try it: generate a new MAC for a device on the Devices tab and look at the table here.
        </Callout>
      )}
    </div>
  );
}
