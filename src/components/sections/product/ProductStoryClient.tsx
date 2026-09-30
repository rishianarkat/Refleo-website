"use client";

// The product story: one continuous walk through the app, scrubbed by scroll.
//
//   motion OK      A tall wrapper reserves the scroll distance; inside it a
//                  sticky stage holds a phone and the captions. ScrollTrigger
//                  (scrub) turns the wrapper's scroll progress into a position
//                  in the image sequence in public/journey/. The drawn position
//                  eases toward the scroll position (a few frames of visual
//                  lag, nothing more), and between two frames the canvas
//                  blends them, so the scrub is continuous at any scroll speed.
//                  It draws at most once per animation frame, only when
//                  something changed. Nothing is hijacked: the page scrolls
//                  exactly as it always does, so wheel, touch and keyboard all
//                  work, both ways.
//                  The same on phones: phone above, caption below.
//   reduced motion No pinning, no scrubbing, no drift: a plain vertical list
//                  of key frames as images, each with its captions.
//
// Captions are real DOM text (h3 + p). The canvas and the frames are
// decorative (aria-hidden): the captions carry the meaning.

import { forwardRef, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journeyFrameSrc, type JourneyCaption, type JourneyManifest } from "./storyJourney";

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

function poseTransform({ ry, rz, s }: { ry: number; rz: number; s: number }): string {
  return `perspective(1600px) rotateY(${ry.toFixed(3)}deg) rotateZ(${rz.toFixed(3)}deg) scale(${s.toFixed(4)})`;
}

const smoothstep = (u: number) => u * u * (3 - 2 * u);

function poseAt(p: number, stops: readonly number[]) {
  let k = 0;
  while (k < stops.length - 1 && stops[k + 1] <= p) k++;
  const a = POSES[Math.min(k, POSES.length - 1)];
  if (k >= stops.length - 1) return a;
  const b = POSES[Math.min(k + 1, POSES.length - 1)];
  const e = smoothstep(Math.max(0, Math.min(1, (p - stops[k]) / (stops[k + 1] - stops[k]))));
  return { ry: a.ry + (b.ry - a.ry) * e, rz: a.rz + (b.rz - a.rz) * e, s: a.s + (b.s - a.s) * e };
}

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
  const phoneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const phone = phoneRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!enabled || !wrapper || !phone || !canvas || !ctx) return;

    const n = manifest.frames;
    const keys = manifest.keys;
    // Where each frame stops being exact: a still holds until its end, a
    // motion frame is exact at a single position.
    const ends = keys.slice();
    for (const [i, end] of manifest.holds) ends[i] = end;
    const stops = manifest.captions.map((c) => c.activeAt);
    const images: (HTMLImageElement | null)[] = new Array(n).fill(null);
    const requested = new Uint8Array(n);
    const pending = new Set<HTMLImageElement>();

    /** Scroll progress, 0..1, from ScrollTrigger. */
    let target = 0;
    /** Drawn progress: eases toward `target`. */
    let shown = 0;
    let lastTime = 0;
    let drawnA: HTMLImageElement | null = null;
    let drawnB: HTMLImageElement | null = null;
    let drawnMix = -1;
    let dirty = true;
    let raf = 0;
    let started = false;
    let disposed = false;
    let lastActive = -1;
    let lastPose = "";
    /** Frame the scroll is at, and the way it last moved (+1 down, -1 up). */
    let heading = 0;
    let direction = 1;

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

    const draw = (p: number) => {
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
      if (!dirty && a === drawnA && b === drawnB && q === drawnMix) return;
      ctx.globalAlpha = 1;
      ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
      if (b && q > 0) {
        ctx.globalAlpha = q;
        ctx.drawImage(b, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
      }
      drawnA = a;
      drawnB = b;
      drawnMix = q;
      dirty = false;
    };

    const tick = (time: number) => {
      raf = 0;
      const dt = lastTime ? Math.min(100, time - lastTime) : 16.7;
      lastTime = time;
      // Ease toward the scroll position, the same pace at 60 and 120 Hz.
      const ease = 1 - Math.pow(1 - EASE_PER_FRAME, dt / 16.7);
      shown += (target - shown) * ease;
      if (Math.abs(target - shown) < SNAP) shown = target;

      draw(shown);
      const pose = poseTransform(poseAt(shown, stops));
      if (pose !== lastPose) {
        phone.style.transform = pose;
        lastPose = pose;
      }
      const a = lastAtOrBelow(stops, shown);
      if (a !== lastActive) {
        lastActive = a;
        setActive(a);
      }
      if (shown !== target) schedule();
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
          schedule();
        },
      });
      // A reload that restores the scroll position lands mid-story: start
      // there, not with a long ease from the top.
      target = shown = tween.scrollTrigger?.progress ?? 0;
      heading = lastAtOrBelow(keys, target);
      schedule();
    }, wrapper);

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
      phone.style.transform = "";
    };
  }, [enabled, manifest]);

  const count = captions.length;
  const wrapperStyle: CSSProperties = { height: `${100 + count * VH_PER_CAPTION}vh` };

  return (
    <div ref={wrapperRef} style={wrapperStyle} className="relative mt-8 md:mt-12">
      {/* The stage is exactly one small viewport tall (svh where supported,
          so iOS toolbars never push it off screen). The phone takes what the
          navbar and the caption leave: on phones, 360px covers the navbar,
          a three-line caption, the progress row, the gaps and the site's
          fixed Human/Machine toggle at the bottom. */}
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pb-14 pt-16 supports-[height:100svh]:h-[100svh] md:pb-10 md:pt-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-6 md:grid md:grid-cols-12 md:gap-12 lg:px-12">
          <div
            aria-hidden="true"
            className="flex justify-center [--screen-h:min(50vh,calc(100vh_-_360px))] supports-[height:100svh]:[--screen-h:min(50svh,calc(100svh_-_360px))] md:col-span-6 md:col-start-7 md:row-start-1 md:[--screen-h:min(70vh,720px,calc(100vh_-_170px))] md:supports-[height:100svh]:[--screen-h:min(70svh,720px,calc(100svh_-_170px))]"
          >
            <PhoneFrame
              ref={phoneRef}
              manifest={manifest}
              style={{ transform: poseTransform(POSES[0]) }}
              className="will-change-transform"
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

          <div className="w-full max-w-md md:col-span-5 md:col-start-1 md:row-start-1 md:max-w-none">
            <ol className="grid">
              {captions.map((c, i) => {
                const on = i === active;
                return (
                  <li
                    key={c.title}
                    className={`col-start-1 row-start-1 transition-[opacity,transform] ${
                      on
                        ? "translate-y-0 opacity-100 delay-75 duration-[250ms] ease-out"
                        : "pointer-events-none translate-y-2 opacity-0 duration-150 ease-in"
                    }`}
                  >
                    <CaptionText caption={c} index={i} />
                  </li>
                );
              })}
            </ol>

            <div aria-hidden="true" className="mt-6 flex items-center gap-4 md:mt-10">
              <span className="font-mono text-[11px] tabular-nums tracking-[0.14em] text-cream/50">
                {pad(active + 1)} / {pad(count)}
              </span>
              <span className="flex gap-1.5">
                {captions.map((c, i) => (
                  <span
                    key={c.title}
                    className={`h-px w-5 transition-colors duration-[250ms] ease-out md:w-6 ${
                      i === active ? "bg-apricot" : "bg-cream/20"
                    }`}
                  />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CaptionText({ caption, index }: { caption: JourneyCaption; index: number }) {
  return (
    <>
      <span aria-hidden="true" className="font-mono text-[11px] tracking-[0.14em] text-cream/35">
        {pad(index + 1)}
      </span>
      <h3 className="mt-3 text-balance font-serif text-[clamp(1.5rem,3vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em] text-cream md:mt-4">
        {caption.title}
      </h3>
      <p className="mt-2 max-w-md text-base text-cream/65 md:mt-4 md:text-lg">{caption.body}</p>
    </>
  );
}

/**
 * A plain phone: a dark rounded body around a rounded screen sized by the
 * `--screen-h` custom property. No device artwork.
 */
const PhoneFrame = forwardRef<
  HTMLDivElement,
  {
    manifest: JourneyManifest;
    children: ReactNode;
    style?: CSSProperties;
    className?: string;
  }
>(function PhoneFrame({ manifest, children, style, className = "" }, ref) {
  return (
    <div
      ref={ref}
      style={style}
      className={`relative rounded-[calc(var(--screen-h)*0.079)] bg-[#101c1c] p-[calc(var(--screen-h)*0.013)] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)] ring-1 ring-inset ring-cream/15 ${className}`}
    >
      <div
        className="relative overflow-hidden rounded-[calc(var(--screen-h)*0.066)] bg-[#faf9f7]"
        style={{
          height: "var(--screen-h)",
          width: `calc(var(--screen-h) * ${manifest.width / manifest.height})`,
        }}
      >
        {children}
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
    <ol className="mx-auto mt-16 flex max-w-7xl flex-col gap-20 px-6 lg:px-12">
      {manifest.stills.map((still) => (
        <li
          key={still.frame}
          className="flex flex-col gap-8 md:grid md:grid-cols-12 md:items-center md:gap-12"
        >
          <div
            aria-hidden="true"
            className="flex justify-center [--screen-h:min(60vh,560px)] md:col-span-6 md:col-start-7 md:row-start-1"
          >
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
          <div className="flex flex-col gap-10 md:col-span-5 md:col-start-1 md:row-start-1">
            {still.captions.map((i) => (
              <div key={i}>
                <CaptionText caption={captions[i]} index={i} />
              </div>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
