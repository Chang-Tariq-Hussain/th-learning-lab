"use client";

import { cn } from "@/lib/utils";
import type { ArpNode, NodeId, NodeNote, NoteTone, RunStep, TokenKind } from "../model";
import { REMOTE_SERVER } from "../model";

const VIEW_W = 400;
const VIEW_H = 452;
const CARD_W = 128;
const CARD_H = 66;

const SWITCH_POS = { x: 200, y: 156 };
const POS: Record<NodeId, { x: number; y: number }> = {
  a: { x: 70, y: 48 },
  b: { x: 330, y: 48 },
  c: { x: 70, y: 262 },
  d: { x: 330, y: 262 },
  router: { x: 200, y: 318 },
};
const REMOTE_POS = { x: 200, y: 414 };

type Pt = { x: number; y: number };

function lerp(a: Pt, b: Pt, t: number): Pt {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

const TOKEN_FILL: Record<TokenKind, string> = { request: "fill-amber-500", reply: "fill-emerald-500", data: "fill-sky-500" };
const LINK_STROKE: Record<TokenKind, string> = { request: "stroke-amber-500", reply: "stroke-emerald-500", data: "stroke-sky-500" };
const NOTE_FILL: Record<NoteTone, string> = {
  neutral: "fill-ink-soft dark:fill-bone-soft",
  sky: "fill-sky-600 dark:fill-sky-300",
  amber: "fill-amber-600 dark:fill-amber-300",
  emerald: "fill-emerald-600 dark:fill-emerald-300",
  red: "fill-red-600 dark:fill-red-300",
};
const NOTE_STROKE: Record<NoteTone, string> = {
  neutral: "stroke-ink/50 dark:stroke-bone/50",
  sky: "stroke-sky-500",
  amber: "stroke-amber-500",
  emerald: "stroke-emerald-500",
  red: "stroke-red-400",
};

/**
 * 2D LAN diagram: four PCs and the router in a star around one switch. A message token's position is a pure function of the
 * current step (its "leg"), moved by a CSS transition — there is no animation loop.
 */
export function ArpDiagram({
  nodes,
  step,
  srcId,
  showRemote,
  showIdleHint,
  selectedId,
  onSelect,
}: {
  nodes: ArpNode[];
  step: RunStep | null;
  srcId: NodeId;
  /** Draw the remote server behind the router (for remote-destination scenarios). */
  showRemote: boolean;
  showIdleHint: boolean;
  selectedId?: NodeId | null;
  onSelect?: (id: NodeId) => void;
}) {
  const token = step?.token ?? null;
  const notes: Partial<Record<NodeId, NodeNote>> = step?.notes ?? {};

  const recipients: NodeId[] = token ? (token.to === "all" ? nodes.filter((n) => n.id !== token.from).map((n) => n.id) : [token.to]) : [];

  // Sender token: sits on the sender, slides along its cable, and rests at the switch.
  const fromPos = token ? POS[token.from] : SWITCH_POS;
  let mainPos: Pt = fromPos;
  if (token) {
    if (token.leg === 0) mainPos = lerp(fromPos, SWITCH_POS, 0.14);
    else if (token.leg === 1) mainPos = lerp(fromPos, SWITCH_POS, 0.6);
    else mainPos = { x: SWITCH_POS.x, y: SWITCH_POS.y - 34 };
  }
  const mainVisible = !!token && token.leg <= 2;
  const senderLinkOn = !!token && token.leg >= 1;
  const receiverLinksOn = !!token && token.leg >= 3;
  const kind = token?.kind ?? "data";

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="mx-auto h-auto w-full max-w-[560px] rounded-card border border-line bg-paper dark:border-line-dark dark:bg-chalkboard"
      role="img"
      aria-label="Local network: PC-A, PC-B, PC-C and PC-D and a router connected to one switch"
    >
      {/* Cables */}
      {nodes.map((n) => {
        const p = POS[n.id];
        const isSender = !!token && n.id === token.from;
        const isRecipient = recipients.includes(n.id);
        const lit = (isSender && senderLinkOn) || (isRecipient && receiverLinksOn);
        const portLabel = lerp(SWITCH_POS, p, 0.36);
        return (
          <g key={`link-${n.id}`}>
            <line x1={p.x} y1={p.y} x2={SWITCH_POS.x} y2={SWITCH_POS.y} strokeWidth={lit ? 3.2 : 2} className={cn(lit ? LINK_STROKE[kind] : "stroke-ink/30 dark:stroke-bone/30")} />
            <g transform={`translate(${portLabel.x}, ${portLabel.y})`}>
              <rect x={-16} y={-7} width={32} height={14} rx={7} className="fill-paper stroke-ink/25 dark:fill-chalkboard dark:stroke-bone/25" strokeWidth={1} />
              <text textAnchor="middle" y={3} className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">
                Port {n.port}
              </text>
            </g>
          </g>
        );
      })}

      {/* Router → remote network */}
      {showRemote && (
        <g>
          <line x1={POS.router.x} y1={POS.router.y + CARD_H / 2} x2={REMOTE_POS.x} y2={REMOTE_POS.y - 20} strokeWidth={2} strokeDasharray="5 4" className="stroke-ink/40 dark:stroke-bone/40" />
          <text x={POS.router.x + 8} y={POS.router.y + CARD_H / 2 + 22} className="fill-ink-soft font-mono text-[8.5px] dark:fill-bone-soft">
            another network
          </text>
          <g transform={`translate(${REMOTE_POS.x - 76}, ${REMOTE_POS.y - 20})`}>
            <rect width={152} height={40} rx={8} strokeDasharray="4 3" strokeWidth={1.4} className="fill-white stroke-ink/50 dark:fill-white/[0.04] dark:stroke-bone/50" />
            <text x={76} y={16} textAnchor="middle" className="fill-ink font-mono text-[10.5px] font-semibold dark:fill-bone">
              {REMOTE_SERVER.name}
            </text>
            <text x={76} y={30} textAnchor="middle" className="fill-ink-soft font-mono text-[8.5px] dark:fill-bone-soft">
              {REMOTE_SERVER.ip}/{REMOTE_SERVER.prefix} · MAC never needed
            </text>
          </g>
        </g>
      )}

      {/* Switch */}
      <g transform={`translate(${SWITCH_POS.x}, ${SWITCH_POS.y})`}>
        <rect x={-48} y={-22} width={96} height={44} rx={9} strokeWidth={1.6} className="fill-subject-it-soft stroke-ink/60 dark:fill-subject-it/15 dark:stroke-bone/60" />
        {[-30, -15, 0, 15, 30].map((x) => (
          <rect key={x} x={x - 4} y={9} width={8} height={6} rx={1.5} className="fill-ink/50 dark:fill-bone/50" />
        ))}
        <text textAnchor="middle" y={-3} className="fill-ink font-mono text-[11px] font-medium dark:fill-bone">
          Switch
        </text>
      </g>
      {token?.to === "all" && token.leg >= 3 && (
        <text x={SWITCH_POS.x} y={SWITCH_POS.y - 52} textAnchor="middle" className="fill-amber-600 font-mono text-[9px] dark:fill-amber-300">
          Broadcast → flood to every other port
        </text>
      )}

      {/* Devices */}
      {nodes.map((n) => {
        const p = POS[n.id];
        const note = notes[n.id];
        const isSender = n.id === srcId;
        const selected = selectedId === n.id;
        const stroke = note ? NOTE_STROKE[note.tone] : selected ? "stroke-subject-it" : isSender ? "stroke-sky-500/70" : "stroke-ink/50 dark:stroke-bone/50";
        return (
          <g
            key={n.id}
            transform={`translate(${p.x - CARD_W / 2}, ${p.y - CARD_H / 2})`}
            className={onSelect ? "cursor-pointer" : undefined}
            onClick={() => onSelect?.(n.id)}
          >
            <rect width={CARD_W} height={CARD_H} rx={8} strokeWidth={note || selected ? 2.4 : 1.4} className={cn("fill-white dark:fill-white/[0.04]", stroke)} />
            <text x={CARD_W / 2} y={15} textAnchor="middle" className="fill-ink font-mono text-[11px] font-semibold dark:fill-bone">
              {n.name}
            </text>
            <text x={CARD_W / 2} y={29} textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">
              {n.ip}/{n.prefix}
            </text>
            <text x={CARD_W / 2} y={41} textAnchor="middle" className="fill-ink-soft font-mono text-[8.5px] dark:fill-bone-soft">
              {n.mac}
            </text>
            <text x={CARD_W / 2} y={56} textAnchor="middle" className={cn("font-mono text-[8.5px] font-medium", note ? NOTE_FILL[note.tone] : "fill-ink-soft dark:fill-bone-soft")}>
              {note ? note.text : n.kind === "router" ? "default gateway" : isSender ? "sender" : " "}
            </text>
          </g>
        );
      })}

      {/* Sender token (device → switch) */}
      {token && (
        <g
          className="transition-[transform,opacity] duration-700 ease-in-out motion-reduce:transition-none"
          style={{ transform: `translate(${mainPos.x}px, ${mainPos.y}px)`, opacity: mainVisible ? 1 : 0 }}
        >
          <rect x={-27} y={-9} width={54} height={18} rx={5} className={TOKEN_FILL[kind]} />
          <text textAnchor="middle" y={4} className="fill-white font-mono text-[9px] font-semibold">
            {token.label}
          </text>
        </g>
      )}

      {/* Receiver tokens (switch → device(s)) */}
      {token &&
        recipients.map((rid) => {
          const rp = POS[rid];
          const pos = token.leg >= 4 ? lerp(SWITCH_POS, rp, 0.8) : token.leg === 3 ? lerp(SWITCH_POS, rp, 0.5) : { x: SWITCH_POS.x, y: SWITCH_POS.y - 34 };
          return (
            <g
              key={`tok-${rid}`}
              className="transition-[transform,opacity] duration-700 ease-in-out motion-reduce:transition-none"
              style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, opacity: token.leg >= 3 ? 1 : 0 }}
            >
              <rect x={-27} y={-9} width={54} height={18} rx={5} className={TOKEN_FILL[kind]} />
              <text textAnchor="middle" y={4} className="fill-white font-mono text-[9px] font-semibold">
                {token.label}
              </text>
            </g>
          );
        })}

      {showIdleHint && !step && (
        <text x={VIEW_W / 2} y={SWITCH_POS.y + 44} textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">
          Press Play or Step to watch ARP work
        </text>
      )}
    </svg>
  );
}
