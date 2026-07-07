"use client";

import { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- Copy constants (apostrophes safe inside JS strings) ---
const EYEBROW = "Product";
const HEADLINE = "See it in action.";
const SUB =
  "A teen's voice notes become a one-screen brief their clinician reads before the session.";
const CTA_LABEL = "Book a Demo";
const CTA_HREF = "/contact?intent=demo";

const BRIEF_ALT =
  "Clinician pre-session brief showing recurring themes and keyword matches";
const JOURNALING_ALT =
  "Teen voice journaling screen with mood picker and audio entry";

export default function ProductHero() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(".ph-eyebrow, .ph-h1, .ph-sub, .ph-cta", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(".ph-mockups", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".ph-mockups",
          start: "top 80%",
          once: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="bg-teal-dark pt-40 pb-28 md:pb-36"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="ph-eyebrow mb-6 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-block h-px w-8 bg-apricot/40"
          />
          <span className="text-xs uppercase tracking-widest text-apricot font-medium font-sans">
            {EYEBROW}
          </span>
        </div>

        <h1 className="ph-h1 font-serif tracking-tight text-cream text-5xl sm:text-6xl lg:text-7xl max-w-3xl">
          {HEADLINE}
        </h1>

        <p className="ph-sub mt-6 text-cream/70 text-lg leading-relaxed max-w-2xl">
          {SUB}
        </p>

        <div className="ph-cta mt-10">
          <Link
            href={CTA_HREF}
            className="inline-flex items-center justify-center rounded-full bg-apricot px-8 py-3 text-sm font-semibold font-sans text-teal-dark transition-all duration-200 ease-out hover:bg-apricot-light hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] active:scale-[0.98]"
          >
            {CTA_LABEL}
          </Link>
        </div>

        {/* Device mockups */}
        <div className="ph-mockups relative mt-16 pb-16">
          {/* Browser mockup */}
          <div className="relative w-full max-w-3xl rounded-xl overflow-hidden border border-teal-light/20 shadow-2xl shadow-black/40 bg-[#1a2e2e]">
            {/* Chrome bar */}
            <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#243636] border-b border-teal-light/10 shrink-0">
              <span
                className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"
                aria-hidden="true"
              />
              <span
                className="w-2.5 h-2.5 rounded-full bg-[#FFBC2E]"
                aria-hidden="true"
              />
              <span
                className="w-2.5 h-2.5 rounded-full bg-[#28C840]"
                aria-hidden="true"
              />
              <div
                className="ml-3 flex-1 bg-teal-dark/60 rounded-md h-4"
                aria-hidden="true"
              />
            </div>

            <div className="relative w-full aspect-[16/10] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/demo-brief.png"
                alt={BRIEF_ALT}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </div>
          </div>

          {/* Phone mockup, overlapping bottom-right */}
          <div className="absolute bottom-0 -right-2 sm:right-0 lg:right-4 w-32 sm:w-40 lg:w-44">
            <div className="relative rounded-[2.5rem] overflow-hidden border-[3px] border-teal-light/30 shadow-2xl shadow-black/50 bg-[#1a2e2e]">
              {/* Notch bar */}
              <div className="h-5 bg-[#1a2e2e] flex items-center justify-center shrink-0">
                <div
                  className="w-12 h-2 bg-[#243636] rounded-full"
                  aria-hidden="true"
                />
              </div>

              <div
                className="relative w-full"
                style={{ aspectRatio: "780 / 1688" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/demo-journaling.png"
                  alt={JOURNALING_ALT}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </div>

              {/* Home indicator bar */}
              <div className="h-4 bg-[#1a2e2e] flex items-end justify-center pb-1 shrink-0">
                <div
                  className="w-10 h-1 bg-[#243636] rounded-full"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
