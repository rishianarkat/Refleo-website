"use client";

import { useEffect, useRef } from "react";

// ─── Tunables ────────────────────────────────────────────────────────────
const PARTICLE_COUNT = 36;
const BAND_HEIGHT = 140;      // px height of the particle band straddling the seam
const FADE_ZONE = 50;         // px fade at top and bottom edges
const MIN_FALL_SPEED = 18;    // px/s
const MAX_FALL_SPEED = 46;    // px/s
const MIN_SIZE = 2;
const MAX_SIZE = 3;
const APRICOT = "232,168,124";
// ──────────────────────────────────────────────────────────────────────────

interface Particle {
  baseX: number;
  y: number;
  vy: number;
  phase: number;
  amp: number;
  driftSpeed: number;
  size: number;
  alpha: number;
}

export default function ParticleFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    let width = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setSize = () => {
      width = canvas.offsetWidth;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(BAND_HEIGHT * dpr);
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        baseX: Math.random(),
        y: Math.random() * BAND_HEIGHT,
        vy: rand(MIN_FALL_SPEED, MAX_FALL_SPEED),
        phase: Math.random() * Math.PI * 2,
        amp: rand(4, 14),
        driftSpeed: rand(0.4, 1.1),
        size: rand(MIN_SIZE, MAX_SIZE),
        alpha: rand(0.25, 0.6),
      });
    }

    let inView = false;
    let raf = 0;
    let last = 0;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!inView || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;

      ctx2d.clearRect(0, 0, width, BAND_HEIGHT);

      for (const p of particles) {
        p.y += p.vy * dt;
        if (p.y > BAND_HEIGHT + p.size) {
          p.y = -p.size;
          p.baseX = Math.random();
        }
        const x = p.baseX * width + Math.sin(t * p.driftSpeed + p.phase) * p.amp;
        const topFade = Math.min(p.y / FADE_ZONE, 1);
        const bottomFade = Math.min((BAND_HEIGHT - p.y) / FADE_ZONE, 1);
        const fade = Math.max(0, Math.min(topFade, bottomFade));
        ctx2d.fillStyle = "rgba(" + APRICOT + "," + (p.alpha * fade).toFixed(3) + ")";
        ctx2d.beginPath();
        ctx2d.arc(x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx2d.fill();
      }
    };

    const io = new IntersectionObserver((entries) => {
      inView = entries[0]?.isIntersecting ?? false;
    });
    io.observe(canvas);

    const onResize = () => setSize();
    window.addEventListener("resize", onResize, { passive: true });

    raf = requestAnimationFrame((n) => {
      last = n;
      loop(n);
    });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative"
      style={{ height: 0, zIndex: 20 }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute left-0 w-full"
        style={{ top: -BAND_HEIGHT / 2, height: BAND_HEIGHT }}
      />
    </div>
  );
}
