"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import {
  CLIENT_IP,
  RESOLVER_IP,
  ROOT_IP,
  STATE_LABEL,
  ZONES,
  splitName,
  tldServerIp,
  type CacheState,
  type NodeId,
  type NodeNote,
  type Run,
  type RunStep,
  type StateKind,
} from "../model";

const VIEW_W = 440;
const VIEW_H = 440;

type Pt = { x: number; y: number };
const POS: Record<NodeId, Pt> = {
  client: { x: 80, y: 60 },
  resolver: { x: 80, y: 215 },
  root: { x: 360, y: 60 },
  tld: { x: 360, y: 160 },
  auth: { x: 360, y: 260 },
  website: { x: 360, y: 380 },
};
const CACHE_POS: Pt = { x: 80, y: 322 };
const CARD_W = 112;
const CARD_H = 56;

function lerp(a: Pt, b: Pt, t: number): Pt {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export const TOKEN_FILL: Record<StateKind, string> = {
  query: "fill-sky-500",
  response: "fill-violet-500",
  hit: "fill-teal-500",
  miss: "fill-amber-500",
  processing: "fill-slate-500",
  success: "fill-emerald-600",
  timeout: "fill-orange-500",
  error: "fill-red-500",
};
export const LINK_STROKE: Record<StateKind, string> = {
  query: "stroke-sky-500",
  response: "stroke-violet-500",
  hit: "stroke-teal-500",
  miss: "stroke-amber-500",
  processing: "stroke-slate-500",
  success: "stroke-emerald-500",
  timeout: "stroke-orange-500",
  error: "stroke-red-500",
};
const NOTE_FILL: Record<StateKind, string> = {
  query: "fill-sky-700 dark:fill-sky-300",
  response: "fill-violet-700 dark:fill-violet-300",
  hit: "fill-teal-700 dark:fill-teal-300",
  miss: "fill-amber-700 dark:fill-amber-300",
  processing: "fill-slate-600 dark:fill-slate-300",
  success: "fill-emerald-700 dark:fill-emerald-300",
  timeout: "fill-orange-700 dark:fill-orange-300",
  error: "fill-red-700 dark:fill-red-300",
};
const NOTE_STROKE: Record<StateKind, string> = {
  query: "stroke-sky-500",
  response: "stroke-violet-500",
  hit: "stroke-teal-500",
  miss: "stroke-amber-500",
  processing: "stroke-slate-500",
  success: "stroke-emerald-500",
  timeout: "stroke-orange-500",
  error: "stroke-red-500",
};
export const CHIP_CLASS: Record<StateKind, string> = {
  query: "bg-sky-500",
  response: "bg-violet-500",
  hit: "bg-teal-500",
  miss: "bg-amber-500",
  processing: "bg-slate-500",
  success: "bg-emerald-600",
  timeout: "bg-orange-500",
  error: "bg-red-500",
};

/**
 * 0 = the message is at its sender, 1 = it has reached the receiver. Moved by CSS transitions; there is no animation
 * loop, and `motion-reduce` turns the movement off so the message simply appears at its destination.
 */
function useTravel(key: string | null, legMs: number): 0 | 1 {
  const [state, setState] = useState<{ key: string | null; phase: 0 | 1 }>({ key, phase: 0 });
  useEffect(() => {
    if (key === null) return;
    setState({ key, phase: 0 });
    const t = setTimeout(() => setState({ key, phase: 1 }), 40);
    return () => clearTimeout(t);
  }, [key, legMs]);
  return state.key === key ? state.phase : 0;
}

function activate(e: KeyboardEvent, fn?: () => void) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn?.();
  }
}

interface NodeSpec {
  title: string;
  line1: string;
  line2?: string;
}

function nodeSpecs(run: Run | null, resolvedIp: string | null): Record<NodeId, NodeSpec> {
  const name = run?.name ?? "www.example.com";
  const { tld, zone } = splitName(name);
  const z = ZONES[zone];
  return {
    client: { title: "User PC", line1: CLIENT_IP, line2: "DNS client" },
    resolver: { title: "DNS Resolver", line1: RESOLVER_IP, line2: "recursive" },
    root: { title: "Root Server", line1: ". (top of tree)", line2: ROOT_IP },
    tld: { title: `.${tld} TLD Server`, line1: "top-level domain", line2: tldServerIp(tld) },
    auth: { title: "Authoritative", line1: z ? z.nsName : "domain's name server", line2: z ? z.nsIp : "for the domain" },
    website: { title: "Website Server", line1: resolvedIp ?? "IP: not known yet", line2: "the destination" },
  };
}

/**
 * 2D diagram: the client and its resolver on the left, the DNS hierarchy on the right, the resolver's cache under the
 * resolver and the website at the bottom. The resolver is the hub: root and TLD servers send *referrals back to it*,
 * they do not forward the query to each other. Every node is a real button, so tapping works on touch screens.
 */
export function DnsDiagram({
  run,
  step,
  stepKey,
  legMs,
  cache,
  selected,
  onSelect,
  resolvedIp,
}: {
  run: Run | null;
  step: RunStep | null;
  /** Changes whenever a new step is shown, so the message animates again. */
  stepKey: string | null;
  legMs: number;
  cache: CacheState;
  selected: NodeId | null;
  onSelect?: (id: NodeId) => void;
  resolvedIp: string | null;
}) {
  const token = step?.token ?? null;
  const notes: Partial<Record<NodeId, NodeNote>> = step?.notes ?? {};
  const phase = useTravel(token ? stepKey : null, legMs);
  const specs = nodeSpecs(run, resolvedIp);
  const moveMs = `${legMs}ms`;
  const trans = { transition: `transform ${moveMs} ease-in-out, opacity ${Math.round(legMs / 2)}ms ease-in-out` } as const;

  let tokenPos: Pt = POS.resolver;
  if (token) {
    const t = phase === 0 ? 0.3 : token.lost ? 0.52 : 0.7;
    tokenPos = lerp(POS[token.from], POS[token.to], t);
  }
  const lostMark = token?.lost ? lerp(POS[token.from], POS[token.to], 0.58) : null;

  const links: [NodeId, NodeId][] = [
    ["client", "resolver"],
    ["resolver", "root"],
    ["resolver", "tld"],
    ["resolver", "auth"],
  ];
  const isActiveLink = (a: NodeId, b: NodeId) => !!token && ((token.from === a && token.to === b) || (token.from === b && token.to === a));

  const nodeIds: NodeId[] = ["client", "resolver", "root", "tld", "auth", "website"];
  const cacheNote = notes.resolver && (notes.resolver.kind === "hit" || notes.resolver.kind === "miss") ? notes.resolver : null;
  const fresh = cache.answers.length;
  const reach = !!step?.reachWebsite;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="mx-auto h-auto w-full max-w-[600px] rounded-card border border-line bg-paper dark:border-line-dark dark:bg-chalkboard"
      role="img"
      aria-label="DNS network: a user PC and its DNS resolver, with the root, top-level domain and authoritative servers, a resolver cache and the website server"
    >
      {/* Links */}
      {links.map(([a, b]) => {
        const lit = isActiveLink(a, b) && token;
        return <line key={`${a}-${b}`} x1={POS[a].x} y1={POS[a].y} x2={POS[b].x} y2={POS[b].y} strokeWidth={lit ? 3.4 : 2} className={cn("transition-[stroke-width] duration-300", lit && token ? LINK_STROKE[token.kind] : "stroke-ink/25 dark:stroke-bone/25")} />;
      })}
      <line x1={POS.auth.x} y1={POS.auth.y} x2={POS.website.x} y2={POS.website.y} strokeWidth={1.6} strokeDasharray="4 4" className={cn(reach ? "stroke-emerald-500" : "stroke-ink/25 dark:stroke-bone/25")} />
      <text x={POS.auth.x - 8} y={(POS.auth.y + POS.website.y) / 2 + 8} textAnchor="end" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">
        A record points here
      </text>
      <line x1={POS.resolver.x} y1={POS.resolver.y} x2={CACHE_POS.x} y2={CACHE_POS.y} strokeWidth={2} className={cn(cacheNote ? NOTE_STROKE[cacheNote.kind] : "stroke-ink/25 dark:stroke-bone/25")} />

      {/* Resolver cache */}
      <g transform={`translate(${CACHE_POS.x - CARD_W / 2}, ${CACHE_POS.y - 24})`} aria-label={`Resolver cache: ${fresh === 0 ? (cache.delegations.length > 0 ? "no saved answers, some saved name servers" : "empty") : `${fresh} saved answer${fresh === 1 ? "" : "s"}`}`}>
        <rect width={CARD_W} height={48} rx={8} strokeWidth={cacheNote ? 2.6 : 1.4} strokeDasharray={cacheNote ? undefined : "4 3"} className={cn("fill-white dark:fill-white/[0.04]", cacheNote ? NOTE_STROKE[cacheNote.kind] : "stroke-ink/40 dark:stroke-bone/40")} />
        <text x={CARD_W / 2} y={17} textAnchor="middle" className="fill-ink font-mono text-[11px] font-semibold dark:fill-bone">
          DNS cache
        </text>
        <text x={CARD_W / 2} y={34} textAnchor="middle" className={cn("font-mono text-[10.5px] font-semibold", cacheNote ? NOTE_FILL[cacheNote.kind] : "fill-ink-soft dark:fill-bone-soft")}>
          {cacheNote ? (cacheNote.kind === "hit" ? "HIT" : "MISS") : fresh > 0 ? `${fresh} saved` : cache.delegations.length > 0 ? "NS records only" : "Empty"}
        </text>
      </g>

      {/* Nodes */}
      {nodeIds.map((id) => {
        const p = POS[id];
        const spec = specs[id];
        const note = notes[id];
        const isSel = selected === id;
        const noteKind = note?.kind;
        const dim = id === "website" && !reach && !run;
        return (
          <g
            key={id}
            role={onSelect ? "button" : undefined}
            tabIndex={onSelect ? 0 : undefined}
            aria-label={`${spec.title}, ${spec.line1}${note ? `, ${note.text}` : ""}${isSel ? ", selected" : ""}`}
            aria-pressed={onSelect ? isSel : undefined}
            className={cn(onSelect && "cursor-pointer", "focus:outline-none [&:focus-visible>rect]:stroke-subject-it")}
            onClick={() => onSelect?.(id)}
            onKeyDown={(e) => activate(e, () => onSelect?.(id))}
          >
            <rect
              x={p.x - CARD_W / 2}
              y={p.y - CARD_H / 2}
              width={CARD_W}
              height={CARD_H}
              rx={9}
              strokeWidth={noteKind || isSel ? 2.6 : 1.5}
              className={cn(
                "fill-white dark:fill-white/[0.04]",
                noteKind ? NOTE_STROKE[noteKind] : isSel ? "stroke-subject-it" : id === "resolver" ? "stroke-subject-it/70" : "stroke-ink/50 dark:stroke-bone/50",
                noteKind === "processing" && "animate-pulse motion-reduce:animate-none",
                dim && "opacity-70",
              )}
            />
            <text x={p.x} y={p.y - 10} textAnchor="middle" className="fill-ink font-mono text-[11px] font-semibold dark:fill-bone">
              {spec.title}
            </text>
            <text x={p.x} y={p.y + 5} textAnchor="middle" className="fill-ink-soft font-mono text-[10px] dark:fill-bone-soft">
              {spec.line1}
            </text>
            {spec.line2 && (
              <text x={p.x} y={p.y + 19} textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">
                {spec.line2}
              </text>
            )}
            {note && !(id === "resolver" && cacheNote) && (
              <text x={p.x} y={p.y + CARD_H / 2 + 14} textAnchor="middle" strokeWidth={3} paintOrder="stroke" className={cn("stroke-paper font-mono text-[10.5px] font-semibold dark:stroke-chalkboard", NOTE_FILL[note.kind])}>
                {note.text}
              </text>
            )}
          </g>
        );
      })}

      {/* Moving message */}
      {token && (
        <g key={`tok-${stepKey}`} style={{ transform: `translate(${tokenPos.x}px, ${tokenPos.y}px)`, opacity: token.lost && phase === 1 ? 0 : 1, ...trans }} className="pointer-events-none motion-reduce:transition-none">
          <rect x={-28} y={-10} width={56} height={20} rx={6} className={TOKEN_FILL[token.kind]} />
          <text textAnchor="middle" y={4} className="fill-white font-mono text-[9.5px] font-bold">
            {token.label}
          </text>
        </g>
      )}
      {lostMark && (
        <text key={`lost-${stepKey}`} x={lostMark.x} y={lostMark.y + 5} textAnchor="middle" style={{ opacity: phase === 1 ? 1 : 0, transition: `opacity ${legMs}ms ease-in` }} className="pointer-events-none fill-red-600 font-mono text-[16px] font-bold motion-reduce:transition-none dark:fill-red-400">
          ✕
        </text>
      )}
    </svg>
  );
}

export function StateLegend() {
  const kinds: StateKind[] = ["query", "response", "hit", "miss", "processing", "success", "timeout", "error"];
  return (
    <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-ink-soft dark:text-bone-soft" aria-label="Message and state colours">
      {kinds.map((k) => (
        <li key={k} className="flex items-center gap-1.5">
          <span className={cn("inline-block h-2.5 w-2.5 rounded-sm", CHIP_CLASS[k])} aria-hidden />
          {STATE_LABEL[k]}
        </li>
      ))}
    </ul>
  );
}
