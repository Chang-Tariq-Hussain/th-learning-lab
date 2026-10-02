"use client";

import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import type { RoutingLab } from "../hooks/use-routing-lab";
import { SCENARIOS, routeLabel, type ScenarioId, type StaticRouteSeed } from "../model";
import { BTN, BTN_PLAIN, BTN_PRIMARY } from "./ui";

type Item = { kind: "send"; src: string; dst: string; label: string } | { kind: "add"; seed: StaticRouteSeed; label: string } | { kind: "remove"; router: string; dest: string; prefix: number; label: string };

export interface Experiment {
  id: string;
  title: string;
  goal: string;
  scenario: ScenarioId;
  /** Static routes the experiment starts with. */
  seeds: StaticRouteSeed[];
  items: Item[];
  expect: string[];
}

const R1_TO_C: StaticRouteSeed = { router: "R1", dest: "192.168.3.0", prefix: 24, nextHop: "10.0.0.2", iface: "G0/1" };
const R1_DEFAULT: StaticRouteSeed = { router: "R1", dest: "0.0.0.0", prefix: 0, nextHop: "10.0.0.2", iface: "G0/1" };
const R1_BROAD: StaticRouteSeed = { router: "R1", dest: "192.168.0.0", prefix: 16, nextHop: "10.0.0.2", iface: "G0/1" };
const MULTI_SEEDS = SCENARIOS.multi.seeds;

export const EXPERIMENTS: Experiment[] = [
  {
    id: "same-network",
    title: "1 · Same network",
    goal: "See that a packet for a device on your own network does not need a router.",
    scenario: "single",
    seeds: [],
    items: [{ kind: "send", src: "PC-A", dst: "192.168.1.20", label: "PC-A sends to PC-C (192.168.1.20)" }],
    expect: ["192.168.1.20 is in PC-A’s own network (192.168.1.0/24).", "PC-A delivers it directly on the local network. R1 never sees the packet."],
  },
  {
    id: "different-network",
    title: "2 · Different network",
    goal: "Follow a packet that has to leave its own network.",
    scenario: "single",
    seeds: [],
    items: [{ kind: "send", src: "PC-A", dst: "192.168.2.10", label: "PC-A sends to PC-B (192.168.2.10)" }],
    expect: ["192.168.2.10 is on a different network → PC-A sends it to its default gateway 192.168.1.1.", "R1 finds the connected route 192.168.2.0/24 and forwards the packet out G0/1."],
  },
  {
    id: "add-static",
    title: "3 · Add a static route",
    goal: "Watch a packet fail for lack of a route, then succeed once you add one.",
    scenario: "multi",
    seeds: [],
    items: [
      { kind: "send", src: "PC-A", dst: "192.168.3.10", label: "PC-A sends to PC-B (R1 has no route yet)" },
      { kind: "add", seed: R1_TO_C, label: "Add on R1: 192.168.3.0/24 via 10.0.0.2" },
      { kind: "send", src: "PC-A", dst: "192.168.3.10", label: "PC-A sends to PC-B again" },
    ],
    expect: ["First send: R1 knows only 192.168.1.0/24 and 10.0.0.0/30 → NO ROUTE FOUND.", "After the static route: R1 forwards to 10.0.0.2 and R2 delivers it on its connected network.", "Replies from PC-B would need R2 to have a route back to 192.168.1.0/24 too."],
  },
  {
    id: "remove-static",
    title: "4 · Remove a static route",
    goal: "Break a working path by removing the route it relied on.",
    scenario: "multi",
    seeds: MULTI_SEEDS,
    items: [
      { kind: "send", src: "PC-A", dst: "192.168.3.10", label: "PC-A sends to PC-B (works)" },
      { kind: "remove", router: "R1", dest: "192.168.3.0", prefix: 24, label: "Remove the route 192.168.3.0/24 from R1" },
      { kind: "send", src: "PC-A", dst: "192.168.3.10", label: "PC-A sends to PC-B again" },
    ],
    expect: ["With the route: forwarded through R1 and R2.", "Without it: R1 stops the packet. Nothing else changed, but R1 no longer knows where 192.168.3.0/24 is."],
  },
  {
    id: "default-route",
    title: "5 · Default route",
    goal: "Use 0.0.0.0/0 when nothing more specific matches, and see a specific route beat it.",
    scenario: "multi",
    seeds: [],
    items: [
      { kind: "send", src: "PC-A", dst: "192.168.3.10", label: "PC-A sends to PC-B (no route)" },
      { kind: "add", seed: R1_DEFAULT, label: "Add on R1: default route 0.0.0.0/0 via 10.0.0.2" },
      { kind: "send", src: "PC-A", dst: "192.168.3.10", label: "PC-A sends again (default route used)" },
      { kind: "add", seed: R1_TO_C, label: "Add on R1: specific route 192.168.3.0/24" },
      { kind: "send", src: "PC-A", dst: "192.168.3.10", label: "PC-A sends again (specific route wins)" },
    ],
    expect: ["The default route matches every destination, but only as a last resort.", "Once 192.168.3.0/24 exists, it is more specific and R1 uses it instead of 0.0.0.0/0."],
  },
  {
    id: "multi-router",
    title: "6 · Multi-router forwarding",
    goal: "Follow one packet across two routers and watch both make a decision.",
    scenario: "multi",
    seeds: MULTI_SEEDS,
    items: [{ kind: "send", src: "PC-A", dst: "192.168.3.10", label: "PC-A sends to PC-B across R1 and R2" }],
    expect: ["R1 uses its static route (192.168.3.0/24 via 10.0.0.2) and forwards out G0/1.", "R2 finds 192.168.3.0/24 connected on G0/1 and delivers the packet to PC-B.", "The destination IP never changed; the TTL dropped by 1 at each router."],
  },
  {
    id: "most-specific",
    title: "7 · Most specific route",
    goal: "See a broad route and a narrow route both match, and the narrow one win.",
    scenario: "multi",
    seeds: [...MULTI_SEEDS, R1_BROAD],
    items: [{ kind: "send", src: "PC-B", dst: "192.168.1.10", label: "PC-B sends to PC-A (192.168.1.10)" }],
    expect: ["R1 has two matches for 192.168.1.10: 192.168.0.0/16 (static) and 192.168.1.0/24 (connected).", "The /24 is more specific, so R1 delivers on its connected network instead of sending the packet back toward R2."],
  },
];

export interface ExperimentsPanelProps {
  lab: RoutingLab;
  activeId: string | null;
  onStart: (exp: Experiment) => void;
  onSend: (src: string, dstIp: string) => void;
}

export function ExperimentsPanel({ lab, activeId, onStart, onSend }: ExperimentsPanelProps) {
  const { inFlight } = lab;
  return (
    <Panel title="Experiments">
      <p className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">Press Start to load an experiment’s scenario and routes, then work through its steps in order.</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {EXPERIMENTS.map((exp) => {
          const active = activeId === exp.id;
          return (
            <section key={exp.id} aria-label={exp.title} className={cn("flex flex-col gap-2 rounded-xl border p-3 text-sm", active ? "border-subject-it bg-subject-it-soft/40 dark:bg-subject-it/10" : "border-line dark:border-line-dark")}>
              <h3 className="font-mono text-[13px] font-semibold text-ink dark:text-bone">{exp.title}</h3>
              <p className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{exp.goal}</p>
              <div>
                <button type="button" className={cn(BTN, active ? BTN_PLAIN : BTN_PRIMARY)} disabled={inFlight} onClick={() => onStart(exp)}>
                  {active ? "Restart experiment" : "Start experiment"}
                </button>
              </div>
              {active && (
                <>
                  <ol className="flex flex-col gap-1.5">
                    {exp.items.map((item, i) => (
                      <li key={`${exp.id}-${i}`}>
                        <button
                          type="button"
                          disabled={inFlight}
                          onClick={() => {
                            if (item.kind === "send") onSend(item.src, item.dst);
                            else if (item.kind === "add") lab.addRoute(item.seed);
                            else lab.removeRoute(item.router, item.dest, item.prefix);
                          }}
                          className="flex min-h-[44px] w-full items-start gap-2 rounded-lg border border-line px-2.5 py-2 text-left text-xs font-medium text-ink transition-colors hover:border-subject-it disabled:opacity-50 dark:border-line-dark dark:text-bone"
                        >
                          <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink/10 font-mono text-[10px] dark:bg-bone/10">{i + 1}</span>
                          <span className="min-w-0">
                            <span className="mr-1.5 rounded-md bg-ink/10 px-1 py-0.5 font-mono text-[9px] uppercase tracking-wide dark:bg-bone/10">{item.kind === "send" ? "send" : item.kind === "add" ? "add route" : "remove route"}</span>
                            {item.label}
                            {item.kind === "add" && <span className="sr-only"> ({routeLabel(item.seed)})</span>}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ol>
                  <ul className="list-disc space-y-1 pl-5 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
                    {exp.expect.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          );
        })}
      </div>
    </Panel>
  );
}
