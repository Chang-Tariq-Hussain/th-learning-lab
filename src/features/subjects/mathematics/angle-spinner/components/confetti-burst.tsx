"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Particle {
  id: number;
  angle: number;
  distance: number;
  color: string;
  size: number;
  delay: number;
}

const COLORS = ["#22C55E", "#3D5AFE", "#F2A65A", "#0D9488", "#7C4FE0", "#F4C86A"];
const PARTICLE_COUNT = 26;

function makeParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, id) => ({
    id,
    angle: Math.random() * Math.PI * 2,
    distance: 50 + Math.random() * 80,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
    size: 4 + Math.random() * 5,
    delay: Math.random() * 0.08,
  }));
}

/** Fires a burst of small circles outward from the center of its parent (which must be `position: relative`) — used when the arm lands exactly on 90°, 180°, or 360°. */
export function ConfettiBurst({ triggerKey }: { triggerKey: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (triggerKey === 0) return;
    setParticles(makeParticles());
    const timeout = setTimeout(() => setParticles([]), 900);
    return () => clearTimeout(timeout);
  }, [triggerKey]);

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-visible" aria-hidden="true">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={`${triggerKey}-${p.id}`}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: Math.cos(p.angle) * p.distance,
              y: Math.sin(p.angle) * p.distance - 20,
              scale: 0.4,
            }}
            transition={{ duration: 0.8, delay: p.delay, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: p.size,
              height: p.size,
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
              backgroundColor: p.color,
              borderRadius: "50%",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
