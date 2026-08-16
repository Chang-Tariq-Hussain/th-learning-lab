import Link from "next/link";
import { footerNav, siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { RulerDivider } from "@/components/ui/ruler-divider";

const columns = [
  { title: "Product", items: footerNav.product },
  { title: "Resources", items: footerNav.resources },
  { title: "Company", items: footerNav.company },
];

export function Footer() {
  return (
    <footer className="border-t border-line dark:border-line-dark">
      <Container className="py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <Logo className="h-6 w-6 text-pine-600 dark:text-pine-300" />
              <span className="font-display text-base font-medium text-ink dark:text-bone">
                {siteConfig.name}
              </span>
            </div>
            <p className="mt-3 max-w-[22ch] text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
              {siteConfig.tagline}
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
                {column.title}
              </p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-ink-soft transition-colors hover:text-ink dark:text-bone-soft dark:hover:text-bone"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <RulerDivider className="my-10" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">
            © {new Date().getFullYear()} {siteConfig.name}. Built for
            curious minds.
          </p>
          <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">
            v0.1.0 — foundation release
          </p>
        </div>
      </Container>
    </footer>
  );
}
