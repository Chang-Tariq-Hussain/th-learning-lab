import type { NavIconName } from "@/components/layout/nav-icons";

export const siteConfig = {
  /** The one user-facing product name. Use this everywhere instead of typing it out. */
  name: "TH Learning Lab",
  /** Canonical technical slug, for places that need an identifier rather than a display name. */
  slug: "th-learning-lab",
  tagline: "A notebook for learning science, by doing it.",
  description:
    "TH Learning Lab is a modern learning platform for Physics, Chemistry, Biology, Mathematics, and Information Technology, built around interactive simulations you can explore at your own pace.",
  /** Set NEXT_PUBLIC_SITE_URL in production; the fallback is only a placeholder for local builds. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://th-learning-lab.example.com",
};

/** `Dashboard` -> `Dashboard | TH Learning Lab`. Only for places that cannot use the root title template. */
export const withSiteName = (title: string): string => `${title} | ${siteConfig.name}`;

export interface MainNavItem {
  label: string;
  href: string;
  icon: NavIconName;
  /** Active only on exactly this path (the dashboard home must not be active on every page below it). */
  exact?: boolean;
}

export const mainNav: MainNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard", exact: true },
  { label: "Practice", href: "/dashboard/practice", icon: "practice" },
  { label: "Mock Tests", href: "/dashboard/mock-tests", icon: "mockTests" },
  { label: "Physics", href: "/dashboard/physics", icon: "physics" },
  { label: "Chemistry", href: "/dashboard/chemistry", icon: "chemistry" },
  { label: "Biology", href: "/dashboard/biology", icon: "biology" },
  { label: "Mathematics", href: "/dashboard/mathematics", icon: "mathematics" },
  { label: "Information Technology", href: "/dashboard/information-technology", icon: "informationTechnology" },
];

export const footerNav = {
  product: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "All subjects", href: "/dashboard" },
    { label: "Roadmap", href: "#" },
  ],
  resources: [
    { label: "Getting started", href: "#" },
    { label: "For educators", href: "#" },
    { label: "Accessibility", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy", href: "#" },
  ],
};
