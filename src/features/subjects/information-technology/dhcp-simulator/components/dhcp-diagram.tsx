"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import {
  CLIENT_IDS,
  CLIENT_META,
  NETWORK_PREFIX,
  PHASE_LABEL,
  ROUTER,
  SERVER,
  lastOctet,
  poolStats,
  type ClientId,
  type ClientPhase,
  type LabState,
  type MsgKind,
  type NodeKey,
  type NodeNote,
  type NoteTone,
  type RunStep,
} from "../model";

const VIEW_W = 400;
const VIEW_H = 372;

type Pt = { x: number; y: number };
const SW: Pt = { x: 200, y: 158 };
const POS: Record<NodeKey, Pt> = {
  server: { x: 100, y: 52 },
  router: { x: 318, y: 52 },
  pc1: { x: 42, y: 292 },
  pc2: { x: 121, y: 292 },
  pc3: { x: 200, y: 292 },
  pc4: { x: 279, y: 292 },
  pc5: { x: 358, y: 292 },
};
const CLIENT_W = 72;
const CLIENT_H = 84;

/** How far along the cable from the switch a message travels before it stops: just outside the card, never on its text. */
function stopFor(node: NodeKey): number {
  return node === "server" || node === "router" ? 0.44 : 0.6;
}

function lerp(a: Pt, b: Pt, t: number): Pt {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

const TOKEN_FILL: Record<MsgKind, string> = {
  discover: "fill-amber-500",
  offer: "fill-sky-500",
  request: "fill-violet-500",
  ack: "fill-emerald-600",
  renew: "fill-violet-500",
  release: "fill-rose-500",
};
const LINK_STROKE: Record<MsgKind, string> = {
  discover: "stroke-amber-500",
  offer: "stroke-sky-500",
  request: "stroke-violet-500",
  ack: "stroke-emerald-500",
  renew: "stroke-violet-500",
  release: "stroke-rose-500",
};
const NOTE_FILL: Record<NoteTone, string> = {
  neutral: "fill-ink-soft dark:fill-bone-soft",
  sky: "fill-sky-600 dark:fill-sky-300",
  amber: "fill-amber-600 dark:fill-amber-300",
  emerald: "fill-emerald-600 dark:fill-emerald-300",
  red: "fill-red-600 dark:fill-red-300",
  violet: "fill-violet-600 dark:fill-violet-300",
};
const NOTE_STROKE: Record<NoteTone, string> = {
  neutral: "stroke-ink/50 dark:stroke-bone/50",
  sky: "stroke-sky-500",
  amber: "stroke-amber-500",
  emerald: "stroke-emerald-500",
  red: "stroke-red-400",
  violet: "stroke-violet-500",
};

type PhaseTone = { dot: string; text: string; stroke: string };
const PHASE_TONE: Record<ClientPhase, PhaseTone> = {
  unconfigured: { dot: "fill-ink/30 dark:fill-bone/30", text: "fill-ink-soft dark:fill-bone-soft", stroke: "stroke-ink/50 dark:stroke-bone/50" },
  discovering: { dot: "fill-amber-500", text: "fill-amber-600 dark:fill-amber-300", stroke: "stroke-amber-500" },
  selecting: { dot: "fill-sky-500", text: "fill-sky-600 dark:fill-sky-300", stroke: "stroke-sky-500" },
  requesting: { dot: "fill-violet-500", text: "fill-violet-600 dark:fill-violet-300", stroke: "stroke-violet-500" },
  bound: { dot: "fill-emerald-500", text: "fill-emerald-600 dark:fill-emerald-300", stroke: "stroke-emerald-500" },
  renewing: { dot: "fill-violet-500", text: "fill-violet-600 dark:fill-violet-300", stroke: "stroke-violet-500" },
  failed: { dot: "fill-red-500", text: "fill-red-600 dark:fill-red-300", stroke: "stroke-red-400" },
  expired: { dot: "fill-red-500", text: "fill-red-600 dark:fill-red-300", stroke: "stroke-red-400" },
  manual: { dot: "fill-violet-500", text: "fill-violet-600 dark:fill-violet-300", stroke: "stroke-violet-400" },
};

/**
 * 0 = the message is at its sender, 1 = it has reached the switch, 2 = it has reached its receiver(s).
 * Keyed by the step so that a new step always starts from 0 again. The values are moved by CSS
 * transitions; there is no animation loop.
 */
function useTravelPhase(key: string | null, legMs: number): 0 | 1 | 2 {
  const [state, setState] = useState<{ key: string | null; phase: 0 | 1 | 2 }>({ key, phase: 0 });
  useEffect(() => {
    if (key === null) return;
    setState({ key, phase: 0 });
    const t1 = setTimeout(() => setState({ key, phase: 1 }), 40);
    const t2 = setTimeout(() => setState({ key, phase: 2 }), 40 + legMs);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [key, legMs]);
  return state.key === key ? state.phase : 0;
}

function activate(e: KeyboardEvent, fn?: () => void) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn?.();
  }
}

/**
 * 2D LAN diagram: the DHCP server, the router (the default gateway, NOT the DHCP server here) and five PCs around
 * one switch. A message token's position is a pure function of the current step and a three-phase travel value.
 */
export function DhcpDiagram({
  state,
  step,
  stepKey,
  legMs,
  selectedId,
  onSelect,
  showIdleHint = true,
}: {
  state: LabState;
  step: RunStep | null;
  /** Changes whenever a new step is shown, so the message animates again. */
  stepKey: string | null;
  legMs: number;
  selectedId: ClientId;
  onSelect?: (id: ClientId) => void;
  showIdleHint?: boolean;
}) {
  const token = step?.token ?? null;
  const notes: Partial<Record<NodeKey, NodeNote>> = step?.notes ?? {};
  const phase = useTravelPhase(token ? stepKey : null, legMs);
  const stats = poolStats(state);
  const broadcast = token?.to === "all";

  const recipients: NodeKey[] = token ? (token.to === "all" ? (["server", "router", ...CLIENT_IDS] as NodeKey[]).filter((n) => n !== token.from) : [token.to]) : [];

  const kind = token?.kind ?? "discover";
  const moveMs = `${legMs}ms`;
  const trans = { transition: `transform ${moveMs} ease-in-out, opacity ${Math.round(legMs / 2)}ms ease-in-out` } as const;

  let mainPos: Pt = SW;
  if (token) {
    const from = POS[token.from];
    if (phase === 0) mainPos = lerp(from, SW, 0.3);
    else if (phase === 1) mainPos = SW;
    else mainPos = token.to === "all" ? SW : lerp(SW, POS[token.to], stopFor(token.to));
  }

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="mx-auto h-auto w-full max-w-[560px] rounded-card border border-line bg-paper dark:border-line-dark dark:bg-chalkboard"
      role="img"
      aria-label="Local network: a DHCP server, a router and five PCs connected to one switch"
    >
      {/* Cables */}
      {(["server", "router", ...CLIENT_IDS] as NodeKey[]).map((k) => {
        const p = POS[k];
        const isSender = !!token && token.from === k;
        const isRecipient = recipients.includes(k) && (broadcast ? k === "server" : true);
        const lit = (isSender && phase >= 1) || (isRecipient && phase >= 2);
        return <line key={`cable-${k}`} x1={p.x} y1={p.y} x2={SW.x} y2={SW.y} strokeWidth={lit ? 3.4 : 2} className={cn("transition-[stroke-width] duration-300", lit && token ? LINK_STROKE[kind] : "stroke-ink/30 dark:stroke-bone/30")} />;
      })}

      {/* Switch */}
      <g transform={`translate(${SW.x}, ${SW.y})`}>
        <rect x={-58} y={-17} width={116} height={34} rx={9} strokeWidth={1.6} className="fill-subject-it-soft stroke-ink/60 dark:fill-subject-it/15 dark:stroke-bone/60" />
        {[-36, -18, 0, 18, 36].map((x) => (
          <rect key={x} x={x - 4} y={6} width={8} height={5} rx={1.5} className="fill-ink/50 dark:fill-bone/50" />
        ))}
        <text textAnchor="middle" y={-2} className="fill-ink font-mono text-[11px] font-medium dark:fill-bone">
          Switch
        </text>
      </g>

      {/* Broadcast indicator */}
      {broadcast && (
        <g aria-hidden>
          {[0, 1].map((i) => (
            <circle
              key={i}
              cx={SW.x}
              cy={SW.y}
              r={30}
              fill="none"
              strokeWidth={2}
              className="stroke-amber-500"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                transform: phase >= 2 ? `scale(${3 + i * 1.3})` : "scale(0.5)",
                opacity: phase >= 2 ? 0 : phase === 1 ? 0.7 : 0,
                transition: `transform ${legMs * 1.4}ms ease-out, opacity ${legMs * 1.4}ms ease-out`,
              }}
            />
          ))}
        </g>
      )}
      {broadcast && phase >= 2 && (
        <text x={SW.x} y={214} textAnchor="middle" strokeWidth={3} paintOrder="stroke" className="fill-amber-700 stroke-paper font-mono text-[11px] font-semibold dark:fill-amber-300 dark:stroke-chalkboard">
          Broadcast: every device receives it
        </text>
      )}
      {!broadcast && token && phase >= 2 && (
        <text x={SW.x} y={214} textAnchor="middle" strokeWidth={3} paintOrder="stroke" className="fill-ink-soft stroke-paper font-mono text-[11px] dark:fill-bone-soft dark:stroke-chalkboard">
          Unicast: only one device receives it
        </text>
      )}
      {showIdleHint && !step && (
        <text x={SW.x} y={214} textAnchor="middle" className="fill-ink-soft font-mono text-[10px] dark:fill-bone-soft">
          Choose a PC, then press Start DHCP
        </text>
      )}

      {/* DHCP server */}
      <g transform={`translate(${POS.server.x - 92}, ${POS.server.y - 33})`}>
        <rect width={184} height={66} rx={9} strokeWidth={notes.server ? 2.4 : 1.6} className={cn("fill-white dark:fill-white/[0.04]", notes.server ? NOTE_STROKE[notes.server.tone] : "stroke-subject-it")} />
        <text x={92} y={15} textAnchor="middle" className="fill-ink font-mono text-[11.5px] font-semibold dark:fill-bone">
          DHCP Server
        </text>
        <text x={92} y={29} textAnchor="middle" className="fill-ink-soft font-mono text-[10.5px] dark:fill-bone-soft">
          {SERVER.ip}/{NETWORK_PREFIX} (static)
        </text>
        <text x={92} y={43} textAnchor="middle" className="fill-ink-soft font-mono text-[10.5px] dark:fill-bone-soft">
          Pool .{state.pool.start} – .{state.pool.end}
        </text>
        <text x={92} y={57} textAnchor="middle" className={cn("font-mono text-[10.5px] font-medium", stats.available === 0 ? "fill-red-600 dark:fill-red-300" : "fill-emerald-700 dark:fill-emerald-300")}>
          Free {stats.available} · Leased {stats.leased}
          {stats.offered > 0 ? ` · Offered ${stats.offered}` : ""}
        </text>
      </g>
      {notes.server && (
        <text x={POS.server.x} y={POS.server.y + 47} textAnchor="middle" className={cn("font-mono text-[10.5px] font-semibold", NOTE_FILL[notes.server.tone])}>
          {notes.server.text}
        </text>
      )}

      {/* Router */}
      <g transform={`translate(${POS.router.x - 64}, ${POS.router.y - 33})`}>
        <rect width={128} height={66} rx={9} strokeWidth={notes.router ? 2.4 : 1.4} className={cn("fill-white dark:fill-white/[0.04]", notes.router ? NOTE_STROKE[notes.router.tone] : "stroke-ink/50 dark:stroke-bone/50")} />
        <text x={64} y={15} textAnchor="middle" className="fill-ink font-mono text-[11.5px] font-semibold dark:fill-bone">
          Router
        </text>
        <text x={64} y={29} textAnchor="middle" className="fill-ink-soft font-mono text-[10px] dark:fill-bone-soft">
          {ROUTER.ip}/{NETWORK_PREFIX}
        </text>
        <text x={64} y={43} textAnchor="middle" className="fill-ink-soft font-mono text-[10px] dark:fill-bone-soft">
          default gateway
        </text>
        <text x={64} y={57} textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">
          not a DHCP server here
        </text>
      </g>
      {notes.router && (
        <text x={POS.router.x} y={POS.router.y + 47} textAnchor="middle" className={cn("font-mono text-[10.5px] font-semibold", NOTE_FILL[notes.router.tone])}>
          {notes.router.text}
        </text>
      )}

      {/* Clients */}
      {CLIENT_IDS.map((id) => {
        const p = POS[id];
        const c = state.clients[id];
        const tone = PHASE_TONE[c.phase];
        const note = notes[id];
        const selected = selectedId === id;
        const shortIp = c.config ? `.${lastOctet(c.config.ip)}` : "—";
        const meta = CLIENT_META[id];
        return (
          <g
            key={id}
            transform={`translate(${p.x - CLIENT_W / 2}, ${p.y - CLIENT_H / 2})`}
            className={onSelect ? "cursor-pointer" : undefined}
            role={onSelect ? "button" : undefined}
            tabIndex={onSelect ? 0 : undefined}
            aria-label={`${meta.name}: ${c.config ? c.config.ip : "no IP address"}, ${PHASE_LABEL[c.phase]}${selected ? ", selected" : ""}`}
            aria-pressed={onSelect ? selected : undefined}
            onClick={() => onSelect?.(id)}
            onKeyDown={(e) => activate(e, () => onSelect?.(id))}
          >
            <rect width={CLIENT_W} height={CLIENT_H} rx={8} strokeWidth={note || selected ? 2.6 : 1.4} className={cn("fill-white dark:fill-white/[0.04]", note ? NOTE_STROKE[note.tone] : selected ? "stroke-subject-it" : tone.stroke)} />
            <circle cx={CLIENT_W - 9} cy={10} r={4} className={tone.dot} />
            <text x={CLIENT_W / 2} y={17} textAnchor="middle" className="fill-ink font-mono text-[10.5px] font-semibold dark:fill-bone">
              {meta.name}
            </text>
            <text x={CLIENT_W / 2} y={46} textAnchor="middle" className={cn("font-mono text-[17px] font-bold", c.config ? "fill-ink dark:fill-bone" : "fill-ink-soft/60 dark:fill-bone-soft/60")}>
              {shortIp}
            </text>
            <text x={CLIENT_W / 2} y={62} textAnchor="middle" className={cn("font-mono text-[9.5px] font-semibold", tone.text)}>
              {PHASE_LABEL[c.phase]}
            </text>
            <text x={CLIENT_W / 2} y={76} textAnchor="middle" className={cn("font-mono text-[9px]", note ? NOTE_FILL[note.tone] : "fill-ink-soft dark:fill-bone-soft")}>
              {note ? note.text : c.mode === "manual" ? "manual" : "DHCP client"}
            </text>
          </g>
        );
      })}

      {/* Main message token (sender → switch → receiver, or sender → switch for a broadcast) */}
      {token && (
        <g key={`main-${stepKey}`} style={{ transform: `translate(${mainPos.x}px, ${mainPos.y}px)`, opacity: broadcast && phase >= 2 ? 0 : 1, ...trans }} className="motion-reduce:transition-none">
          <rect x={-31} y={-10} width={62} height={20} rx={6} className={TOKEN_FILL[kind]} />
          <text textAnchor="middle" y={4} className="fill-white font-mono text-[9.5px] font-bold">
            {token.label}
          </text>
        </g>
      )}

      {/* A broadcast fans out: the DHCP server gets the labelled message, everyone else just a dot */}
      {token &&
        broadcast &&
        recipients.map((r) => {
          const rp = POS[r];
          const at = phase >= 2 ? lerp(SW, rp, stopFor(r)) : SW;
          const isServer = r === "server";
          return (
            <g key={`rcv-${stepKey}-${r}`} style={{ transform: `translate(${at.x}px, ${at.y}px)`, opacity: phase >= 2 ? (isServer ? 1 : 0.55) : 0, ...trans }} className="motion-reduce:transition-none">
              {isServer ? (
                <>
                  <rect x={-31} y={-10} width={62} height={20} rx={6} className={TOKEN_FILL[kind]} />
                  <text textAnchor="middle" y={4} className="fill-white font-mono text-[9.5px] font-bold">
                    {token.label}
                  </text>
                </>
              ) : (
                <circle r={5} className={TOKEN_FILL[kind]} />
              )}
            </g>
          );
        })}
    </svg>
  );
}

export function DiagramLegend() {
  const items: { label: string; cls: string }[] = [
    { label: "Discover", cls: "bg-amber-500" },
    { label: "Offer", cls: "bg-sky-500" },
    { label: "Request / Renew", cls: "bg-violet-500" },
    { label: "ACK", cls: "bg-emerald-600" },
    { label: "Release", cls: "bg-rose-500" },
  ];
  return (
    <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-ink-soft dark:text-bone-soft" aria-label="Message colours">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-1.5">
          <span className={cn("inline-block h-2.5 w-2.5 rounded-sm", i.cls)} aria-hidden />
          {i.label}
        </li>
      ))}
    </ul>
  );
}
