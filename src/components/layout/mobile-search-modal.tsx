"use client";

import { groupBySubject, searchIndex } from "@/lib/search-index";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SearchResultsList } from "./search-results-list";

export interface MobileSearchModalProps {
  onClose: () => void;
}

/** Full-width search experience for small screens, opened from the search icon in the mobile header row. */
export function MobileSearchModal({ onClose }: MobileSearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const matches = useMemo(() => searchIndex(query, 20), [query]);
  const groups = useMemo(() => groupBySubject(matches), [matches]);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    // This modal is only meant to be visible below the `sm` breakpoint
    // (see the `sm:hidden` on the root element, matching the icon
    // button that opens it). If the viewport is resized past `sm`
    // while the modal is open, close it instead of leaving it mounted
    // — invisible but still holding the scroll lock below.
    const handleResize = () => {
      if (window.innerWidth >= 640) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="fixed h-[100vh] inset-0 z-[70] flex flex-col bg-paper dark:bg-chalkboard sm:hidden"
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3 dark:border-line-dark">
        <Search
          className="h-4 w-4 shrink-0 text-ink-soft dark:text-bone-soft"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics, subjects, simulations..."
          aria-label="Search subjects, topics, and simulations"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-ink-soft/60 focus:outline-none dark:text-bone dark:placeholder:text-bone-soft/50"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/[0.06] hover:text-ink dark:text-bone-soft dark:hover:bg-bone/[0.08] dark:hover:text-bone"
        >
          <X className="h-4.5 w-4.5" strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        {query.trim().length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-ink-soft dark:text-bone-soft">
            Search across Physics, Chemistry, Biology, and Mathematics.
          </p>
        ) : groups.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-ink-soft dark:text-bone-soft">
            No results for &ldquo;{query.trim()}&rdquo;
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {groups.map((group) => (
              <div key={group.subjectName}>
                <p className="px-3 pb-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
                  {group.subjectName}
                </p>
                <SearchResultsList
                  matches={group.entries}
                  activeId={null}
                  onSelect={onClose}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
