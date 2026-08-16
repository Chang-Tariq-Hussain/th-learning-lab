"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPlatformStats } from "@/features/subjects/data/subjects";

const platformStats = getPlatformStats();

const stats = [
  { label: "Subjects", value: String(platformStats.subjectCount).padStart(2, "0") },
  { label: "Topics mapped", value: String(platformStats.topicCount) },
  { label: "Simulations live", value: String(platformStats.simulationCount) },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line dark:border-line-dark">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-light bg-grid dark:bg-grid-dark [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]"
      />

      <Container className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <Badge>
              <span className="h-1.5 w-1.5 rounded-full bg-pine-500" />
              {platformStats.simulationCount} simulations live across {platformStats.subjectCount} subjects
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-balance font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink dark:text-bone sm:text-6xl"
          >
            Science, worked out
            <br className="hidden sm:block" /> in the open.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-ink-soft dark:text-bone-soft sm:text-lg"
          >
            Fieldnote is a notebook-style home for Physics, Chemistry,
            Biology, and Mathematics — built to hold interactive
            simulations you can nudge, break, and rebuild.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button href="/dashboard" size="lg">
              Open the dashboard
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Button>
            <Button href="#how-it-works" variant="secondary" size="lg">
              See how it works
            </Button>
          </motion.div>
        </div>

        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-16 grid max-w-xl grid-cols-3 divide-x divide-line rounded-card border border-line bg-white/50 dark:divide-line-dark dark:border-line-dark dark:bg-white/[0.03]"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-5 text-center">
              <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                {stat.label}
              </dt>
              <dd className="mt-1 font-display text-2xl font-medium text-ink dark:text-bone">
                {stat.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </Container>
    </section>
  );
}
