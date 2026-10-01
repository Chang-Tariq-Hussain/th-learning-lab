"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import type { PlaySpeed } from "../../osi-model-explorer/hooks/use-step-player";
import type { DhcpLab } from "../hooks/use-dhcp-lab";
import {
  CLIENT_IDS,
  CLIENT_META,
  LEASE_STATUS_LABEL,
  PHASE_LABEL,
  PHASE_LONG,
  availableAddresses,
  dnsLabel,
  formatDuration,
  lastOctet,
  leaseRemaining,
  poolStats,
  type ClientId,
  type ClientPhase,
  type DetailLevel,
  type LabState,
  type Lease,
  type LeaseStatus,
  type Run,
  type RunStep,
  type Stage,
} from "../model";

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

// ---------------------------------------------------------------------------
// The DORA strip: Discover → Offer → Request → ACK
// ---------------------------------------------------------------------------

interface Pill {
  id: string;
  letter: string;
  label: string;
}

const DORA_CHAIN: Pill[] = [
  { id: "discover", letter: "D", label: "Discover" },
  { id: "offer", letter: "O", label: "Offer" },
  { id: "request", letter: "R", label: "Request" },
  { id: "ack", letter: "A", label: "ACK" },
];
const RENEW_CHAIN: Pill[] = [
  { id: "renew", letter: "1", label: "Renew request" },
  { id: "ack", letter: "2", label: "ACK" },
];
const RELEASE_CHAIN: Pill[] = [
  { id: "release", letter: "1", label: "Release" },
  { id: "none", letter: "2", label: "Address freed" },
];

function chainFor(stages: Set<Stage>): Pill[] {
  if (stages.has("renew")) return RENEW_CHAIN;
  if (stages.has("release")) return RELEASE_CHAIN;
  return DORA_CHAIN;
}

/** The learner's map of where they are in the conversation. Skipped and failed messages are shown honestly. */
export function DoraStrip({ run, step, stepIndex }: { run: Run | null; step: RunStep | null; stepIndex: number }) {
  // In a batch run, look only at the steps of the client currently in focus.
  const stage: Stage | null = step ? step.stage : null;
  const local: RunStep[] = run && step ? run.steps.filter((s) => s.clientId === step.clientId) : [];
  const chain = chainFor(new Set(local.map((s) => s.stage)));
  const failed = step?.tone === "failure";
  const finishedOk = step?.tone === "success";
  const currentPos = stage === "failed" ? 1 : chain.findIndex((c) => c.id === stage);
  void stepIndex;

  return (
    <ol className="flex flex-wrap items-center gap-1.5" aria-label="DHCP message sequence">
      {chain.map((c, i) => {
        const isFailedPill = failed && i === 1;
        const isSkipped = failed && i > 1;
        const isDone = failed ? i === 0 : currentPos > i || (finishedOk && i === currentPos);
        const isCurrent = !failed && !finishedOk && i === currentPos;
        return (
          <li key={c.id} className="flex items-center gap-1.5">
            <span
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                isCurrent && "border-subject-it bg-subject-it text-paper",
                isDone && "border-emerald-400/70 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300",
                isFailedPill && "border-red-400/70 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300",
                isSkipped && "border-dashed border-line text-ink-soft line-through opacity-60 dark:border-line-dark dark:text-bone-soft",
                !isCurrent && !isDone && !isFailedPill && !isSkipped && "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
              )}
            >
              <span className="font-mono text-xs font-bold">{c.letter}</span>
              {c.label}
              {isFailedPill && <span> (none sent)</span>}
              {isSkipped && <span className="sr-only"> (skipped in this run)</span>}
            </span>
            {i < chain.length - 1 && (
              <span className="text-ink-soft/60 dark:text-bone-soft/60" aria-hidden>
                →
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// Current step: what happened, who sent it, why, what changed
// ---------------------------------------------------------------------------

const EXPLAIN_ROWS: { key: "what" | "who" | "why" | "changed"; label: string }[] = [
  { key: "what", label: "What happened" },
  { key: "who", label: "Who sent it" },
  { key: "why", label: "Why it happened" },
  { key: "changed", label: "What changed" },
];

export function StepBanner({ lab, level, readyText }: { lab: DhcpLab; level: DetailLevel; readyText?: string }) {
  const { run, step, stepIndex } = lab;
  if (!run || !step) {
    const sel = CLIENT_META[lab.selectedId];
    return (
      <div className="rounded-card border border-dashed border-line p-4 dark:border-line-dark">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Ready</p>
        <p className="mt-1 text-sm text-ink dark:text-bone">
          {readyText ?? `${sel.name} is selected. Press Start DHCP to watch the four messages of the DORA process, one step at a time, or press Auto-play.`}
        </p>
      </div>
    );
  }
  const last = stepIndex >= run.steps.length - 1;
  const failed = step.tone === "failure";
  const ok = step.tone === "success";
  return (
    <div
      className={cn("rounded-card border-2 p-4", failed ? "border-red-400/70 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10" : ok ? "border-emerald-500/70 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10" : "border-subject-it bg-subject-it-soft dark:bg-subject-it/15")}
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold text-paper", failed ? "bg-red-500" : ok ? "bg-emerald-600" : "bg-subject-it")}>
          Step {stepIndex + 1} of {run.steps.length}
        </span>
        {run.clientIds.length > 1 && <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-ink dark:border-line-dark dark:text-bone">{CLIENT_META[step.clientId].name}</span>}
        {last && <span className="text-xs font-medium text-ink-soft dark:text-bone-soft">{run.kind === "batch" ? "All requests finished" : "Finished"}</span>}
      </div>
      <h3 className="mt-2 font-display text-lg font-medium text-ink dark:text-bone sm:text-xl">{step.title}</h3>
      <dl className="mt-2 flex flex-col gap-1.5 text-sm">
        {EXPLAIN_ROWS.map((r) => (
          <div key={r.key} className="sm:grid sm:grid-cols-[8.5rem_1fr] sm:gap-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-bone-soft sm:pt-0.5">{r.label}</dt>
            <dd className="leading-relaxed text-ink dark:text-bone">{step[r.key]}</dd>
          </div>
        ))}
        {level === "technical" && step.technical && (
          <div className="sm:grid sm:grid-cols-[8.5rem_1fr] sm:gap-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-bone-soft sm:pt-0.5">Technical note</dt>
            <dd className="leading-relaxed text-ink-soft dark:text-bone-soft">{step.technical}</dd>
          </div>
        )}
      </dl>
      {step.contrast && (
        <p className="mt-3 rounded-lg border border-amber-400/60 bg-amber-50 p-2.5 text-xs leading-relaxed text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">{step.contrast}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Play / Next / Back / Restart
// ---------------------------------------------------------------------------

const SPEEDS: PlaySpeed[] = [0.5, 1, 1.5, 2];

export function Controls({ lab, canStart, startLabel = "▶ Start DHCP", onStart, hint, showStart = true }: { lab: DhcpLab; canStart: boolean; startLabel?: string; onStart: (mode: "auto" | "step") => void; hint?: string; showStart?: boolean }) {
  const { run, player } = lab;
  const finished = !!run && player.isFinished && !player.isPlaying && player.stepIndex >= 0;
  const btn = "min-h-[44px] rounded-full border px-4 text-sm font-medium transition-colors disabled:opacity-40";
  const plain = "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone";

  function next() {
    if (!run) onStart("step");
    else player.stepForward();
  }
  // When the last run is over and the selected PC can start a new one, "Auto-play" starts that new run
  // instead of replaying the old one. Replay is only offered when there is nothing new to start.
  const startsNew = !run || (finished && canStart);
  function auto() {
    if (startsNew) onStart("auto");
    else player.playPause();
  }
  const started = !!run && !finished;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="sticky bottom-2 z-20 flex flex-wrap items-center gap-2 rounded-card border border-line bg-paper/95 p-2.5 shadow-sm backdrop-blur dark:border-line-dark dark:bg-chalkboard/95" role="group" aria-label="Playback controls">
        {showStart && (
          <button onClick={() => onStart("step")} disabled={!canStart || started} className={cn(btn, "border-subject-it bg-subject-it text-paper")}>
            {startLabel}
          </button>
        )}
        <button onClick={next} disabled={(!canStart && !run) || (!!run && player.isFinished)} className={cn(btn, plain)}>
          Next Step
        </button>
        <button onClick={player.stepBack} disabled={!run || player.stepIndex <= 0} className={cn(btn, plain)} aria-label="Previous step">
          ◀ Back
        </button>
        <button onClick={auto} disabled={!canStart && !run} className={cn(btn, plain)}>
          {startsNew ? "Auto-play" : player.isPlaying ? "Pause" : player.playLabel === "Play" ? "Auto-play" : player.playLabel}
        </button>
        <button onClick={lab.restart} className={cn(btn, plain)} title="Reset the whole lab to its starting state">
          Restart
        </button>
        <label className="ml-auto flex items-center gap-1.5 text-xs text-ink-soft dark:text-bone-soft">
          Speed
          <select
            value={player.speed}
            onChange={(e) => player.setSpeed(Number(e.target.value) as PlaySpeed)}
            className="min-h-[36px] rounded-lg border border-line bg-paper px-2 text-xs text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone"
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s}×
              </option>
            ))}
          </select>
        </label>
      </div>
      {hint && !run && <p className="px-1 text-xs text-ink-soft dark:text-bone-soft">{hint}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// A client's configuration, with the status it is in
// ---------------------------------------------------------------------------

const PHASE_BADGE: Record<ClientPhase, string> = {
  unconfigured: "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
  discovering: "border-amber-400/70 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200",
  selecting: "border-sky-400/70 bg-sky-50 text-sky-800 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-200",
  requesting: "border-violet-400/70 bg-violet-50 text-violet-800 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-200",
  bound: "border-emerald-400/70 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200",
  renewing: "border-violet-400/70 bg-violet-50 text-violet-800 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-200",
  failed: "border-red-400/70 bg-red-50 text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200",
  expired: "border-red-400/70 bg-red-50 text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200",
  manual: "border-violet-400/70 bg-violet-50 text-violet-800 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-200",
};

export function ConfigCard({ state, id }: { state: LabState; id: ClientId }) {
  const c = state.clients[id];
  const meta = CLIENT_META[id];
  const lease = state.leases.find((l) => l.clientId === id && (l.status === "leased" || l.status === "offered"));
  const cfg = c.config;
  const rows: { label: string; value: string }[] = [
    { label: "IP", value: cfg ? cfg.ip : "Unconfigured" },
    { label: "Subnet Mask", value: cfg ? cfg.mask : "—" },
    { label: "Gateway", value: cfg ? cfg.gateway || "—" : "—" },
    { label: "DNS", value: cfg ? dnsLabel(cfg.dns) : "—" },
  ];
  return (
    <Panel title={`${meta.name} network configuration`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", PHASE_BADGE[c.phase])}>{PHASE_LABEL[c.phase]}</span>
        <span className="text-xs text-ink-soft dark:text-bone-soft">{PHASE_LONG[c.phase]}</span>
      </div>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="contents">
            <dt className="text-xs text-ink-soft dark:text-bone-soft">{r.label}</dt>
            <dd className={cn("break-all font-mono font-semibold", cfg ? "text-ink dark:text-bone" : "text-ink-soft/70 dark:text-bone-soft/70")}>{r.value}</dd>
          </div>
        ))}
        <div className="contents">
          <dt className="text-xs text-ink-soft dark:text-bone-soft">Lease</dt>
          <dd className="font-mono text-xs text-ink dark:text-bone">{lease && lease.status === "leased" ? `${formatDuration(leaseRemaining(lease, state.clock))} left of ${formatDuration(lease.durationMin)}` : c.mode === "manual" ? "None (static)" : "—"}</dd>
        </div>
      </dl>
      {c.phase === "bound" && (
        <p className="mt-3 rounded-lg border border-emerald-400/60 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">🟢 DHCP Configuration Complete</p>
      )}
      {c.phase === "failed" && (
        <p className="mt-3 rounded-lg border border-red-400/60 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
          DHCP failed. Some systems then assign themselves a link-local address{c.linkLocal ? ` such as ${c.linkLocal}` : ""}. It did not come from DHCP, has no gateway, and only works on this local link.
        </p>
      )}
      {c.phase === "expired" && <p className="mt-3 rounded-lg border border-red-400/60 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">The lease ran out without a renewal. The client must stop using the address and run DORA again.</p>}
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// The server's lease table
// ---------------------------------------------------------------------------

const STATUS_BADGE: Record<LeaseStatus | "available", string> = {
  available: "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
  offered: "border-sky-400/70 bg-sky-50 text-sky-800 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-200",
  leased: "border-emerald-400/70 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200",
  released: "border-amber-400/70 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200",
  expired: "border-red-400/70 bg-red-50 text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200",
};

function leaseText(l: Lease, clock: number): string {
  if (l.status === "leased") return `${formatDuration(leaseRemaining(l, clock))} left of ${formatDuration(l.durationMin)}`;
  if (l.status === "offered") return "Reserved, waiting for the request";
  if (l.status === "released") return "Ended: client released it";
  return "Ended: the lease ran out";
}

export function LeaseTable({ state, highlightIp }: { state: LabState; highlightIp?: string | null }) {
  const stats = poolStats(state);
  const free = availableAddresses(state);
  return (
    <Panel title="DHCP lease table (on the server)">
      <p className="text-xs text-ink-soft dark:text-bone-soft">
        Pool of {stats.total} · <span className="font-medium text-ink dark:text-bone">{stats.available} available</span> · {stats.offered} offered · {stats.leased} leased
      </p>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-0 text-left text-xs">
          <caption className="sr-only">Every address the server has offered, leased, released or seen expire</caption>
          <thead>
            <tr className="border-b border-line text-ink-soft dark:border-line-dark dark:text-bone-soft">
              <th className="py-1.5 pr-2 font-medium">Client</th>
              <th className="hidden py-1.5 pr-2 font-medium md:table-cell">MAC</th>
              <th className="py-1.5 pr-2 font-medium">IP</th>
              <th className="py-1.5 pr-2 font-medium">Status</th>
              <th className="py-1.5 font-medium">Lease</th>
            </tr>
          </thead>
          <tbody>
            {state.leases.map((l) => (
              <tr key={l.ip} className={cn("border-b border-line/60 align-top dark:border-line-dark/60", highlightIp === l.ip && "bg-subject-it-soft/60 dark:bg-subject-it/10")}>
                <td className="py-1.5 pr-2 font-medium text-ink dark:text-bone">{CLIENT_META[l.clientId].name}</td>
                <td className="hidden py-1.5 pr-2 font-mono text-[11px] text-ink-soft dark:text-bone-soft md:table-cell">{CLIENT_META[l.clientId].mac}</td>
                <td className="py-1.5 pr-2 font-mono text-ink dark:text-bone">{l.ip}</td>
                <td className="py-1.5 pr-2">
                  <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold", STATUS_BADGE[l.status])}>{LEASE_STATUS_LABEL[l.status]}</span>
                </td>
                <td className="py-1.5 text-ink-soft dark:text-bone-soft">{leaseText(l, state.clock)}</td>
              </tr>
            ))}
            <tr className="align-top">
              <td className="py-1.5 pr-2 text-ink-soft dark:text-bone-soft">—</td>
              <td className="hidden py-1.5 pr-2 text-ink-soft dark:text-bone-soft md:table-cell">—</td>
              <td className="py-1.5 pr-2 font-mono text-ink dark:text-bone">{free[0] ?? "none"}</td>
              <td className="py-1.5 pr-2">
                <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold", STATUS_BADGE.available)}>Available</span>
              </td>
              <td className="py-1.5 text-ink-soft dark:text-bone-soft">{free.length > 0 ? `Next address to offer (${free.length} free)` : "No free address left"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {state.leases.length === 0 && <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">No address has been offered yet.</p>}
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Choosing which PC to work with
// ---------------------------------------------------------------------------

const DOT: Record<ClientPhase, string> = {
  unconfigured: "bg-ink/30 dark:bg-bone/30",
  discovering: "bg-amber-500",
  selecting: "bg-sky-500",
  requesting: "bg-violet-500",
  bound: "bg-emerald-500",
  renewing: "bg-violet-500",
  failed: "bg-red-500",
  expired: "bg-red-500",
  manual: "bg-violet-500",
};

export function ClientPicker({ state, value, onChange, ids = CLIENT_IDS, label = "Choose a PC" }: { state: LabState; value: ClientId; onChange: (id: ClientId) => void; ids?: ClientId[]; label?: string }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
      {ids.map((id) => {
        const c = state.clients[id];
        return (
          <button
            key={id}
            role="radio"
            aria-checked={value === id}
            onClick={() => onChange(id)}
            className={cn(
              "flex min-h-[40px] items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
              value === id ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", DOT[c.phase])} aria-hidden />
            {CLIENT_META[id].name}
            {c.config && <span className="font-mono text-[11px] font-normal opacity-80">.{lastOctet(c.config.ip)}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Small pill button used across the labs. */
export function ActionButton({ children, onClick, disabled, tone = "plain", className }: { children: ReactNode; onClick?: () => void; disabled?: boolean; tone?: "plain" | "primary" | "good" | "warn"; className?: string }) {
  const tones = {
    plain: "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone",
    primary: "border-subject-it bg-subject-it text-paper",
    good: "border-emerald-500 text-emerald-700 dark:text-emerald-300",
    warn: "border-amber-500 text-amber-800 dark:text-amber-300",
  } as const;
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cn("min-h-[44px] rounded-full border px-4 text-sm font-medium transition-colors disabled:opacity-40", tones[tone], className)}>
      {children}
    </button>
  );
}
