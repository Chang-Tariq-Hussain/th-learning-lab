"use client";

import { Callout, PillButton } from "../../osi-model-explorer/components/ui";
import { formatIPv4, prefixToMask } from "../../ip-addressing-simulator/model";
import { PrefixControl, TextField } from "../../ip-addressing-simulator/components/parts";
import { MAX_ORIG, MIN_ORIG, maxNewFor, type SplitPlan } from "../model";
import type { SubnetLab } from "../hooks/use-subnet-lab";

const ORIG_CHOICES = Array.from({ length: MAX_ORIG - MIN_ORIG + 1 }, (_, i) => MIN_ORIG + i);

/** Prefix pills + slider for the NEW prefix. `compact` hides the network and original-prefix fields. */
export function PlanControls({ lab, compact = false, idPrefix = "pc" }: { lab: SubnetLab; compact?: boolean; idPrefix?: string }) {
  const { orig, next, plan } = lab;
  const max = maxNewFor(orig);
  const pills = Array.from({ length: max - orig + 1 }, (_, i) => orig + i);

  return (
    <div className="flex flex-col gap-4">
      {!compact && (
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField id={`${idPrefix}-net`} label="Starting network address" value={lab.ipText} onChange={lab.setIpText} error={lab.ipError} placeholder="192.168.1.0" />
          <div className="flex min-w-0 flex-col gap-1">
            <label htmlFor={`${idPrefix}-orig`} className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
              Original prefix
            </label>
            <select id={`${idPrefix}-orig`} value={orig} onChange={(e) => lab.setOrig(Number(e.target.value))} className="min-h-[44px] w-full rounded-card border border-line bg-paper px-3 py-2 font-mono text-sm text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone">
              {ORIG_CHOICES.map((p) => (
                <option key={p} value={p}>
                  /{p} ({formatIPv4(prefixToMask(p))})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {!compact && plan && <NormalizedNote lab={lab} plan={plan} />}
      <div className="flex flex-col gap-2">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">New prefix (subnet size)</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="New prefix length">
          {pills.map((c) => (
            <PillButton key={c} active={next === c} onClick={() => lab.setNext(c)}>
              /{c}
            </PillButton>
          ))}
        </div>
        <PrefixControl id={`${idPrefix}-next`} prefix={next} onChange={lab.setNext} min={orig} max={max} />
      </div>
    </div>
  );
}

function NormalizedNote({ lab, plan }: { lab: SubnetLab; plan: SplitPlan }) {
  const typed = lab.ipText.trim();
  if (lab.ipError || typed === formatIPv4(plan.base)) return null;
  return (
    <Callout tone="warn" title="That address is not the network address">
      {typed}/{plan.origPrefix} is a host inside {formatIPv4(plan.base)}/{plan.origPrefix}. Subnetting starts from the network address, so the lab uses <span className="font-mono">{formatIPv4(plan.base)}/{plan.origPrefix}</span> (all host bits set to 0).
    </Callout>
  );
}
