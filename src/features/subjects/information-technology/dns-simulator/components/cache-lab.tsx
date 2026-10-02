"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Callout, Panel } from "../../osi-model-explorer/components/ui";
import { TTL_TICK_SECONDS, type DnsLab } from "../hooks/use-dns-lab";
import { isFresh, lookupCostExamples, remaining, type DetailLevel } from "../model";
import { CachePanel, StateChip } from "./parts";

const small = "min-h-[44px] rounded-full border px-4 text-sm font-medium transition-colors disabled:opacity-40";
const plain = "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone";

/** TTL ladder: 300 → 240 → 180 → 120 → 60 → 0. The current rung is lit, passed rungs fade, and 0 means expired. */
function TtlLadder({ ttl, left }: { ttl: number; left: number }) {
  const rungs = Array.from({ length: Math.floor(ttl / TTL_TICK_SECONDS) + 1 }, (_, i) => ttl - i * TTL_TICK_SECONDS);
  const current = [...rungs].reverse().find((v) => v >= left) ?? 0;
  return (
    <ol className="flex flex-wrap items-center gap-1.5" aria-label="TTL countdown">
      {rungs.map((v, i) => (
        <li key={v} className="flex items-center gap-1.5">
          <span
            aria-current={v === current ? "step" : undefined}
            className={cn(
              "min-w-[44px] rounded-lg border px-2 py-1 text-center font-mono text-sm font-semibold transition-colors",
              v === current && v === 0 && "border-red-500 bg-red-500 text-white",
              v === current && v !== 0 && "border-subject-it bg-subject-it text-paper",
              v > current && "border-line text-ink-soft opacity-50 dark:border-line-dark dark:text-bone-soft",
              v < current && "border-line text-ink dark:border-line-dark dark:text-bone",
            )}
          >
            {v}
          </span>
          {i < rungs.length - 1 && (
            <span className="text-ink-soft/60 dark:text-bone-soft/60" aria-hidden>
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

/** Cache HIT vs MISS, and the TTL that decides how long a cached answer may be used. */
export function CacheLab({ lab, level, onGoToResolve }: { lab: DnsLab; level: DetailLevel; onGoToResolve: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const costs = useMemo(() => lookupCostExamples(), []);
  const entries = lab.cache.answers;
  // Default to the most recently saved fresh answer (else the most recent one), so the panel follows what was just resolved.
  const latest = [...entries].reverse().find((a) => isFresh(a, lab.now)) ?? entries[entries.length - 1] ?? null;
  const entry = entries.find((a) => a.name === picked) ?? latest;
  const left = entry ? remaining(entry, lab.now) : 0;
  const fresh = entry ? isFresh(entry, lab.now) : false;
  const frac = entry && entry.ttl > 0 ? left / entry.ttl : 0;
  const anyFresh = entries.some((a) => isFresh(a, lab.now));

  function resolveAgain(name: string) {
    lab.setDomain(name);
    lab.resolve(name, "auto");
    onGoToResolve();
  }

  const tone = { HIT: "border-teal-500/60 bg-teal-50 dark:border-teal-500/40 dark:bg-teal-500/10", PARTIAL: "border-amber-400/60 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10", MISS: "border-amber-500/70 bg-amber-50 dark:border-amber-500/50 dark:bg-amber-500/10" };
  const bodies = [
    { key: "HIT" as const, kind: "hit" as const, text: "The resolver already has the answer saved, so it replies from memory. No other server is contacted." },
    { key: "PARTIAL" as const, kind: "miss" as const, text: "The answer isn't saved, but the resolver remembers which servers are in charge, so it skips the root and TLD and asks the authoritative server directly." },
    { key: "MISS" as const, kind: "miss" as const, text: "Nothing useful is saved, so the resolver walks the hierarchy: root, then the TLD server, then the authoritative server." },
  ];

  return (
    <div className="flex flex-col gap-5">
      <Panel title="Cache HIT vs cache MISS">
        <div className="grid gap-3 sm:grid-cols-3">
          {bodies.map((b, i) => {
            const c = costs[i]!;
            return (
              <div key={b.key} className={cn("rounded-card border p-3", tone[b.key])}>
                <StateChip kind={b.kind} label={c.label} />
                <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{b.text}</p>
                <dl className="mt-2 grid grid-cols-[auto,1fr] gap-x-3 gap-y-0.5 text-sm">
                  <dt className="text-ink-soft dark:text-bone-soft">DNS messages</dt>
                  <dd className="font-mono font-semibold text-ink dark:text-bone">{c.result.messages}</dd>
                  <dt className="text-ink-soft dark:text-bone-soft">Servers asked</dt>
                  <dd className="font-mono font-semibold text-ink dark:text-bone">{c.result.contacted.length}</dd>
                </dl>
              </div>
            );
          })}
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-soft dark:text-bone-soft">
          <li>
            <span className="font-semibold text-ink dark:text-bone">Faster:</span> fewer round trips before the website can even start loading.
          </li>
          <li>
            <span className="font-semibold text-ink dark:text-bone">Less repeated work:</span> the root, TLD and authoritative servers aren&apos;t asked the same question again and again.
          </li>
          <li>
            <span className="font-semibold text-ink dark:text-bone">The trade-off:</span> a cached answer can be out of date. The TTL limits for how long.
          </li>
        </ul>
        {level === "technical" && <p className="mt-2 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">Message counts here follow this lab&apos;s simplified model: one query and one reply per server asked, plus the client&apos;s query and the resolver&apos;s reply. Real lookups can add retries, IPv6 (AAAA) queries and extra steps.</p>}
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-3">
          <CachePanel cache={lab.cache} now={lab.now} selected={entry?.name ?? null} onSelect={setPicked} onFlush={lab.flushCache} />
          {entries.length === 0 && (
            <button onClick={() => resolveAgain("www.example.com")} className={cn(small, "self-start border-subject-it bg-subject-it text-paper")}>
              Resolve www.example.com to fill the cache
            </button>
          )}
        </div>

        <Panel title="TTL: how long an answer may be kept">
          {!entry ? (
            <p className="text-sm text-ink-soft dark:text-bone-soft">Every DNS record comes with a TTL (time to live) in seconds. Once an answer is in the cache, you can watch its TTL count down here.</p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="break-all font-mono text-sm font-semibold text-ink dark:text-bone">{entry.name}</p>
                <p className={cn("font-mono text-2xl font-bold", fresh ? "text-ink dark:text-bone" : "text-red-600 dark:text-red-300")}>TTL: {left} s</p>
              </div>
              <TtlLadder ttl={entry.ttl} left={left} />
              <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-bone/10" aria-hidden>
                <div className={cn("h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none", frac > 0.5 ? "bg-emerald-500" : frac > 0.2 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${Math.round(frac * 100)}%` }} />
              </div>
              {fresh ? (
                <Callout tone="good" title="Fresh">
                  The resolver may still use this saved answer, so a lookup for {entry.name} is a cache HIT.
                </Callout>
              ) : (
                <Callout tone="bad" title="Expired">
                  The TTL has reached zero, so this record can&apos;t be used any more. The next lookup for {entry.name} will be a cache MISS and must ask a DNS server again.
                </Callout>
              )}
              <div className="flex flex-wrap gap-2">
                <button onClick={lab.toggleTtlPlay} disabled={!anyFresh && !lab.ttlPlaying} className={cn(small, "border-subject-it bg-subject-it text-paper")}>
                  {lab.ttlPlaying ? "⏸ Pause" : "▶ Start countdown"}
                </button>
                <button onClick={() => lab.advanceTime(TTL_TICK_SECONDS)} disabled={!fresh} className={cn(small, plain)}>
                  +{TTL_TICK_SECONDS} s
                </button>
                <button onClick={() => lab.skipToExpiry(entry.name)} disabled={!fresh} className={cn(small, plain)}>
                  Skip to expiry
                </button>
                <button onClick={() => resolveAgain(entry.name)} className={cn(small, plain)}>
                  Re-resolve
                </button>
              </div>
              <p className="text-xs text-ink-soft dark:text-bone-soft">For teaching, the countdown is sped up: one second here is one minute of lab time. Real TTLs run in real time, from seconds to days.</p>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
