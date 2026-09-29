"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CountUp from "@/components/v2/CountUp";

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

export default function WeekStory() {
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
        } ${active ? "text-ink" : "text-cream/60 hover:text-cream"}`}
      >
        {label}
      </button>
    );
  };

  return (
    <section id="problem" ref={rootRef} className="relative border-t border-cream/10">
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
        <div data-animate>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/50">
            <span className="text-apricot">[01]</span> {EYEBROW}
          </p>
          <h2 className="mt-6 max-w-[18ch] font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
            {H2_LINE_1}{" "}
            <span className="text-apricot-light">{H2_LINE_2}</span>
          </h2>
        </div>

        {/* The band */}
        <div data-animate className="mt-16">
          <div
            ref={bandRef}
            className="relative h-36 w-full overflow-hidden border border-cream/10 bg-black/30 sm:h-48 md:h-60"
          >
            {/* Day boundaries */}
            {DAY_DIVIDERS.map((left) => (
              <span
                key={left}
                aria-hidden="true"
                className="absolute top-0 bottom-0 w-px bg-cream/10"
                style={{ left: `${left}%` }}
              />
            ))}

            {/* The thread running through the week. viewBox 0 0 100 100 with
                preserveAspectRatio none maps the marks' left/top percentages
                straight onto the path coordinates. The draw-on is a left-to-right
                clip wipe: the non-uniform viewBox scale would fragment a dash
                offset, and one compositor property is cheaper anyway. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              style={{
                clipPath: showMarks ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                transition: reduced ? "none" : `clip-path ${TRAIL_DRAW_MS}ms ease-out`,
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
            {ENTRY_MARKS.map((mark) => (
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
              style={{ left: SESSION_LEFT, width: SESSION_WIDTH, minWidth: SESSION_MIN_WIDTH }}
            />

            {/* Session caption, beside the sliver so it never sits on top of it */}
            <span
              className="absolute top-4 ml-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-cream/70"
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
                className="absolute font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40"
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
          className="relative mt-10 inline-flex items-center rounded-full border border-cream/15 p-1"
        >
          {/* Sliding indicator, so the handoff glides rather than snaps */}
          <span
            aria-hidden="true"
            className={`absolute inset-y-1 left-1 w-32 rounded-full bg-apricot ${
              reduced ? "" : "transition-transform duration-700 ease-in-out"
            }`}
            style={{ transform: mode === "refleo" ? "translateX(100%)" : "translateX(0)" }}
          />
          {toggleButton("today", MODE_TODAY)}
          {toggleButton("refleo", MODE_REFLEO)}
        </div>

        {/* Readout, in the same bordered cells as the rest of the page */}
        <div data-animate className="mt-12 grid border border-cream/10 sm:grid-cols-[1fr_1fr_1.4fr]">
          <div className="border-b border-cream/10 px-6 py-8 sm:border-b-0 sm:border-r">
            <CountUp
              value={UNSEEN_MINUTES}
              className="block font-serif text-6xl leading-none text-apricot lg:text-7xl"
            />
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-cream/50">
              {UNSEEN_LABEL}
            </p>
          </div>
          <div className="border-b border-cream/10 px-6 py-8 sm:border-b-0 sm:border-r">
            <span className="block font-serif text-6xl leading-none text-teal-light tabular-nums lg:text-7xl">
              {capturedCount}
            </span>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-cream/50">
              {CAPTURED_LABEL}
            </p>
          </div>
          <p
            aria-live="polite"
            className="flex items-center px-6 py-8 text-lg leading-relaxed text-cream/75"
          >
            {mode === "today" ? CLOSING_TODAY : CLOSING_REFLEO}
          </p>
        </div>
      </div>
    </section>
  );
}
