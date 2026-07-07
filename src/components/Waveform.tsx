"use client";

import { useEffect, useRef } from "react";

const WIDTH = 600;
const HEIGHT = 80;
const POINTS = 90;

interface Layer {
  amp: number;
  speed: number;
  phase: number;
}

const LAYER_1: Layer = { amp: 10, speed: 1.6, phase: 0 };
const LAYER_2: Layer = { amp: 6, speed: 2.3, phase: 1.7 };

function buildPath(t: number, layer: Layer, mx: number): string {
  let d = "";
  for (let i = 0; i < POINTS; i++) {
    const x = (i / (POINTS - 1)) * WIDTH;
    const envelope = Math.sin((Math.PI * x) / WIDTH);
    const swell =
      1 + 0.9 * Math.exp(-Math.pow(((x / WIDTH - mx) * 4), 2));
    const y =
      HEIGHT / 2 +
      Math.sin(x * 0.025 + t * layer.speed + layer.phase) *
        layer.amp *
        swell *
        envelope;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)} `;
  }
  return d.trim();
}

function buildStaticPath(layer: Layer): string {
  let d = "";
  for (let i = 0; i < POINTS; i++) {
    const x = (i / (POINTS - 1)) * WIDTH;
    const envelope = Math.sin((Math.PI * x) / WIDTH);
    const y =
      HEIGHT / 2 + Math.sin(x * 0.025 + layer.phase) * layer.amp * envelope;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)} `;
  }
  return d.trim();
}

export default function Waveform({ className }: { className?: string }) {
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      path1Ref.current?.setAttribute("d", buildStaticPath(LAYER_1));
      path2Ref.current?.setAttribute("d", buildStaticPath(LAYER_2));
      return;
    }

    const isFinePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;

    let rafId = 0;
    let targetMx = 0.5;
    let mx = 0.5;
    const start = performance.now();

    const onMouseMove = (e: MouseEvent) => {
      targetMx = e.clientX / window.innerWidth;
    };

    if (isFinePointer) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }

    const tick = (now: number) => {
      if (document.hidden) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const t = (now - start) / 1000;
      mx += (targetMx - mx) * 0.08;

      path1Ref.current?.setAttribute("d", buildPath(t, LAYER_1, mx));
      path2Ref.current?.setAttribute("d", buildPath(t, LAYER_2, mx));

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      if (isFinePointer) {
        window.removeEventListener("mousemove", onMouseMove);
      }
    };
  }, []);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`w-full h-16 ${className ?? ""}`}
    >
      <path
        ref={path1Ref}
        d={buildStaticPath(LAYER_1)}
        stroke="#7FB3B3"
        strokeOpacity={0.5}
        strokeWidth={1.5}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <path
        ref={path2Ref}
        d={buildStaticPath(LAYER_2)}
        stroke="#E8A87C"
        strokeOpacity={0.7}
        strokeWidth={1.5}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
