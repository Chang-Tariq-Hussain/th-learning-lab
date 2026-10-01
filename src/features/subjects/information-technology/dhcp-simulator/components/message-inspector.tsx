"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import { CLIENT_META, DETAIL_LEVEL_LABELS, MESSAGE_INFO, fieldVisible, type DetailLevel, type DhcpMessage, type FieldId } from "../model";

const TONE: Record<string, string> = {
  discover: "border-amber-400/70 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10",
  offer: "border-sky-400/70 bg-sky-50 dark:border-sky-500/40 dark:bg-sky-500/10",
  request: "border-violet-400/70 bg-violet-50 dark:border-violet-500/40 dark:bg-violet-500/10",
  renew: "border-violet-400/70 bg-violet-50 dark:border-violet-500/40 dark:bg-violet-500/10",
  ack: "border-emerald-400/70 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10",
  release: "border-rose-400/70 bg-rose-50 dark:border-rose-500/40 dark:bg-rose-500/10",
};

/**
 * Click a DHCP message to see its fields. Beginner shows the essentials, Intermediate adds the ports and
 * addresses it travels with, Technical adds the whole BOOTP-style header and the options.
 */
export function MessageInspector({ messages, currentIndex, level }: { messages: DhcpMessage[]; currentIndex: number; level: DetailLevel }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [field, setField] = useState<FieldId | null>(null);

  useEffect(() => {
    setPicked(null);
    setField(null);
  }, [currentIndex, messages.length]);

  if (messages.length === 0) {
    return <p className="text-sm text-ink-soft dark:text-bone-soft">DHCP messages appear here as the conversation reaches them. Start DHCP, then click any message to inspect its fields.</p>;
  }
  const idx = Math.min(picked ?? (currentIndex >= 0 ? currentIndex : 0), messages.length - 1);
  const msg = messages[idx]!;
  const info = MESSAGE_INFO[msg.kind];
  const multiClient = new Set(messages.map((m) => m.clientId)).size > 1;
  const visible = msg.fields.filter((f) => fieldVisible(f, level));
  const sel = msg.fields.find((f) => f.id === field) ?? null;
  const reached = currentIndex >= 0 ? currentIndex : messages.length - 1;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Choose a DHCP message">
        {messages.map((m, i) => (
          <button
            key={`${m.kind}-${m.clientId}-${i}`}
            onClick={() => {
              setPicked(i);
              setField(null);
            }}
            aria-pressed={i === idx}
            disabled={i > reached}
            className={cn("min-h-[36px] rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-40", i === idx ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "border-line text-ink dark:border-line-dark dark:text-bone")}
          >
            {multiClient ? `${CLIENT_META[m.clientId].name} · ` : ""}
            {MESSAGE_INFO[m.kind].label}
          </button>
        ))}
      </div>

      <div className={cn("rounded-xl border p-3", TONE[msg.kind])}>
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
          {info.label} · {info.who}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink dark:text-bone">
          <span className="font-semibold">{DETAIL_LEVEL_LABELS[level]}: </span>
          {level === "beginner" ? info.beginner : level === "intermediate" ? info.intermediate : info.technical}
        </p>
      </div>

      <div className="flex flex-col gap-1.5" role="group" aria-label={`${info.label} fields`}>
        {visible.map((f) => (
          <button
            key={f.id}
            onClick={() => setField(f.id)}
            aria-pressed={field === f.id}
            className={cn(
              "flex min-h-[44px] w-full flex-col items-start gap-0.5 rounded-lg border border-line bg-white/70 px-3 py-2 text-left transition-all dark:border-line-dark dark:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between sm:gap-3",
              field === f.id && "ring-2 ring-subject-it",
            )}
          >
            <span className="text-xs font-medium text-ink dark:text-bone">{f.label}</span>
            <span className={cn("max-w-full break-words font-mono text-xs sm:text-right", f.value.startsWith("—") ? "text-ink-soft dark:text-bone-soft" : "text-ink dark:text-bone")}>{f.value}</span>
          </button>
        ))}
      </div>

      <Panel title={sel ? sel.label : "Field explanation"}>
        {sel ? (
          <>
            <p className="text-sm text-ink dark:text-bone">{sel.explain}</p>
            {level === "technical" && sel.technical && <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">{sel.technical}</p>}
          </>
        ) : (
          <p className="text-sm text-ink-soft dark:text-bone-soft">Select any field to see what it is for.{level === "beginner" ? " Switch to Intermediate or Technical to reveal more fields." : ""}</p>
        )}
      </Panel>
    </div>
  );
}
