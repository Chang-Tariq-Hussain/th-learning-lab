"use client";

import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { hostWithIp, type Anchor, type Plan, type PlanStep, type Scenario, type ScenarioId } from "../model";

// ---------------------------------------------------------------------------
// Layout (SVG user units). Everything sits in one column so the packet travels in straight lines along the wires.
// ---------------------------------------------------------------------------
const VIEW_W = 380;
const HOST_W = 160;
const HOST_H = 62;
const COL = 100;

interface HostPos {
  cx: number;
  y: number;
  barY: number;
}
interface BarPos {
  kind: "h" | "v";
  /** Horizontal bar: y position and x extent. Vertical bar: x position and y extent. */
  at: number;
  from: number;
  to: number;
  labelSide: "above" | "below" | "right";
}
interface RouterPos {
  y: number;
  h: number;
}
interface PortPos {
  x: number;
  y: number;
  /** y of the LAN bar this port connects to (absent for link ports). */
  barY?: number;
  side: "top" | "bottom";
}
interface Layout {
  h: number;
  hosts: Record<string, HostPos>;
  bars: Record<string, BarPos>;
  routers: Record<string, RouterPos>;
  ports: Record<string, PortPos>;
}

const ROUTER_X = 20;
const ROUTER_W = 340;

const LAYOUTS: Record<ScenarioId, Layout> = {
  single: {
    h: 450,
    hosts: {
      "PC-A": { cx: COL, y: 8, barY: 112 },
      "PC-C": { cx: 280, y: 8, barY: 112 },
      "PC-B": { cx: COL, y: 380, barY: 324 },
    },
    bars: {
      netA: { kind: "h", at: 112, from: 20, to: 360, labelSide: "below" },
      netB: { kind: "h", at: 324, from: 20, to: 360, labelSide: "above" },
    },
    routers: { R1: { y: 170, h: 96 } },
    ports: {
      "R1:G0/0": { x: COL, y: 170, barY: 112, side: "top" },
      "R1:G0/1": { x: COL, y: 266, barY: 324, side: "bottom" },
    },
  },
  multi: {
    h: 640,
    hosts: {
      "PC-A": { cx: COL, y: 8, barY: 112 },
      "PC-B": { cx: COL, y: 566, barY: 510 },
    },
    bars: {
      netA: { kind: "h", at: 112, from: 20, to: 360, labelSide: "below" },
      netB: { kind: "v", at: COL, from: 252, to: 372, labelSide: "right" },
      netC: { kind: "h", at: 510, from: 20, to: 360, labelSide: "above" },
    },
    routers: { R1: { y: 170, h: 82 }, R2: { y: 372, h: 82 } },
    ports: {
      "R1:G0/0": { x: COL, y: 170, barY: 112, side: "top" },
      "R1:G0/1": { x: COL, y: 252, side: "bottom" },
      "R2:G0/0": { x: COL, y: 372, side: "top" },
      "R2:G0/1": { x: COL, y: 454, barY: 510, side: "bottom" },
    },
  },
};

function anchorPoint(layout: Layout, a: Anchor): { x: number; y: number } {
  if (a.t === "host") {
    const h = layout.hosts[a.id]!;
    // Midpoint of the short cable between the host card and its LAN bar.
    const edge = h.barY > h.y ? h.y + HOST_H : h.y;
    return { x: h.cx, y: (edge + h.barY) / 2 };
  }
  if (a.t === "port") {
    const p = layout.ports[`${a.router}:${a.iface}`]!;
    return { x: p.x, y: p.y };
  }
  const r = layout.routers[a.id]!;
  return { x: ROUTER_X + 52, y: r.y + r.h / 2 };
}

// ---------------------------------------------------------------------------
// Captions drawn inside the active router
// ---------------------------------------------------------------------------
type CaptionTone = "neutral" | "good" | "bad";
interface Caption {
  lines: string[];
  tone: CaptionTone;
}

function captionFor(step: PlanStep | null, routerId: string, dstIp: string | null): Caption | null {
  if (!step || step.router !== routerId) return null;
  const { lookup } = step;
  switch (step.kind) {
    case "receive":
      return { lines: ["PACKET RECEIVED", `on ${step.inspect.inIface ?? ""}`], tone: "neutral" };
    case "lookup": {
      const n = lookup?.matches.length ?? 0;
      return { lines: ["CHECK ROUTING TABLE", `for ${dstIp ?? "the destination"}`, n === 0 ? "0 routes match" : `${n} route${n === 1 ? "" : "s"} match`], tone: "neutral" };
    }
    case "select": {
      const b = lookup?.best;
      if (!b) return { lines: ["NO MATCHING ROUTE"], tone: "bad" };
      return { lines: [lookup.usedDefault ? "DEFAULT ROUTE USED" : "BEST MATCH", `${b.route.dest}/${b.route.prefix}`], tone: "good" };
    }
    case "forward":
      return { lines: [`FORWARD → ${step.inspect.outIface ?? ""}`, step.inspect.nextHop === "directly connected" ? "directly connected" : `next hop ${step.inspect.nextHop ?? ""}`], tone: "good" };
    case "drop":
      return { lines: step.inspect.decision.includes("NO MATCH") || step.inspect.reason === "No matching route" ? ["NO ROUTE FOUND", "PACKET DROPPED"] : ["PACKET DROPPED", step.inspect.reason ?? ""], tone: "bad" };
    case "deliver":
      return { lines: ["PACKET FOR THIS ROUTER"], tone: "good" };
    default:
      return null;
  }
}

const CAPTION_FILL: Record<CaptionTone, string> = {
  neutral: "fill-ink dark:fill-bone",
  good: "fill-emerald-700 dark:fill-emerald-300",
  bad: "fill-red-700 dark:fill-red-300",
};

// Literal class names (not built dynamically) so Tailwind keeps them.
const TOKEN_FILL = { moving: "fill-sky-500", delivered: "fill-emerald-500", dropped: "fill-red-500", nohost: "fill-amber-500" } as const;
const WIRE_ON = { moving: "stroke-sky-500", delivered: "stroke-emerald-500", dropped: "stroke-sky-500", nohost: "stroke-amber-500" } as const;
type Tone = keyof typeof TOKEN_FILL;

function chipWidth(text: string): number {
  return Math.round(text.length * 6 + 14);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export interface RoutingDiagramProps {
  scenario: Scenario;
  plan: Plan | null;
  idx: number;
  txId: number;
  step: PlanStep | null;
}

export const RoutingDiagram = memo(function RoutingDiagram({ scenario, plan, idx, txId, step }: RoutingDiagramProps) {
  const layout = LAYOUTS[scenario.id];
  const finished = !!plan && idx >= plan.steps.length - 1;
  const tone: Tone = !plan || !finished ? "moving" : plan.outcome === "delivered" ? "delivered" : plan.outcome === "dropped" ? "dropped" : "nohost";

  // Everything the packet has touched so far (cumulative).
  const lit = useMemo(() => {
    const set = new Set<string>();
    if (plan) for (let i = 0; i <= idx && i < plan.steps.length; i++) for (const t of plan.steps[i]!.touch) set.add(t);
    return set;
  }, [plan, idx]);

  const srcHost = plan ? plan.srcId : null;
  const dstHost = plan ? hostWithIp(scenario, plan.dstIp) : undefined;
  const showGateway = !!step && (step.kind === "determine" || step.kind === "to-gateway");
  const tokenPos = step ? anchorPoint(layout, step.at) : null;
  const wire = WIRE_ON[tone];

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${layout.h}`}
      className="mx-auto h-auto w-full max-w-[460px] rounded-card border border-line bg-paper dark:border-line-dark dark:bg-chalkboard"
      role="img"
      aria-label={
        scenario.id === "single"
          ? "Network diagram: PC-A and PC-C on Network A, router R1 in the middle, and PC-B on Network B."
          : "Network diagram: PC-A on Network A, router R1, a link network between R1 and R2, router R2, and PC-B on Network C."
      }
    >
      {/* Networks */}
      {scenario.networks.map((net) => {
        const bar = layout.bars[net.id]!;
        const on = lit.has(`net:${net.id}`);
        const cls = cn(on ? wire : "stroke-ink/35 dark:stroke-bone/35");
        if (bar.kind === "h") {
          const labelY = bar.labelSide === "below" ? bar.at + 17 : bar.at - 8;
          return (
            <g key={net.id}>
              <line x1={bar.from} y1={bar.at} x2={bar.to} y2={bar.at} strokeWidth={on ? 5 : 4} strokeLinecap="round" className={cls} />
              <text x={bar.to} y={labelY} textAnchor="end" className="fill-ink-soft font-mono text-[9.5px] font-semibold uppercase tracking-wide dark:fill-bone-soft">
                {net.label} · {net.cidr}
              </text>
            </g>
          );
        }
        return (
          <g key={net.id}>
            <line x1={bar.at} y1={bar.from} x2={bar.at} y2={bar.to} strokeWidth={on ? 5 : 4} strokeLinecap="round" className={cls} />
            <text x={bar.at + 16} y={(bar.from + bar.to) / 2 - 2} className="fill-ink-soft font-mono text-[9.5px] font-semibold uppercase tracking-wide dark:fill-bone-soft">
              {net.label} · {net.cidr}
            </text>
            <text x={bar.at + 16} y={(bar.from + bar.to) / 2 + 12} className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">
              link between the routers
            </text>
          </g>
        );
      })}

      {/* Host cables */}
      {scenario.hosts.map((h) => {
        const pos = layout.hosts[h.id]!;
        const edge = pos.barY > pos.y ? pos.y + HOST_H : pos.y;
        const on = lit.has(`host:${h.id}`);
        return <line key={`cable-${h.id}`} x1={pos.cx} y1={edge} x2={pos.cx} y2={pos.barY} strokeWidth={on ? 3.4 : 2} className={on ? wire : "stroke-ink/35 dark:stroke-bone/35"} />;
      })}

      {/* Routers */}
      {scenario.routers.map((r) => {
        const pos = layout.routers[r.id]!;
        const active = step?.router === r.id;
        const touched = lit.has(`router:${r.id}`);
        const dropped = active && step?.kind === "drop" && plan?.outcome === "dropped";
        const caption = captionFor(step, r.id, plan ? plan.dstIp : null);
        const stroke = dropped ? "stroke-red-500" : active ? "stroke-subject-it" : touched ? wire : "stroke-ink/50 dark:stroke-bone/50";
        return (
          <g key={r.id}>
            <rect x={ROUTER_X} y={pos.y} width={ROUTER_W} height={pos.h} rx={14} className={cn("fill-subject-it-soft dark:fill-subject-it/15", stroke)} strokeWidth={active || touched ? 2.6 : 1.6} />
            {/* router glyph */}
            <g transform={`translate(${ROUTER_X + 18}, ${pos.y + pos.h / 2 - 14})`} className="stroke-ink/60 dark:stroke-bone/60" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <rect x={0} y={8} width={34} height={14} rx={4} />
              <path d="M9 8V2m0 0-3 3m3-3 3 3M25 2v6m0 0-3-3m3 3 3-3" />
            </g>
            <text x={ROUTER_X + 96} y={pos.y + 22} className="fill-ink font-mono text-[12.5px] font-semibold dark:fill-bone">
              ROUTER {r.name}
            </text>
            <text x={ROUTER_X + 96 + 90} y={pos.y + 22} className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">
              Layer 3 · IP
            </text>
            {caption ? (
              <text className={cn("font-mono text-[10.5px] font-semibold", CAPTION_FILL[caption.tone])}>
                {caption.lines.map((line, i) => (
                  <tspan key={`${line}-${i}`} x={ROUTER_X + 96} y={pos.y + 42 + i * 14}>
                    {line}
                  </tspan>
                ))}
              </text>
            ) : (
              <text x={ROUTER_X + 96} y={pos.y + 44} className="fill-ink-soft font-mono text-[9.5px] dark:fill-bone-soft">
                {r.ifaces.length} interfaces · {r.ifaces.length} connected routes
              </text>
            )}
          </g>
        );
      })}

      {/* Router ports, LAN stubs and interface address chips */}
      {scenario.routers.flatMap((r) =>
        r.ifaces.map((i) => {
          const key = `${r.id}:${i.name}`;
          const p = layout.ports[key]!;
          const on = lit.has(`port:${key}`);
          const text = `${i.name} · ${i.ip}/${i.prefix}`;
          const w = chipWidth(text);
          const chipY = p.side === "top" ? p.y - 22 : p.y + 8;
          return (
            <g key={key}>
              {p.barY !== undefined && <line x1={p.x} y1={p.barY} x2={p.x} y2={p.y} strokeWidth={on ? 3.4 : 2} className={on ? wire : "stroke-ink/35 dark:stroke-bone/35"} />}
              <circle cx={p.x} cy={p.y} r={6} className={cn("stroke-ink/40 dark:stroke-bone/40", on ? "fill-sky-500" : "fill-paper dark:fill-chalkboard")} strokeWidth={1} />
              <g transform={`translate(${p.x + 10}, ${chipY})`}>
                <rect width={w} height={16} rx={8} className="fill-paper stroke-ink/25 dark:fill-chalkboard dark:stroke-bone/25" strokeWidth={1} />
                <text x={w / 2} y={11.2} textAnchor="middle" className="fill-ink font-mono text-[9.5px] dark:fill-bone">
                  {text}
                </text>
              </g>
            </g>
          );
        }),
      )}

      {/* Hosts */}
      {scenario.hosts.map((h) => {
        const pos = layout.hosts[h.id]!;
        const isSrc = srcHost === h.id;
        const isDst = !!dstHost && dstHost.id === h.id;
        const received = isDst && finished && plan?.outcome === "delivered";
        let status = "";
        let statusTone = "fill-ink-soft dark:fill-bone-soft";
        let stroke = "stroke-ink/45 dark:stroke-bone/45";
        let sw = 1.4;
        if (received) {
          status = "RECEIVED ✓";
          statusTone = "fill-emerald-600 dark:fill-emerald-300";
          stroke = "stroke-emerald-500";
          sw = 2.6;
        } else if (isSrc) {
          status = "SOURCE";
          statusTone = "fill-sky-600 dark:fill-sky-300";
          stroke = "stroke-sky-500";
          sw = 2.4;
        } else if (isDst) {
          status = "DESTINATION";
          statusTone = "fill-emerald-600 dark:fill-emerald-300";
          stroke = "stroke-emerald-500";
          sw = 2;
        }
        const gwHot = isSrc && showGateway;
        return (
          <g key={h.id} transform={`translate(${pos.cx - HOST_W / 2}, ${pos.y})`}>
            <rect width={HOST_W} height={HOST_H} rx={9} className={cn("fill-white dark:fill-white/[0.05]", stroke)} strokeWidth={sw} />
            <text x={12} y={20} className="fill-ink font-mono text-[12.5px] font-semibold dark:fill-bone">
              {h.name}
            </text>
            <text x={HOST_W - 10} y={19} textAnchor="end" className={cn("font-mono text-[8.5px] font-bold", statusTone)}>
              {status}
            </text>
            <text x={12} y={37} className="fill-ink font-mono text-[10.5px] dark:fill-bone">
              {h.ip}/{h.prefix}
            </text>
            <text x={12} y={53} className={cn("font-mono text-[10px]", gwHot ? "fill-amber-700 font-bold dark:fill-amber-300" : "fill-ink-soft dark:fill-bone-soft")}>
              Gateway: {h.gateway}
            </text>
          </g>
        );
      })}

      {/* Packet token */}
      {plan && tokenPos && (
        <g
          key={`tok-${txId}`}
          className="transition-transform duration-700 ease-in-out motion-reduce:transition-none"
          style={{ transform: `translate(${tokenPos.x}px, ${tokenPos.y}px)` }}
          aria-hidden
        >
          <rect x={-19} y={-9} width={38} height={18} rx={5} className={cn(TOKEN_FILL[tone], "stroke-white/80")} strokeWidth={1.2} />
          <text textAnchor="middle" y={4} className="fill-white font-mono text-[10px] font-bold">
            {tone === "dropped" ? "✕ IP" : "IP"}
          </text>
        </g>
      )}
    </svg>
  );
});
