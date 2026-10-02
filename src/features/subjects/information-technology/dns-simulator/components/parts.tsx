"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import type { PlaySpeed } from "../../osi-model-explorer/hooks/use-step-player";
import type { DnsLab, LogEntry } from "../hooks/use-dns-lab";
import {
  PRESET_DOMAINS,
  STATE_LABEL,
  formatTtl,
  isFresh,
  remaining,
  validateName,
  type CacheState,
  type DetailLevel,
  type LogKind,
  type NodeId,
  type Run,
  type StateKind,
} from "../model";
import { CHIP_CLASS } from "./dns-diagram";

// ---------------------------------------------------------------------------
// Collapsible: keeps long inspectors out of the way on small screens
// ---------------------------------------------------------------------------

export function Collapsible({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-card border border-line bg-white/60 dark:border-line-dark dark:bg-white/[0.03]">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex min-h-[44px] w-full items-center justify-between gap-2 px-3.5 py-2 text-left">
        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{title}</span>
        <span className="text-xs text-ink-soft dark:text-bone-soft" aria-hidden>
          {open ? "Hide ▲" : "Show ▼"}
        </span>
      </button>
      {open && <div className="border-t border-line p-3.5 dark:border-line-dark">{children}</div>}
    </div>
  );
}

const BTN = "min-h-[44px] rounded-full border px-4 text-sm font-medium transition-colors disabled:opacity-40";
const PLAIN = "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone";
const PRIMARY = "border-subject-it bg-subject-it text-paper";
export const BTN_CLASSES = { btn: BTN, plain: PLAIN, primary: PRIMARY };

export function ActionButton({ onClick, disabled, children, primary }: { onClick: () => void; disabled?: boolean; children: ReactNode; primary?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className={cn(BTN, primary ? PRIMARY : PLAIN)}>
      {children}
    </button>
  );
}

export function StateChip({ kind, label }: { kind: StateKind; label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink dark:border-line-dark dark:text-bone">
      <span className={cn("h-2 w-2 rounded-full", CHIP_CLASS[kind])} aria-hidden />
      {label ?? STATE_LABEL[kind]}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Domain form
// ---------------------------------------------------------------------------

export function LookupForm({ value, onChange, onResolve, busy }: { value: string; onChange: (v: string) => void; onResolve: (mode: "auto" | "step") => void; busy?: boolean }) {
  const [touched, setTouched] = useState(false);
  const error = validateName(value);
  const showError = touched && error;
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label htmlFor="dns-domain" className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
          Domain name
        </label>
        <div className="mt-1 flex flex-wrap gap-2">
          <input
            id="dns-domain"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setTouched(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !error) onResolve("auto");
            }}
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={!!showError}
            aria-describedby={showError ? "dns-domain-error" : undefined}
            className="min-h-[44px] min-w-0 flex-1 basis-56 rounded-xl border border-line bg-white px-3 font-mono text-base text-ink dark:border-line-dark dark:bg-white/[0.04] dark:text-bone"
            placeholder="www.example.com"
          />
          <button onClick={() => onResolve("auto")} disabled={!!error || busy} className={cn(BTN, PRIMARY)}>
            Resolve Domain
          </button>
          <button onClick={() => onResolve("step")} disabled={!!error || busy} className={cn(BTN, PLAIN)}>
            Step by step
          </button>
        </div>
        {showError && (
          <p id="dns-domain-error" className="mt-1 text-xs text-red-600 dark:text-red-300">
            {error}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Example domains">
        <span className="text-xs text-ink-soft dark:text-bone-soft">Try:</span>
        {PRESET_DOMAINS.map((d) => (
          <button
            key={d}
            onClick={() => {
              onChange(d);
              setTouched(false);
            }}
            className={cn("min-h-[36px] rounded-full border px-3 py-1 font-mono text-[11px] transition-colors", value.trim().toLowerCase() === d ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30")}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step banner and playback controls
// ---------------------------------------------------------------------------

export function StepBanner({ lab, level, idleText }: { lab: DnsLab; level: DetailLevel; idleText?: string }) {
  const { run, step, stepIndex } = lab;
  if (!run || !step) {
    return (
      <div className="rounded-card border border-dashed border-line p-3.5 text-sm text-ink-soft dark:border-line-dark dark:text-bone-soft">
        <p>{idleText ?? "Enter a domain name and press Resolve Domain, or step through the lookup one message at a time."}</p>
      </div>
    );
  }
  return (
    <div className="rounded-card border border-line bg-white/60 p-3.5 dark:border-line-dark dark:bg-white/[0.03]" aria-live="polite">
      <div className="flex flex-wrap items-center gap-2">
        <StateChip kind={step.kind} />
        <span className="font-mono text-[11px] text-ink-soft dark:text-bone-soft">
          Step {stepIndex + 1} of {run.steps.length}
        </span>
      </div>
      <p className="mt-2 font-display text-base font-medium text-ink dark:text-bone">{step.title}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{step.text}</p>
      {step.tech && level !== "beginner" && (
        <p className="mt-2 rounded-lg bg-ink/[0.04] p-2.5 text-xs leading-relaxed text-ink-soft dark:bg-bone/[0.06] dark:text-bone-soft">
          <span className="font-mono font-semibold text-ink dark:text-bone">Under the hood: </span>
          {step.tech}
        </p>
      )}
    </div>
  );
}

const SPEEDS: PlaySpeed[] = [0.5, 1, 1.5, 2];

export function Controls({ lab, canStart, onStart, hint }: { lab: DnsLab; canStart: boolean; onStart: (mode: "auto" | "step") => void; hint?: string }) {
  const { run, player } = lab;
  const finished = lab.runDone && !player.isPlaying;
  const idle = !run;

  function primary() {
    if (idle || finished) onStart("auto");
    else player.playPause();
  }
  const primaryLabel = idle ? "▶ Start" : finished ? "▶ Resolve again" : player.isPlaying ? "⏸ Pause" : "▶ Resume";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="sticky bottom-2 z-20 flex flex-wrap items-center gap-2 rounded-card border border-line bg-paper/95 p-2.5 shadow-sm backdrop-blur dark:border-line-dark dark:bg-chalkboard/95" role="group" aria-label="Playback controls">
        <button onClick={primary} disabled={(idle || finished) && !canStart} className={cn(BTN, PRIMARY)}>
          {primaryLabel}
        </button>
        <button onClick={() => (idle ? onStart("step") : player.stepForward())} disabled={idle ? !canStart : lab.runDone} className={cn(BTN, PLAIN)}>
          Next step ▸
        </button>
        <button onClick={player.stepBack} disabled={idle || player.stepIndex <= 0} className={cn(BTN, PLAIN)} aria-label="Previous step">
          ◂ Back
        </button>
        <button onClick={lab.restartLookup} disabled={idle} className={cn(BTN, PLAIN)} title="Replay this lookup from its first step, with the cache it started with">
          ↻ Restart
        </button>
        <label className="ml-auto flex items-center gap-1.5 text-xs text-ink-soft dark:text-bone-soft">
          Speed
          <select value={player.speed} onChange={(e) => player.setSpeed(Number(e.target.value) as PlaySpeed)} className="min-h-[44px] rounded-lg border border-line bg-white px-2 text-sm text-ink dark:border-line-dark dark:bg-white/[0.04] dark:text-bone">
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s}×
              </option>
            ))}
          </select>
        </label>
      </div>
      {hint && <p className="px-1 text-xs text-ink-soft dark:text-bone-soft">{hint}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Result
// ---------------------------------------------------------------------------

export function ResultCard({ lab }: { lab: DnsLab }) {
  const r = lab.runDone ? lab.run?.result : null;
  if (!r) {
    return (
      <Panel title="Result">
        <p className="text-sm text-ink-soft dark:text-bone-soft">The result appears when the lookup finishes.</p>
      </Panel>
    );
  }
  const ok = r.status === "resolved" || r.status === "cache-hit";
  const tone = ok ? "border-emerald-400/60 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10" : r.status === "timeout" ? "border-orange-400/60 bg-orange-50 dark:border-orange-500/40 dark:bg-orange-500/10" : "border-red-400/60 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10";
  const route = r.contacted.length > 0 ? ["Resolver", ...r.contacted].join(" → ") : r.status === "cache-hit" ? "None: answered from the resolver's cache" : r.status === "timeout" ? "None: the resolver never answered" : "None";
  return (
    <div className={cn("rounded-card border p-3.5", tone)}>
      <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Result</p>
      <dl className="mt-2 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1.5 text-sm">
        <dt className="text-ink-soft dark:text-bone-soft">Domain</dt>
        <dd className="break-all font-mono font-semibold text-ink dark:text-bone">{r.name}</dd>
        {ok ? (
          <>
            <dt className="text-ink-soft dark:text-bone-soft">IPv4</dt>
            <dd className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">{r.ip}</dd>
            {r.cname && (
              <>
                <dt className="text-ink-soft dark:text-bone-soft">Alias of</dt>
                <dd className="break-all font-mono text-ink dark:text-bone">{r.cname} (CNAME)</dd>
              </>
            )}
            <dt className="text-ink-soft dark:text-bone-soft">TTL</dt>
            <dd className="font-mono text-ink dark:text-bone">{r.ttl} seconds{r.status === "cache-hit" ? " left" : ""}</dd>
          </>
        ) : r.status === "nxdomain" ? (
          <>
            <dt className="text-ink-soft dark:text-bone-soft">Answer</dt>
            <dd className="font-mono font-semibold text-red-700 dark:text-red-300">NXDOMAIN / Domain not found</dd>
          </>
        ) : (
          <>
            <dt className="text-ink-soft dark:text-bone-soft">Answer</dt>
            <dd className="font-mono font-semibold text-orange-700 dark:text-orange-300">DNS query timed out</dd>
          </>
        )}
        <dt className="text-ink-soft dark:text-bone-soft">Servers asked</dt>
        <dd className="text-ink dark:text-bone">{route}</dd>
        {r.skipped.length > 0 && (
          <>
            <dt className="text-ink-soft dark:text-bone-soft">Skipped</dt>
            <dd className="text-ink dark:text-bone">{r.skipped.join(", ")} (already known from the cache)</dd>
          </>
        )}
        <dt className="text-ink-soft dark:text-bone-soft">DNS messages</dt>
        <dd className="font-mono text-ink dark:text-bone">{r.messages}</dd>
      </dl>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cache panel
// ---------------------------------------------------------------------------

function ttlBarClass(frac: number): string {
  return frac > 0.5 ? "bg-emerald-500" : frac > 0.2 ? "bg-amber-500" : "bg-red-500";
}

export function CachePanel({
  cache,
  now,
  highlight,
  selected,
  onSelect,
  onFlush,
  showDelegations = true,
}: {
  cache: CacheState;
  now: number;
  highlight?: string;
  selected?: string | null;
  onSelect?: (name: string) => void;
  onFlush?: () => void;
  showDelegations?: boolean;
}) {
  const empty = cache.answers.length === 0;
  return (
    <Panel title="DNS cache (on the resolver)">
      {empty ? (
        <div className="rounded-lg border border-dashed border-line p-3 text-center dark:border-line-dark">
          <p className="font-mono text-sm text-ink-soft dark:text-bone-soft">{cache.delegations.length > 0 ? "No answers saved yet" : "Empty"}</p>
          <p className="mt-0.5 text-xs text-ink-soft dark:text-bone-soft">{cache.delegations.length > 0 ? "The resolver has only remembered which name servers to ask." : "Resolve a domain and its answer is saved here."}</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {cache.answers.map((a) => {
            const fresh = isFresh(a, now);
            const left = remaining(a, now);
            const frac = a.ttl > 0 ? left / a.ttl : 0;
            const hit = highlight === a.name;
            const isSel = selected === a.name;
            const body = (
              <>
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                  <span className="break-all font-mono text-sm font-semibold text-ink dark:text-bone">{a.name}</span>
                  <span className={cn("rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase", hit ? "bg-teal-500 text-white" : fresh ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200" : "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200")}>{hit ? "HIT" : fresh ? "Fresh" : "Expired"}</span>
                </div>
                <p className="mt-0.5 font-mono text-sm text-ink dark:text-bone">{a.value}</p>
                <p className="mt-0.5 font-mono text-xs text-ink-soft dark:text-bone-soft">TTL: {left} seconds{fresh ? "" : " (expired)"}</p>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-bone/10" aria-hidden>
                  <div className={cn("h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none", ttlBarClass(frac))} style={{ width: `${Math.round(frac * 100)}%` }} />
                </div>
              </>
            );
            const cls = cn("w-full rounded-lg border p-2.5 text-left", hit ? "border-teal-500 bg-teal-50 dark:bg-teal-500/10" : isSel ? "border-subject-it bg-subject-it-soft/50 dark:bg-subject-it/10" : "border-line dark:border-line-dark", !fresh && "opacity-80");
            return (
              <li key={a.name}>
                {onSelect ? (
                  <button onClick={() => onSelect(a.name)} aria-pressed={isSel} className={cn(cls, "min-h-[44px]")}>
                    {body}
                  </button>
                ) : (
                  <div className={cls}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {showDelegations && cache.delegations.length > 0 && (
        <div className="mt-3 border-t border-line pt-2.5 dark:border-line-dark">
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Saved name servers</p>
          <ul className="mt-1 space-y-0.5 text-xs text-ink-soft dark:text-bone-soft">
            {cache.delegations.map((d) => (
              <li key={d.zone} className="break-words font-mono">
                {d.zone.includes(".") ? d.zone : `.${d.zone}`} → {d.nsName} · TTL {formatTtl(d.ttl)}
              </li>
            ))}
          </ul>
        </div>
      )}
      {onFlush && (cache.answers.length > 0 || cache.delegations.length > 0) && (
        <div className="mt-3">
          <button onClick={onFlush} className="min-h-[36px] rounded-full border border-line px-3 py-1 text-xs font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone">
            Flush cache
          </button>
        </div>
      )}
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Query inspector
// ---------------------------------------------------------------------------

export function QueryInspector({ run, stepIndex, level }: { run: Run | null; stepIndex: number; level: DetailLevel }) {
  const [picked, setPicked] = useState<number | null>(null);
  useEffect(() => setPicked(null), [stepIndex, run]);

  if (!run) return <p className="text-sm text-ink-soft dark:text-bone-soft">Start a lookup, then click any DNS message here to inspect it.</p>;
  const reached = run.steps.map((s, i) => ({ s, i })).filter(({ s, i }) => i <= stepIndex && s.message);
  if (reached.length === 0) return <p className="text-sm text-ink-soft dark:text-bone-soft">The first message appears when the lookup starts.</p>;
  const current = reached[reached.length - 1]!;
  const sel = reached.find((r) => r.i === picked) ?? current;
  const m = sel.s.message!;

  const rows: [string, string][] = [
    ["Query", m.name],
    ["Record type", m.type],
    ["Question", m.question],
  ];
  if (m.response) rows.push(["Response", m.response]);
  if (level !== "beginner") {
    rows.push(["Server contacted", m.server]);
    if (m.answer) rows.push(["Answer", m.answer]);
    if (m.ttl !== undefined) rows.push(["TTL", `${m.ttl} seconds`]);
  }
  if (level === "technical") {
    rows.push(["Direction", m.direction === "query" ? `Query: ${m.from} → ${m.to}` : `Response: ${m.from} → ${m.to}`]);
    if (m.rcode) rows.push(["Response code", m.rcode]);
    if (m.flags) rows.push(["Flags", m.flags]);
    rows.push(["Transport", "UDP port 53 (TCP if the reply is too large)"]);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="DNS messages in this lookup">
        {reached.map(({ s, i }, n) => (
          <button key={s.id} onClick={() => setPicked(i)} aria-pressed={sel.i === i} className={cn("min-h-[36px] rounded-full border px-3 py-1 text-[11px] font-medium transition-colors", sel.i === i ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft")}>
            {n + 1}. {s.message!.direction === "query" ? "Query" : "Response"}
          </button>
        ))}
      </div>
      <p className="font-display text-sm font-medium text-ink dark:text-bone">{m.title}</p>
      <dl className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1.5 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-ink-soft dark:text-bone-soft">{k}</dt>
            <dd className="min-w-0 break-words font-mono text-[13px] text-ink dark:text-bone">{v}</dd>
          </div>
        ))}
      </dl>
      {m.note && level !== "beginner" && <p className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{m.note}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Node info (tap a node in the diagram)
// ---------------------------------------------------------------------------

const NODE_INFO: Record<NodeId, { title: string; beginner: string; technical: string }> = {
  client: { title: "User PC (DNS client)", beginner: "The device that needs an IP address. An application, such as a browser, asks the operating system to look up a name.", technical: "The client's stub resolver sends ordinary queries to its configured resolver, usually over UDP port 53, with recursion desired. It normally also keeps a small local cache; this lab shows only the resolver's cache so you can watch the saved work." },
  resolver: { title: "DNS resolver", beginner: "The server the client asks. It does the searching on the client's behalf and remembers answers for next time. Often run by your ISP, your organization, or a public DNS service.", technical: "A recursive resolver answers the client from its cache when it can. Otherwise it follows referrals with iterative queries (root → TLD → authoritative), caches what it learns, and returns one final answer or an error." },
  root: { title: "Root server", beginner: "The top of the DNS hierarchy. It doesn't know the answer, but it knows where each top-level domain (like .com) is handled.", technical: "Root servers answer with referrals to TLD servers (NS records). They hold only the root zone and are not asked for most lookups, because resolvers cache TLD name servers for a long time." },
  tld: { title: "TLD server", beginner: "Handles a top-level domain such as .com, .org, .net, .edu or a country code. It knows which name servers are in charge of each domain below it.", technical: "A TLD server's zone is mostly delegations: NS records for registered domains. It refers the resolver to the domain's authoritative servers instead of answering host names itself." },
  auth: { title: "Authoritative DNS server", beginner: "The server that holds the real records for a domain. Its answer is the official one.", technical: "Authoritative servers answer from their zone data and set the AA flag. They return A, AAAA, CNAME, MX, NS or TXT records with a TTL, or NXDOMAIN if the name doesn't exist in the zone." },
  website: { title: "Website server", beginner: "The machine that actually hosts the site. DNS only tells the client its address. Connecting to it is a separate step that happens after DNS finishes.", technical: "The address in the A record points at the web server (or a load balancer in front of it). Connecting uses other protocols, such as TCP and HTTP, which are outside this simulation." },
};

export function NodeInfo({ node, level }: { node: NodeId | null; level: DetailLevel }) {
  if (!node) {
    return <p className="text-xs text-ink-soft dark:text-bone-soft">Tip: tap any device in the diagram to learn what it does.</p>;
  }
  const info = NODE_INFO[node];
  return (
    <div className="rounded-card border border-line bg-white/60 p-3 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-display text-sm font-medium text-ink dark:text-bone">{info.title}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{info.beginner}</p>
      {level !== "beginner" && <p className="mt-1.5 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{info.technical}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Event log
// ---------------------------------------------------------------------------

const LOG_DOT: Record<LogKind, string> = { ...CHIP_CLASS, info: "bg-ink/40 dark:bg-bone/40" };

/** DNS event log: append-only, scrolls inside its own box. Pause/Resume/Restart control the current lookup. */
export function DnsEventLog({ lab, entries }: { lab: DnsLab; entries: LogEntry[] }) {
  const { run, player } = lab;
  const finished = lab.runDone;
  const listRef = useRef<HTMLOListElement>(null);
  // Keep the newest event in view by scrolling the log's own box, never the page.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries.length]);
  const small = "min-h-[36px] rounded-full border border-line px-3 py-1 text-xs font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone";
  return (
    <Panel title="DNS event log">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-ink-soft dark:text-bone-soft">{entries.length === 0 ? "Nothing has happened yet." : `${entries.length} event${entries.length === 1 ? "" : "s"}`}</p>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={player.playPause} disabled={!run || finished} className={small}>
            {player.isPlaying ? "Pause" : "Resume"}
          </button>
          <button onClick={lab.restartLookup} disabled={!run} className={small}>
            Restart
          </button>
          <button onClick={lab.clearLog} disabled={entries.length === 0} className={small}>
            Clear
          </button>
        </div>
      </div>
      <ol ref={listRef} className="mt-2 max-h-64 space-y-2 overflow-y-auto pr-1" aria-live="polite">
        {entries.map((e) => (
          <li key={e.id} className="flex gap-2 text-xs">
            <span className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", LOG_DOT[e.kind])} aria-hidden />
            <div className="min-w-0">
              <p className="break-words font-medium text-ink dark:text-bone">{e.text}</p>
              {e.detail && <p className="whitespace-pre-line break-words font-mono text-[11px] text-ink-soft dark:text-bone-soft">{e.detail}</p>}
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
