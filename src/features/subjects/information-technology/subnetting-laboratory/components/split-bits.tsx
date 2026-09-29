"use client";

import { cn } from "@/lib/utils";
import { bitAt, toOctets } from "../../ip-addressing-simulator/model";
import { bitRoles, type BitRole } from "../model";

type Mode = "bits" | "letters" | "mask";

/**
 * 32 bits in four octets, coloured by role:
 *   N = original network bit, B = borrowed bit (now a network bit), H = host bit.
 * `bits` shows the value of `value`, `letters` shows N/H, `mask` shows the subnet mask (1 for network, 0 for host).
 * Thick bars mark the original boundary (dark) and the new boundary (amber).
 */
export function SplitBits({ orig, next, value, mode = "bits", label, showDecimal = true }: { orig: number; next: number; value?: number; mode?: Mode; label?: string; showDecimal?: boolean }) {
  const roles = bitRoles(orig, next);
  const maskValue = mode === "mask" ? (next === 0 ? 0 : (0xffffffff << (32 - next)) >>> 0) : undefined;
  const source = mode === "mask" ? maskValue! : (value ?? 0);
  const octets = toOctets(source);

  function text(i: number, role: BitRole): string {
    if (mode === "letters") return role === "H" ? "H" : "N";
    return String(bitAt(source, i));
  }

  return (
    <div className="min-w-0">
      {label && <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{label}</p>}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:flex sm:flex-wrap sm:gap-x-4">
        {[0, 1, 2, 3].map((o) => (
          <div key={o} className="flex min-w-0 flex-col items-start gap-0.5">
            <div className="flex gap-[2px]" role="group" aria-label={`Octet ${o + 1}`}>
              {Array.from({ length: 8 }, (_, b) => {
                const i = o * 8 + b;
                const role = roles[i]!;
                return (
                  <span
                    key={b}
                    className={cn(
                      "flex h-8 w-[15px] items-center justify-center rounded-[3px] border font-mono text-[11px] sm:w-6 sm:text-sm",
                      role === "N" && "border-subject-it bg-subject-it font-semibold text-paper",
                      role === "B" && "border-amber-500 bg-amber-400 font-semibold text-ink",
                      role === "H" && "border-dashed border-ink/50 bg-transparent text-ink dark:border-bone/50 dark:text-bone",
                      orig < next && i === orig && "border-l-[3px] border-l-ink dark:border-l-bone",
                      i === next && next < 32 && "border-l-[3px] border-l-amber-500",
                    )}
                  >
                    {text(i, role)}
                  </span>
                );
              })}
            </div>
            {showDecimal && mode !== "letters" && <span className="font-mono text-[10px] text-ink-soft dark:text-bone-soft">{octets[o]}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SplitLegend({ borrowed = true }: { borrowed?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink-soft dark:text-bone-soft">
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-4 w-4 rounded-[3px] border border-subject-it bg-subject-it" aria-hidden="true" /> Original network bit (N)
      </span>
      {borrowed && (
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-4 w-4 rounded-[3px] border border-amber-500 bg-amber-400" aria-hidden="true" /> Borrowed bit (a network bit now)
        </span>
      )}
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-4 w-4 rounded-[3px] border border-dashed border-ink/50 dark:border-bone/50" aria-hidden="true" /> Host bit (H)
      </span>
    </div>
  );
}
