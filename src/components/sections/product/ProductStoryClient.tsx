"use client";

// The product story: one continuous walk through the app, scrubbed by scroll.
//
//   motion OK      A tall wrapper reserves the scroll distance; inside it a
//                  sticky stage holds a phone, the captions and a progress
//                  rail, on the ink ground with a soft glow behind the phone.
//                  ScrollTrigger (scrub) turns the wrapper's scroll progress
//                  into a position in the image sequence in public/journey/.
//                  The drawn position eases toward the scroll position (a few
//                  frames of visual lag, nothing more), and between two frames
//                  the canvas blends them, so the scrub is continuous at any
//                  scroll speed. Everything else on the stage (the phone's
//                  pose and shadow, the glow, the screen's reflection, the
//                  rail) follows the same drawn position, through transform
//                  and opacity only, written at most once per animation frame
//                  and only when it changed. Nothing is hijacked: the page
//                  scrolls exactly as it always does, so wheel, touch and
//                  keyboard all work, both ways. On phones: phone above,
//                  caption below, and the rail becomes a bar.
//   reduced motion No pinning, no scrubbing, no drift, no pulses: a plain
//                  vertical list of key frames as images, each with its
//                  captions, in the same dress.
//
// Captions are real DOM text (h3 + p). The canvas, the frames, the glow and
// the rail are decorative (aria-hidden): the captions carry the meaning.
// Motion follows refleo-web/docs/MOTION.md: no bounce, no flashing, no
// parallax layers; UI transitions 150-300 ms; nothing shifts layout.

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  journeyFrameSrc,
  type JourneyCaption,
  type JourneyGlow,
  type JourneyManifest,
} from "./storyJourney";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/** Scroll distance per caption while the stage is pinned, in viewport heights. */
const VH_PER_CAPTION = 90;
/** Frames fetched before anything else, in order, once the section is near. */
const EAGER_FRAMES = 30;
/** Frame downloads in flight at once. */
const PARALLEL = 6;
/** Frames fetched ahead, in the direction of travel, before any behind. */
const LOOKAHEAD = 48;
/**
 * How far the drawn position closes on the scroll position per 60 Hz frame
 * (scaled for other refresh rates), and how close counts as arrived. With 400
 * frames a long scroll passes one about every 0.002 of progress, so the snap
 * is a tenth of a frame: the settle never ends on a visible hop.
 */
const EASE_PER_FRAME = 0.15;
const SNAP = 0.0002;
/** The apricot ring that answers a touch-down: one ring, then gone. */
const PULSE_MS = 300;
/** A jump bigger than this (a restored scroll, a keyboard End) plays no pulses. */
const PULSE_MAX_STEP = 0.04;

const APRICOT = "232, 168, 124";
const TEAL = "74, 124, 124";

/**
 * The phone's pose at each caption: a few degrees of turn and tilt and a few
 * percent of scale, eased from one to the next as the story advances.
 */
const POSES: readonly { ry: number; rz: number; s: number }[] = [
  { ry: -4, rz: 1, s: 0.97 },
  { ry: 3, rz: -0.8, s: 0.99 },
  { ry: -2.5, rz: 0.6, s: 1 },
  { ry: 3.5, rz: -1, s: 1 },
  { ry: 0, rz: 0, s: 1.03 },
  { ry: -3, rz: 0.8, s: 1 },
  { ry: 2, rz: -0.5, s: 1.02 },
];

type Pose = (typeof POSES)[number];

function poseTransform({ ry, rz, s }: Pose): string {
  return `perspective(1600px) rotateY(${ry.toFixed(3)}deg) rotateZ(${rz.toFixed(3)}deg) scale(${s.toFixed(4)})`;
}

const smoothstep = (u: number) => u * u * (3 - 2 * u);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** The last index whose value is at or below `p` (values ascending). */
function lastAtOrBelow(values: readonly number[], p: number): number {
  let lo = 0;
  let hi = values.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (values[mid] <= p) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/** The caption stop at or before `p`, and how far (0..1) it is to the next. */
function between(p: number, stops: readonly number[]): [number, number] {
  const k = lastAtOrBelow(stops, p);
  if (k >= stops.length - 1) return [k, 0];
  return [k, clamp01((p - stops[k]) / (stops[k + 1] - stops[k]))];
}

function poseAt(p: number, stops: readonly number[]): Pose {
  const [k, u] = between(p, stops);
  const a = POSES[Math.min(k, POSES.length - 1)];
  const b = POSES[Math.min(k + 1, POSES.length - 1)];
  const e = smoothstep(u);
  return { ry: a.ry + (b.ry - a.ry) * e, rz: a.rz + (b.rz - a.rz) * e, s: a.s + (b.s - a.s) * e };
}

/**
 * The glow at progress `p`: the captions' own settings, eased from one to
 * the next over the whole of each caption, so it drifts slowly and never
 * stops while the story moves.
 */
function glowAt(p: number, stops: readonly number[], glows: readonly JourneyGlow[]): JourneyGlow {
  const [k, u] = between(p, stops);
  const a = glows[k];
  const b = glows[Math.min(k + 1, glows.length - 1)];
  const e = smoothstep(u);
  return { warm: a.warm + (b.warm - a.warm) * e, x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e };
}

/** Teal layer: most of the light, cooling as the apricot rises. */
function tealStyle(g: JourneyGlow, p: number): [string, string] {
  const s = 1 + 0.05 * Math.sin(p * Math.PI * 2);
  return [
    `translate3d(${g.x.toFixed(2)}%, ${g.y.toFixed(2)}%, 0) scale(${s.toFixed(4)})`,
    (0.62 - 0.2 * g.warm).toFixed(3),
  ];
}

/**
 * Apricot layer: low behind the phone, toward the caption, and only as strong
 * as the beat is warm.
 */
function apricotStyle(g: JourneyGlow, p: number): [string, string] {
  const s = 0.85 + 0.3 * g.warm;
  const x = -24 - g.x * 1.6 + 5 * Math.cos(p * Math.PI * 3);
  const y = 26 - g.y * 1.4;
  return [
    `translate3d(${x.toFixed(2)}%, ${y.toFixed(2)}%, 0) scale(${s.toFixed(4)})`,
    (0.06 + 0.5 * g.warm).toFixed(3),
  ];
}

const TEAL_LIGHT = `radial-gradient(closest-side, rgba(127, 179, 179, 0.55), rgba(${TEAL}, 0.55) 30%, rgba(${TEAL}, 0.18) 62%, rgba(${TEAL}, 0) 100%)`;
const APRICOT_LIGHT = `radial-gradient(closest-side, rgba(242, 200, 160, 0.8), rgba(${APRICOT}, 0.5) 28%, rgba(${APRICOT}, 0.14) 62%, rgba(${APRICOT}, 0) 100%)`;

/**
 * The contact shadow under the phone: darker and a little wider the more the
 * phone is turned, and shifted away from the side it turns toward.
 */
function shadowStyle({ ry, rz }: Pose): [string, string] {
  const tilt = clamp01(Math.abs(ry) / 4 + Math.abs(rz) / 2.5);
  return [
    `translateX(${(-ry * 3.5).toFixed(2)}px) scale(${(0.9 + 0.12 * tilt).toFixed(4)}, ${(1 + 0.3 * tilt).toFixed(4)})`,
    (0.55 + 0.4 * tilt).toFixed(3),
  ];
}

/** The screen's reflection slides a little across the glass as the story runs. */
const glareTransform = (p: number) => `translate3d(${(-12 + 24 * p).toFixed(2)}%, 0, 0)`;

/** How full the rail is: tick k exactly when caption k takes over. */
function railFill(p: number, stops: readonly number[]): number {
  const [k, u] = between(p, stops);
  return k >= stops.length - 1 ? 1 : (k + u) / (stops.length - 1);
}

function useReducedMotion(): boolean | null {
  // null until mounted: the server and the first client render agree, and CSS
  // (motion-reduce:) already shows the right layout before this is known.
  const [reduced, setReduced] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(REDUCED_QUERY);
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function ProductStoryClient({
  manifest,
  captions,
}: {
  manifest: JourneyManifest;
  captions: readonly JourneyCaption[];
}) {
  const reduced = useReducedMotion();

  return (
    <>
      <div className="motion-reduce:hidden">
        <Journey manifest={manifest} captions={captions} enabled={reduced === false} />
      </div>
      <div className="hidden motion-reduce:block">
        <StillStory manifest={manifest} captions={captions} />
      </div>
    </>
  );
}

function Journey({
  manifest,
  captions,
  enabled,
}: {
  manifest: JourneyManifest;
  captions: readonly JourneyCaption[];
  enabled: boolean;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const entryRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const tealRef = useRef<HTMLDivElement>(null);
  const apricotRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // ── Entering: the phone rises 24px and fades in, once ──────────────────
  useEffect(() => {
    const el = entryRef.current;
    if (!enabled || !el) return;
    // Already on screen (a reload mid-page): no entrance.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.style.opacity = "0";
    el.style.transform = "translate3d(0, 24px, 0)";
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        el.style.transition =
          "opacity 300ms cubic-bezier(0.16, 1, 0.3, 1), transform 300ms cubic-bezier(0.16, 1, 0.3, 1)";
        el.style.opacity = "";
        el.style.transform = "";
        io.disconnect();
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.style.opacity = "";
      el.style.transform = "";
      el.style.transition = "";
    };
  }, [enabled]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const phone = phoneRef.current;
    const canvas = canvasRef.current;
    const shadow = shadowRef.current;
    const glare = glareRef.current;
    const teal = tealRef.current;
    const apricot = apricotRef.current;
    const rail = railRef.current;
    const bar = barRef.current;
    const ctx = canvas?.getContext("2d");
    if (!enabled || !wrapper || !phone || !canvas || !ctx) return;
    if (!shadow || !glare || !teal || !apricot || !rail || !bar) return;

    const n = manifest.frames;
    const keys = manifest.keys;
    // Where each frame stops being exact: a still holds until its end, a
    // motion frame is exact at a single position.
    const ends = keys.slice();
    for (const [i, end] of manifest.holds) ends[i] = end;
    const stops = manifest.captions.map((c) => c.activeAt);
    const glows = captions.map((c) => c.glow);
    const taps = manifest.taps;
    const images: (HTMLImageElement | null)[] = new Array(n).fill(null);
    const requested = new Uint8Array(n);
    const pending = new Set<HTMLImageElement>();

    /** Scroll progress, 0..1, from ScrollTrigger. */
    let target = 0;
    /** Drawn progress: eases toward `target`. Everything on the stage follows it. */
    let shown = 0;
    /**
     * Once the drawn position has caught up with a scroll that stopped
     * between two frames, it carries on (the way it was going) to the next
     * whole frame: a blend is motion, and a still double exposure is not.
     */
    let rest: number | null = null;
    let lastTime = 0;
    let drawnA: HTMLImageElement | null = null;
    let drawnB: HTMLImageElement | null = null;
    let drawnMix = -1;
    let dirty = true;
    /** A pulse ring is on the canvas: the next draw must repaint without it. */
    let ringDrawn = false;
    let raf = 0;
    let started = false;
    let disposed = false;
    let lastActive = -1;
    /** Frame the scroll is at, and the way it last moved (+1 down, -1 up). */
    let heading = 0;
    let direction = 1;
    /** The live pulse: where, and when it started (animation-frame time). */
    let pulse: { x: number; y: number; t0: number } | null = null;

    // Style writes happen only when the value changed.
    const last = new Map<string, string>();
    const write = (el: HTMLElement, prop: "transform" | "opacity", value: string, key: string) => {
      if (last.get(key) === value) return;
      last.set(key, value);
      el.style[prop] = value;
    };

    // ── Drawing ────────────────────────────────────────────────────────────
    const nearestLoaded = (i: number): HTMLImageElement | null => {
      // Prefer the frame just before: the screen the visitor came from.
      for (let d = 0; d < n; d++) {
        if (i - d >= 0 && images[i - d]) return images[i - d];
        if (i + d < n && images[i + d]) return images[i + d];
      }
      return null;
    };

    /** The two frames around progress `p`, and how far from the first to the second. */
    const blendAt = (p: number): [number, number] => {
      const k = lastAtOrBelow(keys, p);
      if (k >= n - 1 || p <= ends[k]) return [k, 0];
      const span = keys[k + 1] - ends[k];
      return [k, span > 0 ? Math.min(1, (p - ends[k]) / span) : 1];
    };

    /** Draw the screen at `p`, with the pulse `u` (0..1) through, if any. */
    const draw = (p: number, u: number) => {
      const [k, f] = blendAt(p);
      let a = images[k];
      let b = f > 0 ? images[k + 1] : null;
      let mix = f;
      if (!a || (f > 0 && !b)) {
        // A frame is still on its way: show the nearest one we have, whole.
        a = nearestLoaded(f < 0.5 ? k : k + 1);
        b = null;
        mix = 0;
      }
      if (!a) return;
      // 1/256 steps: finer than 8-bit alpha can show.
      const q = b ? Math.round(mix * 256) / 256 : 0;
      if (!dirty && !ringDrawn && u < 0 && a === drawnA && b === drawnB && q === drawnMix) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.globalAlpha = 1;
      ctx.drawImage(a, 0, 0, w, h);
      if (b && q > 0) {
        ctx.globalAlpha = q;
        ctx.drawImage(b, 0, 0, w, h);
      }
      if (pulse && u >= 0) {
        // Out from the touch disc's edge, fading as it goes.
        const e = 1 - Math.pow(1 - u, 3);
        const r = w * (0.055 + 0.075 * e);
        ctx.globalAlpha = 0.85 * Math.pow(1 - u, 1.5);
        ctx.strokeStyle = `rgb(${APRICOT})`;
        ctx.lineWidth = w * 0.009;
        ctx.shadowColor = `rgba(${APRICOT}, 0.9)`;
        ctx.shadowBlur = w * 0.02;
        ctx.beginPath();
        ctx.arc(pulse.x * w, pulse.y * h, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
      }
      ctx.globalAlpha = 1;
      drawnA = a;
      drawnB = b;
      drawnMix = q;
      dirty = false;
      ringDrawn = u >= 0;
    };

    const tick = (time: number) => {
      raf = 0;
      const dt = lastTime ? Math.min(100, time - lastTime) : 16.7;
      lastTime = time;
      const before = shown;
      const goal = rest ?? target;
      // Ease toward the scroll position, the same pace at 60 and 120 Hz.
      const ease = 1 - Math.pow(1 - EASE_PER_FRAME, dt / 16.7);
      shown += (goal - shown) * ease;
      if (Math.abs(goal - shown) < SNAP) shown = goal;
      if (rest === null && shown === target) {
        const [k, f] = blendAt(target);
        if (f > 0 && f < 1) rest = direction > 0 ? keys[k + 1] : ends[k];
      }

      // A touch-down passed on the way forward: answer it with a ring.
      if (shown > before && shown - before < PULSE_MAX_STEP) {
        for (const t of taps) {
          if (t.at > before && t.at <= shown) pulse = { x: t.x, y: t.y, t0: time };
        }
      }
      let u = -1;
      if (pulse) {
        u = (time - pulse.t0) / PULSE_MS;
        if (u >= 1) {
          pulse = null;
          u = -1;
        }
      }

      draw(shown, u);

      const pose = poseAt(shown, stops);
      write(phone, "transform", poseTransform(pose), "phone");
      const [st, so] = shadowStyle(pose);
      write(shadow, "transform", st, "shadow-t");
      write(shadow, "opacity", so, "shadow-o");
      const g = glowAt(shown, stops, glows);
      const [tt, to] = tealStyle(g, shown);
      write(teal, "transform", tt, "teal-t");
      write(teal, "opacity", to, "teal-o");
      const [at, ao] = apricotStyle(g, shown);
      write(apricot, "transform", at, "apricot-t");
      write(apricot, "opacity", ao, "apricot-o");
      write(glare, "transform", glareTransform(shown), "glare");
      const fill = railFill(shown, stops).toFixed(4);
      write(rail, "transform", `scaleY(${fill})`, "rail");
      write(bar, "transform", `scaleX(${fill})`, "bar");

      const a = lastAtOrBelow(stops, shown);
      if (a !== lastActive) {
        lastActive = a;
        setActive(a);
      }
      if (shown !== (rest ?? target) || pulse || ringDrawn) schedule();
      else lastTime = 0;
    };
    const schedule = () => {
      if (!raf && !disposed) raf = requestAnimationFrame(tick);
    };

    // ── Loading: the first frames first, then the way the visitor is going ─
    const nextToLoad = (): number => {
      for (let i = 0; i < Math.min(EAGER_FRAMES, n); i++) if (!requested[i]) return i;
      for (let d = 0; d < LOOKAHEAD; d++) {
        const i = heading + direction * d;
        if (i >= 0 && i < n && !requested[i]) return i;
      }
      for (let d = 0; d < n; d++) {
        if (heading + d < n && !requested[heading + d]) return heading + d;
        if (heading - d >= 0 && !requested[heading - d]) return heading - d;
      }
      return -1;
    };
    const retried = new Uint8Array(n);
    const pump = () => {
      while (started && !disposed && pending.size < PARALLEL) {
        const i = nextToLoad();
        if (i < 0) return;
        requested[i] = 1;
        load(i);
      }
    };
    const load = (i: number) => {
      const img = new Image();
      img.decoding = "async";
      pending.add(img);
      const done = (ok: boolean) => {
        pending.delete(img);
        if (disposed) return;
        if (ok) {
          // Redraws only if this frame (or a nearer stand-in) is on screen.
          images[i] = img;
          schedule();
        }
        pump();
      };
      img.onload = () => {
        // Decode off the main thread before the first draw where supported.
        if (typeof img.decode === "function") {
          img.decode().then(
            () => done(true),
            () => done(true),
          );
        } else done(true);
      };
      img.onerror = () => {
        // One retry for a dropped request; after that the nearest loaded
        // frame stands in for this one.
        if (!retried[i]) {
          retried[i] = 1;
          requested[i] = 0;
        }
        done(false);
      };
      img.src = journeyFrameSrc(manifest, i);
    };
    const start = () => {
      if (started) return;
      started = true;
      pump();
    };

    // Start fetching when the section is within about a screen of view.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    io.observe(wrapper);

    // ── A crisp canvas at the device's pixel ratio ─────────────────────────
    const resize = () => {
      // Layout size, not the transformed box: the phone's drift scales it.
      // A few percent over, so the drift's largest scale is still crisp.
      const dpr = Math.min(window.devicePixelRatio || 1, 3) * 1.03;
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        dirty = true;
        schedule();
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // ── Scroll: section progress, scrubbed ─────────────────────────────────
    const state = { p: 0 };
    const gctx = gsap.context(() => {
      const tween = gsap.to(state, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const i = lastAtOrBelow(keys, state.p);
          if (i !== heading) {
            direction = i > heading ? 1 : -1;
            heading = i;
          }
          target = state.p;
          rest = null;
          schedule();
        },
      });
      // A reload that restores the scroll position lands mid-story: start
      // there, not with a long ease from the top.
      target = shown = tween.scrollTrigger?.progress ?? 0;
      heading = lastAtOrBelow(keys, target);
      schedule();
    }, wrapper);

    const styled = [phone, shadow, glare, teal, apricot, rail, bar];
    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      gctx.revert();
      pending.forEach((img) => {
        img.onload = null;
        img.onerror = null;
        img.src = "";
      });
      pending.clear();
      for (const el of styled) {
        el.style.transform = "";
        el.style.opacity = "";
      }
    };
  }, [enabled, manifest, captions]);

  const count = captions.length;
  const wrapperStyle: CSSProperties = { height: `${100 + count * VH_PER_CAPTION}vh` };
  const g0 = captions[0].glow;
  const [teal0, tealOpacity0] = tealStyle(g0, 0);
  const [apricot0, apricotOpacity0] = apricotStyle(g0, 0);
  const [shadow0, shadowOpacity0] = shadowStyle(POSES[0]);

  return (
    <div ref={wrapperRef} style={wrapperStyle} className="relative mt-8 md:mt-12">
      {/* The stage is exactly one small viewport tall (svh where supported,
          so iOS toolbars never push it off screen). The phone takes what the
          navbar and the caption leave: on phones, 380px covers the navbar,
          a three-line caption, the progress bar, the gaps and the site's
          fixed Human/Machine toggle at the bottom. */}
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pb-14 pt-16 supports-[height:100svh]:h-[100svh] md:pb-10 md:pt-24">
        {/* The ground: ink, with a teal and an apricot light behind the
            phone. Two layers, transform and opacity only. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]"
        >
          <div className="absolute left-1/2 top-[33%] md:left-[73%] md:top-[52%]">
            <GlowLayer
              ref={tealRef}
              light={TEAL_LIGHT}
              size="max(72vmax, 720px)"
              style={{ transform: teal0, opacity: tealOpacity0 }}
            />
            <GlowLayer
              ref={apricotRef}
              light={APRICOT_LIGHT}
              size="max(46vmax, 480px)"
              style={{ transform: apricot0, opacity: apricotOpacity0 }}
            />
            {/* Refleo's ripple, held still: two hairline rings. */}
            <div className="absolute left-[-24rem] top-[-24rem] h-[48rem] w-[48rem] rounded-full border border-cream/[0.05]" />
            <div className="absolute left-[-36rem] top-[-36rem] h-[72rem] w-[72rem] rounded-full border border-cream/[0.035]" />
          </div>
          <div className="v2-grain absolute inset-0" />
        </div>

        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-6 md:grid md:grid-cols-12 md:items-center md:gap-8 lg:gap-12 lg:px-12">
          <div
            aria-hidden="true"
            className="flex justify-center [--screen-h:min(50vh,calc(100vh_-_380px))] supports-[height:100svh]:[--screen-h:min(50svh,calc(100svh_-_380px))] md:col-span-6 md:col-start-7 md:row-start-1 md:[--screen-h:min(70vh,720px,calc(100vh_-_170px))] md:supports-[height:100svh]:[--screen-h:min(70svh,720px,calc(100svh_-_170px))]"
          >
            <div ref={entryRef} className="relative">
              {/* Contact shadow: the phone standing just above the ground. */}
              <div
                ref={shadowRef}
                className="absolute bottom-[-5%] left-[8%] h-[9%] w-[84%] rounded-[50%] will-change-transform"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(0,0,0,0.85), rgba(0,0,0,0.35) 55%, transparent)",
                  filter: "blur(14px)",
                  transform: shadow0,
                  opacity: shadowOpacity0,
                }}
              />
              <PhoneFrame
                ref={phoneRef}
                manifest={manifest}
                style={{ transform: poseTransform(POSES[0]) }}
                className="will-change-transform"
                glareRef={glareRef}
                glareStyle={{ transform: glareTransform(0) }}
              >
                {/* Frame 0 as a plain image: on screen before any script runs,
                    and under the canvas until the canvas has drawn. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={journeyFrameSrc(manifest, 0)}
                  alt=""
                  width={manifest.width}
                  height={manifest.height}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full"
                />
                <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
              </PhoneFrame>
            </div>
          </div>

          <div className="w-full max-w-md md:col-span-6 md:col-start-1 md:row-start-1 md:flex md:max-w-none md:items-center md:gap-10 lg:gap-14">
            {/* The rail: seven ticks, filling downward as the story runs. */}
            <div
              aria-hidden="true"
              className="relative hidden h-[min(22rem,52vh)] shrink-0 md:block"
            >
              <div className="absolute bottom-[5px] left-[5px] top-[5px] w-px bg-cream/15">
                <div
                  ref={railRef}
                  className="absolute inset-0 origin-top bg-gradient-to-b from-apricot/40 to-apricot will-change-transform"
                  style={{ transform: "scaleY(0)" }}
                />
              </div>
              <ol className="relative flex h-full flex-col justify-between">
                {captions.map((c, i) => (
                  <li key={c.label} className="flex items-center gap-4">
                    <Tick state={i === active ? "on" : i < active ? "past" : "ahead"} />
                    <span
                      className={`hidden font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-200 ease-out lg:inline ${
                        i === active ? "text-apricot" : i < active ? "text-cream/55" : "text-cream/30"
                      }`}
                    >
                      {c.label}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="relative min-w-0 flex-1">
              <StepNumber value={active} count={count} />
              <ol className="relative grid">
                {captions.map((c, i) => {
                  const on = i === active;
                  // The outgoing caption fades first (150 ms), rising away;
                  // the incoming one follows, lifting 12px into place (250 ms).
                  const place = on
                    ? "translate-y-0 opacity-100 delay-[120ms] duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    : `pointer-events-none opacity-0 duration-150 ease-in ${
                        i < active ? "-translate-y-3" : "translate-y-3"
                      }`;
                  return (
                    <li
                      key={c.title}
                      data-caption={i}
                      aria-hidden={on ? undefined : true}
                      className={`col-start-1 row-start-1 pt-[clamp(3.25rem,6.8vw,6.5rem)] transition-[opacity,transform] ${place}`}
                    >
                      <CaptionText caption={c} />
                    </li>
                  );
                })}
              </ol>

              {/* Phones: the rail as a bar under the caption. */}
              <div aria-hidden="true" className="mt-5 md:hidden">
                <div className="relative h-[9px]">
                  <div className="absolute left-[4px] right-[4px] top-[4px] h-px bg-cream/15">
                    <div
                      ref={barRef}
                      className="absolute inset-0 origin-left bg-gradient-to-r from-apricot/40 to-apricot will-change-transform"
                      style={{ transform: "scaleX(0)" }}
                    />
                  </div>
                  <div className="relative flex justify-between">
                    {captions.map((c, i) => (
                      <Tick
                        key={c.label}
                        small
                        state={i === active ? "on" : i < active ? "past" : "ahead"}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.16em]">
                  <span className="text-apricot">{captions[active].label}</span>
                  <span className="tabular-nums text-cream/45">
                    {pad(active + 1)} / {pad(count)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** One of the glow's two lights: a big, soft, heavily blurred disc. */
const GlowLayer = forwardRef<HTMLDivElement, { light: string; size: string; style: CSSProperties }>(
  function GlowLayer({ light, size, style }, ref) {
    return (
      <div
        ref={ref}
        className="absolute rounded-full will-change-[transform,opacity]"
        style={{
          width: size,
          height: size,
          left: `calc(${size} / -2)`,
          top: `calc(${size} / -2)`,
          background: light,
          filter: "blur(48px)",
          ...style,
        }}
      />
    );
  },
);

function Tick({ state, small = false }: { state: "on" | "past" | "ahead"; small?: boolean }) {
  const size = small ? "h-[9px] w-[9px]" : "h-[11px] w-[11px]";
  const look =
    state === "on"
      ? "border-apricot bg-apricot shadow-[0_0_14px_rgba(232,168,124,0.65)]"
      : state === "past"
        ? "border-apricot/60 bg-ink"
        : "border-cream/25 bg-ink";
  return (
    <span
      className={`block shrink-0 rounded-full border transition-[background-color,border-color,box-shadow] duration-200 ease-out ${size} ${look}`}
    />
  );
}

/**
 * The big faint step number behind the title. The digits sit in a column
 * behind a one-line mask and roll to the active step, counting through any
 * steps in between.
 */
function StepNumber({ value, count }: { value: number; count: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-[-0.04em] top-0 h-[1em] select-none overflow-hidden font-serif text-[clamp(5rem,10vw,9.5rem)] font-medium leading-none tracking-[-0.04em] text-cream/10"
    >
      <div
        className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateY(${-value}em)` }}
      >
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="h-[1em]">
            {pad(i + 1)}
          </div>
        ))}
      </div>
    </div>
  );
}

function CaptionText({ caption }: { caption: JourneyCaption }) {
  return (
    <>
      <h3 className="text-balance font-serif text-[clamp(1.75rem,3.4vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.025em] text-cream">
        {caption.title}
      </h3>
      <p className="mt-3 max-w-md text-base leading-relaxed text-cream/65 md:mt-5 md:text-lg">
        {caption.body}
      </p>
    </>
  );
}

/**
 * The phone: a dark body with a hairline edge highlight around a rounded
 * screen sized by the `--screen-h` custom property, a faint reflection over
 * the glass. No device artwork.
 */
const PhoneFrame = forwardRef<
  HTMLDivElement,
  {
    manifest: JourneyManifest;
    children: ReactNode;
    style?: CSSProperties;
    className?: string;
    glareRef?: Ref<HTMLDivElement>;
    glareStyle?: CSSProperties;
  }
>(function PhoneFrame({ manifest, children, style, className = "", glareRef, glareStyle }, ref) {
  return (
    <div
      ref={ref}
      style={{
        background: "linear-gradient(150deg, #1f3131 0%, #0e1a1a 38%, #0a1414 70%, #172727 100%)",
        boxShadow: [
          // The edge highlight: a 1px inner stroke, a touch brighter on top.
          "inset 0 0 0 1px rgba(255, 255, 255, 0.12)",
          "inset 0 1px 0 rgba(255, 255, 255, 0.10)",
          "0 0 0 1px rgba(0, 0, 0, 0.55)",
          "0 50px 100px -40px rgba(0, 0, 0, 0.85)",
        ].join(", "),
        ...style,
      }}
      className={`relative rounded-[calc(var(--screen-h)*0.079)] p-[calc(var(--screen-h)*0.013)] ${className}`}
    >
      <div
        className="relative overflow-hidden rounded-[calc(var(--screen-h)*0.066)] bg-[#faf9f7]"
        style={{
          height: "var(--screen-h)",
          width: `calc(var(--screen-h) * ${manifest.width / manifest.height})`,
        }}
      >
        {children}
        {/* The glass: a faint diagonal sheen over the screen. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            ref={glareRef}
            className="absolute inset-y-0 left-[-50%] w-[200%] will-change-transform"
            style={{
              background:
                "linear-gradient(118deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.13) 44%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0) 58%)",
              ...glareStyle,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/[0.035] via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
});

function StillStory({
  manifest,
  captions,
}: {
  manifest: JourneyManifest;
  captions: readonly JourneyCaption[];
}) {
  return (
    // overflow-x-clip: the glow reaches past the phone's column, never past the page.
    <ol className="mx-auto mt-16 flex max-w-7xl flex-col gap-24 overflow-x-clip px-6 lg:px-12">
      {manifest.stills.map((still) => {
        const warm = captions[still.captions[0]].glow.warm;
        return (
          <li
            key={still.frame}
            className="flex flex-col gap-10 md:grid md:grid-cols-12 md:items-center md:gap-12"
          >
            <div
              aria-hidden="true"
              className="relative flex justify-center py-6 [--screen-h:min(60vh,560px)] md:col-span-6 md:col-start-7 md:row-start-1"
            >
              {/* The same ground as the scrubbed story, held still. */}
              <div
                className="pointer-events-none absolute inset-[-15%]"
                style={{
                  background: `radial-gradient(closest-side at 44% 46%, rgba(${TEAL}, ${(0.42 - 0.14 * warm).toFixed(2)}), transparent), radial-gradient(closest-side at 62% 64%, rgba(${APRICOT}, ${(0.04 + 0.22 * warm).toFixed(2)}), transparent 80%)`,
                }}
              />
              <PhoneFrame manifest={manifest}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={journeyFrameSrc(manifest, still.frame)}
                  alt=""
                  width={manifest.width}
                  height={manifest.height}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full"
                />
              </PhoneFrame>
            </div>
            <div className="flex flex-col gap-12 md:col-span-5 md:col-start-1 md:row-start-1">
              {still.captions.map((i) => (
                <div key={i} className="relative">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[-0.04em] top-0 select-none font-serif text-[clamp(5rem,10vw,9.5rem)] font-medium leading-none tracking-[-0.04em] text-cream/10"
                  >
                    {pad(i + 1)}
                  </div>
                  <div className="relative pt-[clamp(3.25rem,6.8vw,6.5rem)]">
                    <CaptionText caption={captions[i]} />
                  </div>
                </div>
              ))}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
