"use client";

import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import { formatIPv4 } from "../../ip-addressing-simulator/model";
import type { SubnetLab } from "../hooks/use-subnet-lab";
import { pow2 } from "../model";
import { PlanControls } from "./plan-controls";
import { SubnetInspector } from "./subnet-inspector";
import { SubnetTable } from "./subnet-table";

/** Section 13: the subnet calculator. It edits the same plan as every other tab and shows where each number comes from. */
export function CalculatorLab({ lab }: { lab: SubnetLab }) {
  const { plan, selectedRow } = lab;
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Subnet calculator">Enter a starting network, the original prefix, and the new prefix. Every result shows the rule it comes from, so you can check it by hand.</SectionHeading>
      <PlanControls lab={lab} idPrefix="ca" />
      {plan && selectedRow ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
            <Result label="Subnet mask" value={formatIPv4(plan.newMask)} rule={`${plan.newPrefix} ones then ${32 - plan.newPrefix} zeros`} />
            <Result label="Borrowed bits" value={plan.borrowed} rule={`${plan.newPrefix} − ${plan.origPrefix}`} />
            <Result label="Number of subnets" value={plan.subnetCount.toLocaleString()} rule={`${pow2(plan.borrowed)}`} />
            <Result label="Host bits" value={plan.hostBits} rule={`32 − ${plan.newPrefix}`} />
            <Result label="Addresses per subnet" value={plan.addressesPerSubnet.toLocaleString()} rule={`${pow2(plan.hostBits)}`} />
            <Result label="Typical usable hosts" value={plan.usablePerSubnet.toLocaleString()} rule={`${pow2(plan.hostBits)} − 2`} />
          </div>
          <Panel title="Complete subnet table">
            <SubnetTable plan={plan} selected={selectedRow.number} onSelect={lab.setSelected} />
          </Panel>
          <SubnetInspector plan={plan} row={selectedRow} />
          <Callout title="Check it by hand">
            Total addresses ÷ number of subnets should equal addresses per subnet: {plan.parent.totalAddresses.toLocaleString()} ÷ {plan.subnetCount.toLocaleString()} = {(plan.parent.totalAddresses / plan.subnetCount).toLocaleString()}. If those do not match, one of the steps above is wrong.
          </Callout>
        </>
      ) : (
        <Callout tone="warn" title="Fix the starting network">{lab.ipError}</Callout>
      )}
    </div>
  );
}

function Result({ label, value, rule }: { label: string; value: string | number; rule: string }) {
  return (
    <div className="min-w-0 rounded-card border border-line p-3 dark:border-line-dark">
      <p className="text-[11px] text-ink-soft dark:text-bone-soft">{label}</p>
      <p className="break-words font-mono text-lg text-ink dark:text-bone">{value}</p>
      <p className="font-mono text-[11px] text-subject-it">{rule}</p>
    </div>
  );
}
