/**
 * Central registry for the app's theme system.
 *
 * Each theme id doubles as the class name next-themes applies to
 * `<html>` (see `theme-provider.tsx` / `app/layout.tsx`), and as the
 * selector used in `globals.css` to override the surface CSS
 * variables (`--color-paper`, `--color-chalkboard`, `--color-ink`,
 * `--color-ink-soft`, `--color-bone`, `--color-bone-soft`,
 * `--color-line`, `--color-line-dark`). `light` and `dark` are the
 * original two themes and their ids are unchanged, so any value
 * already stored in localStorage under next-themes' `theme` key
 * keeps working with no migration needed.
 *
 * `previewFrom`/`previewTo` are only used to paint the small swatch
 * next to each option in the theme selector — they intentionally
 * mirror each theme's actual --color-paper/--color-chalkboard and
 * --color-ink/--color-bone values so the preview is accurate. The
 * app's own UI never reads these two fields.
 */

export type ThemeType = "light" | "dark";

export interface ThemeDefinition {
  id: string;
  name: string;
  type: ThemeType;
  /** Swatch background (surface color), for the selector preview only. */
  previewFrom: string;
  /** Swatch foreground/accent dot, for the selector preview only. */
  previewTo: string;
}

export const themes: ThemeDefinition[] = [
  {
    id: "light",
    name: "Light",
    type: "light",
    previewFrom: "#F6F7F4",
    previewTo: "#142019",
  },
  {
    id: "soft-light",
    name: "Soft Light",
    type: "light",
    previewFrom: "#FAF6EF",
    previewTo: "#2B2620",
  },
  {
    id: "solarized-light",
    name: "Solarized Light",
    type: "light",
    previewFrom: "#FDF6E3",
    previewTo: "#586E75",
  },
  {
    id: "github-light",
    name: "GitHub Light",
    type: "light",
    previewFrom: "#FFFFFF",
    previewTo: "#1F2328",
  },
  {
    id: "dark",
    name: "Dark",
    type: "dark",
    previewFrom: "#0F1613",
    previewTo: "#E7ECE8",
  },
  {
    id: "midnight",
    name: "Midnight",
    type: "dark",
    previewFrom: "#05070D",
    previewTo: "#E3E8F5",
  },
  {
    id: "dracula",
    name: "Dracula",
    type: "dark",
    previewFrom: "#282A36",
    previewTo: "#F8F8F2",
  },
  {
    id: "nord",
    name: "Nord",
    type: "dark",
    previewFrom: "#2E3440",
    previewTo: "#ECEFF4",
  },
  {
    id: "monokai",
    name: "Monokai",
    type: "dark",
    previewFrom: "#272822",
    previewTo: "#F8F8F2",
  },
  {
    id: "one-dark",
    name: "One Dark",
    type: "dark",
    previewFrom: "#282C34",
    previewTo: "#ABB2BF",
  },
];

export const themeIds = themes.map((theme) => theme.id);

export const lightThemes = themes.filter((theme) => theme.type === "light");
export const darkThemes = themes.filter((theme) => theme.type === "dark");

export function getThemeDefinition(
  id: string | undefined,
): ThemeDefinition | undefined {
  return themes.find((theme) => theme.id === id);
}
