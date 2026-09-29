"use client";

import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import type { SubnetLab } from "../hooks/use-subnet-lab";
import { PlanControls } from "./plan-controls";
import { SubnetInspector } from "./subnet-inspector";
import { SubnetMap } from "./subnet-map";
import { SubnetTable } from "./subnet-table";

/** Sections 5, 6 and 14: interactive subnet table, map and inspector. */
export function TableLab({ lab }: { lab: SubnetLab }) {
  const { plan, selectedRow } = lab;
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Subnet table and map">Change the prefix and both views redraw. Click a subnet in the map or the table to inspect it.</SectionHeading>
      <PlanControls lab={lab} compact idPrefix="tb" />
      {plan && selectedRow ? (
        <>
          <Panel title="Address space divided into subnets">
            <SubnetMap plan={plan} selected={lab.selected} onSelect={lab.setSelected} />
          </Panel>
          <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
            <div className="min-w-0">
              <SubnetTable plan={plan} selected={selectedRow.number} onSelect={lab.setSelected} />
            </div>
            <div className="min-w-0">
              <SubnetInspector plan={plan} row={selectedRow} />
            </div>
          </div>
          <Callout title="Typical usable hosts vs. special cases">
            Every row above follows the ordinary rule: the first address is the network address, the last is the broadcast address, and the hosts in between are &ldquo;typical usable hosts&rdquo; (2<sup>H</sup> − 2). Two prefixes break that rule and are not part of equal-size LAN subnetting: <strong>/31</strong> (two addresses for a point-to-point link, both usable) and <strong>/32</strong> (a single address). See the Prefix Quick Guide.
          </Callout>
        </>
      ) : (
        <Callout tone="warn" title="Fix the starting network">{lab.ipError}</Callout>
      )}
    </div>
  );
}
