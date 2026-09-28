"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLE_EXPLANATION, ROLE_LABEL, addressRole, analyze, bitAt, classifyIPv4, formatIPv4, ipBinary, toOctets } from "../model";

// ---------------------------------------------------------------------------
// Bits
// ---------------------------------------------------------------------------

const WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];

function octetTag(octetIndex: number, prefix: number): string {
  const start = octetIndex * 8;
  const netBitsHere = Math.max(0, Math.min(8, prefix - start));
  if (netBitsHere === 8) return "network";
  if (netBitsHere === 0) return "host";
  return `${netBitsHere} network + ${8 - netBitsHere} host`;
}

interface OctetBitsProps {
  value: number;
  octetIndex: number;
  /** When set, bits are styled as network (filled) or host (dashed outline). */
  prefix?: number;
  onToggle?: (bitIndex: number) => void;
  showWeights?: boolean;
  size?: "sm" | "lg";
  highlightBits?: (bitIndex: number) => boolean;
}

/** One octet of bits. Network bits are solid; host bits are hollow with a dashed outline; the boundary is a thick bar. */
export function OctetBits({ value, octetIndex, prefix, onToggle, showWeights, size = "sm", highlightBits }: OctetBitsProps) {
  const octet = toOctets(value)[octetIndex]!;
  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      {showWeights && (
        <div className="flex gap-[3px]" aria-hidden="true">
          {WEIGHTS.map((w) => (
            <span key={w} className={cn("text-center font-mono text-[10px] text-ink-soft dark:text-bone-soft", size === "lg" ? "w-8" : "w-[18px] sm:w-6")}>
              {w}
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-[3px]" role="group" aria-label={`Octet ${octetIndex + 1}: ${octet}`}>
        {WEIGHTS.map((w, b) => {
          const bitIndex = octetIndex * 8 + b;
          const bit = bitAt(value, bitIndex);
          const isNet = prefix === undefined ? undefined : bitIndex < prefix;
          const boundaryLeft = prefix !== undefined && prefix < 32 && bitIndex === prefix;
          const boundaryRight = prefix === 32 && bitIndex === 31;
          const cls = cn(
            "flex items-center justify-center rounded-[4px] border font-mono transition-colors",
            size === "lg" ? "h-10 w-8 text-base" : "h-8 w-[18px] text-xs sm:w-6 sm:text-sm",
            isNet === undefined && "border-line bg-transparent text-ink dark:border-line-dark dark:text-bone",
            isNet === true && "border-subject-it bg-subject-it font-semibold text-paper",
            isNet === false && "border-dashed border-ink/50 bg-transparent text-ink dark:border-bone/50 dark:text-bone",
            bit === 1 && isNet === undefined && "bg-subject-it-soft font-semibold dark:bg-subject-it/25",
            boundaryLeft && "border-l-4 border-solid border-l-amber-500",
            boundaryRight && "border-r-4 border-solid border-r-amber-500",
            highlightBits?.(bitIndex) && "ring-2 ring-amber-500",
          );
          if (onToggle) {
            return (
              <button
                key={b}
                type="button"
                onClick={() => onToggle(bitIndex)}
                className={cn(cls, "cursor-pointer hover:border-subject-it")}
                aria-label={`Bit ${b + 1} of octet ${octetIndex + 1}, weight ${w}, currently ${bit}. Click to toggle.`}
                aria-pressed={bit === 1}
              >
                {bit}
              </button>
            );
          }
          return (
            <span key={b} className={cls}>
              {bit}
            </span>
          );
        })}
      </div>
      {prefix !== undefined && <span className="font-mono text-[10px] text-ink-soft dark:text-bone-soft">{octetTag(octetIndex, prefix)}</span>}
    </div>
  );
}

/** All 32 bits as four octets that wrap on narrow screens. */
export function BinaryAddress({ value, prefix, label, highlightBits }: { value: number; prefix?: number; label?: string; highlightBits?: (bitIndex: number) => boolean }) {
  return (
    <div className="min-w-0">
      {label && <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{label}</p>}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:flex sm:flex-wrap sm:gap-x-3">
        {[0, 1, 2, 3].map((i) => (
          <OctetBits key={i} value={value} octetIndex={i} prefix={prefix} highlightBits={highlightBits} />
        ))}
      </div>
      <span className="sr-only">{ipBinary(value)}</span>
    </div>
  );
}

export function BitLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink-soft dark:text-bone-soft">
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-4 w-4 rounded-[3px] border border-subject-it bg-subject-it" aria-hidden="true" /> Network bit (solid)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-4 w-4 rounded-[3px] border border-dashed border-ink/50 dark:border-bone/50" aria-hidden="true" /> Host bit (dashed outline)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-4 w-1 bg-amber-500" aria-hidden="true" /> Boundary
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inputs & small pieces
// ---------------------------------------------------------------------------

export function TextField({
  label,
  value,
  onChange,
  error,
  placeholder,
  id,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
  placeholder?: string;
  id: string;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(
          "min-h-[44px] w-full min-w-0 rounded-card border bg-paper px-3 py-2 font-mono text-sm text-ink dark:bg-chalkboard dark:text-bone",
          error ? "border-red-500" : "border-line dark:border-line-dark",
        )}
      />
      {error && (
        <p id={`${id}-err`} role="alert" className="text-xs text-red-700 dark:text-red-300">
          <span className="font-semibold">Problem: </span>
          {error}
        </p>
      )}
    </div>
  );
}

export function KV({ label, value, mono = true, hint }: { label: string; value: ReactNode; mono?: boolean; hint?: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-line py-2 last:border-b-0 dark:border-line-dark sm:flex-row sm:items-baseline sm:gap-3">
      <dt className="shrink-0 text-xs text-ink-soft dark:text-bone-soft sm:w-40">{label}</dt>
      <dd className={cn("min-w-0 break-words text-sm text-ink dark:text-bone", mono && "font-mono")}>
        {value}
        {hint && <span className="mt-0.5 block font-sans text-xs text-ink-soft dark:text-bone-soft">{hint}</span>}
      </dd>
    </div>
  );
}

export function Chip({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "bad" | "warn" | "info" }) {
  const t = {
    neutral: "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
    good: "border-emerald-500 text-emerald-700 dark:text-emerald-300",
    bad: "border-red-500 text-red-700 dark:text-red-300",
    warn: "border-amber-500 text-amber-700 dark:text-amber-300",
    info: "border-subject-it text-subject-it",
  }[tone];
  return <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[11px]", t)}>{children}</span>;
}

/** Slider + −/+ buttons for a prefix length. */
export function PrefixControl({ prefix, onChange, min, max, id }: { prefix: number; onChange: (n: number) => void; min: number; max: number; id: string }) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
        Prefix length: /{prefix}
      </label>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onChange(clamp(prefix - 1))} disabled={prefix <= min} className="min-h-[44px] min-w-[44px] rounded-full border border-line text-lg disabled:opacity-40 dark:border-line-dark" aria-label="Decrease prefix length">
          −
        </button>
        <input id={id} type="range" min={min} max={max} value={prefix} onChange={(e) => onChange(clamp(Number(e.target.value)))} className="h-8 min-w-0 flex-1 accent-subject-it" />
        <button type="button" onClick={() => onChange(clamp(prefix + 1))} disabled={prefix >= max} className="min-h-[44px] min-w-[44px] rounded-full border border-line text-lg disabled:opacity-40 dark:border-line-dark" aria-label="Increase prefix length">
          +
        </button>
      </div>
    </div>
  );
}

export function CollapsiblePanel({ title, children, defaultOpen = true, className }: { title: string; children: ReactNode; defaultOpen?: boolean; className?: string }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn("rounded-card border border-line bg-white/60 dark:border-line-dark dark:bg-white/[0.03]", className)}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex min-h-[44px] w-full items-center justify-between gap-2 px-3.5 py-2 text-left">
        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{title}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open && <div className="border-t border-line px-3.5 pb-3.5 pt-2 dark:border-line-dark">{children}</div>}
    </div>
  );
}

export function Advanced({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="rounded-card border border-dashed border-line p-3 dark:border-line-dark">
      <summary className="min-h-[36px] cursor-pointer select-none font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Advanced · {title}</summary>
      <div className="mt-3 flex flex-col gap-3 text-sm text-ink-soft dark:text-bone-soft">{children}</div>
    </details>
  );
}

// ---------------------------------------------------------------------------
// Address Inspector
// ---------------------------------------------------------------------------

function hostPortionText(hostValue: number, hostBits: number): string {
  const o = toOctets(hostValue);
  if (hostBits > 24) return o.join(".");
  if (hostBits > 16) return o.slice(1).join(".");
  if (hostBits > 8) return o.slice(2).join(".");
  return String(o[3]);
}

/** Full breakdown of one address + prefix. Used in the Network Map and the Address Inspector tab. Collapsible so it stays out of the way on phones. */
export function AddressInspector({ ip, prefix, title = "Address inspector", mac }: { ip: number; prefix: number; title?: string; mac?: string }) {
  const info = analyze(ip, prefix);
  const cls = classifyIPv4(ip);
  const role = addressRole(info);
  const broadcastText =
    info.kind === "point-to-point"
      ? `${formatIPv4(info.broadcast)} (a /31 has no separate broadcast in the usual sense; see Technical mode)`
      : info.kind === "single-host"
        ? "Not applicable: a /32 is a single address"
        : formatIPv4(info.broadcast);
  return (
    <CollapsiblePanel title={title}>
      <dl>
        <KV label="IPv4 address" value={formatIPv4(ip)} />
        <KV label="Binary" value={<span className="break-all">{ipBinary(ip)}</span>} />
        <KV label="CIDR prefix" value={`/${prefix}`} hint={`${info.networkBits} network bits, ${info.hostBits} host bits`} />
        <KV label="Subnet mask" value={formatIPv4(info.mask)} />
        <KV label="Network address" value={formatIPv4(info.network)} />
        <KV label="Broadcast address" value={broadcastText} />
        <KV label="Host portion" value={`${hostPortionText(info.hostValue, info.hostBits)} (value ${info.hostValue})`} hint="The bits after the boundary, read as a number." />
        <KV label="This address is a" value={ROLE_LABEL[role]} hint={ROLE_EXPLANATION[role]} mono={false} />
        <KV label="Classification" value={`${cls.scope}: ${cls.label}${cls.range ? ` (${cls.range})` : ""}`} hint={cls.explanation} mono={false} />
        {mac && <KV label="MAC address" value={mac} hint="The link-layer identity from the Ethernet lab. The IP address is a separate, network-layer identity for the same interface." />}
      </dl>
    </CollapsiblePanel>
  );
}
