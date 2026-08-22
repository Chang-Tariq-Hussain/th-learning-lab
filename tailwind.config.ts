import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F6F7F4",
        chalkboard: "#0F1613",
        ink: {
          DEFAULT: "#142019",
          soft: "#3D4A44",
        },
        bone: {
          DEFAULT: "#E7ECE8",
          soft: "#A9B6AF",
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
          DEFAULT: "#DDE3DD",
          dark: "#243430",
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
