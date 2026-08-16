"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CATALYST_BONUS,
  COLOR_A,
  COLOR_B,
  COLOR_PRODUCT,
  PARTICLE_RADIUS,
  temperatureToSpeedScale,
  temperatureToSuccessProbability,
} from "../model";
import type { ChamberStats, KineticsParticle, ParticleType, Spark } from "../types";

const BASE_SPEED = 26; // px/s at the low end of the temperature range
const COLLISION_DISTANCE = PARTICLE_RADIUS * 1.9;
const COOLDOWN_MS = 450;
const STATS_INTERVAL_MS = 220;
const MAX_HISTORY_POINTS = 90;
const SPARK_LIFETIME_MS = 650;

export interface UseReactionChamberOptions {
  numA: number;
  numB: number;
  tempC: number;
  catalyst: boolean;
  running: boolean;
  width: number;
  height: number;
}

function randomVelocity(speed: number) {
  const angle = Math.random() * Math.PI * 2;
  return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
}

function createParticles(numA: number, numB: number, width: number, height: number): KineticsParticle[] {
  const particles: KineticsParticle[] = [];
  const total = numA + numB;
  let id = 0;
  for (let i = 0; i < total; i++) {
    const type: ParticleType = i < numA ? "A" : "B";
    const { vx, vy } = randomVelocity(BASE_SPEED);
    particles.push({
      id: id++,
      type,
      active: true,
      x: PARTICLE_RADIUS + Math.random() * (width - PARTICLE_RADIUS * 2),
      y: PARTICLE_RADIUS + Math.random() * (height - PARTICLE_RADIUS * 2),
      vx,
      vy,
      cooldownUntil: 0,
    });
  }
  return particles;
}

/**
 * Drives a self-contained "reaction chamber" particle simulation.
 *
 * Positions are mutated on refs and written straight to the DOM nodes
 * supplied via `registerParticleEl` on every animation frame — no React
 * state changes for the 60fps particle motion itself. Stats (counts,
 * history for the graph) are only pushed into React state a few times a
 * second, which is enough to keep readouts and the progress graph feeling
 * live without re-rendering on every tick.
 */
export function useReactionChamber({
  numA,
  numB,
  tempC,
  catalyst,
  running,
  width,
  height,
}: UseReactionChamberOptions) {
  const particlesRef = useRef<KineticsParticle[]>(createParticles(numA, numB, width, height));
  const elsRef = useRef<Array<SVGGElement | null>>([]);
  const frameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const lastStatsPushRef = useRef(0);
  const elapsedRef = useRef(0);
  const successRef = useRef(0);
  const failRef = useRef(0);
  const historyRef = useRef<{ t: number; product: number }[]>([{ t: 0, product: 0 }]);

  const tempRef = useRef(tempC);
  const catalystRef = useRef(catalyst);
  useEffect(() => {
    tempRef.current = tempC;
  }, [tempC]);
  useEffect(() => {
    catalystRef.current = catalyst;
  }, [catalyst]);

  const [stats, setStats] = useState<ChamberStats>(() => ({
    reactantsRemaining: numA + numB,
    productCount: 0,
    totalParticles: numA + numB,
    successfulCollisions: 0,
    failedCollisions: 0,
    elapsed: 0,
    history: [{ t: 0, product: 0 }],
  }));
  const [sparks, setSparks] = useState<Spark[]>([]);
  const sparkIdRef = useRef(0);

  const addSpark = useCallback((x: number, y: number, kind: Spark["kind"]) => {
    const id = sparkIdRef.current++;
    setSparks((prev) => [...prev.slice(-5), { id, x, y, kind }]);
    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => s.id !== id));
    }, SPARK_LIFETIME_MS);
  }, []);

  const registerParticleEl = useCallback(
    (index: number) => (el: SVGGElement | null) => {
      elsRef.current[index] = el;
    },
    []
  );

  const reset = useCallback(() => {
    particlesRef.current = createParticles(numA, numB, width, height);
    elapsedRef.current = 0;
    successRef.current = 0;
    failRef.current = 0;
    historyRef.current = [{ t: 0, product: 0 }];
    lastTickRef.current = null;
    lastStatsPushRef.current = 0;
    setStats({
      reactantsRemaining: numA + numB,
      productCount: 0,
      totalParticles: numA + numB,
      successfulCollisions: 0,
      failedCollisions: 0,
      elapsed: 0,
      history: [{ t: 0, product: 0 }],
    });
    setSparks([]);
    // Force the freshly-created particles to paint immediately, before the next frame.
    requestAnimationFrame(() => paint());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numA, numB, width, height]);

  const paint = useCallback(() => {
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const el = elsRef.current[i];
      if (!el) continue;
      const p = particles[i];
      if (!p) continue;
      el.setAttribute("transform", `translate(${p.x}, ${p.y})`);
      el.setAttribute("opacity", p.active ? "1" : "0");
      el.style.setProperty("--kinetics-color", p.type === "A" ? COLOR_A : p.type === "B" ? COLOR_B : COLOR_PRODUCT);
      const label = el.querySelector("text");
      if (label && label.textContent !== p.type) label.textContent = p.type;
    }
  }, []);

  useEffect(() => {
    // Re-seed whenever the reactant counts change (e.g. a concentration slider).
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numA, numB]);

  useEffect(() => {
    if (!running) {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      lastTickRef.current = null;
      return;
    }

    const tick = (now: number) => {
      if (lastTickRef.current === null) lastTickRef.current = now;
      const dt = Math.min((now - lastTickRef.current) / 1000, 0.05);
      lastTickRef.current = now;
      elapsedRef.current += dt;

      const speedScale = temperatureToSpeedScale(tempRef.current);
      const successProb = Math.min(
        0.97,
        temperatureToSuccessProbability(tempRef.current) + (catalystRef.current ? CATALYST_BONUS : 0)
      );

      const particles = particlesRef.current;

      // Move + bounce off walls.
      for (const p of particles) {
        if (!p.active) continue;
        p.x += p.vx * speedScale * dt;
        p.y += p.vy * speedScale * dt;
        if (p.x < PARTICLE_RADIUS) {
          p.x = PARTICLE_RADIUS;
          p.vx = Math.abs(p.vx);
        } else if (p.x > width - PARTICLE_RADIUS) {
          p.x = width - PARTICLE_RADIUS;
          p.vx = -Math.abs(p.vx);
        }
        if (p.y < PARTICLE_RADIUS) {
          p.y = PARTICLE_RADIUS;
          p.vy = Math.abs(p.vy);
        } else if (p.y > height - PARTICLE_RADIUS) {
          p.y = height - PARTICLE_RADIUS;
          p.vy = -Math.abs(p.vy);
        }
      }

      // Check A–B collisions only (reactant pairs). AB product particles and
      // same-type pairs are left to drift past one another — this is a
      // conceptual visualization, not a physically exact collision model.
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        if (!a || !a.active || a.type !== "A" || now < a.cooldownUntil) continue;
        for (let j = 0; j < particles.length; j++) {
          const b = particles[j];
          if (!b || !b.active || b.type !== "B" || now < b.cooldownUntil) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > COLLISION_DISTANCE * COLLISION_DISTANCE) continue;

          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          const success = Math.random() < successProb;

          if (success) {
            a.type = "AB";
            b.active = false;
            successRef.current += 1;
            addSpark(midX, midY, "success");
          } else {
            failRef.current += 1;
            addSpark(midX, midY, "fail");
          }

          a.cooldownUntil = now + COOLDOWN_MS;
          b.cooldownUntil = now + COOLDOWN_MS;
          // Push the pair apart so a failed collision doesn't re-trigger next frame.
          const dist = Math.sqrt(distSq) || 1;
          const push = (COLLISION_DISTANCE - dist) / 2 + 1;
          const nx = dx / dist;
          const ny = dy / dist;
          a.x += nx * push;
          a.y += ny * push;
          b.x -= nx * push;
          b.y -= ny * push;
          a.vx = -a.vx;
          a.vy = -a.vy;
          b.vx = -b.vx;
          b.vy = -b.vy;
          break;
        }
      }

      paint();

      if (now - lastStatsPushRef.current > STATS_INTERVAL_MS) {
        lastStatsPushRef.current = now;
        const productCount = particles.filter((p) => p.type === "AB").length;
        const reactantsRemaining = particles.filter((p) => p.active && p.type !== "AB").length;
        const nextHistory = [...historyRef.current, { t: Number(elapsedRef.current.toFixed(2)), product: productCount }];
        if (nextHistory.length > MAX_HISTORY_POINTS) nextHistory.shift();
        historyRef.current = nextHistory;
        setStats({
          reactantsRemaining,
          productCount,
          totalParticles: particles.length,
          successfulCollisions: successRef.current,
          failedCollisions: failRef.current,
          elapsed: elapsedRef.current,
          history: nextHistory,
        });
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      lastTickRef.current = null;
    };
  }, [running, width, height, addSpark, paint]);

  // Paint once on mount / whenever particle count changes, even if paused.
  useEffect(() => {
    paint();
  }, [paint, stats.totalParticles]);

  return { registerParticleEl, stats, sparks, reset };
}
