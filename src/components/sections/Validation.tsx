"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- Copy constants (apostrophes live safely inside JS strings) ---
const SECTION_NUMBER = "05";
const SECTION_LABEL = "Validation";
const HEADLINE = "We've Talked to the Clinicians We're Building For.";

const STAT_1_VALUE = 100;
const STAT_1_SUFFIX = "+";
const STAT_1_LABEL = "Clinician conversations across 8 states";

const STAT_2_VALUE = 5;
const STAT_2_SUFFIX = "+";
const STAT_2_LABEL = "Clinics interested in piloting";

const STAT_3_VALUE = 60;
const STAT_3_SUFFIX = "%";
const STAT_3_LABEL = "Already use some form of technology in practice";

const QUOTE_1_TEXT =
  "What you're describing is exactly what I need. I lose so much of what happens between sessions.";
const QUOTE_1_ATTR = "— LCSW, Adolescent Practice";

const QUOTE_2_TEXT =
  "I'd want to set the keywords myself for each kid. Every teen's signal is different.";
const QUOTE_2_ATTR = "— LPC, Private Practice";

const TAGLINE_START = "Clinicians describe ";
const TAGLINE_BRAND = "Refleo";
const TAGLINE_END = " back to us before we describe it to them.";

const PHOTO_CREDIT_PHOTOGRAPHER = "Kari Shea";
const PHOTO_CREDIT_PHOTOGRAPHER_URL =
  "https://unsplash.com/@karishea?utm_source=refleo&utm_medium=referral";
const PHOTO_CREDIT_UNSPLASH_URL =
  "https://unsplash.com/?utm_source=refleo&utm_medium=referral";

export default function Validation() {
  const rootRef = useRef<HTMLElement>(null);
  const stat1Ref = useRef<HTMLSpanElement>(null);
  const stat2Ref = useRef<HTMLSpanElement>(null);
  const stat3Ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // If reduced motion, leave everything at final visible state
    if (prefersReduced) {
      if (stat1Ref.current) stat1Ref.current.textContent = `${STAT_1_VALUE}${STAT_1_SUFFIX}`;
      if (stat2Ref.current) stat2Ref.current.textContent = `${STAT_2_VALUE}${STAT_2_SUFFIX}`;
      if (stat3Ref.current) stat3Ref.current.textContent = `${STAT_3_VALUE}${STAT_3_SUFFIX}`;
      return;
    }

    // Reset numeric part to 0 for count-up animation
    if (stat1Ref.current) stat1Ref.current.textContent = `0${STAT_1_SUFFIX}`;
    if (stat2Ref.current) stat2Ref.current.textContent = `0${STAT_2_SUFFIX}`;
    if (stat3Ref.current) stat3Ref.current.textContent = `0${STAT_3_SUFFIX}`;

    const ctx = gsap.context(() => {
      // Header fade + slide in
      gsap.from(".val-header", {
        opacity: 0,
        y: 32,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".val-header",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Image fade in
      gsap.from(".val-image", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".val-image",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Stats count-up — fire once when stat row enters view
      const statsProxy1 = { n: 0 };
      const statsProxy2 = { n: 0 };
      const statsProxy3 = { n: 0 };

      ScrollTrigger.create({
        trigger: ".val-stats",
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap.to(statsProxy1, {
            n: STAT_1_VALUE,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              if (stat1Ref.current) {
                stat1Ref.current.textContent = `${Math.round(statsProxy1.n)}${STAT_1_SUFFIX}`;
              }
            },
          });
          gsap.to(statsProxy2, {
            n: STAT_2_VALUE,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => {
              if (stat2Ref.current) {
                stat2Ref.current.textContent = `${Math.round(statsProxy2.n)}${STAT_2_SUFFIX}`;
              }
            },
          });
          gsap.to(statsProxy3, {
            n: STAT_3_VALUE,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              if (stat3Ref.current) {
                stat3Ref.current.textContent = `${Math.round(statsProxy3.n)}${STAT_3_SUFFIX}`;
              }
            },
          });
        },
      });

      // Stats row fade in
      gsap.from(".val-stats", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".val-stats",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Quote cards entrance: fade up + slide from left (spec), staggered
      gsap.fromTo(
        ".val-quote-card",
        { opacity: 0, x: -24, y: 16 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.18,
          scrollTrigger: {
            trigger: ".val-quotes",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Tagline fade in
      gsap.from(".val-tagline", {
        opacity: 0,
        y: 20,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".val-tagline",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="validation"
      ref={rootRef}
      className="bg-cream text-teal-dark py-28 md:py-40"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        {/* Two-column band: header/stats left, image right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20 md:mb-24">

          {/* Left: header + stats */}
          <div className="val-header">
            {/* Dragonfly-style numbered label */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-7xl sm:text-8xl font-semibold text-apricot leading-none select-none">
                {SECTION_NUMBER}
              </span>
              <span className="text-xs uppercase tracking-widest text-apricot font-medium">
                {SECTION_LABEL}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-balance text-teal-dark mb-12 max-w-xl">
              {HEADLINE}
            </h2>

            {/* Stats row */}
            <div className="val-stats grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* Stat 1 */}
              <div className="flex flex-col gap-2">
                <span
                  ref={stat1Ref}
                  className="text-5xl sm:text-6xl font-bold text-apricot tabular-nums leading-none"
                >
                  {STAT_1_VALUE}{STAT_1_SUFFIX}
                </span>
                <p className="text-base sm:text-sm text-teal-dark/70 leading-snug mt-1">
                  {STAT_1_LABEL}
                </p>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col gap-2">
                <span
                  ref={stat2Ref}
                  className="text-5xl sm:text-6xl font-bold text-apricot tabular-nums leading-none"
                >
                  {STAT_2_VALUE}{STAT_2_SUFFIX}
                </span>
                <p className="text-base sm:text-sm text-teal-dark/70 leading-snug mt-1">
                  {STAT_2_LABEL}
                </p>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col gap-2">
                <span
                  ref={stat3Ref}
                  className="text-5xl sm:text-6xl font-bold text-apricot tabular-nums leading-none"
                >
                  {STAT_3_VALUE}{STAT_3_SUFFIX}
                </span>
                <p className="text-base sm:text-sm text-teal-dark/70 leading-snug mt-1">
                  {STAT_3_LABEL}
                </p>
              </div>
            </div>
          </div>

          {/* Right: clinic photo */}
          <div className="val-image flex flex-col gap-2">
            <div className="relative w-full rounded-2xl overflow-hidden aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/validation-clinic.jpg"
                alt="A calm therapy room"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </div>
            {/* Unsplash credit */}
            <p className="text-xs text-teal-dark/40 mt-1">
              {"Photo by "}
              <a
                href={PHOTO_CREDIT_PHOTOGRAPHER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-teal-dark/60 transition-colors"
              >
                {PHOTO_CREDIT_PHOTOGRAPHER}
              </a>
              {" on "}
              <a
                href={PHOTO_CREDIT_UNSPLASH_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-teal-dark/60 transition-colors"
              >
                Unsplash
              </a>
            </p>
          </div>
        </div>

        {/* Quote cards */}
        <div className="val-quotes grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-20 md:mb-24">
          {/* Quote Card 1 */}
          <div className="val-quote-card relative bg-white rounded-2xl border border-teal-dark/10 shadow-sm p-8 flex flex-col gap-4">
            {/* Apricot left accent bar */}
            <div className="absolute left-0 top-6 bottom-6 w-1 bg-apricot rounded-full" aria-hidden="true" />
            {/* Decorative quotation mark */}
            <span
              className="block text-apricot text-6xl font-serif leading-none select-none -mb-2"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <blockquote className="text-teal-dark text-base sm:text-lg italic leading-relaxed">
              {QUOTE_1_TEXT}
            </blockquote>
            <cite className="not-italic text-sm text-apricot/80 tracking-wide mt-2">
              {QUOTE_1_ATTR}
            </cite>
          </div>

          {/* Quote Card 2 */}
          <div className="val-quote-card relative bg-white rounded-2xl border border-teal-dark/10 shadow-sm p-8 flex flex-col gap-4">
            {/* Apricot left accent bar */}
            <div className="absolute left-0 top-6 bottom-6 w-1 bg-apricot rounded-full" aria-hidden="true" />
            {/* Decorative quotation mark */}
            <span
              className="block text-apricot text-6xl font-serif leading-none select-none -mb-2"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <blockquote className="text-teal-dark text-base sm:text-lg italic leading-relaxed">
              {QUOTE_2_TEXT}
            </blockquote>
            <cite className="not-italic text-sm text-apricot/80 tracking-wide mt-2">
              {QUOTE_2_ATTR}
            </cite>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-teal-dark/10 mb-14" />

        {/* Bottom tagline */}
        <p className="val-tagline text-center text-xl sm:text-2xl font-medium text-teal-dark tracking-tight">
          {TAGLINE_START}
          <span className="text-apricot">{TAGLINE_BRAND}</span>
          {TAGLINE_END}
        </p>

      </div>
    </section>
  );
}
