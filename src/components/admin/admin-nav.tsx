"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface AdminNavItem {
  href: string;
  label: string;
  exact?: boolean;
}

export function AdminNav({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto md:flex-col">
      {items.map((i) => {
        const active = i.exact ? pathname === i.href : pathname === i.href || pathname.startsWith(`${i.href}/`);
        return (
          <Link
            key={i.href}
            href={i.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "whitespace-nowrap rounded-lg px-3 py-2 text-sm",
              active ? "bg-pine-600/10 font-medium text-pine-700 dark:bg-pine-500/15 dark:text-pine-300" : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink dark:text-bone-soft dark:hover:bg-bone/[0.06] dark:hover:text-bone",
            )}
          >
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
