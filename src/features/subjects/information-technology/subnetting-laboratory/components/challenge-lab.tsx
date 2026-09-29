"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Callout } from "../../osi-model-explorer/components/ui";
import { formatIPv4 } from "../../ip-addressing-simulator/model";
import { Chip } from "../../ip-addressing-simulator/components/parts";
import { DEPARTMENT_NEEDS, PREFIX_TASKS, SUBNET_CHALLENGE_IDS, type SubnetChallengeId } from "../challenges";
import { useSubnetLab, type SubnetLab } from "../hooks/use-subnet-lab";
import { ALLOC_LETTERS, DIAGNOSE_DEVICES, allocPlan, diagnoseDevice } from "../model";
import { PlanControls } from "./plan-controls";
import { SubnetMap } from "./subnet-map";
import { SubnetTable } from "./subnet-table";

export interface SubnetChallengeLabHandle {
  /** Inspects what the student actually built. */
  check: () => boolean;
}

/**
 * A self-contained lab for the interactive Challenge scenarios. Each scenario starts from its own state;
 * "Check my work" grades what the student built, not a typed description of it.
 */
export const SubnetChallengeLab = forwardRef<SubnetChallengeLabHandle, { challengeId: SubnetChallengeId }>(function SubnetChallengeLab({ challengeId }, ref) {
  const inner = useRef<SubnetChallengeLabHandle | null>(null);
  useImperativeHandle(ref, () => ({ check: () => inner.current?.check() ?? false }), []);

  return (
    <div className="flex flex-col gap-4 rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
      {challengeId === SUBNET_CHALLENGE_IDS.departments ? (
        <DepartmentsChallenge ref={inner} />
      ) : challengeId === SUBNET_CHALLENGE_IDS.diagnose ? (
        <DiagnoseChallenge ref={inner} />
      ) : (
        <PrefixChallenge ref={inner} challengeId={challengeId} />
      )}
    </div>
  );
});

// ---- Choose the right prefix ---------------------------------------------

const PrefixChallenge = forwardRef<SubnetChallengeLabHandle, { challengeId: SubnetChallengeId }>(function PrefixChallenge({ challengeId }, ref) {
  const task = PREFIX_TASKS[challengeId]!;
  const lab = useSubnetLab({ network: task.network, orig: task.orig, next: task.orig });
  const nextRef = useRef(lab.next);
  nextRef.current = lab.next;
  useImperativeHandle(ref, () => ({ check: () => nextRef.current === task.expected }), [task]);

  return (
    <>
      <Callout title="Your task">
        {task.instructions}
        <span className="mt-1 block">{task.focus}</span>
      </Callout>
      <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">Starting network: {task.network}/{task.orig}</p>
      <PlanControls lab={lab} compact idPrefix={`ch-${challengeId.slice(-6)}`} />
      {lab.plan && (
        <>
          <SubnetMap plan={lab.plan} />
          <dl className="grid gap-2 font-mono text-xs text-ink dark:text-bone sm:grid-cols-3" aria-live="polite">
            <span>Subnets: {lab.plan.subnetCount}</span>
            <span>Addresses each: {lab.plan.addressesPerSubnet}</span>
            <span>Typical usable hosts: {lab.plan.usablePerSubnet}</span>
          </dl>
        </>
      )}
      <div>
        <button type="button" onClick={() => lab.setNext(task.orig)} className="min-h-[44px] rounded-full border border-line px-4 text-xs dark:border-line-dark">Restart this challenge</button>
      </div>
    </>
  );
});

// ---- Design four department subnets ---------------------------------------

const DepartmentsChallenge = forwardRef<SubnetChallengeLabHandle, object>(function DepartmentsChallenge(_props, ref) {
  const lab: SubnetLab = useSubnetLab({ network: "192.168.1.0", orig: 24, next: 24 });
  const [assign, setAssign] = useState<Record<string, number>>({});
  const state = useRef({ next: lab.next, assign });
  state.current = { next: lab.next, assign };

  useImperativeHandle(
    ref,
    () => ({
      check: () => {
        const { next, assign: a } = state.current;
        if (next !== 26) return false;
        const picks = DEPARTMENT_NEEDS.map((d) => a[d.letter]);
        if (picks.some((p) => p === undefined || p < 1 || p > 4)) return false;
        return new Set(picks).size === 4;
      },
    }),
    [],
  );

  const plan = lab.plan;
  return (
    <>
      <Callout title="Your task">
        One /24 must serve four departments with equal-size subnets. First choose a prefix that gives at least 4 subnets, each big enough for the biggest department, then give every department its own subnet.
        <span className="mt-1 block">Equal sizes only: every subnet is the same size, even for the smaller departments.</span>
      </Callout>
      <ul className="grid gap-1 text-sm text-ink dark:text-bone sm:grid-cols-2">
        {DEPARTMENT_NEEDS.map((d) => (
          <li key={d.letter}>
            Department {d.letter} ({d.name}): <span className="font-mono">{d.hosts}</span> hosts
          </li>
        ))}
      </ul>
      <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">Starting network: 192.168.1.0/24</p>
      <PlanControls lab={lab} compact idPrefix="ch-dept" />
      {plan && <SubnetMap plan={plan} />}
      <div className="grid gap-3 sm:grid-cols-2">
        {DEPARTMENT_NEEDS.map((d) => {
          const chosen = assign[d.letter];
          const row = plan && chosen ? plan.rows[chosen - 1] : undefined;
          const fits = plan ? plan.usablePerSubnet >= d.hosts : false;
          return (
            <div key={d.letter} className="flex flex-col gap-1 rounded-card border border-line p-2.5 dark:border-line-dark">
              <label htmlFor={`dept-${d.letter}`} className="text-xs font-medium text-ink dark:text-bone">Department {d.letter} ({d.name}) goes in subnet</label>
              <select id={`dept-${d.letter}`} value={chosen ?? ""} onChange={(e) => setAssign((p) => ({ ...p, [d.letter]: Number(e.target.value) }))} className="min-h-[44px] rounded-card border border-line bg-paper px-3 font-mono text-sm text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone">
                <option value="">— choose —</option>
                {plan?.rows.slice(0, 16).map((r) => (
                  <option key={r.number} value={r.number}>Subnet {r.number}: {formatIPv4(r.network)}/{r.prefix}</option>
                ))}
              </select>
              {row && <Chip tone={fits ? "good" : "bad"}>{fits ? `✓ ${plan!.usablePerSubnet} usable ≥ ${d.hosts}` : `✕ only ${plan!.usablePerSubnet} usable < ${d.hosts}`}</Chip>}
            </div>
          );
        })}
      </div>
      <div>
        <button type="button" onClick={() => { lab.setNext(24); setAssign({}); }} className="min-h-[44px] rounded-full border border-line px-4 text-xs dark:border-line-dark">Restart this challenge</button>
      </div>
    </>
  );
});

// ---- Diagnose incorrectly assigned addresses ------------------------------

const DiagnoseChallenge = forwardRef<SubnetChallengeLabHandle, object>(function DiagnoseChallenge(_props, ref) {
  const plan = allocPlan();
  const [flagged, setFlagged] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const flaggedRef = useRef(flagged);
  flaggedRef.current = flagged;

  useImperativeHandle(
    ref,
    () => ({
      check: () => {
        const truth = DIAGNOSE_DEVICES.filter((d) => !diagnoseDevice(d).ok).map((d) => d.id).sort();
        const mine = [...flaggedRef.current].sort();
        const ok = truth.length === mine.length && truth.every((id, i) => id === mine[i]);
        if (ok) setSolved(true);
        return ok;
      },
    }),
    [],
  );

  function toggle(id: string) {
    setFlagged((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
    setSolved(false);
  }

  return (
    <>
      <Callout title="Your task">
        192.168.1.0/24 was split into four /26 subnets, one per department. A technician assigned the addresses below, but some are wrong. Tick every device whose address is a mistake, then check.
        <span className="mt-1 block">A mistake is an address in the wrong department&apos;s subnet, or an address that cannot be given to a device at all.</span>
      </Callout>
      <ul className="grid gap-1 font-mono text-xs text-ink dark:text-bone sm:grid-cols-2">
        {plan.rows.map((r) => (
          <li key={r.number}>
            Dept {ALLOC_LETTERS[r.number - 1]}: {formatIPv4(r.network)}/{r.prefix} ({formatIPv4(r.network)} – {formatIPv4(r.broadcast)})
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-2">
        {DIAGNOSE_DEVICES.map((d) => {
          const on = flagged.includes(d.id);
          const v = diagnoseDevice(d);
          return (
            <li key={d.id} className="rounded-card border border-line p-2.5 dark:border-line-dark">
              <label className="flex min-h-[44px] cursor-pointer items-center gap-3 text-sm text-ink dark:text-bone">
                <input type="checkbox" checked={on} onChange={() => toggle(d.id)} className="h-5 w-5 accent-subject-it" />
                <span className="min-w-0 flex-1">
                  {d.name} <span className="text-xs text-ink-soft dark:text-bone-soft">(Department {d.dept})</span>
                  <span className="block break-all font-mono text-xs">{d.ip}/26</span>
                </span>
              </label>
              {solved && <p className={"mt-1 text-xs " + (v.ok ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300")}>{v.ok ? "✓ " : "✕ "}{v.reason}</p>}
            </li>
          );
        })}
      </ul>
      <SubnetTable plan={plan} maxHeight={false} />
      <div>
        <button type="button" onClick={() => { setFlagged([]); setSolved(false); }} className="min-h-[44px] rounded-full border border-line px-4 text-xs dark:border-line-dark">Restart this challenge</button>
      </div>
    </>
  );
});
