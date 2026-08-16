"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Particle {
  id: number;
  angle: number;
  distance: number;
  color: string;
  width: number;
  height: number;
  rotate: number;
  delay: number;
}

const COLORS = [
  "#7C4FE0",
  "#F4C86A",
  "#E0524F",
  "#F2A65A",
  "#2E9E5B",
  "#3D5AFE",
];
const PARTICLE_COUNT = 30;

function makeParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, id) => ({
    id,
    angle: Math.random() * Math.PI * 2,
    distance: 60 + Math.random() * 90,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
    width: 5 + Math.random() * 5,
    height: 3 + Math.random() * 4,
    rotate: Math.random() * 360,
    delay: Math.random() * 0.1,
  }));
}

/** Fires a burst of small rectangles outward from the center of its parent (which must be `position: relative`). */
export function ConfettiBurst({ triggerKey }: { triggerKey: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (triggerKey === 0) return;
    setParticles(makeParticles());
    const timeout = setTimeout(() => setParticles([]), 1000);
    return () => clearTimeout(timeout);
  }, [triggerKey]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 overflow-visible"
      aria-hidden="true"
    >
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={`${triggerKey}-${p.id}`}
            initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: Math.cos(p.angle) * p.distance,
              y: Math.sin(p.angle) * p.distance - 30,
              rotate: p.rotate,
              scale: 0.5,
            }}
            transition={{ duration: 0.9, delay: p.delay, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: p.width,
              height: p.height,
              marginLeft: -p.width / 2,
              marginTop: -p.height / 2,
              backgroundColor: p.color,
              borderRadius: 1.5,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
