"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getPlatformStats } from "@/features/subjects/data/subjects";

const platformStats = getPlatformStats();

export function CtaSection() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-card border border-line bg-pine-900 px-6 py-16 text-center dark:border-line-dark sm:px-16"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-grid-dark bg-grid opacity-40 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black,transparent)]"
          />
          <div className="relative">
            <h2 className="text-balance font-display text-3xl font-medium leading-tight text-bone sm:text-4xl">
              {platformStats.simulationCount} simulations, ready to explore.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-balance text-base leading-relaxed text-bone-soft">
              Jump into Physics, Chemistry, Biology, or Mathematics and start nudging, breaking,
              and rebuilding the models yourself.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                href="/dashboard"
                size="lg"
                className="bg-pine-300 text-pine-900 hover:bg-bone"
              >
                Open the dashboard
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
