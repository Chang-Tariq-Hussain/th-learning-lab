import type { ReactNode } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AdminNav, type AdminNavItem } from "./admin-nav";

/** Only screens that actually exist are listed. New entries arrive with the phase that builds them. */
const NAV: AdminNavItem[] = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/health", label: "Content Health" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-chalkboard dark:text-bone">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-pine-600 focus:px-3 focus:py-2 focus:text-paper">Skip to content</a>
      <header className="flex items-center justify-between border-b border-ink/10 px-5 py-3 dark:border-bone/15">
        <Link href="/admin" className="font-display text-base font-medium">TH Learning Lab <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">· Admin</span></Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-ink-soft hover:underline dark:text-bone-soft">View learner site</Link>
          <ThemeToggle />
          <form action={logoutAction}>
            <button type="submit" className="rounded-lg border border-ink/15 px-3 py-1.5 text-sm hover:border-pine-500 dark:border-bone/20">Sign out</button>
          </form>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-5 py-6 md:flex-row md:gap-8">
        <aside className="md:w-52 md:shrink-0"><AdminNav items={NAV} /></aside>
        <main id="admin-main" className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
