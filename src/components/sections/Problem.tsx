"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTION_NUMBER = "01";
const SECTION_LABEL = "Problem";
const HEADLINE = "Therapists See Teens Once A Week — For 50 Minutes.";
const COUNTER_FINAL = 10030;
const COUNTER_CAPTION = "minutes every week the clinician can't see";
const BODY_COPY =
  "Sessions start cold. The first ten minutes are spent trying to remember the week. Crises, breakthroughs, and small moments fade before the next session. Teens forget. Or they don't have the words yet. Or they don't want to look their therapist in the eye and say it.";
const QUOTE_TEXT =
  "By the time they're in my office, I've lost the week. I'm building a picture from what they happen to remember in the first five minutes.";
const QUOTE_ATTRIBUTION = "— LPC, Private Practice";

export default function Problem() {
  const rootRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const quoteCardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      if (counterRef.current) {
        counterRef.current.textContent = COUNTER_FINAL.toLocaleString("en-US");
      }
      return;
    }

    // Reset counter to 0 before ScrollTrigger fires
    if (counterRef.current) {
      counterRef.current.textContent = "0";
    }

    const ctx = gsap.context(() => {
      // Staggered fade + slide-in for all content elements
      gsap.fromTo(
        "[data-animate]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      // Counter count-up ScrollTrigger
      const proxy = { n: 0 };
      ScrollTrigger.create({
        trigger: counterRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(proxy, {
            n: COUNTER_FINAL,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = Math.round(
                  proxy.n
                ).toLocaleString("en-US");
              }
            },
          });
        },
      });

      // Quote card entrance: fade up + slide from left (spec)
      gsap.fromTo(
        quoteCardRef.current,
        { opacity: 0, x: -24, y: 16 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: quoteCardRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="problem"
      ref={rootRef}
      className="bg-gradient-to-b from-teal-dark to-teal text-cream py-28 md:py-40"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Section eyebrow */}
        <div className="flex items-baseline gap-4 mb-16" data-animate>
          <span className="text-apricot font-bold text-5xl sm:text-6xl leading-none tracking-tight">
            {SECTION_NUMBER}
          </span>
          <span className="text-cream/60 text-xs uppercase tracking-widest font-medium">
            {SECTION_LABEL}
          </span>
        </div>

        {/* Headline */}
        <h2
          className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-balance text-cream mb-16 max-w-3xl"
          data-animate
        >
          {HEADLINE}
        </h2>

        {/* Counter block */}
        <div className="mb-16" data-animate>
          <div className="inline-block">
            <span
              ref={counterRef}
              className="text-6xl sm:text-7xl lg:text-8xl font-bold text-apricot tabular-nums leading-none"
            >
              {COUNTER_FINAL.toLocaleString("en-US")}
            </span>
            <p className="mt-3 text-cream/70 text-base tracking-wide">
              {COUNTER_CAPTION}
            </p>
          </div>
        </div>

        {/* Body copy */}
        <p
          className="text-cream/80 text-lg leading-relaxed max-w-2xl mb-16"
          data-animate
        >
          {BODY_COPY}
        </p>

        {/* Quote card */}
        <div
          ref={quoteCardRef}
          className="relative bg-teal-dark/40 border border-white/10 rounded-2xl p-8 sm:p-10 max-w-2xl"
        >
          {/* Apricot left accent */}
          <div className="absolute left-0 top-8 bottom-8 w-1 bg-apricot rounded-full" />

          {/* Large decorative quotation mark */}
          <span
            className="block text-apricot text-7xl font-serif leading-none mb-4 select-none"
            aria-hidden="true"
          >
            &ldquo;
          </span>

          <blockquote className="text-cream text-lg sm:text-xl italic leading-relaxed mb-6">
            {QUOTE_TEXT}
          </blockquote>

          <cite className="not-italic text-sm text-apricot/80 tracking-wide">
            {QUOTE_ATTRIBUTION}
          </cite>
        </div>
      </div>
    </section>
  );
}
