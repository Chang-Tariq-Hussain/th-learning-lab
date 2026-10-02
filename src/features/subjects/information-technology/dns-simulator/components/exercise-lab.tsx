"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import { EXERCISE_DOMAINS, outcomeFor } from "../model";

function ipOf(name: string): string {
  const o = outcomeFor(name);
  return o.kind === "answer" ? o.ip : "?";
}

function Arrow({ lit }: { lit: boolean }) {
  return (
    <div className="flex flex-col items-center py-0.5" aria-hidden>
      <span className={cn("h-5 w-0.5 rounded transition-colors duration-500 motion-reduce:transition-none", lit ? "bg-subject-it" : "bg-ink/20 dark:bg-bone/20")} />
      <span className={cn("-mt-1 text-sm leading-none transition-colors duration-500 motion-reduce:transition-none", lit ? "text-subject-it" : "text-ink/30 dark:text-bone/30")}>▼</span>
    </div>
  );
}

/** A small exercise: pick a name, resolve it, and watch Domain name → DNS lookup → IP address. Independent of the main lab. */
export function ExerciseLab({ onWatchFull }: { onWatchFull: (name: string) => void }) {
  const [selected, setSelected] = useState<string>(EXERCISE_DOMAINS[0]);
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [found, setFound] = useState<Record<string, string>>({});

  useEffect(() => {
    if (stage !== 1) return;
    const t = setTimeout(() => {
      setStage(2);
      setFound((f) => ({ ...f, [selected]: ipOf(selected) }));
    }, 1100);
    return () => clearTimeout(t);
  }, [stage, selected]);

  const btn = "min-h-[44px] rounded-full border px-4 text-sm font-medium transition-colors disabled:opacity-40";
  const ip = stage === 2 ? ipOf(selected) : "?";

  return (
    <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-ink-soft dark:text-bone-soft">Pick a name, then resolve it. People use names; the network needs addresses.</p>
        <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Domain names">
          {EXERCISE_DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => {
                setSelected(d);
                setStage(0);
              }}
              aria-pressed={selected === d}
              className={cn("min-h-[44px] rounded-card border px-3 py-2 text-left transition-colors", selected === d ? "border-subject-it bg-subject-it-soft/60 dark:bg-subject-it/15" : "border-line hover:border-ink/30 dark:border-line-dark dark:hover:border-bone/30")}
            >
              <span className="block break-all font-mono text-sm font-semibold text-ink dark:text-bone">{d}</span>
              <span className="block font-mono text-xs text-ink-soft dark:text-bone-soft">{found[d] ? `✓ ${found[d]}` : "not looked up yet"}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setStage(1)} disabled={stage === 1} className={cn(btn, "border-subject-it bg-subject-it text-paper")}>
            {stage === 1 ? "Looking up…" : stage === 2 ? "Resolve again" : "Resolve"}
          </button>
          <button
            onClick={() => {
              setStage(0);
              setFound({});
            }}
            className={cn(btn, "border-line text-ink dark:border-line-dark dark:text-bone")}
          >
            Reset
          </button>
          <button onClick={() => onWatchFull(selected)} className={cn(btn, "border-line text-ink dark:border-line-dark dark:text-bone")}>
            Watch the full lookup →
          </button>
        </div>
      </div>

      <Panel title="Name → address">
        <div className="mx-auto flex max-w-sm flex-col items-stretch" aria-live="polite">
          <div className="rounded-card border border-line bg-white p-3 text-center dark:border-line-dark dark:bg-white/[0.04]">
            <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Domain name</p>
            <p className="break-all font-mono text-base font-semibold text-ink dark:text-bone">{selected}</p>
          </div>
          <Arrow lit={stage >= 1} />
          <div className={cn("rounded-card border p-3 text-center transition-colors duration-500 motion-reduce:transition-none", stage === 1 ? "animate-pulse border-slate-500 bg-slate-100 motion-reduce:animate-none dark:bg-slate-500/10" : stage === 2 ? "border-subject-it bg-subject-it-soft/50 dark:bg-subject-it/10" : "border-line bg-white dark:border-line-dark dark:bg-white/[0.04]")}>
            <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">DNS lookup</p>
            <p className="text-sm text-ink dark:text-bone">{stage === 0 ? "waiting" : stage === 1 ? "the resolver finds the A record…" : "A record found"}</p>
          </div>
          <Arrow lit={stage >= 2} />
          <div className={cn("rounded-card border p-3 text-center transition-colors duration-500 motion-reduce:transition-none", stage === 2 ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" : "border-line bg-white dark:border-line-dark dark:bg-white/[0.04]")}>
            <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">IP address</p>
            <p className={cn("font-mono text-xl font-bold", stage === 2 ? "text-emerald-700 dark:text-emerald-300" : "text-ink-soft dark:text-bone-soft")}>{ip}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-soft dark:text-bone-soft">
          Notice that mail.example.com and shop.example.com sit under the same domain but have different addresses: each name has its own record. DNS translates human-friendly names into network addresses.
        </p>
      </Panel>
    </div>
  );
}
