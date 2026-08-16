"use client";

import { useEffect, type RefObject } from "react";

/**
 * Calls `onDismiss` on an outside pointer-down or an Escape key press,
 * while `active`. Shared by every dropdown/popover/modal in the header
 * (user menu, edit-name modal, search results) so each one doesn't
 * reimplement its own listener.
 */
export function useDismiss(ref: RefObject<HTMLElement | null>, active: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!active) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onDismiss();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, ref, onDismiss]);
}
