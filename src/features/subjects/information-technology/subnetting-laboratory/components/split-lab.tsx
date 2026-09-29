"use client";

import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import { formatIPv4 } from "../../ip-addressing-simulator/model";
import type { SubnetLab } from "../hooks/use-subnet-lab";
import { patternText, reasoningSteps } from "../model";
import { OriginalNetworkCard } from "./original-network-card";
import { PlanControls } from "./plan-controls";
import { SplitBits, SplitLegend } from "./split-bits";
import { SubnetMap } from "./subnet-map";

/** Sections 1-4 and 6: start network, prefix selector, borrowing bits, the calculation with reasoning, and the map. */
export function SplitLab({ lab }: { lab: SubnetLab }) {
  const { plan } = lab;
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Split one network into equal subnets">Start with a network, then make its prefix longer. Each extra network bit is borrowed from the host bits and divides the address space again.</SectionHeading>
      <div className="grid gap-4 lg:grid-cols-2">
        {plan ? <OriginalNetworkCard plan={plan} /> : <Callout tone="warn" title="Fix the starting network">{lab.ipError}</Callout>}
        <PlanControls lab={lab} idPrefix="sp" />
      </div>

      {plan && (
        <>
          <Panel title="Borrowing host bits">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Stat label="Original" value={`/${plan.origPrefix}`} />
                <Stat label="New" value={`/${plan.newPrefix}`} />
                <Stat label="Borrowed bits" value={plan.borrowed} accent />
                <Stat label="Remaining host bits" value={plan.hostBits} />
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <SplitBits orig={plan.origPrefix} next={plan.origPrefix} mode="letters" label={`Original: /${plan.origPrefix}`} />
                  <p className="mt-1 break-all font-mono text-[11px] text-ink-soft dark:text-bone-soft">{patternText(plan.origPrefix, plan.origPrefix)}</p>
                </div>
                <div>
                  <SplitBits orig={plan.origPrefix} next={plan.newPrefix} mode="letters" label={`New: /${plan.newPrefix}`} />
                  <p className="mt-1 break-all font-mono text-[11px] text-ink-soft dark:text-bone-soft">{patternText(plan.origPrefix, plan.newPrefix)}</p>
                </div>
                <SplitLegend borrowed={plan.borrowed > 0} />
              </div>
              <Callout title="Why more network bits means more, smaller networks">
                {plan.borrowed === 0
                  ? "The prefix has not changed, so no bits are borrowed and the address space is still one network. Make the new prefix longer to divide it."
                  : `The ${plan.borrowed} amber bit${plan.borrowed > 1 ? "s were" : " was"} host bits and ${plan.borrowed > 1 ? "are" : "is"} now part of the network portion. Each pattern of ${plan.borrowed > 1 ? "those bits" : "that bit"} identifies a different subnet, so there are ${plan.subnetCount} of them, and fewer host bits are left in each.`}
              </Callout>
            </div>
          </Panel>

          <Panel title="The calculation, step by step">
            <ol className="flex flex-col gap-2">
              {reasoningSteps(plan).map((s) => (
                <li key={s.label} className="rounded-card border border-line p-3 dark:border-line-dark">
                  <p className="text-sm font-medium text-ink dark:text-bone">{s.label}</p>
                  <p className="mt-0.5 break-words font-mono text-sm text-subject-it">{s.math}</p>
                  <p className="mt-0.5 text-xs text-ink-soft dark:text-bone-soft">{s.note}</p>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-ink-soft dark:text-bone-soft">
              Resulting subnets:{" "}
              <span className="font-mono text-ink dark:text-bone">
                {plan.rows.slice(0, 8).map((r) => `${formatIPv4(r.network)}/${r.prefix}`).join(", ")}
                {plan.subnetCount > 8 ? `, ... (${plan.subnetCount - 8} more)` : ""}
              </span>
            </p>
          </Panel>

          <Panel title="Visual subnet map">
            <SubnetMap plan={plan} selected={lab.selected} onSelect={lab.setSelected} />
            <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">Select a segment, then open the Subnet Table &amp; Map tab to inspect it.</p>
          </Panel>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="rounded-card border border-line p-2.5 dark:border-line-dark">
      <p className="text-[11px] text-ink-soft dark:text-bone-soft">{label}</p>
      <p className={"font-mono text-lg " + (accent ? "text-amber-600 dark:text-amber-400" : "text-ink dark:text-bone")}>{value}</p>
    </div>
  );
}
