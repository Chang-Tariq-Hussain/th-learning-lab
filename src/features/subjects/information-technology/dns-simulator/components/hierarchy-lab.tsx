"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import { HIERARCHY, type DetailLevel, type HierarchyId } from "../model";

const TLD_PILLS: { id: string; label: string; note: string }[] = [
  { id: "com", label: ".com", note: "Started for commercial sites; today anyone can register a .com name." },
  { id: "org", label: ".org", note: "Started for non-commercial organizations; registration is open today." },
  { id: "net", label: ".net", note: "Started for network providers; registration is open today." },
  { id: "edu", label: ".edu", note: "Restricted to qualifying educational institutions." },
  { id: "cc", label: "Country codes", note: "Two-letter codes for countries and territories, such as .uk, .pk and .de." },
];

const base = "min-h-[44px] rounded-xl border px-3 py-2 text-left text-sm font-medium transition-colors";
const on = "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20";
const off = "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40";

/** Clickable DNS tree plus the same name read right-to-left. Every level is a real button, so touch works. */
export function HierarchyLab({ level, onGoToResolve }: { level: DetailLevel; onGoToResolve: () => void }) {
  const [sel, setSel] = useState<HierarchyId>("root");
  const [tld, setTld] = useState("com");
  const info = HIERARCHY.find((h) => h.id === sel) ?? HIERARCHY[0]!;
  const tldInfo = TLD_PILLS.find((t) => t.id === tld) ?? TLD_PILLS[0]!;

  const chips: { id: HierarchyId; text: string; hint: string }[] = [
    { id: "host", text: "www", hint: "host" },
    { id: "domain", text: "example", hint: "domain" },
    { id: "tld", text: "com", hint: "TLD" },
    { id: "root", text: ".", hint: "root" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <Panel title="Read a name from right to left">
        <div className="flex flex-wrap items-end gap-1" role="group" aria-label="Parts of www.example.com">
          {chips.map((c, i) => (
            <div key={c.id} className="flex items-end gap-1">
              <button onClick={() => setSel(c.id)} aria-pressed={sel === c.id} className="flex min-h-[44px] flex-col items-center justify-center gap-0.5">
                <span className={cn("rounded-lg border px-3 py-1.5 font-mono text-lg font-semibold transition-colors", sel === c.id ? on : off)}>{c.text}</span>
                <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{c.hint}</span>
              </button>
              {i < chips.length - 1 && <span className="pb-6 font-mono text-lg text-ink-soft dark:text-bone-soft">{i < 2 ? "." : "·"}</span>}
            </div>
          ))}
        </div>
        <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">
          The full name is really <span className="font-mono">www.example.com.</span> The final dot is the root. A resolver walks the tree from the root down: root → com → example → www.
        </p>
      </Panel>

      <div className="grid gap-5 md:grid-cols-2 md:items-start">
        <Panel title="The DNS tree: tap a level">
          <div className="flex flex-col gap-2">
            <button onClick={() => setSel("root")} aria-pressed={sel === "root"} className={cn(base, sel === "root" ? on : off)}>
              <span className="font-mono">.</span> Root
              <span className="block text-xs font-normal text-ink-soft dark:text-bone-soft">the top of the hierarchy</span>
            </button>
            <div className="ml-3 flex flex-col gap-2 border-l-2 border-line pl-3 dark:border-line-dark">
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Top-level domains">
                {TLD_PILLS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTld(t.id);
                      setSel("tld");
                    }}
                    aria-pressed={sel === "tld" && tld === t.id}
                    className={cn("min-h-[44px] rounded-xl border px-3 py-2 font-mono text-sm transition-colors", sel === "tld" && tld === t.id ? on : off)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="ml-3 flex flex-col gap-2 border-l-2 border-line pl-3 dark:border-line-dark">
                <button onClick={() => setSel("domain")} aria-pressed={sel === "domain"} className={cn(base, sel === "domain" ? on : off)}>
                  <span className="font-mono">example.com</span>
                  <span className="block text-xs font-normal text-ink-soft dark:text-bone-soft">a domain with its own authoritative servers</span>
                </button>
                <div className="ml-3 border-l-2 border-line pl-3 dark:border-line-dark">
                  <button onClick={() => setSel("host")} aria-pressed={sel === "host"} className={cn(base, "w-full", sel === "host" ? on : off)}>
                    <span className="font-mono">www.example.com</span>
                    <span className="block text-xs font-normal text-ink-soft dark:text-bone-soft">a host name inside the domain</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title={info.who}>
          <p className="font-display text-lg font-medium text-ink dark:text-bone">{info.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{info.beginner}</p>
          {sel === "tld" && (
            <p className="mt-2 rounded-lg bg-ink/[0.04] p-2.5 text-sm text-ink-soft dark:bg-bone/[0.06] dark:text-bone-soft">
              <span className="font-mono font-semibold text-ink dark:text-bone">{tldInfo.label}: </span>
              {tldInfo.note}
            </p>
          )}
          {level !== "beginner" && <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{info.intermediate}</p>}
          {level === "technical" && <p className="mt-2 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{info.technical}</p>}
          <ul className="mt-3 space-y-0.5 font-mono text-xs text-ink dark:text-bone">
            {info.examples.map((e) => (
              <li key={e} className="break-words">
                • {e}
              </li>
            ))}
          </ul>
          <button onClick={onGoToResolve} className="mt-3 min-h-[44px] text-sm font-medium text-subject-it underline-offset-2 hover:underline">
            Watch a lookup walk down the tree →
          </button>
        </Panel>
      </div>
    </div>
  );
}
