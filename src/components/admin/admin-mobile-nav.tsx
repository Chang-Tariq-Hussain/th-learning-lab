"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Menu, X } from "lucide-react";
import { SubmitButton } from "@/components/admin/submit-button";
import { AdminNav, type AdminNavItem } from "./admin-nav";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface Props {
  items: AdminNavItem[];
  who: string;
  roleLabel: string;
  logoutAction: () => Promise<void>;
}

/**
 * Admin navigation below `lg`: a button in the header opens a modal drawer.
 * - focus moves into the drawer, Tab stays inside it, Escape / the backdrop / the close button / choosing a
 *   page all close it, and focus returns to the menu button
 * - the page behind is inert and does not scroll while it is open
 * - it closes by itself if the window grows to the desktop layout (where the sidebar takes over)
 */
export function AdminMobileNav({ items, who, roleLabel, logoutAction }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(false), []);

  // Choosing a page (or any other navigation) closes the drawer.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const app = document.getElementById("admin-app");
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    app?.setAttribute("inert", "");
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panelRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onWide = () => {
      if (mq.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
      document.body.style.overflow = previousOverflow;
      app?.removeAttribute("inert");
      // Only after the page is no longer inert can the menu button take focus back.
      trigger?.focus();
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="admin-drawer"
        className="-ml-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink hover:bg-ink/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 lg:hidden dark:text-bone dark:hover:bg-bone/[0.08]"
      >
        <Menu aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
      </button>

      {/* Portalled to <body>: a fixed panel inside the sticky header would be positioned against the header. */}
      {mounted && open
        ? createPortal(
            <div className="lg:hidden">
              <div aria-hidden="true" onClick={close} className="fixed inset-0 z-50 bg-ink/50 dark:bg-black/60" />
              <div
                ref={panelRef}
                id="admin-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Admin navigation"
                className="fixed inset-y-0 left-0 z-50 flex w-[min(20rem,88vw)] animate-drawer-in flex-col overflow-y-auto border-r border-ink/10 bg-paper pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] shadow-card-hover dark:border-bone/15 dark:bg-chalkboard"
              >
                <div className="flex items-center justify-between gap-2 border-b border-ink/10 px-4 py-2 dark:border-bone/15">
                  <p className="min-w-0 truncate font-display text-base font-medium text-ink dark:text-bone">Admin menu</p>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    aria-label="Close navigation menu"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink hover:bg-ink/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:text-bone dark:hover:bg-bone/[0.08]"
                  >
                    <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                </div>
                <AdminNav items={items} className="flex-1 px-3 py-3" onNavigate={() => setOpen(false)} />
                <div className="space-y-3 border-t border-ink/10 px-4 py-4 dark:border-bone/15">
                  <p className="text-sm leading-snug text-ink-soft [overflow-wrap:anywhere] dark:text-bone-soft">
                    {who}
                    <br />
                    <span className="font-mono text-label uppercase tracking-wide">{roleLabel}</span>
                  </p>
                  <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-soft hover:text-ink hover:underline dark:text-bone-soft dark:hover:text-bone">
                    View learner site <ExternalLink aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
                  </Link>
                  <form action={logoutAction}>
                    <SubmitButton pendingLabel="Signing out…" className="w-full">Sign out</SubmitButton>
                  </form>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
