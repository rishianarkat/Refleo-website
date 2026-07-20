"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WaveLines } from "@/components/ripples/RippleArt";

gsap.registerPlugin(ScrollTrigger);

const EYEBROW = "03 · Validation";
const H2_TEXT = "We asked the clinicians we're building for.";

const STATS = [
  { value: 100, suffix: "+", label: "Clinician conversations across 8 states" },
  { value: 6, suffix: "+", label: "Clinics interested in piloting" },
  { value: 60, suffix: "%", label: "Already use some form of technology in practice" },
] as const;

const QUOTE_A_TEXT =
  "What you're describing is exactly what I need. I lose so much of what happens between sessions.";
const QUOTE_A_ATTRIBUTION = "LCSW, Adolescent Practice";
const QUOTE_B_TEXT =
  "I'd want to set the keywords myself for each client. Every patient's signal is different.";
const QUOTE_B_ATTRIBUTION = "LPC, Private Practice";
const CLOSING_LINE =
  "Clinicians describe Refleo back to us before we describe it to them.";

export default function Validation() {
  const rootRef = useRef<HTMLElement>(null);
  const statRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pingRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [displayStats, setDisplayStats] = useState<number[]>(
    STATS.map((s) => s.value)
  );

  useLayoutEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setDisplayStats(STATS.map((s) => s.value));
      return;
    }

    setDisplayStats(STATS.map(() => 0));

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

      STATS.forEach((stat, i) => {
        const counter = { value: 0 };
        ScrollTrigger.create({
          trigger: statRefs.current[i],
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(counter, {
              value: stat.value,
              duration: 2,
              ease: "power2.out",
              onUpdate: () => {
                setDisplayStats((prev) => {
                  const next = [...prev];
                  next[i] = Math.round(counter.value);
                  return next;
                });
              },
              onComplete: () => {
                const ping = pingRefs.current[i];
                if (!ping) return;
                gsap.fromTo(
                  ping,
                  { opacity: 0.6, scale: 0.4 },
                  { opacity: 0, scale: 2.2, duration: 0.9, ease: "power2.out" }
                );
              },
            });
          },
        });
      });

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          window.dispatchEvent(
            new CustomEvent("refleo:pulse", {
              detail: { x: 0.7, y: 0.5, strength: 1.2 },
            })
          );
        },
      });

      gsap.from("[data-quote]", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: "[data-quote]",
          start: "top 80%",
          once: true,
        },
      });

      gsap.from("[data-closing]", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-closing]",
          start: "top 80%",
          once: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="validation" ref={rootRef} className="bg-teal-deep/60">
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

        <div data-animate className="mt-20 grid sm:grid-cols-3 gap-10">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="relative">
              <span
                ref={(el) => {
                  statRefs.current[i] = el;
                }}
                className="font-serif text-6xl sm:text-7xl lg:text-8xl text-apricot tabular-nums leading-none"
              >
                {displayStats[i]}
                {stat.suffix}
              </span>
              <span
                ref={(el) => {
                  pingRefs.current[i] = el;
                }}
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-apricot/60 opacity-0"
              />
              <p className="mt-4 text-sm text-cream/60">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-14 md:grid-cols-2 md:gap-12">
          <div data-quote>
            <span
              aria-hidden="true"
              className="block font-serif text-6xl leading-none text-apricot select-none"
            >
              &ldquo;
            </span>
            <p className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-cream leading-snug">
              {QUOTE_A_TEXT}
            </p>
            <p className="mt-5 text-sm uppercase tracking-widest text-cream/50 font-sans">
              {QUOTE_A_ATTRIBUTION}
            </p>
          </div>

          <div data-quote>
            <span
              aria-hidden="true"
              className="block font-serif text-6xl leading-none text-apricot select-none"
            >
              &ldquo;
            </span>
            <p className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-cream leading-snug">
              {QUOTE_B_TEXT}
            </p>
            <p className="mt-5 text-sm uppercase tracking-widest text-cream/50 font-sans">
              {QUOTE_B_ATTRIBUTION}
            </p>
          </div>
        </div>

        <p
          data-closing
          className="mt-16 text-center font-serif text-xl text-cream/80 italic"
        >
          {CLOSING_LINE}
        </p>

        <WaveLines className="text-teal-light/30 w-full max-w-lg mx-auto mt-16" />
      </div>
    </section>
  );
}
