"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastKind = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  /** Same id replaces the earlier toast instead of stacking a second one. */
  id?: string;
  /** Milliseconds before it closes itself; 0 keeps it until dismissed. */
  duration?: number;
}

interface ToastItem {
  id: string;
  kind: ToastKind;
  message: string;
  duration: number;
}

interface ToastApi {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  dismiss: (id: string) => void;
}

const MAX_VISIBLE = 4;
const DEFAULT_DURATION: Record<ToastKind, number> = { success: 5000, info: 6000, warning: 8000, error: 10000 };

const STYLE: Record<ToastKind, { icon: LucideIcon; accent: string; iconCls: string; label: string }> = {
  success: { icon: CheckCircle2, accent: "border-l-pine-600 dark:border-l-pine-300", iconCls: "text-pine-700 dark:text-pine-300", label: "Success" },
  error: { icon: AlertCircle, accent: "border-l-red-600 dark:border-l-red-400", iconCls: "text-red-700 dark:text-red-300", label: "Error" },
  warning: { icon: AlertTriangle, accent: "border-l-amber-600 dark:border-l-amber-400", iconCls: "text-amber-700 dark:text-amber-300", label: "Warning" },
  info: { icon: Info, accent: "border-l-blue-600 dark:border-l-blue-300", iconCls: "text-blue-700 dark:text-blue-300", label: "Notice" },
};

const noop = (): void => undefined;
const fallback: ToastApi = { success: noop, error: noop, warning: noop, info: noop, dismiss: noop };
const ToastContext = createContext<ToastApi>(fallback);

/** Shared notifications for the whole app (learner and admin). Mounted once in the root layout. */
export function useToast(): ToastApi {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: string) => setItems((list) => list.filter((t) => t.id !== id)), []);

  const show = useCallback((kind: ToastKind, message: string, options?: ToastOptions) => {
    const text = message.trim();
    if (!text) return;
    setItems((list) => {
      // One failed operation must never stack identical toasts.
      if (list.some((t) => t.kind === kind && t.message === text && (!options?.id || t.id === options.id))) return list;
      counter.current += 1;
      const id = options?.id ?? `t${counter.current}`;
      const next: ToastItem = { id, kind, message: text, duration: options?.duration ?? DEFAULT_DURATION[kind] };
      return [...list.filter((t) => t.id !== id), next].slice(-MAX_VISIBLE);
    });
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (m, o) => show("success", m, o),
      error: (m, o) => show("error", m, o),
      warning: (m, o) => show("warning", m, o),
      info: (m, o) => show("info", m, o),
      dismiss,
    }),
    [show, dismiss],
  );

  const assertive = items.filter((t) => t.kind === "error");
  const polite = items.filter((t) => t.kind !== "error");

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/*
        Bottom of the screen so it never covers the sticky headers. Both live regions are always in the DOM:
        screen readers only announce content added to a region that already exists.
      */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:items-end sm:px-5 sm:pb-5">
        <div role="status" aria-live="polite" aria-atomic="false" className="flex w-full flex-col items-center gap-2 sm:items-end">
          {polite.map((t) => <ToastCard key={t.id} item={t} onClose={dismiss} />)}
        </div>
        <div role="alert" aria-live="assertive" aria-atomic="false" className="flex w-full flex-col items-center gap-2 sm:items-end">
          {assertive.map((t) => <ToastCard key={t.id} item={t} onClose={dismiss} />)}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ item, onClose }: { item: ToastItem; onClose: (id: string) => void }) {
  const [paused, setPaused] = useState(false);
  const { icon: Icon, accent, iconCls, label } = STYLE[item.kind];

  useEffect(() => {
    if (item.duration === 0 || paused) return;
    const timer = window.setTimeout(() => onClose(item.id), item.duration);
    return () => window.clearTimeout(timer);
  }, [item.id, item.duration, paused, onClose]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        "pointer-events-auto flex w-full max-w-md animate-toast-in items-start gap-3 rounded-xl border border-l-4 border-ink/15 bg-paper py-3 pl-3 pr-1.5 text-ink shadow-card-hover dark:border-bone/20 dark:bg-chalkboard dark:text-bone",
        accent,
      )}
    >
      <Icon aria-hidden="true" strokeWidth={2} className={cn("mt-0.5 h-5 w-5 shrink-0", iconCls)} />
      <p className="min-w-0 flex-1 break-words text-sm leading-snug">
        <span className="sr-only">{label}: </span>
        {item.message}
      </p>
      <button
        type="button"
        onClick={() => onClose(item.id)}
        aria-label="Dismiss notification"
        className="-my-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink-soft hover:bg-ink/[0.06] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:text-bone-soft dark:hover:bg-bone/[0.08] dark:hover:text-bone"
      >
        <X aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}
