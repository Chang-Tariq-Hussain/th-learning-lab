import { AlertTriangle } from "lucide-react";
import { CONCENTRATION_WARNING } from "../model";

/** A small, prominent note protecting the simulation's key distinction: strength is not concentration. */
export function ConcentrationNote() {
  return (
    <div className="flex items-start gap-3 rounded-card border border-[#E0663D]/30 bg-[#E0663D]/10 p-4 sm:p-5">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#E0663D]" strokeWidth={1.75} />
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E0663D]">{CONCENTRATION_WARNING.heading}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{CONCENTRATION_WARNING.body}</p>
      </div>
    </div>
  );
}
