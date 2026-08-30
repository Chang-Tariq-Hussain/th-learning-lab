import type { Config } from "tailwindcss";

const config: Config = {
  // Extended from the original `darkMode: "class"` so every `dark:` utility
  // used throughout the app (unchanged) also activates for the new
  // dark-family themes below, not just the original `.dark` class. See
  // `src/config/themes.ts` for the theme registry and `globals.css` for the
  // per-theme CSS variable values.
  darkMode: [
    "selector",
    ":is(.dark, .midnight, .dracula, .nord, .monokai, .one-dark)",
  ],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    // Theme class names (dracula, nord, monokai, etc.) live as string
    // literals in the registry here, not as literal `className`s in
    // JSX — they're applied at runtime by next-themes. Tailwind's JIT
    // only keeps a hand-written `@layer base` rule (see the theme
    // blocks in globals.css) if its class name text is found
    // somewhere in the scanned content, so this file must be included
    // or every non-"dark"-named theme's CSS gets silently stripped.
    "./src/config/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // paper/chalkboard/ink/bone/line were flat hex values before the
        // multi-theme system; they now resolve through CSS variables (same
        // pattern as `subject.physics`/`subject.math` below) so every
        // existing `bg-paper`, `dark:bg-chalkboard`, `text-ink`,
        // `dark:text-bone`, `border-line`, etc. call site repaints per
        // theme with zero changes at the call site. Values are defined
        // per-theme in `globals.css`. `pine` (the brand accent) is
        // intentionally left as-is and stays constant across every theme.
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        chalkboard: "rgb(var(--color-chalkboard) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--color-ink) / <alpha-value>)",
          soft: "rgb(var(--color-ink-soft) / <alpha-value>)",
        },
        bone: {
          DEFAULT: "rgb(var(--color-bone) / <alpha-value>)",
          soft: "rgb(var(--color-bone-soft) / <alpha-value>)",
        },
        pine: {
          50: "#EAF2EF",
          100: "#CFE1DA",
          300: "#7AA99A",
          500: "#2F7D68",
          600: "#1F6F5C",
          700: "#175748",
          900: "#0D2E26",
        },
        line: {
          DEFAULT: "rgb(var(--color-line) / <alpha-value>)",
          dark: "rgb(var(--color-line-dark) / <alpha-value>)",
        },
        /**
         * Physics (`physics`) and Mathematics (`math`) resolve through a
         * CSS variable — see `:root` / `.dark` in `globals.css` — so the
         * same bare class (`text-subject-physics`, `bg-subject-math`,
         * etc.) renders a softer, dark-mode-tuned shade automatically
         * wherever it's used, without touching each of the ~200 call
         * sites individually. This was needed because, unlike most
         * colors in this app, these two are referenced directly with no
         * `dark:` companion class at most call sites (subject cards,
         * nav, badges, breadcrumb kickers...), and the original fixed
         * hex values (a saturated electric blue and violet) read as
         * overly vivid/neon against the dark chalkboard background,
         * particularly in small text on mobile screens. Chemistry and
         * Biology stay as plain hex — their mid-tone green/teal already
         * reads fine on both light and dark surfaces.
         */
        subject: {
          physics: "rgb(var(--color-subject-physics) / <alpha-value>)",
          "physics-soft": "#E8EBFF",
          chemistry: "#2E9E5B",
          "chemistry-soft": "#E5F6EC",
          biology: "#0D9488",
          "biology-soft": "#DFF5F2",
          math: "rgb(var(--color-subject-math) / <alpha-value>)",
          "math-soft": "#EFE7FB",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(to right, rgba(20,32,25,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,32,25,0.05) 1px, transparent 1px)",
        "grid-dark":
          "linear-gradient(to right, rgba(231,236,232,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(231,236,232,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "28px 28px",
      },
      borderRadius: {
        card: "0.875rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,32,25,0.06), 0 8px 24px -12px rgba(20,32,25,0.18)",
        "card-hover":
          "0 2px 4px rgba(20,32,25,0.08), 0 16px 32px -12px rgba(20,32,25,0.24)",
      },
      maxWidth: {
        content: "72rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
