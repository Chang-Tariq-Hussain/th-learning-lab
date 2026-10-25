import { useEffect, type RefObject } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

/** The page shells that sit behind a modal. They are made inert (no Tab, hidden from screen readers) while it is open. */
const BACKGROUND_IDS = ["learner-app", "admin-app"];

/**
 * Behaviour every modal dialog needs, in one place:
 *  - Tab and Shift+Tab stay inside `panelRef`
 *  - Escape calls `onClose` (omit it for a dialog that must be completed)
 *  - the page behind is inert and does not scroll
 *  - focus returns to whatever had it before the dialog opened
 * The dialog itself must render OUTSIDE the shell (createPortal to document.body): a `position: fixed` element
 * inside a header with `backdrop-filter` is positioned against the header, not the screen.
 */
export function useModal(panelRef: RefObject<HTMLElement | null>, onClose?: () => void): void {
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const backgrounds = BACKGROUND_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    document.body.style.overflow = "hidden";
    backgrounds.forEach((el) => el.setAttribute("inert", ""));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        e.preventDefault();
        onClose();
        return;
      }
      const panel = panelRef.current;
      if (e.key !== "Tab" || !panel) return;
      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null || n === document.activeElement);
      if (nodes.length === 0) {
        e.preventDefault();
        return;
      }
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      backgrounds.forEach((el) => el.removeAttribute("inert"));
      if (opener && opener.isConnected) opener.focus();
    };
    // onClose is read through the closure on purpose: re-running would reset focus and scroll lock.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelRef]);
}
