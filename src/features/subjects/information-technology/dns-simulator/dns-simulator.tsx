"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CacheLab } from "./components/cache-lab";
import { ExerciseLab } from "./components/exercise-lab";
import { HierarchyLab } from "./components/hierarchy-lab";
import { InfoPanel } from "./components/info-panel";
import { LevelSwitch } from "./components/level-switch";
import { ModesLab } from "./components/modes-lab";
import { RecordsLab } from "./components/records-lab";
import { ResolveLab } from "./components/resolve-lab";
import { ScenariosLab } from "./components/scenarios-lab";
import { useDnsLab } from "./hooks/use-dns-lab";
import type { DetailLevel } from "./model";

type TabId = "resolve" | "hierarchy" | "records" | "cache" | "modes" | "scenarios" | "exercise";

const TABS: { id: TabId; label: string; blurb: string }[] = [
  { id: "resolve", label: "Resolve a Domain", blurb: "Type a name, press Resolve Domain and watch the query travel. Pause, step through it, or restart. Resolve the same name twice to see the cache answer." },
  { id: "hierarchy", label: "DNS Hierarchy", blurb: "Root, top-level domains, domains and hosts. Tap each level to see what it does and who answers there." },
  { id: "records", label: "DNS Records", blurb: "A, AAAA, CNAME, MX, NS and TXT: what each record type maps, with examples from a sample zone." },
  { id: "cache", label: "Cache & TTL", blurb: "Compare a cache HIT with a MISS, then watch a saved answer's TTL count down until it expires." },
  { id: "modes", label: "Recursive vs Iterative", blurb: "Two ways of finding an answer: have a resolver do all the work, or follow the referrals yourself." },
  { id: "scenarios", label: "Scenarios", blurb: "Six situations: it works, cache hit, cache miss, no response, unknown domain and an expired TTL." },
  { id: "exercise", label: "Names → Addresses", blurb: "Pick a few domain names and see how DNS turns each one into an IP address." },
];

/**
 * "DNS Simulator": the ninth simulation in the Networking branch, standalone version. Same tabbed 2D shell as the earlier
 * ones. The resolver's cache, the clock, the current lookup and the event log live in one hook so they survive tab switches.
 *
 * Out of scope on purpose: DNSSEC, DNS over HTTPS/TLS, reverse lookups, a real DNS server, zone transfers, and live
 * Internet lookups. Every name, zone and address here is an offline teaching example.
 */
export function DnsSimulator() {
  const [level, setLevel] = useState<DetailLevel>("beginner");
  const [tab, setTab] = useState<TabId>("resolve");
  const lab = useDnsLab();
  const active = TABS.find((t) => t.id === tab) ?? TABS[0]!;

  function watchFull(name: string) {
    lab.setDomain(name);
    lab.resolve(name, "auto");
    setTab("resolve");
  }

  return (
    <div className="flex flex-col gap-6">
      <LevelSwitch level={level} onChange={setLevel} />
      <InfoPanel level={level} onChange={setLevel} />

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="DNS Simulator mode">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active.id === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "min-h-[40px] rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active.id === t.id ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink-soft dark:text-bone-soft">{active.blurb}</p>

      <div className="min-w-0 rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {active.id === "resolve" && <ResolveLab lab={lab} level={level} onGoToCache={() => setTab("cache")} />}
        {active.id === "hierarchy" && <HierarchyLab level={level} onGoToResolve={() => setTab("resolve")} />}
        {active.id === "records" && <RecordsLab level={level} />}
        {active.id === "cache" && <CacheLab lab={lab} level={level} onGoToResolve={() => setTab("resolve")} />}
        {active.id === "modes" && <ModesLab />}
        {active.id === "scenarios" && <ScenariosLab lab={lab} level={level} />}
        {active.id === "exercise" && <ExerciseLab onWatchFull={watchFull} />}
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">
        Ordinary DNS queries commonly use UDP port 53; TCP is used when a response is too large for UDP and for zone transfers. This lab is a simplified, offline model: names, servers and addresses are examples, nothing is looked up on the real Internet, and not every real lookup visits the root, TLD and authoritative servers, because caches often let the resolver skip steps. DNSSEC, encrypted DNS and reverse lookups are left out on purpose.
      </p>
    </div>
  );
}
