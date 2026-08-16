"use client";

import { motion } from "framer-motion";
import { Compass, FlaskConical, MousePointerClick } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    number: "01",
    icon: Compass,
    title: "Pick a subject",
    description:
      "Start from the dashboard and choose Physics, Chemistry, Biology, or Mathematics — each organized into focused topics.",
  },
  {
    number: "02",
    icon: FlaskConical,
    title: "Open a topic",
    description:
      "Every topic page is a workspace: concept notes on one side, a model you can manipulate on the other.",
  },
  {
    number: "03",
    icon: MousePointerClick,
    title: "Interact & observe",
    description:
      "Change a variable, run a reaction, or plot a function — and watch the result update instantly, no setup required.",
  },
];

export function FeaturesSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="Built around a simple loop: choose, open, interact."
          description="Fieldnote's structure is designed so a new simulation can slot into any topic page without changing how the rest of the app works."
        />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line dark:border-line-dark dark:bg-line-dark sm:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative bg-paper p-7 dark:bg-chalkboard"
            >
              <span className="font-mono text-xs text-pine-600 dark:text-pine-300">
                {step.number}
              </span>
              <div className="mt-4 inline-flex rounded-lg bg-pine-50 p-2.5 dark:bg-pine-900/40">
                <step.icon
                  className="h-5 w-5 text-pine-600 dark:text-pine-300"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="mt-4 font-display text-lg font-medium text-ink dark:text-bone">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
