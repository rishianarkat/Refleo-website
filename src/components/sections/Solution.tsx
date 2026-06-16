"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- Copy constants (apostrophes live safely inside JS strings) ---
const SECTION_NUMBER = "02";
const SECTION_LABEL = "Solution";
const HEADLINE = "A Private Place to Reflect. A Pre-Session Brief for Their Clinician.";

const COL1_LABEL = "ADOLESCENT";
const COL1_TITLE = "Records short audio or text entries between sessions";
const COL1_BODY = "Lightweight. No prompts to perform. A private place to talk through the week as it happens.";

const COL2_LABEL = "REFLEO";
const COL2_TITLE = "Analyzes entries for themes and clinician-set parameters";
const COL2_BODY = "Surfaces recurring topics, emotional shifts, and patterns. Never counsels.";

const COL3_LABEL = "CLINICIAN";
const COL3_TITLE = "Receives a pre-session insights brief before each appointment";
const COL3_BODY = "Walks in informed. Spends the session on the work, not the recap.";

const TAGLINE_TEENS = "Teens Share.";
const TAGLINE_REFLEO = "Refleo Surfaces.";
const TAGLINE_CLINICIANS = "Clinicians Walk-in Informed.";

// --- Icon components (simple inline SVGs, stroke-based, uniform 48px) ---

function MicIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Microphone body */}
      <rect
        x="18"
        y="6"
        width="12"
        height="20"
        rx="6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Arc / stand */}
      <path
        d="M12 24c0 6.627 5.373 12 12 12s12-5.373 12-12"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Stand stem */}
      <line
        x1="24"
        y1="36"
        x2="24"
        y2="42"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Base */}
      <line
        x1="18"
        y1="42"
        x2="30"
        y2="42"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RippleIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outermost ring */}
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeOpacity="0.4"
      />
      {/* Middle ring */}
      <circle
        cx="24"
        cy="24"
        r="13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeOpacity="0.65"
      />
      {/* Inner ring */}
      <circle
        cx="24"
        cy="24"
        r="7"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.85"
      />
      {/* Center dot — apricot fill */}
      <circle cx="24" cy="24" r="3" fill="#E8A87C" />
    </svg>
  );
}

function BriefIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Document outline */}
      <rect
        x="10"
        y="6"
        width="28"
        height="36"
        rx="3"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Title line */}
      <line
        x1="16"
        y1="16"
        x2="32"
        y2="16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Body lines */}
      <line
        x1="16"
        y1="23"
        x2="32"
        y2="23"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="29"
        x2="28"
        y2="29"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="35"
        x2="24"
        y2="35"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// --- Column data type ---
interface Column {
  label: string;
  title: string;
  body: string;
  icon: React.ReactNode;
}

const COLUMNS: Column[] = [
  {
    label: COL1_LABEL,
    title: COL1_TITLE,
    body: COL1_BODY,
    icon: <MicIcon />,
  },
  {
    label: COL2_LABEL,
    title: COL2_TITLE,
    body: COL2_BODY,
    icon: <RippleIcon />,
  },
  {
    label: COL3_LABEL,
    title: COL3_TITLE,
    body: COL3_BODY,
    icon: <BriefIcon />,
  },
];

export default function Solution() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Fade + slide in the number + headline block
      gsap.from(".sol-header", {
        opacity: 0,
        y: 32,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".sol-header",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Staggered columns
      gsap.from(".sol-col", {
        opacity: 0,
        y: 30,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.18,
        scrollTrigger: {
          trigger: ".sol-cols",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      // Tagline
      gsap.from(".sol-tagline", {
        opacity: 0,
        y: 20,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".sol-tagline",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="solution"
      ref={rootRef}
      className="bg-cream text-teal-dark py-28 md:py-40"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        {/* Number + Headline */}
        <div className="sol-header mb-20 md:mb-24">
          {/* Dragonfly-style numbered label */}
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-7xl sm:text-8xl font-semibold text-apricot leading-none select-none">
              {SECTION_NUMBER}
            </span>
            <span className="text-xs uppercase tracking-widest text-apricot font-medium">
              {SECTION_LABEL}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-balance text-teal-dark max-w-3xl">
            {HEADLINE}
          </h2>
        </div>

        {/* Three columns */}
        <div className="sol-cols grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
          {COLUMNS.map((col) => (
            <div
              key={col.label}
              className="sol-col flex flex-col gap-5 rounded-2xl border border-teal-dark/10 bg-white/50 p-6 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0"
            >
              {/* Icon in an apricot-tinted circle */}
              <div className="w-14 h-14 rounded-full bg-apricot/10 flex items-center justify-center text-teal shrink-0">
                {col.icon}
              </div>

              {/* Label */}
              <span className="text-xs uppercase tracking-widest font-semibold text-apricot">
                {col.label}
              </span>

              {/* Title */}
              <h3 className="text-lg font-semibold text-teal-dark leading-snug">
                {col.title}
              </h3>

              {/* Body */}
              <p className="text-base text-teal-dark/70 leading-relaxed">
                {col.body}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-20 md:mt-28 border-t border-teal-dark/10" />

        {/* Tagline */}
        <p className="sol-tagline mt-14 text-center text-xl sm:text-2xl font-medium text-teal-dark tracking-tight">
          {TAGLINE_TEENS}{" "}
          <span className="text-apricot">{TAGLINE_REFLEO}</span>{" "}
          {TAGLINE_CLINICIANS}
        </p>

      </div>
    </section>
  );
}
