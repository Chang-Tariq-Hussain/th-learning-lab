import type { SVGProps } from "react";

/**
 * Brand mark: an open notebook page with a measurement tick,
 * standing in for "fieldnotes" across the sciences.
 */
export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 6.5c-2.6-1.6-5.6-2-8.5-1.2v16c2.9-.8 5.9-.4 8.5 1.2" />
      <path d="M14 6.5c2.6-1.6 5.6-2 8.5-1.2v16c-2.9-.8-5.9-.4-8.5 1.2" />
      <path d="M14 6.5v16" />
      <path d="M7.5 10h3" />
      <path d="M7.5 13.5h3" />
    </svg>
  );
}
