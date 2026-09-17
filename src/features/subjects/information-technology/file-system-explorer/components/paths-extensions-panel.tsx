"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { EXTENSION_DISCLAIMER, EXTENSION_REFERENCE, PATH_STYLE_EXAMPLES, type PathStyle } from "../model";

export function PathsExtensionsPanel() {
  const [style, setStyle] = useState<PathStyle>("unix");
  const example = PATH_STYLE_EXAMPLES[style];
  const segments = style === "unix" ? example.split("/").filter(Boolean) : example.replace("C:\\", "").split("\\");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium text-ink dark:text-bone">Path syntax</p>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Path style">
          {(["unix", "windows"] as PathStyle[]).map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={style === s}
              onClick={() => setStyle(s)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium capitalize transition-colors",
                style === s
                  ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                  : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
              )}
            >
              {s === "unix" ? "Unix-like" : "Windows-style"}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-card border border-line bg-ink/[0.02] p-4 dark:border-line-dark dark:bg-bone/[0.03]">
          <p className="mb-3 break-all font-mono text-sm text-ink dark:text-bone">{example}</p>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {style === "unix" && <span className="rounded-full bg-subject-it/10 px-2 py-1 font-mono text-subject-it">/ (root)</span>}
            {segments.map((seg, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className={cn(
                  "rounded-full px-2 py-1 font-mono",
                  i === segments.length - 1 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-ink/5 text-ink-soft dark:bg-bone/10 dark:text-bone-soft",
                )}>
                  {seg}
                </span>
                {i < segments.length - 1 && <span className="text-ink-soft dark:text-bone-soft">{style === "unix" ? "/" : "\\"}</span>}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-soft dark:text-bone-soft">
            {style === "unix" ? "Root" : "Drive letter"} → directory → subdirectory → filename, with the extension (.txt) at the end identifying the file&apos;s type.
          </p>
        </div>
        <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">
          The same file could be described with either syntax — path syntax is a convention of the operating system, not a property of the file itself.
        </p>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink dark:text-bone">File extensions</p>
        <div className="overflow-x-auto rounded-card border border-line dark:border-line-dark">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="border-b border-line bg-ink/[0.02] text-xs uppercase tracking-wide text-ink-soft dark:border-line-dark dark:bg-bone/[0.03] dark:text-bone-soft">
              <tr>
                <th className="px-3 py-2 font-medium">Extension</th>
                <th className="px-3 py-2 font-medium">Typical content</th>
                <th className="px-3 py-2 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {EXTENSION_REFERENCE.map((e) => (
                <tr key={e.extension} className="border-b border-line last:border-0 dark:border-line-dark">
                  <td className="px-3 py-2 font-mono text-ink dark:text-bone">{e.extension}</td>
                  <td className="px-3 py-2 text-ink dark:text-bone">{e.typicalContent}</td>
                  <td className="px-3 py-2 text-ink-soft dark:text-bone-soft">{e.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">{EXTENSION_DISCLAIMER}</p>
      </div>
    </div>
  );
}
