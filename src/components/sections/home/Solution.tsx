"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DotRipple } from "@/components/ripples/RippleArt";

gsap.registerPlugin(ScrollTrigger);

const EYEBROW = "02 · The Solution";
const H2_TEXT =
  "A private place to reflect. A pre-session brief for their clinician.";

const COLUMNS = [
  {
    label: "PATIENT",
    title: "Records short voice or text entries between sessions",
    body: "Lightweight and private. No prompts to perform. A place to talk through the week as it happens.",
  },
  {
    label: "REFLEO",
    title: "Analyzes entries for themes and clinician-set parameters",
    body: "Surfaces recurring topics, emotional shifts, and patterns. It never counsels.",
  },
  {
    label: "CLINICIAN",
    title: "Receives a pre-session brief before each appointment",
    body: "Walks in informed. Spends the session on the work, not the recap.",
  },
] as const;

const TAGLINE_PREFIX = "Patients share. ";
const TAGLINE_HIGHLIGHT = "Refleo surfaces.";
const TAGLINE_SUFFIX = " Clinicians walk in informed.";

const STATION_X = [90, 500, 910];
const STATION_DELAYS = [0.15, 0.75, 1.35];

export default function Solution() {
  const rootRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);

  useLayoutEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pathEl = pathRef.current;
    const dots = dotRefs.current.filter(Boolean) as SVGCircleElement[];

    if (reduced) {
      if (pathEl) {
        pathEl.style.strokeDasharray = "none";
        pathEl.style.strokeDashoffset = "0";
      }
      gsap.set(dots, { scale: 1, transformOrigin: "center" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from("[data-animate]", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          once: true,
        },
      });

      gsap.from("[data-tagline]", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-tagline]",
          start: "top 80%",
          once: true,
        },
      });

      if (pathEl) {
        const length = pathEl.getTotalLength();
        pathEl.style.strokeDasharray = `${length}`;
        pathEl.style.strokeDashoffset = `${length}`;

        gsap.set(dots, { scale: 0, transformOrigin: "center" });

        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top 75%",
          once: true,
          onEnter: () => {
            gsap.to(pathEl, {
              strokeDashoffset: 0,
              duration: 1.6,
              ease: "power2.inOut",
            });

            dots.forEach((dot, i) => {
              gsap.to(dot, {
                scale: 1,
                duration: 0.5,
                ease: "back.out(2)",
                delay: STATION_DELAYS[i],
              });
            });
          },
        });
      }

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          window.dispatchEvent(
            new CustomEvent("refleo:pulse", {
              detail: { x: 0.5, y: 0.4, strength: 1.2 },
            })
          );
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="solution"
      ref={rootRef}
      className="bg-teal-deep/60 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-20 md:py-24">
        <div data-animate className="mb-6 inline-flex items-center gap-4">
          <span
            aria-hidden="true"
            className="inline-block h-px w-8 bg-apricot/40"
          />
          <span className="text-xs uppercase tracking-widest text-apricot font-medium font-sans">
            {EYEBROW}
          </span>
        </div>

        <h2
          data-animate
          className="font-serif tracking-tight text-cream text-3xl sm:text-5xl lg:text-6xl max-w-3xl"
        >
          {H2_TEXT}
        </h2>

        <svg
          aria-hidden="true"
          viewBox="0 0 1000 60"
          className="hidden md:block mt-20 w-full h-auto"
        >
          <path
            ref={pathRef}
            d="M 90 30 C 250 -10, 340 70, 500 30 C 660 -10, 750 70, 910 30"
            stroke="#7FB3B3"
            strokeWidth="1.5"
            fill="none"
          />
          {STATION_X.map((x, i) => (
            <circle
              key={x}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              cx={x}
              cy={30}
              r={5}
              fill={i === 1 ? "#E8A87C" : "none"}
              stroke={i === 1 ? "none" : "#7FB3B3"}
              strokeWidth={i === 1 ? 0 : 1.5}
            />
          ))}
        </svg>

        <div className="mt-10 md:mt-10 grid md:grid-cols-3 gap-10">
          {COLUMNS.map((col) => (
            <div key={col.label} data-animate>
              <DotRipple className="mb-6 text-teal-light w-14 h-14" />
              <span className="text-xs uppercase tracking-widest text-apricot font-sans">
                {col.label}
              </span>
              <h3 className="mt-4 font-sans font-semibold text-cream text-lg">
                {col.title}
              </h3>
              <p className="mt-3 text-cream/70">{col.body}</p>
            </div>
          ))}
        </div>

        <div
          data-tagline
          className="mt-24 pt-16 border-t border-white/10 text-center"
        >
          <p className="font-serif text-xl sm:text-2xl text-cream">
            {TAGLINE_PREFIX}
            <span className="text-apricot">{TAGLINE_HIGHLIGHT}</span>
            {TAGLINE_SUFFIX}
          </p>
        </div>
      </div>
    </section>
  );
}
