"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { PlayerControls } from "../../tcp-ip-model-explorer/components/player-controls";
import { useStepPlayer } from "../../osi-model-explorer/hooks/use-step-player";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import type { EthernetLab } from "../hooks/use-ethernet-lab";
import { buildTransmission, deviceById, deviceByPort, fullTable, type DetailLevel, type MacTable } from "../model";
import { MacTablePanel } from "./mac-table-panel";
import { NetworkDiagram } from "./network-diagram";

type ExpId = "A" | "B" | "C";

const EXPERIMENTS: { id: ExpId; title: string; blurb: string }[] = [
  { id: "A", title: "A — Known destination", blurb: "The switch already knows where the destination is." },
  { id: "B", title: "B — Unknown destination", blurb: "The switch has never seen the destination MAC." },
  { id: "C", title: "C — Broadcast", blurb: "The destination is FF:FF:FF:FF:FF:FF." },
];

// Which diagram step corresponds to each flow box (0..3).
const DIAGRAM_STEP = [5, 6, 7, 9];

/**
 * Three forwarding experiments on a private scratch MAC table — the
 * student's main lab table is never touched.
 */
export function ForwardingLab({ lab, level }: { lab: EthernetLab; level: DetailLevel }) {
  const { devices } = lab;
  const [exp, setExp] = useState<ExpId>("A");
  const [srcId, setSrcId] = useState("a");
  const [dstId, setDstId] = useState("b");
  const player = useStepPlayer(4);

  const dstChoices = devices.filter((d) => d.id !== srcId);
  const effectiveDst = dstChoices.some((d) => d.id === dstId) ? dstId : dstChoices[0]!.id;

  // A: everyone except the sender is already known. B/C: empty table.
  const scratchTable: MacTable = useMemo(() => {
    if (exp === "A") return fullTable(devices).filter((e) => e.mac !== devices.find((d) => d.id === srcId)?.mac);
    return [];
  }, [exp, devices, srcId]);

  const tx = useMemo(
    () => buildTransmission({ devices, table: scratchTable, srcId, dstId: exp === "C" ? "broadcast" : effectiveDst, message: "Hello" }),
    [devices, scratchTable, srcId, effectiveDst, exp],
  );

  const src = deviceById(devices, srcId)!;
  const dst = deviceById(devices, effectiveDst)!;
  const stepIndex = player.stepIndex;
  const diagramStep = stepIndex < 0 ? -1 : DIAGRAM_STEP[stepIndex]!;
  const egress = tx ? tx.decision.egressPorts : [];
  const egressNames = egress.map((p) => deviceByPort(devices, p)?.name ?? `Port ${p}`).join(", ");

  const flow: { title: string; detail: string }[] = tx
    ? exp === "A"
      ? [
          { title: `Incoming Port ${src.port}`, detail: `${src.name}'s frame enters the switch. The source MAC ${src.mac} is learned on Port ${src.port}.` },
          { title: "MAC table lookup", detail: `Search the table for ${dst.mac}.` },
          { title: `Correct output port: Port ${dst.port}`, detail: `Found — ${dst.name} is on Port ${dst.port}. Only that port is used.` },
          { title: `Destination: ${dst.name}`, detail: `Only ${dst.name} receives the frame; the other devices never see it.` },
        ]
      : exp === "B"
        ? [
            { title: `Incoming Port ${src.port}`, detail: `${src.name}'s frame enters the switch. The source MAC ${src.mac} is learned on Port ${src.port}.` },
            { title: "MAC table lookup", detail: `Search the table for ${dst.mac}.` },
            { title: "Destination unknown → flood", detail: `No entry for ${dst.mac}. The switch floods the frame out of Ports ${egress.join(", ")} — every port except Port ${src.port}.` },
            { title: "Only the real destination accepts", detail: `${egressNames} each receive a copy, but only ${dst.name}'s MAC matches. The others discard it. This is unknown unicast flooding, not a broadcast.` },
          ]
        : [
            { title: `Incoming Port ${src.port}`, detail: `${src.name} sends a frame whose destination is ${tx.frame.dst}.` },
            { title: "Destination is broadcast", detail: "The broadcast address is never a device's own address, so it is never in the MAC table — and no lookup is needed." },
            { title: "Forward to every other port", detail: `The frame goes out of Ports ${egress.join(", ")}.` },
            { title: "Everyone accepts", detail: `${egressNames} all accept the frame, because a broadcast is meant for everyone.` },
          ]
    : [];

  function pickExp(id: ExpId) {
    setExp(id);
    player.reset();
  }

  const selectClass = "h-11 rounded-xl border border-line bg-paper px-3 text-sm text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone";

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Frame forwarding experiments">
        Run the same frame through three different situations and watch how the switch&apos;s decision changes. These experiments use their own scratch MAC table,
        so your main lab table is not affected.
      </SectionHeading>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Forwarding experiment">
        {EXPERIMENTS.map((e) => (
          <button
            key={e.id}
            role="tab"
            aria-selected={exp === e.id}
            onClick={() => pickExp(e.id)}
            className={cn(
              "min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              exp === e.id ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
            )}
          >
            Experiment {e.title}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink-soft dark:text-bone-soft">{EXPERIMENTS.find((e) => e.id === exp)!.blurb}</p>

      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm text-ink dark:text-bone">
          Sender
          <select
            className={selectClass}
            value={srcId}
            onChange={(e) => {
              setSrcId(e.target.value);
              player.reset();
            }}
          >
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        {exp !== "C" && (
          <label className="flex items-center gap-2 text-sm text-ink dark:text-bone">
            Destination
            <select
              className={selectClass}
              value={effectiveDst}
              onChange={(e) => {
                setDstId(e.target.value);
                player.reset();
              }}
            >
              {dstChoices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-4">
          <NetworkDiagram devices={devices} tx={tx} stepIndex={diagramStep} ariaLabel="Forwarding experiment diagram" />
          <PlayerControls player={player} total={4} />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <ol className="flex flex-col gap-2" aria-label="Forwarding decision flow">
            {flow.map((f, i) => (
              <li key={f.title} className="flex flex-col items-stretch">
                <div
                  className={cn(
                    "rounded-xl border p-3 transition-colors",
                    i === stepIndex ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/20" : i < stepIndex ? "border-emerald-400/60 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10" : "border-line opacity-70 dark:border-line-dark",
                  )}
                >
                  <p className="text-sm font-medium text-ink dark:text-bone">{f.title}</p>
                  {i <= stepIndex && <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">{f.detail}</p>}
                </div>
                {i < flow.length - 1 && (
                  <span className="text-center text-ink-soft dark:text-bone-soft" aria-hidden>
                    ↓
                  </span>
                )}
              </li>
            ))}
          </ol>
          <MacTablePanel table={scratchTable} devices={devices} title="Scratch MAC table at the start" showDeviceColumn />
        </div>
      </div>

      {exp === "B" && (
        <Callout tone="warn" title="Unknown unicast flooding ≠ broadcast">
          Flooding here is a fallback because the switch does not know the destination yet. The frame is still addressed to one device. Once that device sends anything, the
          switch learns its port and later frames to it are forwarded to a single port.
        </Callout>
      )}
      {exp === "C" && (
        <Callout tone="good" title="Broadcast is intentional">
          The destination address itself says &quot;everyone&quot;. Compare with Experiment B: both reach many ports, but only a broadcast is accepted by all of them.
        </Callout>
      )}
      {level === "technical" && (
        <Panel title="Forwarding rules (simplified)">
          <ul className="list-disc space-y-1 pl-5 text-sm text-ink-soft dark:text-bone-soft">
            <li>Learn the source MAC on the ingress port (add, or refresh/move the entry).</li>
            <li>Broadcast destination → flood to all ports except ingress.</li>
            <li>Destination in table on another port → forward to that port only.</li>
            <li>Destination in table on the ingress port → filter (drop) the frame.</li>
            <li>Destination not in table → flood to all ports except ingress (unknown unicast).</li>
            <li>A frame is never sent back out of the port it arrived on.</li>
          </ul>
        </Panel>
      )}
    </div>
  );
}
