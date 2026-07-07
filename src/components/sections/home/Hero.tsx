"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import RippleField from "@/components/ripples/RippleField";

const H1_TEXT = "Helping clinicians capture life outside the session";
const SUB_TEXT =
  "Teens talk through their week in short voice notes. Their therapist walks into the next session already caught up.";
const CTA_DEMO_LABEL = "Book a Demo";
const CTA_DEMO_HREF = "/contact?intent=demo";
const CTA_CONTACT_LABEL = "Get in Touch";
const CTA_CONTACT_HREF = "mailto:info@refleohealth.com?subject=Contact";
const SCROLL_HINT_LABEL = "Scroll";

const FILL_BTN =
  "inline-flex items-center justify-center rounded-full bg-apricot px-8 py-3 text-sm font-semibold font-sans text-teal-dark transition-all duration-200 ease-out hover:bg-apricot-light hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] active:scale-[0.98]";
const OUTLINE_BTN =
  "inline-flex items-center justify-center rounded-full border border-apricot bg-transparent px-8 py-3 text-sm font-semibold font-sans text-apricot transition-all duration-200 ease-out hover:bg-apricot/10 hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] active:scale-[0.98]";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(h1Ref.current, { y: 24, duration: 0.8 })
        .from(
          subRef.current,
          { opacity: 0, y: 28, duration: 0.8 },
          "-=0.5"
        )
        .from(
          ctaRef.current,
          { opacity: 0, y: 28, duration: 0.8 },
          "-=0.5"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  function handleScrollHint() {
    document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-teal-dark px-6 pt-24 pb-16 text-center"
    >
      <div className="absolute inset-0 z-0">
        <RippleField />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(45,79,79,0.72) 0%, rgba(45,79,79,0.35) 38%, rgba(45,79,79,0) 70%)",
        }}
      />

      <div className="relative z-[2] flex flex-col items-center">
        <h1
          ref={h1Ref}
          className="font-serif tracking-tight text-cream text-5xl sm:text-6xl lg:text-7xl text-balance"
          style={{ maxWidth: "18ch" }}
        >
          {H1_TEXT}
        </h1>

        <p
          ref={subRef}
          className="mt-8 text-lg sm:text-xl text-cream/70 max-w-xl"
        >
          {SUB_TEXT}
        </p>

        <div
          ref={ctaRef}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href={CTA_DEMO_HREF} className={FILL_BTN}>
            {CTA_DEMO_LABEL}
          </Link>
          <a href={CTA_CONTACT_HREF} className={OUTLINE_BTN}>
            {CTA_CONTACT_LABEL}
          </a>
        </div>

        <button
          type="button"
          onClick={handleScrollHint}
          aria-label={SCROLL_HINT_LABEL}
          className="mt-16 flex flex-col items-center gap-2 text-cream/60 hover:text-cream transition-colors duration-200 animate-bounce"
        >
          <span className="text-xs uppercase tracking-widest font-sans">
            {SCROLL_HINT_LABEL}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </section>
  );
}
