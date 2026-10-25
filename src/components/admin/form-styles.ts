import { primaryButtonColors } from "@/components/ui/button-styles";

/**
 * Shared admin form and control styles. Controls keep a 44px touch height until `lg` (tablets are touch devices
 * too); inputs are 16px until `lg` (anything smaller makes iOS Safari zoom the page on focus).
 */
export const fieldCls =
  "min-h-11 rounded-lg border border-ink/15 bg-paper px-3 py-2 text-base text-ink lg:min-h-9 lg:text-sm dark:border-bone/20 dark:bg-chalkboard dark:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 aria-[invalid=true]:border-red-600 dark:aria-[invalid=true]:border-red-400";
export const inputCls = `w-full ${fieldCls}`;
export const labelCls = "mb-1 block font-mono text-label uppercase tracking-wide text-ink-soft dark:text-bone-soft";
export const linkBtnCls =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-ink/15 px-3 py-1.5 text-sm hover:border-pine-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 lg:min-h-9 dark:border-bone/20";
export const linkBtnPrimaryCls =
  `inline-flex min-h-11 items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2 lg:min-h-9 ${primaryButtonColors}`;
/** A text link that still has a 44px tap area on touch widths. */
export const textLinkCls =
  "inline-flex min-h-11 items-center text-pine-700 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 lg:min-h-0 dark:text-pine-300";
/** <summary> of a <details> disclosure. */
export const summaryCls = "inline-flex min-h-11 cursor-pointer items-center underline lg:min-h-0";
/** Wrap every checkbox / radio in a label with this so the whole row is the tap target. */
export const checkLabelCls = "flex min-h-11 cursor-pointer items-center gap-2 text-sm lg:min-h-0";
/** Message tied to a field with aria-describedby. */
export const fieldErrorCls = "mt-1 text-helper text-red-800 dark:text-red-300";
