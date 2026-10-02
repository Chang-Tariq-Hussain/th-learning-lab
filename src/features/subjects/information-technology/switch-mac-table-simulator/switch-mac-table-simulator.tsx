"use client";

import { useCallback, useMemo, useState } from "react";
import { Panel } from "../osi-model-explorer/components/ui";
import { DecisionPanel } from "./components/decision-panel";
import { EventLog } from "./components/event-log";
import { EXPERIMENTS, ExperimentsPanel, type Experiment } from "./components/experiments-panel";
import { FrameBuilder } from "./components/frame-builder";
import { FrameInspector } from "./components/frame-inspector";
import { KeyIdeas } from "./components/key-ideas";
import { MacTablePanel } from "./components/mac-table-panel";
import { PortControls } from "./components/port-controls";
import { OutcomeLegend, StageStepper } from "./components/stage-stepper";
import { SwitchDiagram } from "./components/switch-diagram";
import { useSwitchLab } from "./hooks/use-switch-lab";
import { DEVICES, deviceById, dstMacFor, type DeviceId, type DstChoice } from "./model";

/**
 * "Switch & MAC Address Table Simulator": a standalone Layer 2 lab. One switch, five PCs, one broadcast domain.
 * All lab state (MAC table, ports, current frame, log) lives in `useSwitchLab`, a single reducer, so nothing is duplicated
 * across panels. Plain 2D SVG/HTML: no three.js, no extra dependencies.
 *
 * Out of scope on purpose: VLANs (real switches keep one MAC table per VLAN), STP, LACP, managed-switch configuration,
 * routing, IP, ARP, and anything above Layer 2.
 */
export function SwitchMacTableSimulator() {
  const lab = useSwitchLab();
  const [src, setSrc] = useState<DeviceId>("A");
  const [dst, setDst] = useState<DstChoice>("B");
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);

  const handleSrc = useCallback((id: DeviceId) => {
    setSrc(id);
    // A frame can't be addressed to its own sender here, so move the destination if it clashes.
    setDst((d) => (d === id ? (DEVICES.find((x) => x.id !== id)!.id as DeviceId) : d));
  }, []);

  const startExperiment = useCallback(
    (exp: Experiment) => {
      if (exp.setup === "fresh") lab.reset();
      else lab.cancel();
      setActiveExperiment(exp.id);
      const first = exp.items.find((i) => i.kind === "send");
      if (first && first.kind === "send") {
        setSrc(first.src);
        setDst(first.dst);
      }
    },
    [lab],
  );

  const sendFromExperiment = useCallback(
    (s: DeviceId, d: DstChoice) => {
      setSrc(s);
      setDst(d);
      lab.send(s, d);
    },
    [lab],
  );

  const draft = useMemo(() => ({ srcMac: deviceById(src).mac, dstMac: dstMacFor(dst) }), [src, dst]);
  const { state } = lab;

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-3xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        A switch learns <strong className="font-semibold text-ink dark:text-bone">who is where</strong> by reading the <em>source</em> MAC address of every frame, then uses the <em>destination</em> MAC address to decide where to send it. Send a few frames and watch the MAC table, the frame and the switch’s decision.
      </p>

      <div className="min-w-0 rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-5">
            <FrameBuilder lab={lab} src={src} dst={dst} onSrc={handleSrc} onDst={setDst} />
            <Panel title="Live network">
              <div className="flex flex-col gap-4">
                <StageStepper tx={state.tx} />
                <SwitchDiagram tx={state.tx} enabled={state.enabled} />
                <OutcomeLegend tx={state.tx} />
              </div>
            </Panel>
            <PortControls lab={lab} />
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            <MacTablePanel lab={lab} />
            <DecisionPanel tx={state.tx} />
            <FrameInspector tx={state.tx} draft={draft} />
          </div>
        </div>
      </div>

      <ExperimentsPanel lab={lab} activeId={activeExperiment} onStart={startExperiment} onSend={sendFromExperiment} />
      <EventLog entries={state.log} onClear={lab.clearLog} />
      <KeyIdeas />

      <p className="text-xs text-ink-soft dark:text-bone-soft">
        This is a simplified single-LAN, single-VLAN model: every port belongs to the same broadcast domain. Real switches keep a separate MAC table for each VLAN and learn from the source address of every frame they receive. All MAC addresses here are fictional, and the {EXPERIMENTS.length} experiments above use only the controls on this page. VLANs, spanning tree, link aggregation and routing are covered elsewhere.
      </p>
    </div>
  );
}
