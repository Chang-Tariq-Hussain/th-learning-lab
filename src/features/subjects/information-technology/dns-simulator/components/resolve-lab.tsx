"use client";

import type { DnsLab } from "../hooks/use-dns-lab";
import type { DetailLevel } from "../model";
import { LookupForm } from "./parts";
import { RunSurface } from "./run-surface";

/** "Resolve Domain": type a name, watch the query travel, then resolve it again to see the cache answer. */
export function ResolveLab({ lab, level, onGoToCache }: { lab: DnsLab; level: DetailLevel; onGoToCache: () => void }) {
  return (
    <RunSurface
      lab={lab}
      level={level}
      onGoToCache={onGoToCache}
      header={
        <div className="flex flex-col gap-2">
          <LookupForm value={lab.domain} onChange={lab.setDomain} onResolve={(mode) => lab.resolve(lab.domain, mode)} />
          <p className="text-xs text-ink-soft dark:text-bone-soft">
            Resolve a name once, then press Resolve Domain again: the second lookup is answered from the resolver&apos;s cache. Then try a different name under example.com and watch some steps disappear.
          </p>
        </div>
      }
    />
  );
}
