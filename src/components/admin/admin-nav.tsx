"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavActive } from "@/lib/nav";
import { NAV_ICONS, type NavIconName } from "@/components/layout/nav-icons";
import { navBar, navIconActive, navIconCls, navIconInactive, navLinkActive, navLinkBase, navLinkInactive } from "@/components/layout/nav-styles";
import { cn } from "@/lib/utils";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: NavIconName;
  exact?: boolean;
}

/** Admin navigation list. Used as the desktop sidebar and inside the mobile drawer. */
export function AdminNav({ items, onNavigate, className }: { items: AdminNavItem[]; onNavigate?: () => void; className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className={className}>
      <ul className="flex flex-col gap-1">
        {items.map((i) => {
          const active = isNavActive(pathname, i.href, i.exact);
          const Icon = NAV_ICONS[i.icon];
          return (
            <li key={i.href}>
              <Link
                href={i.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(navLinkBase, "min-h-11 lg:min-h-10", active ? cn(navLinkActive, navBar) : navLinkInactive)}
              >
                <Icon aria-hidden="true" strokeWidth={1.75} className={cn(navIconCls, active ? navIconActive : navIconInactive)} />
                <span className="min-w-0">{i.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
