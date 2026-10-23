/**
 * Shared admin form styles. Inputs are 16px on phones (anything smaller makes iOS zoom the page on focus)
 * and 14px from `md`; they keep a comfortable touch height on small screens.
 */
export const fieldCls =
  "min-h-11 rounded-lg border border-ink/15 bg-paper px-3 py-2 text-base text-ink md:min-h-9 md:text-sm dark:border-bone/20 dark:bg-chalkboard dark:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500";
export const inputCls = `w-full ${fieldCls}`;
export const labelCls = "mb-1 block font-mono text-label uppercase tracking-wide text-ink-soft dark:text-bone-soft";
export const linkBtnCls =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-ink/15 px-3 py-1.5 text-sm hover:border-pine-500 md:min-h-9 dark:border-bone/20";
export const linkBtnPrimaryCls =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-pine-600 px-3 py-1.5 text-sm font-medium text-paper hover:bg-pine-700 md:min-h-9 dark:bg-pine-500 dark:text-chalkboard";
