"use client";

import { useCallback, useState } from "react";
import { Panel } from "../osi-model-explorer/components/ui";
import { ComparePanel } from "./components/compare-panel";
import { DecisionPanel } from "./components/decision-panel";
import { EventLog } from "./components/event-log";
import { EXPERIMENTS, ExperimentsPanel, type Experiment } from "./components/experiments-panel";
import { GatewayPanel } from "./components/gateway-panel";
import { KeyIdeas } from "./components/key-ideas";
import { CUSTOM, PacketBuilder, resolveDestination } from "./components/packet-builder";
import { PacketInspector } from "./components/packet-inspector";
import { RoutingDiagram } from "./components/routing-diagram";
import { RoutingTablePanel } from "./components/routing-table-panel";
import { StageStepper } from "./components/stage-stepper";
import { useRoutingLab } from "./hooks/use-routing-lab";
import { SCENARIOS, type ScenarioId } from "./model";

/**
 * "Routing Simulator": a standalone, basic IPv4 routing lab. One or two routers, a few hosts, connected routes,
 * static routes, a default route and longest-prefix route selection. All lab state (routes, current packet, log)
 * lives in `useRoutingLab`, a single reducer, so nothing is duplicated across panels. Plain 2D SVG/HTML: no three.js,
 * no extra dependencies.
 *
 * Out of scope on purpose: dynamic routing protocols (RIP, OSPF, BGP), route metrics and administrative distance,
 * NAT, ARP, ICMP/ping, TCP/UDP, VLANs, firewalls and VPNs.
 */
export function RoutingSimulator() {
  const lab = useRoutingLab();
  const [src, setSrc] = useState("PC-A");
  const [dst, setDst] = useState("PC-B");
  const [custom, setCustom] = useState("");
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);
  const { state } = lab;
  const sc = SCENARIOS[state.scenarioId];

  const handleSrc = useCallback(
    (id: string) => {
      setSrc(id);
      // A packet can't be addressed to its own sender here, so move the destination if it clashes.
      setDst((d) => (d === id ? (sc.hosts.find((h) => h.id !== id)?.id ?? d) : d));
    },
    [sc],
  );

  const changeScenario = useCallback(
    (id: ScenarioId) => {
      lab.setScenario(id);
      setSrc("PC-A");
      setDst("PC-B");
      setCustom("");
      setActiveExperiment(null);
    },
    [lab],
  );

  const reset = useCallback(() => {
    lab.reset();
    setActiveExperiment(null);
  }, [lab]);

  const pickDestination = useCallback((scenarioId: ScenarioId, srcId: string, ip: string) => {
    const host = SCENARIOS[scenarioId].hosts.find((h) => h.ip === ip && h.id !== srcId);
    if (host) setDst(host.id);
    else {
      setDst(CUSTOM);
      setCustom(ip);
    }
  }, []);

  const startExperiment = useCallback(
    (exp: Experiment) => {
      lab.setScenario(exp.scenario, exp.seeds);
      setActiveExperiment(exp.id);
      const first = exp.items.find((i) => i.kind === "send");
      if (first && first.kind === "send") {
        setSrc(first.src);
        pickDestination(exp.scenario, first.src, first.dst);
      }
    },
    [lab, pickDestination],
  );

  const sendFromExperiment = useCallback(
    (srcId: string, ip: string) => {
      setSrc(srcId);
      pickDestination(state.scenarioId, srcId, ip);
      lab.send(srcId, ip);
    },
    [lab, pickDestination, state.scenarioId],
  );

  const target = resolveDestination(lab, src, dst, custom);

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-3xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        A router connects different networks. When a packet arrives, the router reads the <strong className="font-semibold text-ink dark:text-bone">destination IP address</strong>, looks for the best matching route in its routing table, and forwards the packet to the next hop. Send a few packets, then change the routes and see what happens.
      </p>

      <div className="min-w-0 rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-5">
            <PacketBuilder lab={lab} src={src} dst={dst} custom={custom} onSrc={handleSrc} onDst={setDst} onCustom={setCustom} onScenario={changeScenario} onReset={reset} />
            <Panel title="Live network">
              <div className="flex flex-col gap-4">
                <StageStepper plan={state.plan} idx={state.idx} step={lab.step} />
                <RoutingDiagram scenario={sc} plan={state.plan} idx={state.idx} txId={state.txId} step={lab.step} />
              </div>
            </Panel>
            <GatewayPanel scenario={sc} srcId={src} dstIp={target.ok ? target.ip : null} step={lab.inFlight ? lab.step : null} />
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            <RoutingTablePanel lab={lab} />
            <DecisionPanel plan={state.plan} idx={state.idx} />
            <PacketInspector plan={state.plan} step={lab.step} />
          </div>
        </div>
      </div>

      <ExperimentsPanel lab={lab} activeId={activeExperiment} onStart={startExperiment} onSend={sendFromExperiment} />
      <EventLog entries={state.log} onClear={lab.clearLog} />
      <ComparePanel />
      <KeyIdeas />

      <p className="text-xs text-ink-soft dark:text-bone-soft">
        This is a simplified IPv4 model with directly connected and static routes only. Real routers can also learn routes with dynamic routing protocols, weigh routes by administrative distance and metric, and use ARP on each link to find the next device’s MAC address; this lab leaves those out on purpose. All addresses here are private or documentation-style examples, and the {EXPERIMENTS.length} experiments above use only the controls on this page.
      </p>
    </div>
  );
}
