"use client";

import { useEffect, useRef } from "react";

// ─── Tunables ────────────────────────────────────────────────────────────
const MAX_RIPPLES = 12;          // concurrent ripples in the shader
const RIPPLE_SPEED = 0.32;       // uv units per second (must match shader)
const RIPPLE_LIFETIME = 3.6;     // seconds (must match shader)
const IDLE_PULSE_EVERY = 3.0;    // idle center pulse cadence, seconds
const MOUSE_THROTTLE = 0.18;     // min seconds between mouse-spawned ripples
const PIXEL_RATIO_CAP = 1.75;
const TARGET_FPS = 60;
// ──────────────────────────────────────────────────────────────────────────

const VERT = [
  "varying vec2 vUv;",
  "void main() {",
  "  vUv = uv;",
  "  gl_Position = vec4(position, 1.0);",
  "}",
].join("\n");

const FRAG = [
  "precision mediump float;",
  "uniform vec2 uResolution;",
  "uniform float uTime;",
  `uniform vec4 uRipples[${MAX_RIPPLES}];`,
  "varying vec2 vUv;",
  "void main() {",
  "  float aspect = uResolution.x / max(uResolution.y, 1.0);",
  "  vec2 p = vec2(vUv.x * aspect, vUv.y);",
  "  float a = 0.0;",
  `  for (int i = 0; i < ${MAX_RIPPLES}; i++) {`,
  "    vec4 r = uRipples[i];",
  "    if (r.z < 0.0) { continue; }",
  "    float age = uTime - r.z;",
  `    if (age < 0.0 || age > ${RIPPLE_LIFETIME.toFixed(1)}) { continue; }`,
  `    float radius = age * ${RIPPLE_SPEED.toFixed(2)};`,
  "    float d = distance(p, vec2(r.x * aspect, r.y));",
  "    float band = smoothstep(0.030, 0.0, abs(d - radius));",
  `    float fade = 1.0 - age / ${RIPPLE_LIFETIME.toFixed(1)};`,
  "    a += band * fade * fade * r.w;",
  "  }",
  "  gl_FragColor = vec4(0.290, 0.486, 0.486, min(a, 1.0) * 0.16);",
  "}",
].join("\n");

interface RippleCanvasProps {
  onActiveChange?: (active: boolean) => void;
}

export default function RippleCanvas({ onActiveChange }: RippleCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const activeCbRef = useRef(onActiveChange);
  activeCbRef.current = onActiveChange;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.innerWidth >= 768;
    if (!finePointer || reduced || !wide) return; // CSS ripple fallback stays visible

    let disposed = false;
    let raf = 0;
    let cleanup: (() => void) | null = null;

    (async () => {
      let THREE: typeof import("three");
      try {
        THREE = await import("three");
      } catch {
        return;
      }
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          powerPreference: "low-power",
        });
      } catch {
        return; // no WebGL — CSS fallback stays
      }
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP));
      const canvas = renderer.domElement;
      canvas.style.position = "absolute";
      canvas.style.inset = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.pointerEvents = "none";
      host.appendChild(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const rippleVecs: import("three").Vector4[] = [];
      for (let i = 0; i < MAX_RIPPLES; i++) {
        rippleVecs.push(new THREE.Vector4(0, 0, -1, 0)); // z = -1 → inactive
      }

      const uniforms = {
        uResolution: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uRipples: { value: rippleVecs },
      };

      const material = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });
      const geometry = new THREE.PlaneGeometry(2, 2);
      scene.add(new THREE.Mesh(geometry, material));

      const setSize = () => {
        const rect = host.getBoundingClientRect();
        const w = Math.max(1, rect.width);
        const h = Math.max(1, rect.height);
        renderer.setSize(w, h, false);
        uniforms.uResolution.value.set(w, h);
      };
      setSize();
      const ro = new ResizeObserver(setSize);
      ro.observe(host);

      let slot = 0;
      const spawn = (u: number, v: number, strength: number, now: number) => {
        rippleVecs[slot].set(u, v, now, strength);
        slot = (slot + 1) % MAX_RIPPLES;
      };

      let lastMouseSpawn = 0;
      let lastSpawnAny = 0;
      const onMove = (e: MouseEvent) => {
        const now = uniforms.uTime.value;
        if (now - lastMouseSpawn < MOUSE_THROTTLE) return;
        const rect = host.getBoundingClientRect();
        if (e.clientY < rect.top || e.clientY > rect.bottom) return;
        const u = (e.clientX - rect.left) / rect.width;
        const v = 1 - (e.clientY - rect.top) / rect.height;
        spawn(u, v, 0.85, now);
        lastMouseSpawn = now;
        lastSpawnAny = now;
      };
      window.addEventListener("mousemove", onMove, { passive: true });

      let inView = true;
      const io = new IntersectionObserver((entries) => {
        inView = entries[0]?.isIntersecting ?? true;
      });
      io.observe(host);

      const start = performance.now();
      let lastFrame = 0;
      const minFrameMs = 1000 / TARGET_FPS - 2;

      const loop = (nowMs: number) => {
        raf = requestAnimationFrame(loop);
        if (!inView || document.hidden) return;
        if (nowMs - lastFrame < minFrameMs) return;
        lastFrame = nowMs;

        const t = (nowMs - start) / 1000;
        uniforms.uTime.value = t;

        // Idle pulse from center when nothing spawned recently
        if (t - lastSpawnAny > IDLE_PULSE_EVERY) {
          spawn(0.5, 0.5, 1.0, t);
          lastSpawnAny = t;
        }

        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(loop);
      activeCbRef.current?.(true);

      cleanup = () => {
        window.removeEventListener("mousemove", onMove);
        ro.disconnect();
        io.disconnect();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        canvas.remove();
        activeCbRef.current?.(false);
      };
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    />
  );
}
