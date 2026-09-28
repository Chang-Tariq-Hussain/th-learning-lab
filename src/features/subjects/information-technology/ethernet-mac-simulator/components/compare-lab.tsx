"use client";

import { useMemo, useState } from "react";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import type { EthernetLab } from "../hooks/use-ethernet-lab";
import { buildTransmission, fullTable, type DetailLevel } from "../model";
import { NetworkDiagram } from "./network-diagram";

/**
 * Unicast vs broadcast, side by side. Uses a private, fully-populated MAC
 * table so the unicast side is a clean "known destination" case and the
 * student's own lab table is left untouched.
 */
export function CompareLab({ lab, level }: { lab: EthernetLab; level: DetailLevel }) {
  const [srcId, setSrcId] = useState("a");
  const [dstId, setDstId] = useState("c");
  const devices = lab.devices;
  const dstChoices = devices.filter((d) => d.id !== srcId);
  const effectiveDst = dstChoices.some((d) => d.id === dstId) ? dstId : dstChoices[0]!.id;

  const { unicast, broadcast } = useMemo(() => {
    const table = fullTable(devices);
    return {
      unicast: buildTransmission({ devices, table, srcId, dstId: effectiveDst, message: "Hello" }),
      broadcast: buildTransmission({ devices, table, srcId, dstId: "broadcast", message: "Hello everyone" }),
    };
  }, [devices, srcId, effectiveDst]);

  const selectClass = "h-11 rounded-xl border border-line bg-paper px-3 text-sm text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone";

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Unicast vs. broadcast">
        Same sender, same LAN — two very different destination addresses. Choose a sender and a unicast destination and compare the results.
      </SectionHeading>

      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm text-ink dark:text-bone">
          Sender
          <select className={selectClass} value={srcId} onChange={(e) => setSrcId(e.target.value)}>
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-ink dark:text-bone">
          Unicast destination
          <select className={selectClass} value={effectiveDst} onChange={(e) => setDstId(e.target.value)}>
            {dstChoices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-3">
          <h3 className="font-display text-base font-medium text-ink dark:text-bone">Unicast — one sender → one intended destination</h3>
          <NetworkDiagram devices={devices} tx={unicast} stepIndex={9} ariaLabel="Unicast frame delivered to one device" />
          <p className="break-all font-mono text-xs text-ink-soft dark:text-bone-soft">Destination MAC: {unicast?.frame.dst}</p>
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            Only {devices.find((d) => d.id === effectiveDst)?.name} receives the frame. The switch knows which port it is on, so nobody else sees the traffic.
          </p>
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          <h3 className="font-display text-base font-medium text-ink dark:text-bone">Broadcast — one sender → every device on the LAN</h3>
          <NetworkDiagram devices={devices} tx={broadcast} stepIndex={9} ariaLabel="Broadcast frame delivered to all devices" />
          <p className="break-all font-mono text-xs text-ink-soft dark:text-bone-soft">Destination MAC: {broadcast?.frame.dst}</p>
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            The destination is FF:FF:FF:FF:FF:FF, so the switch sends the frame out of every port except the one it arrived on, and every receiving interface accepts it.
          </p>
        </div>
      </div>

      <Panel title="Side by side">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-xs">
            <thead>
              <tr className="border-b border-line font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:border-line-dark dark:text-bone-soft">
                <th className="py-1.5 pr-3 font-medium" />
                <th className="py-1.5 pr-3 font-medium">Unicast</th>
                <th className="py-1.5 font-medium">Broadcast</th>
              </tr>
            </thead>
            <tbody className="text-ink dark:text-bone">
              {[
                ["Destination MAC", "One device's MAC address", "FF:FF:FF:FF:FF:FF"],
                ["Intended receivers", "One", "All devices in the local broadcast domain"],
                ["Switch behaviour", "Forwards out one port (once it knows the port)", "Sends out every port except the incoming one"],
                ["Devices that accept it", `${unicast?.deliveries.filter((d) => d.accepted).length ?? 0} in this LAN`, `${broadcast?.deliveries.filter((d) => d.accepted).length ?? 0} in this LAN`],
              ].map(([label, u, b]) => (
                <tr key={label} className="border-b border-line/60 align-top dark:border-line-dark/60">
                  <td className="py-1.5 pr-3 font-medium">{label}</td>
                  <td className="py-1.5 pr-3 text-ink-soft dark:text-bone-soft">{u}</td>
                  <td className="py-1.5 text-ink-soft dark:text-bone-soft">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {level !== "beginner" && (
        <Callout tone="warn" title="Don't confuse broadcast with unknown-unicast flooding">
          Both can send copies out of many ports, but for different reasons. A broadcast is addressed to everyone, so everyone accepts it. Unknown-unicast
          flooding happens when the destination is one specific device the switch has not learned yet — the copies go everywhere, but only the real destination
          accepts the frame. Use the Forwarding Experiments tab to see the two side by side.
        </Callout>
      )}
      <p className="text-xs text-ink-soft dark:text-bone-soft">
        Multicast (one sender → a chosen group) also exists, but it is not covered in this simulation.
      </p>
    </div>
  );
}
