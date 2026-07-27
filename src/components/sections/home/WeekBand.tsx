"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EYEBROW = "One week · one client";
const H2_LINE_1 = "You see fifty minutes.";
const H2_LINE_2 = "Everything else happens without you.";

const UNSEEN_MINUTES = 10030;
const UNSEEN_LABEL = "Minutes you never see";
const CAPTURED_LABEL = "Moments captured between sessions";

const TOGGLE_GROUP_LABEL = "Week view";
const MODE_TODAY = "Today";
const MODE_REFLEO = "With Refleo";

const CLOSING_TODAY =
  "The first ten minutes go to reconstructing the week from memory. Crises fade. Breakthroughs blur.";
const CLOSING_REFLEO =
  "You open the brief and the week is already there. Themes, your keywords, their own words.";

const SESSION_CAPTION = "50 min";

// A week is 10,080 minutes. The session is 50. The sliver is therefore
// 50 / 10080 = 0.496% of the band. This stays a percentage so the graphic
// remains a true proportional representation at every viewport width.
const SESSION_WIDTH = "0.496%";
const SESSION_MIN_WIDTH = "3px";
// Wednesday afternoon, ~63 hours into the week.
const SESSION_LEFT = "37.5%";

// Day boundaries, one seventh apart.
const DAY_DIVIDERS = [1, 2, 3, 4, 5, 6].map((d) => (d * 100) / 7);

const AXIS_LABELS = [
  { label: "Mon", left: 0 },
  { label: "Wed", left: (2 * 100) / 7 },
  { label: "Fri", left: (4 * 100) / 7 },
  { label: "Sun", left: (6 * 100) / 7 },
];

// Entries scattered across the unseen week. Percentages, never pixels, so they
// track the band as it resizes. None sit within ~4% of the session sliver.
const ENTRY_MARKS = [
  { left: 4.2, top: 34 },
  { left: 11.8, top: 62 },
  { left: 19.5, top: 28 },
  { left: 26.1, top: 71 },
  { left: 32.4, top: 45 },
  { left: 44.8, top: 33 },
  { left: 52.3, top: 66 },
  { left: 59.7, top: 41 },
  { left: 68.2, top: 58 },
  { left: 77.6, top: 36 },
  { left: 88.3, top: 63 },
];


// Catmull-Rom through the marks, converted to cubic beziers. Computed once at
// module load, so the draw-on animation costs a single CSS transition at runtime.
const TRAIL_PATH = (() => {
  const p = ENTRY_MARKS;
  let d = `M ${p[0].left} ${p[0].top}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1x = p1.left + (p2.left - p0.left) / 6;
    const c1y = p1.top + (p2.top - p0.top) / 6;
    const c2x = p2.left - (p3.left - p1.left) / 6;
    const c2y = p2.top - (p3.top - p1.top) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(
      2
    )}, ${p2.left} ${p2.top}`;
  }
  return d;
})();

// The line leads the dots, drawing at an unhurried pace across the week.
const TRAIL_DRAW_MS = 2200;

type Mode = "today" | "refleo";

export default function WeekBand() {
  const rootRef = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<Mode>("today");
  const [capturedCount, setCapturedCount] = useState(0);
  const [reduced, setReduced] = useState(false);
  // Once the reader drives the toggle themselves, the scroll handoff stands down.
  const userToggled = useRef(false);
  const bandRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setReduced(prefersReduced);

    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-animate]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 28,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true,
          },
        });
      });

      // The band reveals at "top 80%". Firing at "top 40%" means roughly one
      // more swipe hands the section over to With Refleo on its own.
      ScrollTrigger.create({
        trigger: bandRef.current,
        start: "top 40%",
        once: true,
        onEnter: () => {
          if (!userToggled.current) setMode("refleo");
        },
      });

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          window.dispatchEvent(
            new CustomEvent("refleo:pulse", {
              detail: { x: 0.3, y: 0.4, strength: 1.2 },
            })
          );
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Count up alongside the staggered marks so the figure and the field land together.
  useLayoutEffect(() => {
    if (mode === "today") {
      setCapturedCount(0);
      return;
    }

    if (reduced) {
      setCapturedCount(ENTRY_MARKS.length);
      return;
    }

    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value: ENTRY_MARKS.length,
      duration: TRAIL_DRAW_MS / 1000,
      ease: "none",
      onUpdate: () => setCapturedCount(Math.round(counter.value)),
    });

    return () => {
      tween.kill();
    };
  }, [mode, reduced]);

  const showMarks = mode === "refleo";

  const toggleButton = (value: Mode, label: string) => {
    const active = mode === value;
    return (
      <button
        type="button"
        onClick={() => {
          userToggled.current = true;
          setMode(value);
        }}
        aria-pressed={active}
        className={`relative z-10 w-32 rounded-full py-2 text-sm font-medium font-sans focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apricot ${
          reduced ? "" : "transition-colors duration-700 ease-out"
        } ${active ? "text-teal-dark" : "text-cream/60 hover:text-cream"}`}
      >
        {label}
      </button>
    );
  };

  return (
    <section
      id="problem"
      ref={rootRef}
      className="relative bg-teal-deep/60 overflow-hidden"
    >
      <div className="relative max-w-6xl mx-auto px-6 lg:px-12 py-20 md:py-24">
        <div data-animate className="mb-6 inline-flex items-center gap-4">
          <span aria-hidden="true" className="inline-block h-px w-8 bg-apricot/40" />
          <span className="text-xs uppercase tracking-widest text-apricot font-medium font-sans">
            {EYEBROW}
          </span>
        </div>

        <h2
          data-animate
          className="font-serif tracking-tight text-cream text-3xl sm:text-5xl lg:text-6xl max-w-3xl"
        >
          {H2_LINE_1}{" "}
          <span className="text-apricot">{H2_LINE_2}</span>
        </h2>

        {/* The band */}
        <div data-animate className="mt-14">
          <div
            ref={bandRef}
            className="relative h-32 w-full overflow-hidden rounded-2xl border border-white/5 bg-black/30 sm:h-44 md:h-56"
          >
            {/* Day boundaries */}
            {DAY_DIVIDERS.map((left) => (
              <span
                key={left}
                aria-hidden="true"
                className="absolute top-0 bottom-0 w-px bg-white/5"
                style={{ left: `${left}%` }}
              />
            ))}

            {/* The thread running through the week. viewBox 0 0 100 100 with
                preserveAspectRatio none maps the marks' left/top percentages
                straight onto the path coordinates. The draw-on is a left-to-right
                clip wipe rather than a dash offset: the non-uniform viewBox scale
                would otherwise fragment the dash pattern, and a clip transition is
                cheaper anyway (one compositor property, no layout measurement). */}
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              style={{
                clipPath: showMarks ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                transition: reduced
                  ? "none"
                  : `clip-path ${TRAIL_DRAW_MS}ms ease-out`,
              }}
            >
              <path
                d={TRAIL_PATH}
                fill="none"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                className="stroke-apricot/80"
              />
            </svg>

            {/* Entries captured between sessions */}
            {ENTRY_MARKS.map((mark, i) => (
              <span
                key={`${mark.left}-${mark.top}`}
                aria-hidden="true"
                className={`absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-light/70 ring-4 ring-teal-light/10 sm:h-2.5 sm:w-2.5 ${
                  reduced ? "" : "transition-opacity duration-700"
                } ${showMarks ? "opacity-100" : "opacity-0"}`}
                style={{
                  left: `${mark.left}%`,
                  top: `${mark.top}%`,
                  // Each mark lights as the line reaches its position.
                  transitionDelay:
                    reduced || !showMarks
                      ? "0ms"
                      : `${Math.round((mark.left / 100) * TRAIL_DRAW_MS)}ms`,
                }}
              />
            ))}

            {/* Glow behind the session, so the one lit thing reads as lit */}
            <span
              aria-hidden="true"
              className="absolute top-0 bottom-0 w-8 -translate-x-1/2 bg-cream/20 blur-md"
              style={{ left: SESSION_LEFT }}
            />

            {/* The session itself */}
            <span
              aria-hidden="true"
              className="absolute top-0 bottom-0 rounded-full bg-cream"
              style={{
                left: SESSION_LEFT,
                width: SESSION_WIDTH,
                minWidth: SESSION_MIN_WIDTH,
              }}
            />

            {/* Session caption, anchored beside the sliver so it never sits on top of it */}
            <span
              className="absolute top-4 ml-3 whitespace-nowrap text-xs uppercase tracking-widest text-cream/70 font-sans"
              style={{ left: SESSION_LEFT }}
            >
              {SESSION_CAPTION}
            </span>
          </div>

          {/* Axis */}
          <div className="relative mt-3 h-4">
            {AXIS_LABELS.map(({ label, left }) => (
              <span
                key={label}
                className="absolute text-xs uppercase tracking-widest text-cream/40 font-sans"
                style={{ left: `${left}%` }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Toggle */}
        <div
          data-animate
          role="group"
          aria-label={TOGGLE_GROUP_LABEL}
          className="relative mt-10 inline-flex items-center rounded-full border border-white/10 p-1"
        >
          {/* Sliding indicator, so the handoff glides rather than snaps */}
          <span
            aria-hidden="true"
            className={`absolute inset-y-1 left-1 w-32 rounded-full bg-apricot ${
              reduced ? "" : "transition-transform duration-700 ease-in-out"
            }`}
            style={{
              transform: mode === "refleo" ? "translateX(100%)" : "translateX(0)",
            }}
          />
          {toggleButton("today", MODE_TODAY)}
          {toggleButton("refleo", MODE_REFLEO)}
        </div>

        {/* Readout */}
        <div data-animate className="mt-12 flex flex-wrap gap-x-16 gap-y-10">
          <div>
            <span className="block font-serif text-6xl sm:text-7xl text-apricot tabular-nums leading-none">
              {UNSEEN_MINUTES.toLocaleString("en-US")}
            </span>
            <p className="mt-3 text-sm text-cream/60 font-sans max-w-[16ch]">
              {UNSEEN_LABEL}
            </p>
          </div>

          <div>
            <span className="block font-serif text-6xl sm:text-7xl text-teal-light tabular-nums leading-none">
              {capturedCount}
            </span>
            <p className="mt-3 text-sm text-cream/60 font-sans max-w-[16ch]">
              {CAPTURED_LABEL}
            </p>
          </div>
        </div>

        <p
          data-animate
          aria-live="polite"
          className="mt-12 text-cream/70 text-lg leading-relaxed max-w-2xl"
        >
          {mode === "today" ? CLOSING_TODAY : CLOSING_REFLEO}
        </p>
      </div>
    </section>
  );
}
