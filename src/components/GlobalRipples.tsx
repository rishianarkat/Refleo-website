"use client";

// Persistent WebGL ripple water. Fixed behind every page at z-0 (placement
// handled by layout.tsx). Cursor movement, clicks, and scroll-triggered
// "refleo:pulse" custom events all spawn ripples in a shared shader. Color
// warms from teal toward apricot as the visitor approaches the final CTA.
// Fully inert (and never mounted) under reduced-motion, touch-only, or
// narrow-viewport conditions.

import { useEffect, useRef } from "react";

const MAX_RIPPLES = 14;
const RIPPLE_SPEED = 0.3;
const RIPPLE_LIFETIME = 4.0;
const IDLE_PULSE_EVERY = 6.0;
const MOUSE_THROTTLE = 0.5;
const PIXEL_RATIO_CAP = 1.75;
const TARGET_FPS = 60;
const BASE_ALPHA = 0.09;

const VERTEX_SHADER = [
  "varying vec2 vUv;",
  "void main() {",
  "  vUv = uv;",
  "  gl_Position = vec4(position, 1.0);",
  "}",
].join("\n");

const FRAGMENT_SHADER = [
  "precision mediump float;",
  "varying vec2 vUv;",
  "uniform vec2 uResolution;",
  "uniform float uTime;",
  "uniform float uWarm;",
  `uniform vec4 uRipples[${MAX_RIPPLES}];`,
  "",
  "void main() {",
  "  vec2 uv = vUv;",
  "  float aspect = uResolution.x / uResolution.y;",
  "  float a = 0.0;",
  `  for (int i = 0; i < ${MAX_RIPPLES}; i++) {`,
  "    vec4 r = uRipples[i];",
  "    float age = uTime - r.z;",
  "    if (r.z < 0.0 || age < 0.0 || age > " + RIPPLE_LIFETIME.toFixed(1) + ") continue;",
  "    float radius = age * " + RIPPLE_SPEED.toFixed(2) + ";",
  "    vec2 d2 = uv - r.xy;",
  "    d2.x *= aspect;",
  "    float d = length(d2);",
  "    float band = smoothstep(0.024, 0.0, abs(d - radius));",
  "    float fade = (1.0 - age / " + RIPPLE_LIFETIME.toFixed(1) + ");",
  "    a += band * fade * fade * r.w;",
  "  }",
  "  vec3 col = mix(vec3(0.498, 0.702, 0.702), vec3(0.910, 0.635, 0.486), uWarm);",
  `  gl_FragColor = vec4(col, min(a, 1.0) * ${BASE_ALPHA.toFixed(2)});`,
  "}",
].join("\n");

export default function GlobalRipples() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)")
      .matches;
    const wideEnough = window.innerWidth >= 768;

    if (!canHover || prefersReducedMotion || !wideEnough) {
      return;
    }

    let cancelled = false;
    let cleanupFns: Array<() => void> = [];

    (async () => {
      let THREE: typeof import("three");
      try {
        THREE = await import("three");
      } catch {
        return;
      }
      if (cancelled || !host) return;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
      renderer.setClearColor(0x000000, 0);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, PIXEL_RATIO_CAP);
      renderer.setPixelRatio(pixelRatio);

      const canvas = renderer.domElement;
      canvas.style.position = "absolute";
      canvas.style.inset = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      host.appendChild(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const ripples: import("three").Vector4[] = [];
      for (let i = 0; i < MAX_RIPPLES; i++) {
        ripples.push(new THREE.Vector4(0, 0, -1, 0));
      }
      let nextIndex = 0;

      const uniforms = {
        uResolution: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uWarm: { value: 0 },
        uRipples: { value: ripples },
      };

      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const clock = new THREE.Clock();
      let lastSpawn = 0;

      const spawn = (u: number, v: number, strength: number, now: number) => {
        const r = ripples[nextIndex];
        r.set(u, v, now, strength);
        nextIndex = (nextIndex + 1) % MAX_RIPPLES;
        lastSpawn = now;
      };

      const setSize = () => {
        const w = host.clientWidth || window.innerWidth;
        const h = host.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        uniforms.uResolution.value.set(w, h);
      };
      setSize();

      let lastMouseSpawn = 0;
      const handleMouseMove = (e: MouseEvent) => {
        const now = clock.getElapsedTime();
        if (now - lastMouseSpawn < MOUSE_THROTTLE) return;
        lastMouseSpawn = now;
        const u = e.clientX / window.innerWidth;
        const v = 1 - e.clientY / window.innerHeight;
        spawn(u, v, 0.45, now);
      };

      const handleClick = (e: MouseEvent) => {
        const now = clock.getElapsedTime();
        const u = e.clientX / window.innerWidth;
        const v = 1 - e.clientY / window.innerHeight;
        spawn(u, v, 1.0, now);
      };

      const handlePulse = (e: Event) => {
        const detail = (e as CustomEvent<{ x: number; y: number; strength?: number }>)
          .detail;
        if (!detail) return;
        const now = clock.getElapsedTime();
        spawn(detail.x, 1 - detail.y, (detail.strength ?? 1.4) * 0.65, now);
      };

      let scrollProgress = 0;
      const handleScroll = () => {
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress = max > 0 ? window.scrollY / max : 0;
      };
      handleScroll();

      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      window.addEventListener("click", handleClick);
      window.addEventListener("refleo:pulse", handlePulse as EventListener);
      window.addEventListener("scroll", handleScroll, { passive: true });

      const resizeObserver = new ResizeObserver(() => setSize());
      resizeObserver.observe(host);

      const frameInterval = 1000 / TARGET_FPS;
      let lastFrameTime = 0;
      let rafId = 0;

      const loop = (time: number) => {
        rafId = requestAnimationFrame(loop);
        if (document.hidden) return;
        if (time - lastFrameTime < frameInterval) return;
        lastFrameTime = time;

        const now = clock.getElapsedTime();
        uniforms.uTime.value = now;

        const targetWarm = Math.max(0, (scrollProgress - 0.55) / 0.45);
        uniforms.uWarm.value += (targetWarm - uniforms.uWarm.value) * 0.05;

        if (now - lastSpawn > IDLE_PULSE_EVERY) {
          spawn(0.5, 0.55, 0.7, now);
        }

        renderer.render(scene, camera);
      };
      rafId = requestAnimationFrame(loop);

      cleanupFns.push(() => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("click", handleClick);
        window.removeEventListener("refleo:pulse", handlePulse as EventListener);
        window.removeEventListener("scroll", handleScroll);
        resizeObserver.disconnect();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        if (canvas.parentElement === host) {
          host.removeChild(canvas);
        }
      });
    })();

    return () => {
      cancelled = true;
      cleanupFns.forEach((fn) => fn());
      cleanupFns = [];
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
    />
  );
}
