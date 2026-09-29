"use client";

import { useEffect, useState } from "react";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import { formatIPv4, ipBinary, parseMask } from "../../ip-addressing-simulator/model";
import { TextField } from "../../ip-addressing-simulator/components/parts";
import type { SubnetLab } from "../hooks/use-subnet-lab";
import { explainMask, maskBinary, maxNewFor, patternText } from "../model";
import { PlanControls } from "./plan-controls";
import { SplitBits, SplitLegend } from "./split-bits";

/** Sections 7-8: the binary subnetting view (with a Show Binary toggle) and prefix ⇄ subnet-mask conversion. */
export function BinaryLab({ lab }: { lab: SubnetLab }) {
  const { plan } = lab;
  const [draft, setDraft] = useState("");
  const [touched, setTouched] = useState(false);
  const next = lab.next;

  useEffect(() => {
    if (plan) setDraft(formatIPv4(plan.newMask));
    setTouched(false);
  }, [next, plan?.newMask]); // eslint-disable-line react-hooks/exhaustive-deps

  const parsed = parseMask(draft);
  const maskError = !touched ? null : !parsed.ok ? parsed.reason : parsed.prefix < lab.orig || parsed.prefix > maxNewFor(lab.orig) ? `That mask is /${parsed.prefix}, outside the range this network can use (/${lab.orig} to /${maxNewFor(lab.orig)}).` : null;

  function onMask(v: string) {
    setDraft(v);
    setTouched(true);
    const r = parseMask(v);
    if (r.ok && r.prefix >= lab.orig && r.prefix <= maxNewFor(lab.orig)) lab.setNext(r.prefix);
  }

  if (!plan) return <Callout tone="warn" title="Fix the starting network">{lab.ipError}</Callout>;
  const exp = explainMask(plan.newPrefix);
  const origExp = explainMask(plan.origPrefix);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Binary subnetting view">Look at the actual bits. The prefix decides which bits are network bits, and borrowing moves that boundary to the right.</SectionHeading>
      <PlanControls lab={lab} compact idPrefix="bn" />

      <Panel title="Binary view">
        <div className="flex flex-col gap-3">
          <button type="button" role="switch" aria-checked={lab.showBinary} onClick={() => lab.setShowBinary(!lab.showBinary)} className="min-h-[44px] self-start rounded-full border border-subject-it bg-subject-it-soft px-4 py-2 text-xs font-medium text-subject-it dark:bg-subject-it/20">
            Show Binary: {lab.showBinary ? "on" : "off"}
          </button>
          {lab.showBinary ? (
            <div className="flex flex-col gap-3">
              <div>
                <SplitBits orig={plan.origPrefix} next={plan.newPrefix} value={plan.base} label={`IP: ${formatIPv4(plan.base)}`} />
                <p className="mt-1 break-all font-mono text-[11px] text-ink dark:text-bone">{ipBinary(plan.base)}</p>
              </div>
              <div>
                <SplitBits orig={plan.origPrefix} next={plan.newPrefix} mode="letters" label={`/${plan.newPrefix}:`} />
                <p className="mt-1 break-all font-mono text-[11px] text-ink dark:text-bone">{patternText(plan.origPrefix, plan.newPrefix)}</p>
              </div>
              <SplitLegend borrowed={plan.borrowed > 0} />
              <p className="text-sm text-ink-soft dark:text-bone-soft">
                The dark bar marks the original /{plan.origPrefix} boundary{plan.borrowed > 0 ? ` and the amber bar marks the new /${plan.newPrefix} boundary. The bits between them (the amber ones) are the borrowed bits.` : ". The prefix has not changed, so there are no borrowed bits yet."}
              </p>
              {plan.borrowed > 0 && (
                <div className="flex flex-wrap gap-2" aria-label="Subnet identifiers">
                  {plan.rows.slice(0, 8).map((r) => (
                    <span key={r.number} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink dark:border-line-dark dark:text-bone">
                      {r.idBits} → Subnet {r.number} ({formatIPv4(r.network)})
                    </span>
                  ))}
                  {plan.subnetCount > 8 && <span className="px-1 py-1 font-mono text-[11px] text-ink-soft dark:text-bone-soft">... +{plan.subnetCount - 8} more</span>}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-ink-soft dark:text-bone-soft">
              <span className="font-mono text-ink dark:text-bone">{formatIPv4(plan.base)}/{plan.newPrefix}</span> — switch Show Binary on to see which bits are network, borrowed, and host bits.
            </p>
          )}
        </div>
      </Panel>

      <Panel title="Subnet mask conversion">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-xl text-ink dark:text-bone" aria-live="polite">
            /{plan.newPrefix} <span className="text-ink-soft dark:text-bone-soft">⇄</span> {formatIPv4(plan.newMask)}
          </p>
          <SplitBits orig={plan.newPrefix} next={plan.newPrefix} mode="mask" label="Binary subnet mask" />
          <p className="break-all font-mono text-[11px] text-ink dark:text-bone">{maskBinary(plan.newPrefix)}</p>
          <TextField id="bn-mask" label="Or type a mask" value={draft} onChange={onMask} error={maskError} placeholder="255.255.255.192" className="max-w-xs" />
          <ol className="flex list-decimal flex-col gap-1 pl-5 text-sm text-ink-soft dark:text-bone-soft">
            {exp.lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ol>
          {plan.borrowed > 0 && (
            <Callout title={`From ${formatIPv4(plan.parent.mask)} to ${formatIPv4(plan.newMask)}`}>
              The original /{plan.origPrefix} mask is <span className="font-mono">{maskBinary(plan.origPrefix)}</span>. Borrowing {plan.borrowed} bit{plan.borrowed > 1 ? "s" : ""} turns {plan.borrowed} more 0{plan.borrowed > 1 ? "s" : ""} into 1{plan.borrowed > 1 ? "s" : ""}, giving <span className="font-mono">{maskBinary(plan.newPrefix)}</span>.{exp.partialValue !== null && origExp.partialValue !== exp.partialValue ? ` In the octet where the boundary sits, the value changes from ${origExp.partialValue ?? 0} to ${exp.partialValue}.` : ""}
            </Callout>
          )}
        </div>
      </Panel>
    </div>
  );
}
