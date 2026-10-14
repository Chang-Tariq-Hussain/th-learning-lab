import type { ReactNode } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { AdminSession } from "@/lib/admin/auth";
import { ROLE_LABEL, can, type Permission } from "@/lib/admin/permissions";
import { AdminNav, type AdminNavItem } from "./admin-nav";

interface NavDef extends AdminNavItem {
  permission: Permission;
  /** Needs the database (Supabase accounts mode). */
  needsAccounts?: boolean;
}

/** Only screens that actually exist are listed; each appears only for roles that may use it. */
const NAV: NavDef[] = [
  { href: "/admin", label: "Overview", exact: true, permission: "overview.view" },
  { href: "/admin/health", label: "Content Health", permission: "health.view" },
  { href: "/admin/audit", label: "Audit Log", permission: "audit.view", needsAccounts: true },
  { href: "/admin/admins", label: "Admin Users", permission: "admins.manage", needsAccounts: true },
];

export function AdminShell({ session, children }: { session: AdminSession; children: ReactNode }) {
  const items = NAV.filter((i) => can(session.role, i.permission) && (!i.needsAccounts || session.mode === "accounts")).map(({ href, label, exact }) => ({ href, label, exact }));
  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-chalkboard dark:text-bone">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-pine-600 focus:px-3 focus:py-2 focus:text-paper">Skip to content</a>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-5 py-3 dark:border-bone/15">
        <Link href="/admin" className="font-display text-base font-medium">TH Learning Lab <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">· Admin</span></Link>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-right text-xs leading-tight text-ink-soft dark:text-bone-soft">
            {session.email ?? "Shared password"}
            <br />
            <span className="font-mono uppercase tracking-wide">{ROLE_LABEL[session.role]}</span>
          </span>
          <Link href="/dashboard" className="text-sm text-ink-soft hover:underline dark:text-bone-soft">View learner site</Link>
          <ThemeToggle />
          <form action={logoutAction}>
            <button type="submit" className="rounded-lg border border-ink/15 px-3 py-1.5 text-sm hover:border-pine-500 dark:border-bone/20">Sign out</button>
          </form>
        </div>
      </header>
      {session.mode === "password" ? (
        <p role="note" className="border-b border-amber-500/30 bg-amber-500/10 px-5 py-2 text-sm text-amber-800 dark:text-amber-200">
          Signed in with the temporary shared password. Configure Supabase (see <code className="font-mono">.env.example</code>) to switch to individual accounts, roles and the audit log.
        </p>
      ) : null}
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-5 py-6 md:flex-row md:gap-8">
        <aside className="md:w-52 md:shrink-0"><AdminNav items={items} /></aside>
        <main id="admin-main" className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
