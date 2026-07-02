"use client";

import { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- Copy constants (apostrophes inside JS strings are safe) ---
const SECTION_NUMBER = "04";
const SECTION_LABEL = "Product";
const HEADLINE = "See it in action.";
const DEMO_HREF = "/contact?intent=demo";
const DEMO_LABEL = "Book a Demo";

const CALLOUTS = [
  {
    id: "voice",
    title: "Voice-first entries",
    body: "30-second journaling on phone, no prompts",
  },
  {
    id: "custom",
    title: "Clinician-tuned & patient customized",
    body: "Each clinician adjusts settings per client",
  },
  {
    id: "brief",
    title: "Pre-session brief",
    body: "One-screen narrative summary before the appointment",
  },
  {
    id: "guardrails",
    title: "Built-in scope guardrails",
    body: "No automated triage, no direct teen support, no SaMD territory",
  },
] as const;

// --- Inline SVG Icons (stroke apricot, ~20px) ---

function MicWaveIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="7.5"
        y="1.5"
        width="5"
        height="9"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M4 9.5a6 6 0 0 0 12 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="15.5"
        x2="10"
        y2="18.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="7"
        y1="18.5"
        x2="13"
        y2="18.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line
        x1="2"
        y1="5"
        x2="18"
        y2="5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="6" cy="5" r="2" fill="currentColor" />
      <line
        x1="2"
        y1="10"
        x2="18"
        y2="10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="14" cy="10" r="2" fill="currentColor" />
      <line
        x1="2"
        y1="15"
        x2="18"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="9" cy="15" r="2" fill="currentColor" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="3.5"
        y="1.5"
        width="13"
        height="17"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <line
        x1="6.5"
        y1="6.5"
        x2="13.5"
        y2="6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="6.5"
        y1="10"
        x2="13.5"
        y2="10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="6.5"
        y1="13.5"
        x2="10.5"
        y2="13.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 1.5 L17.5 4.5 L17.5 10 C17.5 14 14 17.5 10 18.5 C6 17.5 2.5 14 2.5 10 L2.5 4.5 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <polyline
        points="7,10 9,12 13,8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const CALLOUT_ICONS = [
  <MicWaveIcon key="mic" />,
  <SlidersIcon key="sliders" />,
  <DocumentIcon key="doc" />,
  <ShieldIcon key="shield" />,
];

// --- Arrow for CTA ---
function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Product() {
  const rootRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const browserRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Header fades + slides in
      gsap.from(".prod-header", {
        opacity: 0,
        y: 32,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".prod-header",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Staggered callouts
      gsap.from(".prod-callout", {
        opacity: 0,
        y: 28,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".prod-callouts",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      // Mockup group fades + scales in subtly
      gsap.from(".prod-mockups", {
        opacity: 0,
        scale: 0.97,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".prod-mockups",
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      // Phone entrance: fade up + scale from 0.95
      gsap.from(".prod-phone", {
        opacity: 0,
        y: 24,
        scale: 0.95,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".prod-mockups",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      // Parallax on phone mockup — scrub across section scroll (faster, y 50→-50)
      if (phoneRef.current) {
        gsap.fromTo(
          phoneRef.current,
          { y: 50 },
          {
            y: -50,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // Parallax on browser frame — gentler, opposite direction (y -24→24)
      // gives the two layers slightly different depths as you scroll
      if (browserRef.current) {
        gsap.fromTo(
          browserRef.current,
          { y: -24 },
          {
            y: 24,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="product"
      ref={rootRef}
      className="bg-teal-dark text-cream py-28 md:py-40 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header row: number + headline left, demo CTA right */}
        <div className="prod-header mb-16 md:mb-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
          <div>
            {/* Dragonfly-style numbered label */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-7xl sm:text-8xl font-semibold text-apricot leading-none select-none">
                {SECTION_NUMBER}
              </span>
              <span className="text-xs uppercase tracking-widest text-apricot/80 font-medium">
                {SECTION_LABEL}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-cream max-w-xl">
              {HEADLINE}
            </h2>
          </div>

          {/* Demo CTA pill */}
          <Link
            href={DEMO_HREF}
            className="inline-flex items-center gap-2 self-start sm:self-auto bg-apricot text-teal-dark font-semibold text-sm px-5 py-3 min-h-[44px] rounded-full hover:bg-apricot-light transition-all duration-200 ease-out hover:scale-[1.04] active:scale-[0.98] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] shrink-0"
          >
            {DEMO_LABEL}
            <ArrowRight />
          </Link>
        </div>

        {/* Two-column layout: callouts left, mockups right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* LEFT: Feature callouts */}
          <div className="prod-callouts flex flex-col gap-8">
            {CALLOUTS.map((callout, i) => (
              <div key={callout.id} className="prod-callout flex gap-4 items-start">
                {/* Icon container */}
                <div className="shrink-0 w-9 h-9 rounded-lg bg-teal/30 border border-teal-light/20 flex items-center justify-center text-apricot mt-0.5">
                  {CALLOUT_ICONS[i]}
                </div>

                {/* Text */}
                <div>
                  <p className="font-semibold text-cream text-base leading-snug mb-1">
                    {callout.title}
                  </p>
                  <p className="text-cream/70 text-base sm:text-sm leading-relaxed">
                    {callout.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Device mockup composition */}
          <div className="prod-mockups relative w-full pb-20 lg:pb-16">

            {/* Browser frame — clinician pre-session brief */}
            <div ref={browserRef} className="relative w-full rounded-xl overflow-hidden border border-teal-light/20 shadow-2xl shadow-black/40 bg-[#1a2e2e]">
              {/* Browser chrome top bar */}
              <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#243636] border-b border-teal-light/10 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" aria-hidden="true" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBC2E]" aria-hidden="true" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" aria-hidden="true" />
                <div className="ml-3 flex-1 bg-teal-dark/60 rounded-md h-4" aria-hidden="true" />
              </div>

              {/* Screenshot — cropped to top */}
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/demo-brief.png"
                  alt="Clinician pre-session brief showing recurring themes and keyword matches"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </div>
            </div>

            {/* Phone frame — teen voice journaling, overlapping bottom-right */}
            <div
              ref={phoneRef}
              className="absolute bottom-0 -right-4 sm:-right-6 lg:-right-8 w-28 sm:w-36 md:w-40 lg:w-44"
              style={{ zIndex: 10 }}
            >
              <div className="prod-phone relative">
                {/* Soft apricot/teal glow behind the frame */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-10"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 55%, rgba(232,168,124,0.30) 0%, rgba(74,124,124,0.20) 45%, transparent 72%)",
                    filter: "blur(26px)",
                  }}
                />

                {/* Gentle 4s bob — keyframes in globals.css */}
                <div className="phone-float relative">
                  <div className="relative rounded-[2.5rem] overflow-hidden border-[3px] border-teal-light/30 shadow-2xl shadow-black/50 bg-[#1a2e2e]">
                    {/* Phone status bar notch */}
                    <div className="h-5 bg-[#1a2e2e] flex items-center justify-center shrink-0">
                      <div className="w-12 h-2 bg-[#243636] rounded-full" aria-hidden="true" />
                    </div>

                    {/* Screenshot */}
                    <div className="relative w-full" style={{ aspectRatio: "780 / 1688" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/demo-journaling.png"
                        alt="Teen voice journaling screen with mood picker and audio entry"
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover object-top"
                      />
                    </div>

                    {/* Phone home indicator bar */}
                    <div className="h-4 bg-[#1a2e2e] flex items-end justify-center pb-1 shrink-0">
                      <div className="w-10 h-1 bg-[#243636] rounded-full" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* end mockups */}

        </div>
        {/* end two-column grid */}

      </div>
    </section>
  );
}
