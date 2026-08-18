"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchIndex } from "@/lib/search-index";
import { useDismiss } from "@/hooks/use-dismiss";
import { SearchResultsList } from "./search-results-list";

/**
 * Compact search field for the desktop header. Expands its results
 * as a dropdown panel underneath while focused with a query typed —
 * arrow keys move the highlight, Enter navigates, Escape (or a click
 * outside) closes it.
 */
export function HeaderSearch({ className }: { className?: string }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const matches = useMemo(() => searchIndex(query), [query]);

  useEffect(() => setActiveIndex(0), [query]);

  const close = () => setOpen(false);
  useDismiss(containerRef, open, close);

  const goTo = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (matches.length > 0) setActiveIndex((i) => (i + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (matches.length > 0) setActiveIndex((i) => (i - 1 + matches.length) % matches.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const match = matches[activeIndex];
      if (match) goTo(match.href);
    } else if (e.key === "Escape") {
      close();
      e.currentTarget.blur();
    }
  };

  const activeMatch = matches[activeIndex];

  return (
    <div ref={containerRef} className={cn("relative w-56", className)}>
      <div className="flex h-9 w-full items-center gap-2 rounded-full border border-ink/10 bg-transparent px-3.5 text-sm text-ink-soft transition-colors focus-within:border-pine-500 dark:border-bone/15 dark:text-bone-soft">
        <Search className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search topics..."
          aria-label="Search subjects, topics, and simulations"
          role="combobox"
          aria-expanded={open && matches.length > 0}
          aria-controls="header-search-listbox"
          aria-activedescendant={activeMatch ? `search-option-${activeMatch.id}` : undefined}
          autoComplete="off"
          className="w-full bg-transparent text-ink placeholder:text-ink-soft/60 focus:outline-none dark:text-bone dark:placeholder:text-bone-soft/50"
        />
      </div>

      {open && query.trim().length > 0 ? (
        <div
          id="header-search-listbox"
          className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-card border border-line bg-paper py-1.5 shadow-card dark:border-line-dark dark:bg-chalkboard"
        >
          <SearchResultsList
            matches={matches}
            activeId={activeMatch?.id ?? null}
            onSelect={goTo}
            emptyLabel={`No results for "${query.trim()}"`}
          />
        </div>
      ) : null}
    </div>
  );
}
