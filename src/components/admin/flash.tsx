"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface FlashProps { ok?: string; info?: string; warn?: string; error?: string }

const KEYS = ["ok", "info", "warn", "error", "err"];

/**
 * Result of the last admin action, delivered as ?ok= / ?info= / ?warn= / ?error= after a redirect.
 * Shown once as a toast, then removed from the address bar so a reload or a shared link doesn't replay it.
 * Errors and warnings also stay on the page as text (a toast is not the only place a problem is recorded);
 * the server-rendered text also covers the no-JavaScript case.
 */
export function Flash({ ok, info, warn, error }: FlashProps) {
  const toast = useToast();
  const [toasted, setToasted] = useState(false);
  const handled = useRef("");

  useEffect(() => {
    if (!ok && !info && !warn && !error) return;
    const key = JSON.stringify([ok, info, warn, error]);
    if (handled.current === key) return; // React StrictMode runs effects twice in development
    handled.current = key;
    if (ok) toast.success(ok);
    if (info) toast.info(info);
    if (warn) toast.warning(warn);
    if (error) toast.error(error);
    setToasted(true);
    const url = new URL(window.location.href);
    if (KEYS.some((k) => url.searchParams.has(k))) {
      KEYS.forEach((k) => url.searchParams.delete(k));
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    }
  }, [ok, info, warn, error, toast]);

  const box = "rounded-lg border px-3 py-2 text-sm break-words";
  return (
    <>
      {ok && !toasted ? <p className={cn(box, "border-pine-500/40 bg-pine-500/10")}>{ok}</p> : null}
      {info && !toasted ? <p className={cn(box, "border-blue-500/40 bg-blue-500/10")}>{info}</p> : null}
      {warn ? <p className={cn(box, "border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-200")}>{warn}</p> : null}
      {error ? <p className={cn(box, "border-red-500/40 bg-red-500/10 text-red-800 dark:text-red-300")}>{error}</p> : null}
    </>
  );
}
