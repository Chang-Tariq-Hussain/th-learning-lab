import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { ProjectileMotion } from "@/features/subjects/physics/projectile-motion";

export const metadata: Metadata = {
  title: "Projectile Motion",
  description:
    "Interactive projectile motion simulation — explore velocity, angle, gravity, and how horizontal and vertical motion combine.",
};

export default function ProjectileMotionPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/physics/projectile-motion" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Physics", href: "/dashboard/physics" },
          { label: "Kinematics", href: "/dashboard/physics/kinematics" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          Physics · Kinematics
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Projectile Motion
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Launch a projectile and see how velocity, angle, and gravity shape its
          path — horizontal and vertical motion, tracked independently, in real time.
        </p>
      </div>

      <ProjectileMotion />

      <SimulationLearnMore
        colorToken="physics"
        objectives={[
          "Explain why horizontal and vertical motion can be analyzed completely independently.",
          "Predict how changing launch angle and speed affects range, height, and time of flight.",
          "Calculate range, maximum height, and time of flight for an ideal (no-drag) projectile.",
          "Identify which launch angle maximizes range for a given speed.",
        ]}
        concepts={[
          {
            term: "Independence of horizontal and vertical motion",
            explanation:
              "Gravity only ever acts vertically. That means horizontal velocity stays constant throughout the flight, while vertical velocity changes at a constant rate — the two directions never affect each other.",
          },
          {
            term: "Range",
            explanation: "How far the projectile travels horizontally before landing back at launch height.",
            formula: "R = \\dfrac{v^2 \\sin(2\\theta)}{g}",
            formulaCaption: "v = launch speed, θ = launch angle, g = gravity",
          },
          {
            term: "Maximum height",
            explanation: "The highest point the projectile reaches, determined entirely by the vertical component of its launch velocity.",
            formula: "h_{max} = \\dfrac{v^2 \\sin^2(\\theta)}{2g}",
          },
          {
            term: "Time of flight",
            explanation: "How long the projectile stays in the air before returning to launch height.",
            formula: "t = \\dfrac{2 v \\sin(\\theta)}{g}",
          },
          {
            term: "Air resistance",
            explanation:
              "Real projectiles lose energy to drag, which shortens range, lowers the peak, and makes the descending half of the path steeper than the ascending half — unlike the perfectly symmetric ideal parabola.",
          },
        ]}
        howToUse={[
          "Set a launch speed and angle, then fire the projectile and watch the path trace out.",
          "Toggle the ideal (no-drag) trajectory on to compare it against the real one.",
          "Try 30°, 45°, and 60° at the same speed — watch how range and height trade off.",
          "Turn on air resistance and see how the path changes shape.",
          "Read the range, max height, and time-of-flight readouts after each launch.",
        ]}
        whyItMatters="Projectile motion isn't just a textbook idea — it's how engineers design everything from basketball shots to artillery trajectories to the arc of water from a fountain. The key insight, that horizontal and vertical motion can be split apart and solved separately, is one of the most reused problem-solving techniques in all of physics, showing up again later in orbital mechanics and even electromagnetism."
        tryThis={[
          "Find the launch angle that gives the maximum range at a fixed speed. Is it what you expected?",
          "Compare 30° and 60° at the same speed — their ranges should be identical. Can you see why from the formula?",
          "Turn on air resistance and launch at 45°. Does the projectile land short of, or beyond, where the ideal parabola predicts?",
        ]}
      />
    </Container>
  );
}
