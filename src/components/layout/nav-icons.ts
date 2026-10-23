import {
  Activity, Atom, Calculator, ClipboardCheck, Cpu, Dna, FlaskConical, History, LayoutDashboard, Library, Rocket, Target, Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Navigation icons by name. Server components pass the NAME to client navigation components (a component
 * function cannot cross that boundary), and this registry turns it into the icon. All are Lucide icons
 * present in the installed version (lucide-react 0.408).
 */
export const NAV_ICONS = {
  dashboard: LayoutDashboard,
  practice: Target,
  mockTests: ClipboardCheck,
  physics: Atom,
  chemistry: FlaskConical,
  biology: Dna,
  mathematics: Calculator,
  informationTechnology: Cpu,
  contentHealth: Activity,
  questionBank: Library,
  publishing: Rocket,
  auditLog: History,
  adminUsers: Users,
} as const satisfies Record<string, LucideIcon>;

export type NavIconName = keyof typeof NAV_ICONS;
