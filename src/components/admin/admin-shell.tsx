import type { ReactNode } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/submit-button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { siteConfig } from "@/config/site";
import type { AdminSession } from "@/lib/admin/auth";
import { ROLE_LABEL, can, type Permission } from "@/lib/admin/permissions";
import { AdminMobileNav } from "./admin-mobile-nav";
import { AdminNav, type AdminNavItem } from "./admin-nav";

interface NavDef extends AdminNavItem {
  permission: Permission;
  /** Needs the database (Supabase accounts mode). */
  needsAccounts?: boolean;
}

/** Only screens that actually exist are listed; each appears only for roles that may use it. */
const NAV: NavDef[] = [
  { href: "/admin", label: "Overview", exact: true, icon: "dashboard", permission: "overview.view" },
  { href: "/admin/health", label: "Content Health", icon: "contentHealth", permission: "health.view" },
  { href: "/admin/questions", label: "Question Bank", icon: "questionBank", permission: "questions.view", needsAccounts: true },
  { href: "/admin/publishing", label: "Publishing", icon: "publishing", permission: "questions.view", needsAccounts: true },
  { href: "/admin/audit", label: "Audit Log", icon: "auditLog", permission: "audit.view", needsAccounts: true },
  { href: "/admin/admins", label: "Admin Users", icon: "adminUsers", permission: "admins.manage", needsAccounts: true },
];

export function AdminShell({ session, children }: { session: AdminSession; children: ReactNode }) {
  const items: AdminNavItem[] = NAV.filter((i) => can(session.role, i.permission) && (!i.needsAccounts || session.mode === "accounts")).map(({ href, label, exact, icon }) => ({ href, label, exact, icon }));
  const who = session.email ?? "Shared password";
  return (
    <div id="admin-app" className="min-h-screen bg-paper text-ink dark:bg-chalkboard dark:text-bone">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[60] focus:rounded focus:bg-pine-600 focus:px-3 focus:py-2 focus:text-paper">Skip to content</a>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper dark:border-bone/15 dark:bg-chalkboard">
        <div className="flex items-center gap-2 px-3 py-2 sm:px-5 lg:py-3">
          <AdminMobileNav items={items} who={who} roleLabel={ROLE_LABEL[session.role]} logoutAction={logoutAction} />
          <Link href="/admin" className="inline-flex min-h-11 min-w-0 items-center truncate font-display text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500">
            {siteConfig.name} <span className="font-mono text-label uppercase tracking-wide text-ink-soft dark:text-bone-soft">· Admin</span>
          </Link>
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden text-right text-helper leading-tight text-ink-soft [overflow-wrap:anywhere] lg:block dark:text-bone-soft">
              {who}
              <br />
              <span className="font-mono uppercase tracking-wide">{ROLE_LABEL[session.role]}</span>
            </span>
            <Link href="/dashboard" className="hidden text-sm text-ink-soft hover:underline lg:inline dark:text-bone-soft">View learner site</Link>
            <ThemeToggle />
            <form action={logoutAction} className="hidden lg:block">
              <SubmitButton pendingLabel="Signing out…">Sign out</SubmitButton>
            </form>
          </div>
        </div>
      </header>
      {session.mode === "password" ? (
        <p role="note" className="border-b border-amber-500/30 bg-amber-500/10 px-5 py-2 text-sm text-amber-900 dark:text-amber-200">
          Signed in with the temporary shared password. Configure Supabase (see <code className="font-mono">.env.example</code>) to switch to individual accounts, roles and the audit log.
        </p>
      ) : null}
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-6 sm:px-5 lg:flex-row lg:gap-8">
        <aside className="hidden lg:block lg:w-52 lg:shrink-0">
          <div className="sticky top-20">
            <AdminNav items={items} />
          </div>
        </aside>
        <main id="admin-main" tabIndex={-1} className="min-w-0 flex-1 focus:outline-none">{children}</main>
      </div>
    </div>
  );
}
