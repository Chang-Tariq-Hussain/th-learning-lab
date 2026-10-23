import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Decorative spinner. Pair it with visible text (e.g. "Saving…") — it carries no meaning of its own. */
export function Spinner({ className }: { className?: string }) {
  return <Loader2 aria-hidden="true" strokeWidth={2} className={cn("h-4 w-4 shrink-0 animate-spin", className)} />;
}
