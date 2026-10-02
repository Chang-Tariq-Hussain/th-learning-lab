"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import type { Transmission } from "../lab-state";
import { DEVICES, formatPort, type ForwardKind, type PortStates } from "../model";

// ---------------------------------------------------------------------------
// Layout (SVG user units)
// ---------------------------------------------------------------------------
const VIEW_W = 440;
const VIEW_H = 470;
const CARD_X = 4;
const CARD_W = 150;
const CARD_H = 72;
const CABLE_X1 = CARD_X + CARD_W;
const JACK_X = 262;
const SWITCH = { x: 262, y: 10, w: 174, h: 450 };
const CORE = { cx: 362, cy: 236, w: 80, h: 80 };
const TOKEN_CORE = { x: CORE.cx, y: CORE.cy + 14 };
const rowY = (port: number) => 56 + (port - 1) * 90;

const TOKEN_W = 40;
const TOKEN_H = 18;

// Literal class names (not built dynamically) so Tailwind keeps them.
const TOKEN_FILL: Record<ForwardKind | "pending", string> = {
  pending: "fill-sky-500",
  "known-unicast": "fill-emerald-500",
  "unknown-unicast": "fill-violet-500",
  broadcast: "fill-amber-500",
};
const CABLE_STROKE: Record<ForwardKind, string> = {
  "known-unicast": "stroke-emerald-500",
  "unknown-unicast": "stroke-violet-500",
  broadcast: "stroke-amber-500",
};
const JACK_FILL: Record<ForwardKind, string> = {
  "known-unicast": "fill-emerald-500",
  "unknown-unicast": "fill-violet-500",
  broadcast: "fill-amber-500",
};
const CAPTION_FILL: Record<ForwardKind | "neutral", string> = {
  neutral: "fill-ink dark:fill-bone",
  "known-unicast": "fill-emerald-700 dark:fill-emerald-300",
  "unknown-unicast": "fill-violet-700 dark:fill-violet-300",
  broadcast: "fill-amber-700 dark:fill-amber-300",
};

interface Caption {
  lines: string[];
  tone: ForwardKind | "neutral";
}

function captionFor(tx: Transmission): Caption | null {
  const ingress = formatPort(tx.srcPort);
  const { stage } = tx;
  if (stage === 2) return { lines: ["FRAME RECEIVED", `on ${ingress}`], tone: "neutral" };
  if (stage === 3) return { lines: ["LEARN SOURCE", tx.srcMac, `→ ${ingress}`], tone: "neutral" };
  if (stage === 4 && tx.lookup) {
    const result = tx.lookup.broadcast ? "BROADCAST" : tx.lookup.found ? `FOUND → ${formatPort(tx.lookup.port!)}` : "NOT FOUND";
    return { lines: ["CHECK DESTINATION", tx.dstMac, result], tone: "neutral" };
  }
  if (stage >= 5 && tx.decision) {
    const d = tx.decision;
    if (d.kind === "broadcast") return { lines: ["BROADCAST", "→ FLOOD"], tone: d.kind };
    if (d.kind === "unknown-unicast") return { lines: ["UNKNOWN UNICAST", "→ FLOOD"], tone: d.kind };
    return { lines: ["KNOWN UNICAST", d.egress.length ? `→ FORWARD ${formatPort(d.foundPort!)}` : "→ FILTERED"], tone: d.kind };
  }
  return null;
}

interface TokenProps {
  x: number;
  y: number;
  visible: boolean;
  fill: string;
}

/** A frame "token". Positioned purely from props and moved with a CSS transition: no animation loop. */
function FrameToken({ x, y, visible, fill }: TokenProps) {
  return (
    <g
      className="transition-[transform,opacity] duration-700 ease-in-out motion-reduce:transition-none"
      style={{ transform: `translate(${x}px, ${y}px)`, opacity: visible ? 1 : 0 }}
      aria-hidden
    >
      <rect x={-TOKEN_W / 2} y={-TOKEN_H / 2} width={TOKEN_W} height={TOKEN_H} rx={5} className={cn(fill, "stroke-white/70")} strokeWidth={1} />
      <text textAnchor="middle" y={3.5} className="fill-white font-mono text-[10px] font-semibold">
        Frame
      </text>
    </g>
  );
}

export const SwitchDiagram = memo(function SwitchDiagram({ tx, enabled }: { tx: Transmission | null; enabled: PortStates }) {
  const stage = tx?.stage ?? 0;
  const decision = tx?.decision;
  const kind: ForwardKind | null = stage >= 5 && decision ? decision.kind : null;
  const egress = stage >= 5 && decision ? decision.egress : [];
  const caption = tx ? captionFor(tx) : null;

  // Source token path: PC → ingress jack → switch core. Fades out when copies leave the core.
  let srcX = 0;
  let srcY = 0;
  if (tx) {
    const y = rowY(tx.srcPort);
    if (stage <= 1) [srcX, srcY] = [CABLE_X1 + 26, y];
    else if (stage === 2) [srcX, srcY] = [JACK_X + 8, y];
    else [srcX, srcY] = [TOKEN_CORE.x, TOKEN_CORE.y];
  }

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="mx-auto h-auto w-full max-w-[560px] rounded-card border border-line bg-paper dark:border-line-dark dark:bg-chalkboard"
      role="img"
      aria-label="Network diagram: PC-A to PC-E are connected to switch ports Fa0/1 to Fa0/5 of one Ethernet switch."
    >
      {/* Switch body */}
      <rect x={SWITCH.x} y={SWITCH.y} width={SWITCH.w} height={SWITCH.h} rx={14} className={cn("fill-subject-it-soft dark:fill-subject-it/15", stage >= 2 && stage <= 5 ? "stroke-subject-it" : "stroke-ink/50 dark:stroke-bone/50")} strokeWidth={stage >= 2 && stage <= 5 ? 2.6 : 1.6} />
      <text x={SWITCH.x + SWITCH.w / 2} y={34} textAnchor="middle" className="fill-ink font-mono text-[13px] font-semibold dark:fill-bone">
        SWITCH
      </text>
      <text x={SWITCH.x + SWITCH.w / 2} y={49} textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">
        Layer 2 · Ethernet
      </text>

      {/* Internal paths from each port to the switching core */}
      {DEVICES.map((d) => {
        const y = rowY(d.port);
        const isIngress = !!tx && d.port === tx.srcPort && stage >= 3;
        const isEgress = egress.includes(d.port) && stage >= 6;
        return (
          <line
            key={`fabric-${d.port}`}
            x1={JACK_X + 6}
            y1={y}
            x2={TOKEN_CORE.x}
            y2={TOKEN_CORE.y}
            strokeWidth={isIngress || isEgress ? 2.4 : 1}
            strokeDasharray={isIngress || isEgress ? undefined : "3 4"}
            className={cn(isIngress ? "stroke-sky-500" : isEgress && kind ? CABLE_STROKE[kind] : "stroke-ink/20 dark:stroke-bone/20")}
          />
        );
      })}

      {/* Switching core (MAC lookup) */}
      <rect
        x={CORE.cx - CORE.w / 2}
        y={CORE.cy - CORE.h / 2}
        width={CORE.w}
        height={CORE.h}
        rx={10}
        className={cn("fill-paper dark:fill-chalkboard", stage >= 3 && stage <= 5 ? "stroke-subject-it" : "stroke-ink/40 dark:stroke-bone/40")}
        strokeWidth={stage >= 3 && stage <= 5 ? 2.6 : 1.4}
      />
      <text x={CORE.cx} y={CORE.cy - CORE.h / 2 + 16} textAnchor="middle" className="fill-ink-soft font-mono text-[9px] uppercase dark:fill-bone-soft">
        MAC table
      </text>
      {caption && (
        <text textAnchor="middle" className={cn("font-mono text-[10px] font-semibold", CAPTION_FILL[caption.tone])}>
          {caption.lines.map((line, i) => (
            <tspan key={`${line}-${i}`} x={CORE.cx} y={CORE.cy + CORE.h / 2 + 22 + i * 15}>
              {line}
            </tspan>
          ))}
        </text>
      )}

      {/* Cables, port labels and jacks */}
      {DEVICES.map((d) => {
        const y = rowY(d.port);
        const up = enabled[d.port] !== false;
        const isIngress = !!tx && d.port === tx.srcPort && stage >= 2;
        const isEgress = egress.includes(d.port) && stage >= 6;
        const isIdle = !!tx && stage >= 5 && !isEgress && d.port !== tx.srcPort;
        const stroke = !up ? "stroke-red-400" : isIngress ? "stroke-sky-500" : isEgress && kind ? CABLE_STROKE[kind] : "stroke-ink/35 dark:stroke-bone/35";
        const jackFill = !up ? "fill-red-400" : isIngress ? "fill-sky-500" : egress.includes(d.port) && kind ? JACK_FILL[kind] : "fill-ink/40 dark:fill-bone/40";
        return (
          <g key={`cable-${d.port}`} className={cn("transition-opacity duration-500 motion-reduce:transition-none", isIdle && up && "opacity-40")}>
            <line x1={CABLE_X1} y1={y} x2={JACK_X} y2={y} strokeWidth={isIngress || isEgress ? 3.4 : 2} strokeDasharray={up ? undefined : "5 5"} className={stroke} />
            <rect x={JACK_X - 6} y={y - 8} width={12} height={16} rx={3} className={cn(jackFill, "stroke-ink/30 dark:stroke-bone/30")} strokeWidth={0.8} />
            <rect x={206} y={y - 7} width={42} height={14} rx={7} className="fill-paper stroke-ink/25 dark:fill-chalkboard dark:stroke-bone/25" strokeWidth={1} />
            <text x={227} y={y + 3.5} textAnchor="middle" className={cn("font-mono text-[10px]", up ? "fill-ink-soft dark:fill-bone-soft" : "fill-red-600 dark:fill-red-300")}>
              {formatPort(d.port)}
            </text>
            {!up && (
              <text x={178} y={y - 6} textAnchor="middle" className="fill-red-600 font-mono text-[12px] font-bold dark:fill-red-300">
                ✕
              </text>
            )}
          </g>
        );
      })}

      {/* Device cards */}
      {DEVICES.map((d) => {
        const y = rowY(d.port) - CARD_H / 2;
        const up = enabled[d.port] !== false;
        const isSrc = !!tx && d.id === tx.srcId;
        const delivery = tx?.deliveries?.find((x) => x.deviceId === d.id);
        const isDst = !!tx && tx.intent === "unicast" && d.mac === tx.dstMac;
        const noCopy = !!tx && stage >= 5 && !isSrc && !egress.includes(d.port);

        let status = "";
        let statusTone = "fill-ink-soft dark:fill-bone-soft";
        let stroke = "stroke-ink/45 dark:stroke-bone/45";
        let sw = 1.4;
        if (!up) {
          status = "LINK DOWN";
          statusTone = "fill-red-600 dark:fill-red-300";
          stroke = "stroke-red-400";
        } else if (isSrc) {
          status = "SENDER";
          statusTone = "fill-sky-600 dark:fill-sky-300";
          stroke = "stroke-sky-500";
          sw = 2.4;
        } else if (stage >= 7 && delivery) {
          status = delivery.accepted ? "ACCEPTED ✓" : "IGNORED ✕";
          statusTone = delivery.accepted ? "fill-emerald-600 dark:fill-emerald-300" : "fill-amber-600 dark:fill-amber-300";
          stroke = delivery.accepted ? "stroke-emerald-500" : "stroke-amber-500";
          sw = 2.4;
        } else if (noCopy) {
          status = "NO COPY";
        } else if (isDst) {
          status = "DESTINATION";
          statusTone = "fill-emerald-600 dark:fill-emerald-300";
          stroke = "stroke-emerald-500";
          sw = 2;
        }

        return (
          <g key={d.id} transform={`translate(${CARD_X}, ${y})`} className={cn(!up && "opacity-70", noCopy && up && "opacity-60")}>
            <rect width={CARD_W} height={CARD_H} rx={9} className={cn("fill-white dark:fill-white/[0.05]", stroke)} strokeWidth={sw} strokeDasharray={!up ? "4 3" : undefined} />
            <text x={12} y={21} className="fill-ink font-mono text-[13px] font-semibold dark:fill-bone">
              {d.name}
            </text>
            <text x={CARD_W - 10} y={20} textAnchor="end" className={cn("font-mono text-[8.5px] font-bold", statusTone)}>
              {status}
            </text>
            <text x={12} y={40} className="fill-ink-soft font-mono text-[10px] dark:fill-bone-soft">
              {d.mac}
            </text>
            <text x={12} y={58} className="fill-ink font-mono text-[10.5px] dark:fill-bone">
              Port: {formatPort(d.port)}
            </text>
            {/* tiny PC glyph */}
            <g transform="translate(120, 46)" className="stroke-ink/50 dark:stroke-bone/50" fill="none" strokeWidth={1.2}>
              <rect x={0} y={0} width={20} height={13} rx={2} />
              <path d="M6 17h8M10 13v4" />
            </g>
          </g>
        );
      })}

      {/* Frame tokens */}
      {tx && <FrameToken key={`src-${tx.id}`} x={srcX} y={srcY} visible={stage <= 5} fill={TOKEN_FILL[kind ?? "pending"]} />}
      {tx &&
        stage >= 5 &&
        decision &&
        decision.egress.map((p) => {
          const y = rowY(p);
          const [x, ty] = stage === 5 ? [TOKEN_CORE.x, TOKEN_CORE.y] : stage === 6 ? [JACK_X + 8, y] : [CABLE_X1 + 26, y];
          return <FrameToken key={`${tx.id}-${p}`} x={x} y={ty} visible={stage >= 6} fill={TOKEN_FILL[decision.kind]} />;
        })}
    </svg>
  );
});
