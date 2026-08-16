import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  /** Omit on the last (current-page) crumb — it renders as plain text, not a link. */
  href?: string;
}

export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-sm text-ink-soft dark:text-bone-soft",
        className,
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 ? <ChevronRight className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} /> : null}
            {item.href && !isLast ? (
              <Link href={item.href} className="transition-colors hover:text-ink dark:hover:text-bone">
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast && "text-ink dark:text-bone")}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
