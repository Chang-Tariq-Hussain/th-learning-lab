"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import { mainNav, siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Logo } from "@/components/layout/logo";
import { HeaderSearch } from "@/components/layout/header-search";
import { MobileSearchModal } from "@/components/layout/mobile-search-modal";
import { UserMenu } from "@/components/layout/user-menu";
import { cn } from "@/lib/utils";

/**
 * Global header.
 *
 * Logo always sits at the left, and the avatar always sits at the
 * far right -- neither one moves or duplicates across breakpoints.
 * Only two things are breakpoint-dependent:
 *  - The primary nav links (`mainNav`) appear inline, centered, at
 *    `md` and up; below that they live in the hamburger's dropdown
 *    instead, and the hamburger button (which is exactly redundant
 *    once the links are inline) disappears at the same `md` breakpoint.
 *  - The search field itself: a full input box at `lg` and up, but
 *    just an icon (opening the full-screen search modal) from `md`
 *    to `lg`, specifically so it never competes for space with the
 *    inline nav links that already appear at `md`.
 *
 * The nav <ul> is centered with `absolute` + a translate transform
 * rather than a content-sized flex/grid slot, so it stays exactly
 * centered regardless of how wide the logo or the right-hand cluster
 * happen to be -- that width will never be equal on both sides once
 * you add/remove things from either end.
 */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === pathname || (href === "/dashboard" && pathname === "/dashboard");

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md dark:border-line-dark dark:bg-chalkboard/85">
      <Container>
        <nav className="relative flex h-16 items-center justify-between" aria-label="Primary">
          {/* LEFT -- logo, every screen size */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-chalkboard"
          >
            <Logo className="h-7 w-7 text-pine-600 dark:text-pine-300" />
            <span className="font-display text-lg font-medium tracking-tight text-ink dark:text-bone">
              {siteConfig.name}
            </span>
          </Link>

          {/* CENTER -- primary nav, md and up, true center regardless of side widths */}
          <ul className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 md:flex">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "text-sm transition-colors",
                    isActive(item.href)
                      ? "text-ink dark:text-bone"
                      : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* RIGHT -- search + hamburger + avatar, every screen size */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <HeaderSearch className="hidden lg:block" />

            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/[0.06] hover:text-ink dark:text-bone-soft dark:hover:bg-bone/[0.08] dark:hover:text-bone lg:hidden"
            >
              <Search className="h-4 w-4" strokeWidth={1.75} />
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink dark:border-bone/15 dark:text-bone md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500"
            >
              {menuOpen ? <X className="h-4 w-4" strokeWidth={1.75} /> : <Menu className="h-4 w-4" strokeWidth={1.75} />}
            </button>

            <UserMenu />
          </div>
        </nav>
      </Container>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-line dark:border-line-dark md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm transition-colors",
                    isActive(item.href)
                      ? "bg-ink/[0.04] text-ink dark:bg-bone/[0.06] dark:text-bone"
                      : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink dark:text-bone-soft dark:hover:bg-bone/[0.06] dark:hover:text-bone",
                  )}
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-2 flex items-center justify-between rounded-md px-3 py-2 text-sm text-ink-soft dark:text-bone-soft">
                <span>Appearance</span>
                <ThemeToggle />
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {mobileSearchOpen ? <MobileSearchModal onClose={() => setMobileSearchOpen(false)} /> : null}
      </AnimatePresence>
    </header>
  );
}
