"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Callout } from "../osi-model-explorer/components/ui";
import { formatIPv4 } from "../ip-addressing-simulator/model";
import { AllocationLab } from "./components/allocation-lab";
import { BinaryLab } from "./components/binary-lab";
import { CalculatorLab } from "./components/calculator-lab";
import { ExperimentsLab } from "./components/experiments-lab";
import { GuideLab } from "./components/guide-lab";
import { HostsMode, RequirementsMode, SubnetsMode } from "./components/modes";
import { SameLab } from "./components/same-lab";
import { SplitLab } from "./components/split-lab";
import { TableLab } from "./components/table-lab";
import { useSubnetLab } from "./hooks/use-subnet-lab";
import type { Experiment, TabId } from "./model";

const TABS: { id: TabId; label: string; blurb: string }[] = [
  { id: "split", label: "Split a Network", blurb: "Pick a starting network and a new prefix. See the borrowed bits, the calculation, and the resulting subnets." },
  { id: "binary", label: "Binary & Mask", blurb: "The network / borrowed / host bits in binary, and how a prefix becomes a subnet mask." },
  { id: "table", label: "Subnet Table & Map", blurb: "The address space divided into subnets. Click a subnet to inspect it." },
  { id: "calculator", label: "Calculator", blurb: "Starting network, original prefix, new prefix: every result with the rule behind it." },
  { id: "subnets", label: "How Many Subnets?", blurb: "Choose the prefix that gives the number of subnets you need. Hints, not answers." },
  { id: "hosts", label: "How Many Hosts?", blurb: "Work from a host requirement to host bits and a prefix." },
  { id: "requirements", label: "Requirements", blurb: "Realistic scenarios: prefix, number of subnets, hosts per subnet, and network addresses." },
  { id: "allocation", label: "Allocation Lab", blurb: "Put devices in four department subnets and compare which ones share a subnet." },
  { id: "same", label: "Same or Different?", blurb: "Predict, then see the calculation that proves whether two addresses share a subnet." },
  { id: "guide", label: "Prefix Quick Guide", blurb: "/24 to /30 at a glance, with the reasoning behind each row." },
  { id: "experiments", label: "Guided Experiments", blurb: "Five short experiments with an objective, a task, and an explanation each." },
];

/**
 * "Subnetting Laboratory" — the sixth simulation in the Networking branch. Same tabbed 2D shell as the
 * earlier ones. The plan (network + prefixes) lives here so it survives tab switches.
 *
 * Out of scope on purpose: VLSM, ARP, DHCP, DNS, NAT and routing. Only equal-size subnetting is covered.
 */
export function SubnettingLaboratory() {
  const [tab, setTab] = useState<TabId>("split");
  const lab = useSubnetLab();
  const [hostsQuestionId, setHostsQuestionId] = useState<string | undefined>(undefined);
  const [comparePresetId, setComparePresetId] = useState<string | undefined>(undefined);
  const [hostsKey, setHostsKey] = useState(0);
  const [sameKey, setSameKey] = useState(0);

  const active = TABS.find((t) => t.id === tab) ?? TABS[0]!;

  function startExperiment(exp: Experiment) {
    const s = exp.setup;
    if (s.kind === "plan") lab.load({ network: s.network, orig: s.orig, next: s.next });
    if (s.kind === "hosts") {
      setHostsQuestionId(s.questionId);
      setHostsKey((k) => k + 1);
    }
    if (s.kind === "compare") {
      setComparePresetId(s.presetId);
      setSameKey((k) => k + 1);
    }
    setTab(exp.goTo);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-ink-soft dark:text-bone-soft" aria-live="polite">
        <span>Current plan:</span>
        {lab.plan ? (
          <span className="text-ink dark:text-bone">
            {formatIPv4(lab.plan.base)}/{lab.plan.origPrefix} → /{lab.plan.newPrefix} · {lab.plan.subnetCount.toLocaleString()} subnet{lab.plan.subnetCount === 1 ? "" : "s"} · {lab.plan.addressesPerSubnet.toLocaleString()} addresses each
          </span>
        ) : (
          <span className="text-red-700 dark:text-red-300">enter a valid starting network</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Subnetting Laboratory mode">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active.id === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "min-h-[40px] rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active.id === t.id ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink-soft dark:text-bone-soft">{active.blurb}</p>

      <div className="min-w-0 rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {active.id === "split" && <SplitLab lab={lab} />}
        {active.id === "binary" && <BinaryLab lab={lab} />}
        {active.id === "table" && <TableLab lab={lab} />}
        {active.id === "calculator" && <CalculatorLab lab={lab} />}
        {active.id === "subnets" && <SubnetsMode />}
        {active.id === "hosts" && <HostsMode key={hostsKey} initialId={hostsQuestionId} />}
        {active.id === "requirements" && <RequirementsMode />}
        {active.id === "allocation" && <AllocationLab />}
        {active.id === "same" && <SameLab key={sameKey} initialPresetId={comparePresetId} />}
        {active.id === "guide" && <GuideLab />}
        {active.id === "experiments" && <ExperimentsLab onStart={startExperiment} />}
      </div>

      <Callout title="Scope of this lab">
        This lab divides one network into <strong>equal-size</strong> subnets. Subnets of different sizes (VLSM), ARP, DHCP, DNS, NAT and routing are left out on purpose; later simulations in the Networking branch cover them one at a time.
      </Callout>
    </div>
  );
}
