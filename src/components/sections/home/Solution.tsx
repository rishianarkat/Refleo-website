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
    label: "ADOLESCENT",
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

const TAGLINE_PREFIX = "Teens share. ";
const TAGLINE_HIGHLIGHT = "Refleo surfaces.";
const TAGLINE_SUFFIX = " Clinicians walk in informed.";

export default function Solution() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) return;

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
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="solution" ref={rootRef} className="bg-teal-dark">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-28 md:py-40">
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

        <div className="mt-20 grid md:grid-cols-3 gap-10">
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
