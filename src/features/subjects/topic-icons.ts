import {
  Gauge,
  Component,
  Zap,
  Waves,
  Atom,
  Table2,
  Link2,
  FlaskConical,
  TestTube,
  CircleDot,
  Dna,
  HeartPulse,
  Leaf,
  Hash,
  PieChart,
  Sigma,
  TrendingUp,
  Triangle,
  FlipHorizontal2,
  BarChart3,
  Ruler,
  Move,
  Shapes,
  type LucideIcon,
} from "lucide-react";

/**
 * Resolves a topic's `slug` (from `data/subjects.ts`) to a display
 * icon — the same slug-keyed lookup pattern `glyphs.tsx` uses for
 * subject glyphs, kept as a separate registry since topic icons are
 * plain lucide icons (UI chrome) rather than bespoke line-art (brand
 * identity). Falls back to a generic icon for any topic slug not yet
 * listed here, so adding a new topic to `subjects.ts` never breaks a
 * page waiting on a matching icon.
 */
const TOPIC_ICONS: Record<string, LucideIcon> = {
  kinematics: Gauge,
  "newtonian-mechanics": Component,
  electromagnetism: Zap,
  "wave-motion": Waves,
  "atomic-structure": Atom,
  "periodic-trends": Table2,
  "chemical-bonding": Link2,
  "reaction-kinetics": FlaskConical,
  "acids-bases": TestTube,
  "cell-structure": CircleDot,
  genetics: Dna,
  "human-physiology": HeartPulse,
  ecosystems: Leaf,
  "number-sense": Hash,
  fractions: PieChart,
  algebra: Sigma,
  calculus: TrendingUp,
  geometry: Triangle,
  symmetry: FlipHorizontal2,
  statistics: BarChart3,
  measurement: Ruler,
  "coordinate-geometry": Move,
};

export function resolveTopicIcon(topicSlug: string): LucideIcon {
  return TOPIC_ICONS[topicSlug] ?? Shapes;
}
