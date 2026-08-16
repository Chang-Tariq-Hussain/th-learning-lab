import type { ComponentType, SVGProps } from "react";
import type { SubjectSlug } from "./types";

/**
 * Hand-drawn-feeling line-art glyphs, one per subject.
 * Kept stroke-based (not filled icon-font glyphs) so they read like
 * diagrams sketched in a lab notebook rather than generic UI icons.
 */

export function PhysicsGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* orbital paths around a nucleus, evoking an atom / wave motion */}
      <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(0 24 24)" />
      <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(120 24 24)" />
      <circle cx="24" cy="24" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChemistryGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* erlenmeyer flask with a bubble of reaction */}
      <path d="M19 6h10" />
      <path d="M21 6v11.5L11.5 37a3 3 0 0 0 2.7 4.3h19.6a3 3 0 0 0 2.7-4.3L27 17.5V6" />
      <path d="M15.5 30.5h17" />
      <circle cx="20" cy="35" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="26.5" cy="33" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BiologyGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* DNA double helix */}
      <path d="M16 5c0 8 16 8 16 16s-16 8-16 16" />
      <path d="M32 5c0 8-16 8-16 16s16 8 16 16" />
      <path d="M17.5 11h13" />
      <path d="M15.5 21h17" />
      <path d="M15.5 27h17" />
      <path d="M17.5 37h13" />
    </svg>
  );
}

export function MathGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* sigma summation with axis ticks */}
      <path d="M13 10h20l-9 14 9 14H13l7-11" />
      <path d="M6 24h4" />
      <path d="M24 6v4" />
    </svg>
  );
}

/**
 * Lookup map so components can resolve a subject's glyph from its
 * `slug` alone, keeping `Subject` data plain and serializable.
 */
export const subjectGlyphs: Record<
  SubjectSlug,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  physics: PhysicsGlyph,
  chemistry: ChemistryGlyph,
  biology: BiologyGlyph,
  mathematics: MathGlyph,
};
