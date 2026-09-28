"use client";

import { cn } from "@/lib/utils";
import { ROUTER_IFACES, isDuplicated, type HostId, type IpHost, type NodeId } from "../model";

const POS: Record<NodeId, { x: number; y: number }> = {
  a: { x: 72, y: 48 },
  b: { x: 72, y: 150 },
  d: { x: 72, y: 252 },
  sw1: { x: 232, y: 150 },
  router: { x: 380, y: 150 },
  sw2: { x: 528, y: 150 },
  c: { x: 668, y: 150 },
};

const LINKS: [NodeId, NodeId][] = [
  ["a", "sw1"],
  ["b", "sw1"],
  ["d", "sw1"],
  ["sw1", "router"],
  ["router", "sw2"],
  ["sw2", "c"],
];

export interface DiagramProps {
  hosts: IpHost[];
  selected?: NodeId | null;
  onSelect?: (id: NodeId) => void;
  /** Nodes to highlight as a delivery path, in order. */
  path?: NodeId[];
  pathOk?: boolean;
  /** Show the gateway arrow from this host to the router. */
  gatewayFor?: HostId | null;
  showGatewayLabels?: boolean;
}

function inPath(path: NodeId[] | undefined, a: NodeId, b: NodeId): boolean {
  if (!path) return false;
  for (let i = 0; i < path.length - 1; i++) {
    const x = path[i]!;
    const y = path[i + 1]!;
    if ((x === a && y === b) || (x === b && y === a)) return true;
  }
  return false;
}

/** 2D diagram of: PC A / PC B / PC D — Switch 1 — Router — Switch 2 — PC C. Scrolls horizontally inside its own container on phones. */
export function NetworkMapDiagram({ hosts, selected, onSelect, path, pathOk = true, gatewayFor, showGatewayLabels }: DiagramProps) {
  const hostById = (id: NodeId) => hosts.find((h) => h.id === id);
  const gwHost = gatewayFor ? hostById(gatewayFor) : undefined;
  const pathTone = pathOk ? "stroke-emerald-500" : "stroke-red-500";

  return (
    <div className="overflow-x-auto rounded-card border border-line bg-paper dark:border-line-dark dark:bg-chalkboard" tabIndex={0} aria-label="Scrollable network diagram">
      <svg viewBox="0 0 740 310" className="mx-auto h-auto w-full min-w-[600px] max-w-[820px]" role="group" aria-label="Network: PC-A, PC-B and PC-D connect to Switch 1, which connects to a Router, then Switch 2 and PC-C">
        <text x="150" y="16" textAnchor="middle" className="fill-ink-soft font-mono text-[10px] dark:fill-bone-soft">LAN 1</text>
        <text x="590" y="16" textAnchor="middle" className="fill-ink-soft font-mono text-[10px] dark:fill-bone-soft">LAN 2</text>
        <rect x="8" y="22" width="292" height="284" rx="10" className="fill-none stroke-ink/20 dark:stroke-bone/20" strokeDasharray="4 4" />
        <rect x="456" y="22" width="276" height="284" rx="10" className="fill-none stroke-ink/20 dark:stroke-bone/20" strokeDasharray="4 4" />

        {LINKS.map(([a, b]) => {
          const on = inPath(path, a, b);
          return <line key={`${a}-${b}`} x1={POS[a].x} y1={POS[a].y} x2={POS[b].x} y2={POS[b].y} className={cn(on ? pathTone : "stroke-ink/30 dark:stroke-bone/30")} strokeWidth={on ? 4 : 2} strokeDasharray={on && !pathOk ? "6 4" : undefined} />;
        })}

        {gwHost && (
          <g>
            <path d={`M ${POS[gwHost.id].x + 50} ${POS[gwHost.id].y + 26} Q ${(POS[gwHost.id].x + POS.router.x) / 2 + 20} ${POS[gwHost.id].y + 130} ${POS.router.x - 10} ${POS.router.y + 38}`} className="fill-none stroke-amber-500" strokeWidth="2" strokeDasharray="5 4" markerEnd="url(#arrow)" />
            <text x={(POS[gwHost.id].x + POS.router.x) / 2} y={Math.max(POS[gwHost.id].y + 100, 250)} textAnchor="middle" className="fill-amber-700 font-mono text-[10px] dark:fill-amber-300">
              default gateway: {gwHost.gateway || "(none)"}
            </text>
          </g>
        )}
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-amber-500" />
          </marker>
        </defs>

        {/* Switches */}
        {(["sw1", "sw2"] as const).map((id) => (
          <g key={id}>
            <rect x={POS[id].x - 42} y={POS[id].y - 18} width="84" height="36" rx="6" className="fill-paper stroke-ink/40 dark:fill-chalkboard dark:stroke-bone/40" strokeWidth="1.5" />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={POS[id].x - 30 + i * 16} y={POS[id].y + 4} width="10" height="8" rx="1.5" className="fill-ink/40 dark:fill-bone/40" />
            ))}
            <text x={POS[id].x} y={POS[id].y - 4} textAnchor="middle" className="fill-ink font-mono text-[11px] font-medium dark:fill-bone">{id === "sw1" ? "Switch 1" : "Switch 2"}</text>
            <text x={POS[id].x} y={POS[id].y + 34} textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">no IP needed here</text>
          </g>
        ))}

        {/* Router */}
        <g
          role={onSelect ? "button" : undefined}
          tabIndex={onSelect ? 0 : undefined}
          aria-label="Router with two interfaces"
          onClick={() => onSelect?.("router")}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect?.("router")}
          className={onSelect ? "cursor-pointer" : undefined}
        >
          <circle cx={POS.router.x} cy={POS.router.y} r="36" className={cn("fill-paper dark:fill-chalkboard", selected === "router" ? "stroke-subject-it" : "stroke-ink/50 dark:stroke-bone/50")} strokeWidth={selected === "router" ? 3 : 2} />
          <text x={POS.router.x} y={POS.router.y - 2} textAnchor="middle" className="fill-ink font-mono text-[12px] font-semibold dark:fill-bone">Router</text>
          <text x={POS.router.x} y={POS.router.y + 12} textAnchor="middle" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">2 interfaces</text>
          <text x={POS.router.x - 40} y={POS.router.y - 44} textAnchor="end" className="fill-ink font-mono text-[10px] dark:fill-bone">{ROUTER_IFACES[0]!.ip}/{ROUTER_IFACES[0]!.prefix}</text>
          <text x={POS.router.x + 40} y={POS.router.y - 44} textAnchor="start" className="fill-ink font-mono text-[10px] dark:fill-bone">{ROUTER_IFACES[1]!.ip}/{ROUTER_IFACES[1]!.prefix}</text>
        </g>

        {/* Hosts */}
        {(["a", "b", "d", "c"] as const).map((id) => {
          const h = hostById(id);
          if (!h) return null;
          const p = POS[id];
          const dup = isDuplicated(hosts, id);
          const sel = selected === id;
          const inP = path?.includes(id);
          return (
            <g
              key={id}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : undefined}
              aria-label={`${h.name}, ${h.ip}/${h.prefix}${dup ? ", duplicate IP address" : ""}`}
              aria-pressed={onSelect ? sel : undefined}
              onClick={() => onSelect?.(id)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect?.(id)}
              className={onSelect ? "cursor-pointer" : undefined}
            >
              <rect x={p.x - 62} y={p.y - 26} width="124" height="52" rx="8" className={cn("fill-paper dark:fill-chalkboard", dup ? "stroke-red-500" : sel ? "stroke-subject-it" : inP ? "stroke-emerald-500" : "stroke-ink/30 dark:stroke-bone/30")} strokeWidth={sel || dup ? 3 : 1.5} strokeDasharray={dup ? "5 3" : undefined} />
              <text x={p.x} y={p.y - 8} textAnchor="middle" className="fill-ink font-mono text-[12px] font-semibold dark:fill-bone">{h.name}</text>
              <text x={p.x} y={p.y + 7} textAnchor="middle" className="fill-ink font-mono text-[10.5px] dark:fill-bone">{h.ip}/{h.prefix}</text>
              <text x={p.x} y={p.y + 20} textAnchor="middle" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">{h.mac}</text>
              {dup && <text x={p.x} y={p.y - 32} textAnchor="middle" className="fill-red-600 font-mono text-[10px] font-semibold dark:fill-red-300">⚠ Duplicate IP</text>}
              {showGatewayLabels && <text x={p.x} y={p.y + 40} textAnchor="middle" className="fill-ink-soft font-mono text-[8.5px] dark:fill-bone-soft">gw {h.gateway || "none"}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
