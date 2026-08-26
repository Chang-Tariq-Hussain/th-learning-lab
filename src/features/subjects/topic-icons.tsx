import {
  Atom,
  BarChart3,
  CircleDot,
  Compass,
  Dna,
  Dumbbell,
  FlaskConical,
  FlipHorizontal,
  Gauge,
  HeartPulse,
  Hash,
  Infinity as InfinityIcon,
  Leaf,
  Link2,
  PieChart,
  Ruler,
  Scale,
  Shapes,
  Sigma,
  Sparkles,
  Table2,
  TestTube,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * One entry per topic `slug` across every subject. A topic that's added
 * to `data/subjects.ts` without a matching entry here still renders —
 * `topicIcons.tsx`'s `resolveTopicIcon` below falls back to a generic
 * icon rather than crashing, since a missing icon shouldn't block a new
 * topic from shipping.
 */
const topicIconMap: Record<string, LucideIcon> = {
  // Physics
  kinematics: Gauge,
  "newtonian-mechanics": Dumbbell,
  "circular-motion-and-gravitation": CircleDot,
  electromagnetism: Zap,
  "wave-motion": Waves,

  // Chemistry
  "atomic-structure": Atom,
  "periodic-trends": Table2,
  "chemical-bonding": Link2,
  "reaction-kinetics": FlaskConical,
  "acids-bases": TestTube,

  // Biology
  "cell-structure": CircleDot,
  genetics: Dna,
  "human-physiology": HeartPulse,
  ecosystems: Leaf,

  // Mathematics
  "number-sense": Hash,
  fractions: PieChart,
  algebra: Sigma,
  calculus: InfinityIcon,
  ratios: Scale,
  geometry: Shapes,
  symmetry: FlipHorizontal,
  statistics: BarChart3,
  measurement: Ruler,
  "coordinate-geometry": Compass,
};

const FALLBACK_ICON: LucideIcon = Sparkles;

export function resolveTopicIcon(slug: string): LucideIcon {
  return topicIconMap[slug] ?? FALLBACK_ICON;
}
