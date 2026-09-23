"use client";

import { Panel, SectionHeading } from "./ui";
import type { TabId } from "../network-fundamentals-topologies";

interface Experiment {
  title: string;
  objective: string;
  startingConfiguration: string;
  task: string;
  controls: string;
  expectedObservation: string;
  explanation: string;
  goTo: TabId;
  goToLabel: string;
}

const EXPERIMENTS: Experiment[] = [
  {
    title: "1. Build a LAN",
    objective: "Connect a small set of PCs and a server through a switch.",
    startingConfiguration: "An empty canvas on the Build tab.",
    task: "Add two or three PCs, one switch, and one server. Connect every PC to the switch, then connect the switch to the server.",
    controls: "Add-device buttons, click-to-connect, connection type picker.",
    expectedObservation: "Every PC can reach the server through exactly one shared device — the switch.",
    explanation: "This is the shape of a typical small LAN: a star of end devices around a switch, with the server reachable from every client.",
    goTo: "build",
    goToLabel: "Open Build a Network",
  },
  {
    title: "2. Compare topologies",
    objective: "Build Star, Ring, Bus, and Mesh and compare their structure.",
    startingConfiguration: "The Topologies tab's preset picker.",
    task: "Select each of the four topologies one at a time and read its comparison panel.",
    controls: "Topology preset buttons.",
    expectedObservation: "The same number of devices produces very different numbers of links and very different redundancy characteristics.",
    explanation: "Structure, not device count, is what determines a topology's scalability and resilience trade-offs.",
    goTo: "topologies",
    goToLabel: "Open Topologies",
  },
  {
    title: "3. Find the single point of failure",
    objective: "Identify which device or link, if it failed, would disconnect part of the network.",
    startingConfiguration: "Build a Star topology on the Topologies tab, then switch to the Failure Lab.",
    task: "Turn on \"Show single points of failure\" and read which elements are highlighted in amber.",
    controls: "Show single points of failure toggle, click-to-fail.",
    expectedObservation: "The central switch in a Star topology is highlighted — failing it disconnects every other device.",
    explanation: "A Star topology's resilience is only as good as its one central device; that's the classic single point of failure.",
    goTo: "failure",
    goToLabel: "Open Failure Lab",
  },
  {
    title: "4. Add redundancy",
    objective: "Add an extra path and test whether failure behavior improves.",
    startingConfiguration: "Any topology with a highlighted single point of failure on the Failure Lab.",
    task: "Use \"Add a redundant link\" to connect two devices on either side of a highlighted link, then fail that same link again.",
    controls: "Add a redundant link, click-to-fail.",
    expectedObservation: "After the redundant link is added, failing the original link no longer disconnects anything.",
    explanation: "Redundancy works by giving the network a second path — but it also means more links to install and maintain.",
    goTo: "failure",
    goToLabel: "Open Failure Lab",
  },
  {
    title: "5. Bandwidth vs. throughput",
    objective: "Change link capacity and network load, and watch achieved throughput change independently.",
    startingConfiguration: "The Performance tab's bandwidth/latency/loss/load controls.",
    task: "Hold latency and packet loss at their lowest settings, then raise load from 0% toward 150% and watch throughput.",
    controls: "Bandwidth buttons, load slider.",
    expectedObservation: "Throughput rises with load up to the link's bandwidth ceiling, then flattens out — it never exceeds bandwidth.",
    explanation: "Bandwidth is a hard ceiling; throughput is what's actually achieved underneath that ceiling.",
    goTo: "performance",
    goToLabel: "Open Performance Lab",
  },
  {
    title: "6. Latency and packet loss",
    objective: "See how unreliable and slow conditions affect communication differently.",
    startingConfiguration: "The Send Data tab, and the Performance tab's latency slider.",
    task: "Set packet loss to 25% on Send Data and send several packets; separately, raise latency on the Performance tab and watch throughput.",
    controls: "Packet loss buttons, Send data button, latency slider.",
    expectedObservation: "Higher packet loss causes some sends to fail outright; higher latency instead slows throughput without necessarily failing anything.",
    explanation: "Loss and latency are two separate problems — a link can be reliable but slow, or fast but unreliable.",
    goTo: "packets",
    goToLabel: "Open Send Data",
  },
  {
    title: "7. Client–server vs. peer-to-peer",
    objective: "Compare where the workload concentrates in each architecture.",
    startingConfiguration: "The Client–Server vs. P2P tab.",
    task: "Send a request in Client–Server mode, then switch to Peer-to-Peer and send one between two peers.",
    controls: "Architecture toggle, From/To selectors, Send request button.",
    expectedObservation: "In Client–Server, every request passes through the same server; in Peer-to-Peer, requests can travel directly between any two devices.",
    explanation: "Neither architecture is strictly better — client–server centralizes management, peer-to-peer distributes load.",
    goTo: "client-server",
    goToLabel: "Open Client–Server vs. P2P",
  },
];

export function GuidedExperimentsLab({ onJumpToTab }: { onJumpToTab: (tab: TabId) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Guided experiments">
        Seven short, structured experiments that walk through the ideas in this lab one at a time. Each links straight
        to the tab it uses.
      </SectionHeading>
      <div className="grid gap-4 sm:grid-cols-2">
        {EXPERIMENTS.map((exp) => (
          <Panel key={exp.title} title={exp.title}>
            <div className="flex flex-col gap-2 text-sm">
              <p><span className="font-medium text-ink dark:text-bone">Objective:</span> <span className="text-ink-soft dark:text-bone-soft">{exp.objective}</span></p>
              <p><span className="font-medium text-ink dark:text-bone">Starting configuration:</span> <span className="text-ink-soft dark:text-bone-soft">{exp.startingConfiguration}</span></p>
              <p><span className="font-medium text-ink dark:text-bone">Task:</span> <span className="text-ink-soft dark:text-bone-soft">{exp.task}</span></p>
              <p><span className="font-medium text-ink dark:text-bone">Controls:</span> <span className="text-ink-soft dark:text-bone-soft">{exp.controls}</span></p>
              <p><span className="font-medium text-ink dark:text-bone">Expected observation:</span> <span className="text-ink-soft dark:text-bone-soft">{exp.expectedObservation}</span></p>
              <p><span className="font-medium text-ink dark:text-bone">Why:</span> <span className="text-ink-soft dark:text-bone-soft">{exp.explanation}</span></p>
              <button
                onClick={() => onJumpToTab(exp.goTo)}
                className="mt-1 self-start rounded-full border border-subject-it bg-subject-it-soft px-3 py-1.5 text-xs font-medium text-subject-it dark:bg-subject-it/20"
              >
                {exp.goToLabel}
              </button>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
