"use client";

import { useCallback, useId, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  DEFAULT_CONFIG,
  DETAIL_LEVELS,
  DETAIL_LEVEL_DESCRIPTIONS,
  DETAIL_LEVEL_LABELS,
  atLeast,
  createSystem,
  type AccessResult,
  type CacheConfig,
  type DetailLevel,
  type SystemState,
} from "./model";
import { COMPONENTS_LINK, DATA_FLOW_LINK, CPU_LINK, MODEL_DISCLAIMER, READS_ONLY_NOTE } from "./content";
import { AccessLab, type AccessMachine, type AccessPrefs } from "./components/access-lab";
import { AddressLab } from "./components/address-lab";
import { CmeStyles } from "./components/cme-styles";
import { CoherenceLab } from "./components/coherence-lab";
import { CpuLab } from "./components/cpu-lab";
import { EvictionLab } from "./components/eviction-lab";
import { ExperimentsLab } from "./components/experiments-lab";
import { HierarchyLab } from "./components/hierarchy-lab";
import { LocalityLab } from "./components/locality-lab";
import { MappingLab } from "./components/mapping-lab";
import { PerformanceLab } from "./components/performance-lab";
import { ReplacementLab } from "./components/replacement-lab";

type TabId =
  | "hierarchy"
  | "access"
  | "experiments"
  | "locality"
  | "eviction"
  | "performance"
  | "cpu"
  | "replacement"
  | "mapping"
  | "address"
  | "coherence";

const TABS: { id: TabId; label: string; minLevel: DetailLevel }[] = [
  { id: "hierarchy", label: "Memory Hierarchy", minLevel: "beginner" },
  { id: "access", label: "Access Lab", minLevel: "beginner" },
  { id: "experiments", label: "Experiments", minLevel: "beginner" },
  { id: "locality", label: "Locality & Lines", minLevel: "intermediate" },
  { id: "eviction", label: "Eviction", minLevel: "intermediate" },
  { id: "performance", label: "Performance Lab", minLevel: "intermediate" },
  { id: "cpu", label: "CPU & Caches", minLevel: "intermediate" },
  { id: "replacement", label: "Replacement", minLevel: "technical" },
  { id: "mapping", label: "Mapping", minLevel: "technical" },
  { id: "address", label: "Tag / Index / Offset", minLevel: "technical" },
  { id: "coherence", label: "Coherence", minLevel: "technical" },
];

const DEFAULT_PREFS: AccessPrefs = { l1Lines: 4, lineSize: 4, mapping: "full", policy: "lru" };

/**
 * The Access Lab is staged by detail level: Beginner is one cache of
 * 1-word entries in front of RAM; Intermediate adds L1/L2/L3 and cache
 * lines; Technical adds mapping and replacement policy.
 */
function accessConfig(level: DetailLevel, prefs: AccessPrefs): CacheConfig {
  return {
    ...DEFAULT_CONFIG,
    levelCount: level === "beginner" ? 1 : 3,
    l1Lines: prefs.l1Lines,
    lineSize: atLeast(level, "intermediate") ? prefs.lineSize : 1,
    mapping: atLeast(level, "technical") ? prefs.mapping : "full",
    policy: atLeast(level, "technical") ? prefs.policy : "lru",
  };
}

const freshMachine = (config: CacheConfig): AccessMachine => ({ system: createSystem(config), history: [] });

export function CacheMemoryExplorer() {
  // The learning experience mounts this simulation several times on one
  // page (Predict, Explore, Challenge), so every DOM id must be unique
  // per instance or aria-controls / labelledby / focus would cross wires.
  const uid = useId();
  const tabDomId = (id: TabId) => `${uid}-tab-${id}`;
  const panelDomId = (id: TabId) => `${uid}-panel-${id}`;
  const [level, setLevel] = useState<DetailLevel>("beginner");
  const [tabRaw, setTab] = useState<TabId>("hierarchy");
  const [prefs, setPrefs] = useState<AccessPrefs>(DEFAULT_PREFS);
  const [machine, setMachine] = useState<AccessMachine>(() => freshMachine(accessConfig("beginner", DEFAULT_PREFS)));

  const config = machine.system.config;
  const visibleTabs = TABS.filter((t) => atLeast(level, t.minLevel));
  const tab: TabId = visibleTabs.some((t) => t.id === tabRaw) ? tabRaw : "hierarchy";

  const changeLevel = useCallback(
    (next: DetailLevel) => {
      setLevel(next);
      setMachine(freshMachine(accessConfig(next, prefs)));
    },
    [prefs],
  );

  const updatePrefs = useCallback(
    (patch: Partial<AccessPrefs>) => {
      const next = { ...prefs, ...patch };
      setPrefs(next);
      setMachine(freshMachine(accessConfig(level, next)));
    },
    [prefs, level],
  );

  const commitAccess = useCallback((next: SystemState, result: AccessResult) => {
    setMachine((prev) => ({ system: next, history: [...prev.history, result] }));
  }, []);

  const resetMachine = useCallback(() => setMachine(freshMachine(accessConfig(level, prefs))), [level, prefs]);

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const last = visibleTabs.length - 1;
    const nextIndex = e.key === "Home" ? 0 : e.key === "End" ? last : e.key === "ArrowRight" ? (index + 1) % (last + 1) : (index - 1 + last + 1) % (last + 1);
    const target = visibleTabs[nextIndex];
    if (target) {
      setTab(target.id);
      document.getElementById(tabDomId(target.id))?.focus();
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <CmeStyles />

      <header className="flex flex-col gap-3 rounded-card border border-line p-4 dark:border-line-dark">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-800 dark:text-amber-300">Cache Memory Laboratory</p>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-ink-soft sm:text-sm dark:text-bone-soft">{MODEL_DISCLAIMER}</p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Detail level</span>
            <div role="radiogroup" aria-label="Detail level" className="flex gap-1 rounded-full border border-line p-1 dark:border-line-dark">
              {DETAIL_LEVELS.map((l) => {
                const selected = l === level;
                return (
                  <button
                    key={l}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => changeLevel(l)}
                    className={cn(
                      "min-h-[40px] rounded-full px-3 text-xs font-medium transition-colors",
                      selected ? "bg-subject-it text-white" : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone",
                    )}
                  >
                    {DETAIL_LEVEL_LABELS[l]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <p className="text-xs text-ink-soft dark:text-bone-soft">
          <span className="font-medium text-ink dark:text-bone">{DETAIL_LEVEL_LABELS[level]}:</span> {DETAIL_LEVEL_DESCRIPTIONS[level]}
        </p>
      </header>

      <div role="tablist" aria-label="Cache Memory Laboratory sections" className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible">
        {visibleTabs.map((t, i) => {
          const selected = t.id === tab;
          return (
            <button
              key={t.id}
              id={tabDomId(t.id)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelDomId(t.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(t.id)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              className={cn(
                "min-h-[44px] shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                selected
                  ? "border-subject-it bg-subject-it-soft text-amber-800 dark:text-amber-300 dark:bg-subject-it/20"
                  : "border-line text-ink-soft hover:border-ink/30 hover:text-ink dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div id={panelDomId(tab)} role="tabpanel" aria-labelledby={tabDomId(tab)} className="min-w-0">
        {tab === "hierarchy" ? <HierarchyLab level={level} /> : null}
        {tab === "access" ? (
          <AccessLab level={level} config={config} machine={machine} prefs={prefs} onPrefsChange={updatePrefs} onAccess={commitAccess} onReset={resetMachine} />
        ) : null}
        {tab === "experiments" ? <ExperimentsLab level={level} onRequireLevel={changeLevel} /> : null}
        {tab === "locality" ? <LocalityLab /> : null}
        {tab === "eviction" ? <EvictionLab level={level} /> : null}
        {tab === "performance" ? <PerformanceLab level={level} /> : null}
        {tab === "cpu" ? <CpuLab key={String(atLeast(level, "technical"))} split={atLeast(level, "technical")} /> : null}
        {tab === "replacement" ? <ReplacementLab /> : null}
        {tab === "mapping" ? <MappingLab /> : null}
        {tab === "address" ? <AddressLab /> : null}
        {tab === "coherence" ? <CoherenceLab /> : null}
      </div>

      <footer className="rounded-card border border-line p-4 text-sm dark:border-line-dark">
        {/* Collapsed: the guided lesson mounts this component several times per page, so open links here would repeat. */}
        <details>
          <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Related labs</summary>
          <ul className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            {[COMPONENTS_LINK, CPU_LINK, DATA_FLOW_LINK].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-medium text-amber-800 dark:text-amber-300 underline underline-offset-2">
                  {link.label}
                </Link>
                <p className="mt-0.5 text-xs text-ink-soft dark:text-bone-soft">{link.description}</p>
              </li>
            ))}
          </ul>
        </details>
        <p className="mt-3 text-[11px] text-ink-soft dark:text-bone-soft">{READS_ONLY_NOTE}</p>
      </footer>
    </div>
  );
}
