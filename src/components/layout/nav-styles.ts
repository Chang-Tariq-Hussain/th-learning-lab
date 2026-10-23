/**
 * One look for every navigation list (learner header, admin sidebar and drawer).
 *  - active   : green tint + medium weight + coloured icon (+ a bar on vertical lists)
 *  - hover    : neutral grey tint only
 *  - keyboard : focus ring
 * so the three states are never confused with each other.
 */
export const navLinkBase =
  "group relative flex items-center gap-2.5 rounded-lg px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-1 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-chalkboard";

export const navLinkActive = "bg-pine-600/[0.12] font-medium text-pine-900 dark:bg-pine-500/[0.2] dark:text-pine-100";
export const navLinkInactive =
  "text-ink-soft hover:bg-ink/[0.06] hover:text-ink dark:text-bone-soft dark:hover:bg-bone/[0.08] dark:hover:text-bone";

export const navIconActive = "text-pine-700 dark:text-pine-300";
export const navIconInactive = "text-ink-soft group-hover:text-ink dark:text-bone-soft dark:group-hover:text-bone";

/** Left bar for vertical lists. */
export const navBar =
  "before:absolute before:bottom-2 before:left-0 before:top-2 before:w-[3px] before:rounded-full before:bg-pine-600 dark:before:bg-pine-300";

export const navIconCls = "h-[18px] w-[18px] shrink-0";
