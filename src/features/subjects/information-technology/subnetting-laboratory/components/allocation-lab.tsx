"use client";

import { useMemo, useState } from "react";
import { Callout, Panel, PillButton, SectionHeading } from "../../osi-model-explorer/components/ui";
import { formatIPv4 } from "../../ip-addressing-simulator/model";
import { Chip } from "../../ip-addressing-simulator/components/parts";
import { ALLOC_DEPARTMENTS, ALLOC_DEVICES, ALLOC_LETTERS, allocPlan, nextFreeHost, type AllocDevice } from "../model";
import { CompareCard } from "./compare-card";

interface Placement {
  subnet: number;
  ip: number;
}

/** Section 15: a simple network with a router and four subnets. Assign devices to subnets and see who shares one. No routing is simulated. */
export function AllocationLab() {
  const plan = useMemo(() => allocPlan(), []);
  const [placed, setPlaced] = useState<Record<string, Placement>>({});
  const [cmpA, setCmpA] = useState("");
  const [cmpB, setCmpB] = useState("");

  function takenIn(subnet: number, except?: string): number[] {
    return Object.entries(placed)
      .filter(([id, p]) => p.subnet === subnet && id !== except)
      .map(([, p]) => p.ip);
  }
  function place(dev: AllocDevice, subnet: number) {
    const ip = nextFreeHost(plan.rows[subnet - 1]!, takenIn(subnet, dev.id));
    if (ip === null) return;
    setPlaced((prev) => ({ ...prev, [dev.id]: { subnet, ip } }));
  }
  function remove(id: string) {
    setPlaced((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }
  function placeAllCorrectly() {
    const next: Record<string, Placement> = {};
    for (const d of ALLOC_DEVICES) {
      const subnet = ALLOC_LETTERS.indexOf(d.dept) + 1;
      const taken = Object.values(next).filter((p) => p.subnet === subnet).map((p) => p.ip);
      const ip = nextFreeHost(plan.rows[subnet - 1]!, taken);
      if (ip !== null) next[d.id] = { subnet, ip };
    }
    setPlaced(next);
  }

  const placedDevices = ALLOC_DEVICES.filter((d) => placed[d.id]);
  const unplaced = ALLOC_DEVICES.filter((d) => !placed[d.id]);
  const aId = placed[cmpA] ? cmpA : (placedDevices[0]?.id ?? "");
  const bId = placed[cmpB] && cmpB !== aId ? cmpB : (placedDevices.find((d) => d.id !== aId)?.id ?? "");
  const devA = ALLOC_DEVICES.find((d) => d.id === aId);
  const devB = ALLOC_DEVICES.find((d) => d.id === bId);
  const wrong = placedDevices.filter((d) => ALLOC_LETTERS[placed[d.id]!.subnet - 1] !== d.dept).length;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Subnet allocation lab">192.168.1.0/24 has been split into four /26 subnets, one per department. Put each device in a subnet; the lab gives it the next free host address. The router connects the subnets, but nothing is routed here.</SectionHeading>

      <Panel title="Network">
        <div className="flex flex-col items-center gap-0">
          <div className="rounded-card border border-subject-it bg-subject-it-soft px-5 py-2 text-center font-mono text-sm text-subject-it dark:bg-subject-it/20">Router</div>
          <div className="h-3 w-px bg-ink/40 dark:bg-bone/40" aria-hidden="true" />
          <div className="mx-auto hidden h-3 w-[75%] rounded-t-md border-x border-t border-ink/40 dark:border-bone/40 lg:block" aria-hidden="true" />
        </div>
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {plan.rows.map((row) => {
            const letter = ALLOC_LETTERS[row.number - 1]!;
            const dept = ALLOC_DEPARTMENTS[row.number - 1]!;
            const inside = placedDevices.filter((d) => placed[d.id]!.subnet === row.number);
            return (
              <div key={row.number} className="min-w-0 rounded-card border border-line p-3 dark:border-line-dark">
                <p className="font-mono text-xs font-semibold text-ink dark:text-bone">Subnet {letter}</p>
                <p className="break-all font-mono text-[11px] text-subject-it">{formatIPv4(row.network)}/{row.prefix}</p>
                <p className="text-[11px] text-ink-soft dark:text-bone-soft">Department {letter}: {dept.name}</p>
                <p className="mt-1 text-[11px] text-ink-soft dark:text-bone-soft">Router interface: <span className="font-mono">{formatIPv4(row.firstHost)}</span></p>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {inside.map((d) => {
                    const p = placed[d.id]!;
                    const ok = ALLOC_LETTERS[p.subnet - 1] === d.dept;
                    return (
                      <li key={d.id} className="rounded-md border border-line p-1.5 text-xs dark:border-line-dark">
                        <div className="flex items-center justify-between gap-1">
                          <span className="min-w-0 truncate text-ink dark:text-bone">{d.name}</span>
                          <button type="button" onClick={() => remove(d.id)} aria-label={`Remove ${d.name}`} className="min-h-[28px] min-w-[28px] text-ink-soft dark:text-bone-soft">✕</button>
                        </div>
                        <p className="break-all font-mono text-[11px] text-ink dark:text-bone">{formatIPv4(p.ip)}/{row.prefix}</p>
                        <Chip tone={ok ? "good" : "warn"}>{ok ? "✓ right department" : `belongs to Dept ${d.dept}`}</Chip>
                      </li>
                    );
                  })}
                  {inside.length === 0 && <li className="text-[11px] text-ink-soft dark:text-bone-soft">No devices yet.</li>}
                </ul>
                <p className="mt-2 font-mono text-[10px] text-ink-soft dark:text-bone-soft">{inside.length + 1} of {row.info.totalAddresses} addresses in use (incl. router)</p>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="Devices to place">
        {unplaced.length === 0 ? (
          <p className="text-sm text-ink-soft dark:text-bone-soft">All devices are placed.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {unplaced.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center gap-2 rounded-card border border-line p-2 dark:border-line-dark">
                <span className="min-w-0 flex-1 text-sm text-ink dark:text-bone">
                  {d.name} <span className="text-xs text-ink-soft dark:text-bone-soft">(Department {d.dept})</span>
                </span>
                <span className="flex gap-1" role="group" aria-label={`Place ${d.name} in a subnet`}>
                  {ALLOC_LETTERS.map((l, i) => (
                    <button key={l} type="button" onClick={() => place(d, i + 1)} className="min-h-[44px] min-w-[44px] rounded-full border border-line font-mono text-xs text-ink dark:border-line-dark dark:text-bone" aria-label={`Put ${d.name} in Subnet ${l}`}>
                      {l}
                    </button>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <PillButton onClick={placeAllCorrectly}>Place everything correctly</PillButton>
          <PillButton onClick={() => setPlaced({})} disabled={placedDevices.length === 0}>Clear all</PillButton>
        </div>
        {placedDevices.length > 0 && wrong > 0 && <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">{wrong} device{wrong > 1 ? "s are" : " is"} in another department&apos;s subnet.</p>}
      </Panel>

      <Panel title="Compare two devices">
        {placedDevices.length < 2 ? (
          <p className="text-sm text-ink-soft dark:text-bone-soft">Place at least two devices to compare them.</p>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <Select id="al-a" label="Device A" value={aId} onChange={setCmpA} options={placedDevices} />
              <Select id="al-b" label="Device B" value={bId} onChange={setCmpB} options={placedDevices.filter((d) => d.id !== aId)} />
            </div>
            {devA && devB && placed[devA.id] && placed[devB.id] && <CompareCard nameA={devA.name} nameB={devB.name} ipA={placed[devA.id]!.ip} ipB={placed[devB.id]!.ip} prefix={plan.newPrefix} />}
          </div>
        )}
      </Panel>
      <Callout title="What this shows">Devices in the same subnet share the same network address under the /26 mask. Devices in different subnets would need the router to talk to each other; how that works is a later topic.</Callout>
    </div>
  );
}

function Select({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (v: string) => void; options: AllocDevice[] }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="min-h-[44px] w-full rounded-card border border-line bg-paper px-3 py-2 text-sm text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone">
        {options.map((d) => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>
    </div>
  );
}
